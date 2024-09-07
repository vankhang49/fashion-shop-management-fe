import React from 'react';
import styles from './SideBar.module.scss';
import { Link } from 'react-router-dom';

function SideBar({ status }) {
    const sendDataToParent = () => {
        status(false);
    };

    return (
        <aside id={styles.sidebar}>
            <div className={styles.menuSidebar}>
                <div className={styles.menuTop}>
                    <h2><Link to="/" style={{color: "red"}}>FM</Link></h2>
                    <button className={styles.button} onClick={sendDataToParent}>
                        X
                    </button>
                </div>
                <div className={styles.menuContent}>
                    <ul>
                        <li><Link to="/?keyword=Nam">Nam</Link></li>
                        <li><Link to="/?keyword=Nữ">Nữ</Link></li>
                        <li><Link to="/?keyword=Đồ đôi">Đồ đôi</Link></li>
                        <li><Link to="/?keyword=Trẻ em">Trẻ em</Link></li>
                        <li><Link to="/?keyword=Sale">Sale</Link></li>
                    </ul>
                </div>
                <div className={styles.menuBottom}>
                    <ul>
                        <li><Link to="#!">Tư vấn Zalo</Link></li>
                        <li><Link to="/order-history">Lịch sử mua hàng</Link></li>
                        <li><Link to="#!">Hệ thống cửa hàng</Link></li>
                        <li><Link to="#!">Chính sách hỗ trợ</Link></li>
                        <li><Link to="#!">Bộ sưu tập</Link></li>
                        <li><Link to="/news">Tin tức</Link></li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}

export default SideBar;
