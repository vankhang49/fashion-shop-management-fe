import React, { useState, useEffect } from 'react';
import { DashboardMain } from '../../../components/Dashboard/DashboardMain';
import './CustomerList.scss';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate ,useParams} from 'react-router-dom';
import * as CustomerService from '../../../services/customer/CustomerService';
import Moment from 'moment';
import ModalDelete from '../../../ui/ModalDelete';
import { toast } from "react-toastify";

function CustomerList(props) {
    const {role} = useParams();
    const [customers, setCustomers] = useState([]);
    const [customerDelete, setCustomerDelete] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [keyWord, setKeyWord] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getAllCustomers();
    }, []);

    const getAllCustomers = async () => {
        const response = await CustomerService.getCustomers(keyWord);
        setCustomers(response.content);
        setTotalPages(response.totalPages);
    };

    const openModal = (item) => {
        setCustomerDelete(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setCustomerDelete(null);
        setModalOpen(false);
    };

    const handleSubmitDelete = async () => {
        try {
            await CustomerService.deleteCustomer(customerDelete?.customerId);
            getAllCustomers();
            toast.success("Xóa khách hàng thành công");
            closeModal();
        } catch (error) {
            closeModal();
            toast.error("Xóa khách hàng thất bại");
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allCustomerIds = customers.map(customer => customer.customerId);
            setSelectedCustomers(allCustomerIds);
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectCustomer = (e, id) => {
        if (e.target.checked) {
            setSelectedCustomers(prev => [...prev, id]);
        } else {
            setSelectedCustomers(prev => prev.filter(customerId => customerId !== id));
        }
    };

    const handleBatchDelete = async () => {
        try {
            for (let customerId of selectedCustomers) {
                await CustomerService.deleteCustomer(customerId);
            }
            getAllCustomers();
            toast.success("Xóa khách hàng thành công");
            setSelectedCustomers([]);
        } catch (error) {
            toast.error("Xóa khách hàng thất bại");
        }
    };

    const handleSearch = async (e) => {
        setKeyWord(e.target.value);
    };

    const hanleSubmitSearch = async () => {
        setPage(0);
        const response = await CustomerService.getCustomers(keyWord);
        setCustomers(response.content);
        setTotalPages(response.totalPages);
    };

    const goToPage = async (pageNumber) => {
        setPage(pageNumber);
        const response = await CustomerService.getCustomers(keyWord, pageNumber);
        setCustomers(response.content);
    };

    return (
        <>
            <DashboardMain content={
                <div className="customer-list">
                    <div className="box-contents">
                        <div className="box-content-header">
                            <h2>Danh sách khách hàng</h2>
                            <br />
                        </div>
                        <div className="flex-box">
                            <div className="search-header">
                                <input
                                    className="form-control search-bar"
                                    type="search"
                                    placeholder="Tìm kiếm ..."
                                    aria-label="Search"
                                    onChange={handleSearch}
                                />
                                <button onClick={hanleSubmitSearch} className='search'>Tìm kiếm</button>
                            </div>
                            <div className="button-crud">
                                <Link to="/dashboard/storeManager/customer/create">
                                    <button className="addNew">Thêm mới</button>
                                </Link>
                            </div>
                        </div>
                        <button className="delete" onClick={handleBatchDelete} disabled={selectedCustomers.length === 0}>Xóa hàng loạt</button>
                        <div className="table-container">
                            <table className="table box-element">
                                <thead>
                                <tr>
                                    <th>
                                            <span className="custom-checkbox">
                                                <input type="checkbox" id="selectAll" onChange={handleSelectAll} />
                                                <label htmlFor="selectAll" />
                                            </span>
                                    </th>
                                    <th>STT</th>
                                    <th>Mã khách hàng</th>
                                    <th>Họ tên</th>
                                    {/* <th>Địa chỉ</th> */}
                                    <th>Ngày sinh</th>
                                    <th>Số điện thoại</th>
                                    <th>Giới tính</th>
                                    {/* <th>Email</th> */}
                                    <th>Điểm</th>
                                    <th>Cấp độ</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {customers?.map((customer, index) => (
                                    <tr key={customer.id}>
                                        <td>
                                                <span className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox${customer.customerId}`}
                                                        checked={selectedCustomers.includes(customer.customerId)}
                                                        onChange={(e) => handleSelectCustomer(e, customer.customerId)}
                                                    />
                                                    <label htmlFor={`checkbox${customer.customerId}`} />
                                                </span>
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{customer.customerCode}</td>
                                        <td>{customer.customerName}</td>
                                        {/* <td>{customer.address}</td> */}
                                        <td>{Moment(customer.dateOfBirth).format('DD/MM/YYYY')}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.gender == 0 ? "Nam" : customer.gender == 1 ? "Nữ" : "Khác"}</td>
                                        {/* <td>{customer.email}</td> */}
                                        <td>{customer.accumulatedPoints}</td>
                                        <td>{customer.customerType.typeName}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <Link to={`/dashboard/${role}/customer/update/${customer?.customerId}`} ><CiEdit size={22} color='orange' /></Link>
                                            <i onClick={() => openModal(customer)} style={{ cursor: "pointer", marginLeft: "4px" }}><MdDelete size={22} color='red' /></i>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <ModalDelete isOpen={isModalOpen} onClose={closeModal} title={"Xóa khách hàng"} content={`Xác nhận xóa khách hàng tên: ${customerDelete?.customerName} có mã: ${customerDelete?.customerCode}`} submit={handleSubmitDelete} />
                        </div>
                        <div className="pagination">
                            {page > 0 && (
                                <button onClick={() => goToPage(page - 1)}>Trang trước</button>
                            )}
                            <span>Trang {page + 1} / {totalPages}</span>
                            {page + 1 < totalPages && (
                                <button onClick={() => goToPage(page + 1)}>Trang sau</button>
                            )}
                        </div>
                    </div>
                </div>
            } />
        </>
    );
}

export default CustomerList;
