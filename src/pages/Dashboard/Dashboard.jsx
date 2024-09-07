import {DashboardMain} from "../../components/Dashboard/DashboardMain";
import "./Dashboard.scss";
import {useEffect, useState} from "react";
import * as dashboardService from "../../services/dashboard/DashboardService";
import {fCurrency} from '../../utils/format-number';
import Moment from "moment";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {toast} from "react-toastify";
import {getAllByStatusRead} from "../../services/notification/NotificationService";
import {BillModal} from "./BillModal/BillModal";

export function Dashboard() {
    const [totalCustomers, setTotalCustomers] = useState(null);
    const [totalBills, setTotalBills] = useState(null);
    const [revenues, setRevenues] = useState(null);
    const [bestSalesPersons, setBestSalesPersons] = useState([]);
    const [newBills, setNewBills] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [dateCreate, setDateCreate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/createNotification', (message) => {
                getAllByStatusRead(0);
                console.log("da gui data roi ");
                toast("Bạn vừa có thông báo mới nhé !")
            });
            stompClient.connect({}, () => {
                stompClient.subscribe('/topic/notification', (message) => {
                    toast(message.body);
                });
            });
        });
        setStompClient(stompClient);

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getTotalCustomers();
            await getTotalBills();
            await getRevenues(1);
            await getBestSalesPersons();
            await getNewBills();
        }
        fetchData().then().catch();
    }, [])

    const getTotalCustomers = async () => {
        const temp = await dashboardService.getTotalCustomer();
        setTotalCustomers(temp);
    }

    const getTotalBills = async () => {
        const temp = await dashboardService.getTotalBills();
        setTotalBills(temp);
    }

    const getRevenues = async (option) => {
        const temp = await dashboardService.getRevenues(option);
        setRevenues(temp);
    }

    const getBestSalesPersons = async () => {
        const temp = await dashboardService.getBestSalespersons();
        setBestSalesPersons(temp);
    }

    const getNewBills = async () => {
        const temp = await dashboardService.getNewBills();
        setNewBills(temp);
    }

    const handleGetRevenues = async (option) => {
        const temp = await dashboardService.getRevenues(option);
        setRevenues(temp);
    }
    const handleGrowthPercent = (radius, value) => {
        const circumference = 2 * Math.PI * radius;
        if (value <= 100) {
            return circumference - (value / 100) * circumference;
        }
        return circumference - (100 / 100) * circumference;
    }

    const openDetailModal = (dateCreate) => {
        setIsModalOpen(true);
        setDateCreate(dateCreate);
    }

    const closeDetailModal = () => setIsModalOpen(false);

    const totalCustomersGrowthOffset = totalCustomers ? handleGrowthPercent(36, totalCustomers.growth) : 0;
    const totalBillsGrowthOffset = totalBills ? handleGrowthPercent(36, totalBills.growth) : 0;
    const revenuesGrowthOffset = revenues ? handleGrowthPercent(36, revenues.growth) : 0;

    return (
        <DashboardMain path={'dashboard'} content={
            <div className="content-body">
                <div className="content-header">
                    {totalCustomers &&
                        <div className="guest box-element">
                            <div className="element-info">
                                <div className="icon-sta">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={35}
                                        height={35}
                                        fill="currentColor"
                                        className="bi bi-people-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                                    </svg>
                                </div>
                                <span className="item-name">Lượng khách</span>

                                <span className="item-number">{totalCustomers.totalCustomers}</span>

                            </div>
                            <div className="percentage">
                                <svg>
                                    <circle className="circle1" cx="60" cy="45" r="36"
                                            strokeDashoffset={totalCustomersGrowthOffset}/>
                                </svg>
                                <span className="item-growth">
                                {totalCustomers.growth > 0 ? `Tăng ${Math.round(totalCustomers.growth)}%`
                                    : `Giảm ${Math.round(totalCustomers.growth)}%`}
                            </span>
                            </div>
                        </div>
                    }
                    {totalBills &&
                        <div className="orders box-element">
                            <div className="element-info">
                                <div className="icon-sta">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={35}
                                        height={35}
                                        fill="currentColor"
                                        className="bi bi-list-ol"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"
                                        />
                                        <path
                                            d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>
                                    </svg>
                                </div>
                                <span className="item-name">Đơn hàng</span>
                                <span className="item-number">{totalBills.totalBills}</span>

                            </div>
                            <div className="percentage">
                                <svg>
                                    <circle className="circle2" cx="60" cy="45" r="36"
                                            strokeDashoffset={totalBillsGrowthOffset}></circle>
                                </svg>
                                <span className="item-growth">
                                {totalBills.growth > 0 ? `Tăng ${Math.round(totalBills.growth)}%`
                                    : `Giảm ${Math.round(totalBills.growth)}%`}
                            </span>
                            </div>
                        </div>
                    }
                    {revenues &&
                        <div className="revenue box-element">
                            <div className="element-info">
                            <span className="item-name">
                            Doanh thu
                                <label>
                                    <select onChange={(event) => handleGetRevenues(event.target.value)}>
                                        <option value={0}>Tuần này</option>
                                        <option value={1}>Tháng này</option>
                                        <option value={2}>Năm này</option>
                                    </select>
                                </label>
                            </span>
                                <span className="item-number">{fCurrency(revenues.totalRevenue)} VNĐ</span>

                            </div>
                            <div className="percentage">
                                <svg>
                                    <circle className="circle3" cx="60" cy="45" r="36"
                                            strokeDashoffset={revenuesGrowthOffset}></circle>
                                </svg>
                                <span className="item-growth">
                                {revenues.growth > 0 ? `Tăng ${fCurrency(Math.round(revenues.growth))}%`
                                    : `Giảm ${fCurrency(Math.round(revenues.growth))}%`}
                            </span>
                            </div>
                        </div>
                    }
                </div>
                <div className="content-element">
                    <div className="box-content">
                        <p>Top nhân viên bán hàng tốt nhất</p>
                        <table className="table top-employee">
                            <thead>
                            <tr>
                                <th className="emp-name">Họ tên</th>
                                <th className="emp-price">Giá</th>
                                <th>Số lượng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bestSalesPersons && bestSalesPersons.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.fullName}</td>
                                    <td>{fCurrency(item.revenue)} VNĐ</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="content-element">
                    <div className="box-content">
                        <p>Top 5 đơn hàng mới nhất</p>
                        <ol className="styled-list">
                            {newBills && newBills.map((item, index) => (
                                <li key={index} onClick={()=> openDetailModal(item.dateCreate)}>
                                    <span className="date">{Moment(item.dateCreate).format("DD/MM/yyyy")}</span>
                                    <span className="customer-name">{item.customerName}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                <BillModal
                    isOpen={isModalOpen}
                    onClose={closeDetailModal}
                    dateCreate={dateCreate}
                >

                </BillModal>
            </div>
        }/>
    );
}