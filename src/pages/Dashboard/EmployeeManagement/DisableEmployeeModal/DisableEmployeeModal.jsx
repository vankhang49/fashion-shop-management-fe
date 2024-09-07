import styles from "./DisableEmployeeModal.module.scss";
import React, {useEffect, useState} from "react";
import { IoTrashOutline } from "react-icons/io5";
import * as userService from "../../../../services/employee/EmployeeService";
import {toast} from "react-toastify";

export const DisableEmployeeModal = ({isOpen, onClose, employeeDisable, onDisableSuccess}) => {

    const handleDisableEmployee = async () => {
        try {
            await userService.disableEmployee(employeeDisable.employeeId);
            toast.success("Khóa tài khoản thành công");
            onDisableSuccess(); // Gọi callback để cập nhật danh sách
        } catch (e) {
            toast.error(e);
        }
    }

    return (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <IoTrashOutline />
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalTitle}>
                        <p>Bạn có chắc muốn khóa tài khóa nhân viên?</p>
                    </div>
                    <div className={styles.employeeCode}>
                        <label>Mã nhân viên: </label>
                        <span>{employeeDisable.employeeCode}</span>
                    </div>
                    <div className={styles.employeeName}>
                        <label>Tên nhân viên: </label>
                        <span>{employeeDisable.employeeName}</span>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.acceptDelete} onClick={handleDisableEmployee}>Đồng ý</button>
                    <button className={styles.cancel} onClick={onClose}>Huỷ bỏ</button>
                </div>
            </div>
        </div>
    );
};