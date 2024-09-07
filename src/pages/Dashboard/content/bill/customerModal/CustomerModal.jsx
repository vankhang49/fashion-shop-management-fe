import React, { useEffect, useState } from 'react';
import './CustomerModal.scss';
import * as customerService from "../../../../../services/customer/customer-service";

const CustomerModal = ({ isOpen, onClose, getCustomer }) => {
    const [customers, setCustomers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getAllCustomer(search,page);
    }, [search,page]);

    const getAllCustomer = (search,pageNumber) => {
        customerService.getAllCustomer(search,pageNumber).then(res => {
            setCustomers(res.content);
            setTotalPages(res.totalPages);
        }).catch(err => console.error("Error fetching customers: ", err));
    };
    console.log(customers)

    const handlePrevious = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const getPageNumbers = () => {
        const maxPagesToShow = 2;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 0;
            endPage = totalPages - 1;
        } else {
            const middlePage = Math.floor(maxPagesToShow / 2);
            if (page <= middlePage) {
                startPage = 0;
                endPage = maxPagesToShow - 1;
            } else if (page + middlePage >= totalPages) {
                startPage = totalPages - maxPagesToShow;
                endPage = totalPages - 1;
            } else {
                startPage = page - middlePage;
                endPage = page + middlePage;
            }
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handleRowClick = (customer) => {
        setSearchInput(customer.customerName); // Update searchInput with customer name or any other field
        getCustomer(customer); // Pass customer ID to parent component
        onClose(); // Close modal after selection
    };

    return (
        <div className="modal" style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Tra cứu khách hàng</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Nhập mã KH, tên KH hoặc Sdt"
                    />
                    <button>Chọn</button>
                </div>
                <div className='data-table'>
                    <table id="tableId">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã khách hàng</th>
                            <th>Tên khách hàng</th>
                            <th>Số điện thoại</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.map((item, index) => (
                            <tr key={item.customerId} onClick={() => handleRowClick(item)}>
                                <td>{index + 1}</td>
                                <td>{item.customerCode}</td>
                                <td>{item.customerName}</td>
                                <td>{item.phoneNumber}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <button onClick={handlePrevious} hidden={page === 0}>Previous</button>
                    {getPageNumbers().map(pageNum => (
                        <button key={pageNum} onClick={() => setPage(pageNum)} className={pageNum === page ? 'active' : ''}>
                            {pageNum + 1}
                        </button>
                    ))}
                    <button onClick={handleNext} hidden={page === totalPages - 1}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;
