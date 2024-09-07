import React from 'react';
import './InvoiceModal.scss';
import {fCurrency} from "../../../../../utils/format-number";

const InvoiceModal = ({billCode, customerCode, billItems, discount, total, onClose,finalTotal}) => {
    const handlePrint = () => {

        // Lấy nội dung của invoice để in
        const invoiceContent = document.getElementById('invoice-content').innerHTML;

        // Tạo một cửa sổ in mới
        const printWindow = window.open('', '_blank');

        // Đặt nội dung của cửa sổ in là nội dung của invoice
        printWindow.document.write(`
            <html>
            <head>
                <title>Fashion</title>
                <style>
                    /* Thêm CSS để chỉnh trang in */
                    body {
                        font-family: Arial, sans-serif;
                    }
            
                    .invoice {
                        width: 80%;
                        margin: 20px auto;
                        border: 1px solid #ccc;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    /* Thêm CSS cho các phần tử trong invoice */
                    .invoice-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .invoice-customer {
                        margin-bottom: 20px;
                    }
                    .invoice-products {
                        margin-bottom: 20px;
                        
                    }
                    .invoice-summary {
                        text-align: right;
                    }
                    table {
                          width: 100%;
                          border-collapse: collapse;
                          }
                     th, td {
                          text-align: center;
                          }
                </style>
            </head>
            <body>
                ${invoiceContent}
            </body>
            </html>
        `);

        // Đóng việc ghi nội dung
        printWindow.document.close();

        // In cửa sổ in
        printWindow.print();
    };
    const date = new Date()

    return (
        <div className='invoice-modal-overlay'>
            <div className="invoice-modal">
                <div id="invoice-content">
                    <div className="invoice-header">
                        <h2>Fashion Shop</h2>
                        <p>Hóa đơn thanh toán</p>
                        <span>Mã hóa đơn: {billCode}</span>
                    </div>
                    <div className="invoice-customer">
                        <p>Khách hàng: <span>{customerCode}</span></p>
                        <p>Ngày: <span>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</span>
                        </p>
                    </div>
                    <div className="invoice-products">
                        <h3>Sản phẩm đã mua:</h3>
                        {billItems && billItems.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>Size</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {billItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.size}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.quantity * item.price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Không có sản phẩm nào trong hóa đơn.</p>
                        )}
                    </div>
                    <div className="invoice-summary">
                        <div>
                            <p>Tổng tiền: </p>
                            <p className='total'>{fCurrency(total)} VNĐ</p>
                        </div>
                        <div>
                            <p>Giảm giá: </p>
                            <p className='discount'>{fCurrency(discount)} VNĐ</p>
                        </div>
                        <div>
                            <p>Thành tiền: </p>
                            <p className='last-total'>{fCurrency(total - discount)} VNĐ</p>
                        </div>
                    </div>
                </div>
                <div className="invoice-actions">
                    <button onClick={handlePrint}>In hóa đơn</button>
                    <button className="secondary" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
