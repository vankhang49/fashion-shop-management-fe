import '../warehouse/warehouse.scss'
import {DashboardMain} from "../../../../components/Dashboard/DashboardMain";
import React, {useEffect, useState} from "react";
import * as billService from '../../../../services/bill/bill-service'
import {useParams} from "react-router-dom";
const BillList =()=>{
    const [bills,setBills] = useState([])
    const {role} = useParams();
    const getAllBills =()=>{
        billService.getAllBill().then(res=>setBills(res)).catch()
    }
    console.log(bills)
    useEffect(() => {
        getAllBills();
    }, []);
    return(
        <DashboardMain path={role} content={
            <div className="content-body">
                <div className="content-element">
                    <div className="header-content">
                        <form className="form-search">
                            <input type="text" placeholder="Search..." className="search-bar"
                                  />
                            <button className="btn btn-search">Search</button>
                        </form>
                    </div>
                    <div className="box-content" id='warehouse-table'>
                        <p>Danh sách hóa đơn</p>
                        {/* Data table content */}
                        <table className="table">
                            <thead>
                            <tr>
                                <th>
                                    STT
                                </th>
                                <th>
                                    Mã hóa đơn
                                </th>
                                <th>
                                    Tên khách hàng
                                </th>
                                <th >
                                    Ngày tạo
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {!bills ? <tr><td colSpan="7" className='container'>Không có kết quả</td></tr> :
                                bills?.map((item, index) => (
                                    <tr key={item.billId}>
                                        <td>{index + 1}</td>
                                        <td>{item.billCode}</td>
                                        <td>{item.customer.customerName}</td>
                                        <td>{item.dateCreate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        }
            />
    );
}
export  default BillList;