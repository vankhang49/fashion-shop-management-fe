import React, {useEffect, useState} from 'react';
import './PromotionModal.scss';
import * as promotionService from "../../../../../services/promotion/promotion-service";

const PromotionModal = ({ isOpen, onClose, onPayment }) => {
    const [promotionCode, setPromotionCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const applyPromotion = async () => {
        try {
            console.log(promotionCode)
            if (promotionCode) {
                const promotion = await promotionService.usePromotionByPromotionCode(promotionCode);
                if (promotion.enabled) {
                    setErrorMessage('Mã giảm giá đã được áp dụng thành công.');
                    setDiscount(promotion);
                    setPromotionCode('')
                } else {
                    setErrorMessage('Mã giảm giá đã hết hạn.');
                    setDiscount('');
                }
            } else {
                setErrorMessage('Mã giảm giá không tồn tại.');
                setDiscount('');
            }
        } catch (error) {
            setErrorMessage('Mã giảm giá không hợp lệ');
            setDiscount('');
        }
    };

    const handleApplyPromotion = () => {
        applyPromotion().then().catch();
    };

    const handlePayment = () => {
            onPayment(discount);
        onClose();
    };

    const clearErrorMessage = () => {
        setErrorMessage('');
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="modal-input">
                    <label htmlFor="discountInput">Nhập mã giảm giá:</label>
                    <input
                        type="text"
                        id="discountInput"
                        value={promotionCode}
                        onChange={(e) => {
                            setPromotionCode(e.target.value);
                            clearErrorMessage(); // Clear error message on input change
                        }}
                    />
                    <button className="apply-btn" onClick={handleApplyPromotion}>Áp dụng</button>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="modal-button">
                    <button onClick={handlePayment}>Xác nhận</button>
                    <button onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default PromotionModal;
