import React from 'react';
import styles from './PaymentModal.module.scss';

const PaymentModal = ({ isOpen, onClose, onPaymentMethodSelect }) => {
    const handlePaymentMethodSelect = (method) => {
        onPaymentMethodSelect(method);
        onClose();
    };

    return (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            <div className={styles.modalContent}>
                <h2>Chọn Phương Thức Thanh Toán</h2>
                <button onClick={() => handlePaymentMethodSelect('cash')}>
                    Thanh toán tại cửa hàng
                </button>
                <button onClick={() => handlePaymentMethodSelect('vnpay')}>
                    Thanh toán bằng VNPay
                </button>
                <button onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};

export default PaymentModal;
