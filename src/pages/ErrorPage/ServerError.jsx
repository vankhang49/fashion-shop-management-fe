import React from 'react';
import servererror from '../../assets/images/image500.png'
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.scss'

function ServerError(props) {
    return (
        <main id={styles.main}>
            <div className={styles.box}>
            <h2>Xin lỗi hệ thống gặp trục trặc</h2>
            <p>Xin lỗi, chúng tôi  hệ thống chúng tôi có chút vấn đề, quay lại sau nhé!</p>
            <img src={servererror} alt={servererror} />
            <Link to="/dashboard">Quay lại trang quản lý</Link>
            </div>
        </main>
    );
}

export default ServerError;