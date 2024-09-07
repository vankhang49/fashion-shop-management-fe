import React, {useEffect, useState} from "react";
import * as billService from "../../../services/bill/bill-service";
import styles from "./BillModal.module.scss";
import {fCurrency} from "../../../utils/format-number";
import {getPromotionByPromotionCode} from "../../../services/promotion/promotion-service";
import * as promotionService from "../../../services/promotion/promotion-service";


export function BillModal({isOpen, onClose, dateCreate}) {
    const [bill, setBill] = useState(null);
    const [hasOpened, setHasOpened] = useState(false);
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await getBillByDateCreate(dateCreate);
        };

        if (isOpen && hasOpened) {
            fetchData().then().catch();
        } else if (isOpen) {
            setHasOpened(true);
        }
    }, [isOpen, dateCreate, hasOpened]);

    useEffect(() => {
        const fetchPromotion = async () => {
            if (bill?.promotionCode) {
                await getPromotionByPromotionCode(bill.promotionCode);
            }
        };

        fetchPromotion();
    }, [bill]);

    const getBillByDateCreate = async (dateCreate) => {
        try {
            const temp = await billService.getBillByDateCreate(dateCreate);
            setBill(temp);
        } catch (e) {
            console.error(e);
        }

    }

    const getPromotionByPromotionCode = async (promotionCode)=> {
        try {
            const temp = await promotionService.getPromotionByPromotionCode(promotionCode);
            setPromotion(temp);
        } catch (e) {
        console.error(e);
        }

    }

    const calculateTotalPrice = () => {
        return bill.billItemList.reduce((prev, item) => (item.quantity * item.pricing.price) + prev, 0);
    }

    const handleCloseModal = () => {
        setPromotion(null);
        onClose();
    }

    return(
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            <div className={styles.modalContent}>
                {bill &&
                    <div className={styles.boxInfo}>
                        <div className={styles.title}>
                            <h2>HÓA ĐƠN THANH TOÁN</h2>
                            <p className={styles.logo}>FM style</p>
                        </div>
                        <div className={styles.billContent}>
                            <div className={styles.billCode}>
                                <p className={styles.contentTitle}>Mã đơn hàng: </p>
                                <p>{bill.billCode}</p>
                            </div>
                            <div className={styles.dateCreate}>
                                <p className={styles.contentTitle}>Ngày tạo: </p>
                                <p>{bill.dateCreate}</p>
                            </div>
                            <div className={styles.employee}>
                                <p className={styles.contentTitle}>Nhân viên thực hiện: </p>
                                <p>{bill.appUser?.fullName}</p>
                            </div>
                            <div className={styles.customer}>
                                <p className={styles.contentTitle}>Tên khách hàng: </p>
                                <p>{bill.customer.customerName}</p>
                            </div>
                            <div className={styles.phoneNumber}>
                                <p className={styles.contentTitle}>Số điện thoại: </p>
                                <p>{bill.customer.phoneNumber}</p>
                            </div>
                            <div className={styles.address}>
                                <p className={styles.contentTitle}>Địa chỉ: </p>
                                <p>{bill.customer.address}</p>
                            </div>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Tổng tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bill.billItemList?.map((item, index) => (
                                    <tr key={item.itemId}>
                                        <td>{index + 1}</td>
                                        <td>{item.pricing.pricingCode}</td>
                                        <td>{item.quantity}</td>
                                        <td>{fCurrency(item.quantity * item.pricing.price)} VNĐ</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className={styles.intoMoney}>
                                <div className={styles.total}>
                                    <p className={styles.contentTitle}>Tổng tiền: </p>
                                    <p className={styles.totalPrice}>{fCurrency(calculateTotalPrice())} VNĐ</p>
                                </div>
                                <div className={styles.promotion}>
                                    <p className={styles.contentTitle}>Mã khuyến mãi: </p>
                                    <p className={styles.promotionCode}>{bill.promotionCode}</p>
                                </div>
                                <div className={styles.totalPay}>
                                    <p className={styles.contentTitle}>Thành tiền: </p>
                                    {promotion === null ?
                                        <p className={styles.totalPayPrice}>{fCurrency(calculateTotalPrice())} VNĐ</p>
                                        :
                                        <p className={styles.totalPayPrice}>{fCurrency(calculateTotalPrice() * (1 - promotion?.discount))} VNĐ</p>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className={styles.button}>
                            <button onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}