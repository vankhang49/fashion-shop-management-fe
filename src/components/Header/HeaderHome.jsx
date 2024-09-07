import React from 'react';
import { useState } from 'react';
import  styles from './HeaderHome.module.scss'
import SideBar from '../../pages/Home/components/SideBar';
import { Link } from 'react-router-dom';
import InputSearch from '../InputSearch/InputSearch';

function HeaderHome(props) {
    const [isOpenSideBar, setIsOpenSideBar] = useState(false);
    const handleOpenSideBar = () => {
        setIsOpenSideBar(!isOpenSideBar);
    }

    const handleDataFromChild = (childData) => {
        setIsOpenSideBar(childData);
      };

    return (
        <header id={styles.header}>
            <nav className={styles.navTop}>
                <ul>
                    <li>
                        <svg
                            fontSize={24}
                            width="1em"
                            height="1em"
                            viewBox="0 0 18 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16.5 8.46287V8.48806C16.5 8.58671 16.4979 8.68327 16.4926 8.77982V8.79031C16.5 9.63636 15.6216 14.0776 8.99842 21C2.42794 14.1301 1.5 10.0909 1.50738 8.8176C1.50738 8.8092 1.50527 8.79976 1.50527 8.78926C1.50316 8.68222 1.5 8.38397 1.5 8.27273C1.5 4.15141 4.85747 1 8.99842 1C13.1394 1 16.4989 4.3426 16.4989 8.46392L16.5 8.46287Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M8.99839 11.9086C10.704 11.9086 12.0866 10.484 12.0866 8.72674C12.0866 6.96947 10.704 5.54492 8.99839 5.54492C7.29281 5.54492 5.91016 6.96947 5.91016 8.72674C5.91016 10.484 7.29281 11.9086 8.99839 11.9086Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                        <a href="#!">Hệ&nbsp;thống cửa&nbsp;hàng</a>
                    </li>
                    <li>
                        <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.26987 10.0076C8.95819 11.5094 10.7895 14.5887 14.5963 15.7611C15.0678 15.9063 15.5825 15.7947 15.9319 15.4464C16.2277 15.1507 16.6002 14.7739 16.9381 14.4298C17.4475 13.911 18.2821 13.9078 18.7968 14.4224L21.6164 17.2418C22.1279 17.7532 22.1279 18.5815 21.6164 19.0929L19.3356 21.3735C18.7578 21.9512 17.9043 22.1512 17.1328 21.8818C13.8164 20.7231 5.06402 16.7966 2.09181 6.85363C1.86658 6.10117 2.06129 5.28452 2.6149 4.7278C3.30532 4.03533 4.27466 3.07555 4.98298 2.37677C5.49553 1.87162 6.31752 1.87478 6.82692 2.38413L9.84122 5.39818C10.3527 5.90964 10.3527 6.73787 9.84122 7.24933L8.53931 8.55114C8.15515 8.93526 8.04254 9.51513 8.26882 10.0087L8.26987 10.0076Z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                        <a href="#!" style={{ color: "red" }}>
                            +84&nbsp;123&nbsp;456&nbsp;789
                        </a>
                    </li>
                    <li>
                        <svg
                            fontSize={24}
                            width="1em"
                            height="1em"
                            viewBox="0 0 20 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.8261 12.9056C3.68345 12.9056 2.75714 13.8179 2.75714 14.9433C2.75714 16.0688 3.68345 16.9811 4.8261 16.9811C5.96876 16.9811 6.89507 16.0688 6.89507 14.9433C6.89507 13.8179 5.96876 12.9056 4.8261 12.9056ZM1.72266 14.9433C1.72266 13.2552 3.11212 11.8867 4.8261 11.8867C6.54009 11.8867 7.92955 13.2552 7.92955 14.9433C7.92955 16.6315 6.54009 18 4.8261 18C3.11212 18 1.72266 16.6315 1.72266 14.9433Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M14.3105 12.9056C13.1678 12.9056 12.2415 13.8179 12.2415 14.9433C12.2415 16.0688 13.1678 16.9811 14.3105 16.9811C15.4531 16.9811 16.3794 16.0688 16.3794 14.9433C16.3794 13.8179 15.4531 12.9056 14.3105 12.9056ZM11.207 14.9433C11.207 13.2552 12.5965 11.8867 14.3105 11.8867C16.0245 11.8867 17.4139 13.2552 17.4139 14.9433C17.4139 16.6315 16.0245 18 14.3105 18C12.5965 18 11.207 16.6315 11.207 14.9433Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.37931 1.01887C1.18887 1.01887 1.03448 1.17093 1.03448 1.3585V13.2453C1.03448 13.4328 1.18887 13.5849 1.37931 13.5849H2.24138C2.52704 13.5849 2.75862 13.813 2.75862 14.0943C2.75862 14.3757 2.52704 14.6038 2.24138 14.6038H1.37931C0.617538 14.6038 0 13.9955 0 13.2453V1.3585C0 0.608221 0.617538 0 1.37931 0H10C10.7618 0 11.3793 0.60822 11.3793 1.3585V5.6038C11.3793 5.88516 11.1477 6.11324 10.8621 6.11324C10.5764 6.11324 10.3448 5.88516 10.3448 5.6038V1.3585C10.3448 1.17093 10.1904 1.01887 10 1.01887H1.37931Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.89844 14.0934C6.89844 13.8121 7.13001 13.584 7.41568 13.584H11.726C12.0117 13.584 12.2433 13.8121 12.2433 14.0934C12.2433 14.3748 12.0117 14.6029 11.726 14.6029H7.41568C7.13001 14.6029 6.89844 14.3748 6.89844 14.0934Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.3438 4.75498C10.3438 4.0047 10.9613 3.39648 11.7231 3.39648H16.4074C16.8919 3.39648 17.3409 3.64685 17.5901 4.05604L19.9252 7.88912C19.9734 7.9683 19.9989 8.05889 19.9989 8.15123V13.2456C19.9989 13.9959 19.3814 14.6041 18.6196 14.6041H16.8955C16.6098 14.6041 16.3782 14.376 16.3782 14.0947C16.3782 13.8133 16.6098 13.5852 16.8955 13.5852H18.6196C18.8101 13.5852 18.9644 13.4332 18.9644 13.2456V8.29233L16.7031 4.58025C16.6407 4.47795 16.5285 4.41536 16.4074 4.41536H11.7231C11.5326 4.41536 11.3782 4.56741 11.3782 4.75498V14.0947C11.3782 14.376 11.1467 14.6041 10.861 14.6041C10.5753 14.6041 10.3438 14.376 10.3438 14.0947V4.75498Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12.0703 5.60319C12.0703 5.32183 12.3019 5.09375 12.5876 5.09375H15.6048C15.7904 5.09375 15.9618 5.19171 16.0539 5.35044L17.778 8.32215C17.8695 8.47982 17.8688 8.67353 17.7763 8.8306C17.6838 8.98767 17.5133 9.08434 17.3289 9.08434H12.5876C12.3019 9.08434 12.0703 8.85625 12.0703 8.5749V5.60319ZM13.1048 6.11262V8.06546H16.4376L15.3046 6.11262H13.1048Z"
                                fill="currentColor"
                            />
                        </svg>
                        <a href="#!">Tra&nbsp;cứu đơn&nbsp;hàng</a>
                    </li>
                    <li>
                        <svg
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ fontSize: 24 }}
                        >
                            <path
                                d="M4.22266 13.8682V9.90212C4.22266 5.55569 7.72295 2 12.001 2C16.279 2 19.7782 5.55569 19.7782 9.90316V14.314C19.7782 17.6432 17.0197 20.0258 13.8188 20.3333"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M4.22222 8.66714V14.7771C2.99568 14.7771 2 13.6729 2 12.3126V11.1305C2 9.77026 2.99568 8.66602 4.22222 8.66602V8.66714Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M19.7778 14.7762V8.66623C21.0043 8.66623 22 9.77047 22 11.1308V12.3128C22 13.6731 21.0043 14.7773 19.7778 14.7773V14.7762Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M12.2964 19.2227H10.5933C9.83633 19.2227 9.22266 19.8342 9.22266 20.5886V20.6345C9.22266 21.3889 9.83633 22.0004 10.5933 22.0004H12.2964C13.0534 22.0004 13.6671 21.3889 13.6671 20.6345V20.5886C13.6671 19.8342 13.0534 19.2227 12.2964 19.2227Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                        <a href="#!">Trung&nbsp;tâm trợ&nbsp;giúp</a>
                    </li>
                    <li>
                        <svg
                            fontSize={24}
                            width="1em"
                            height="1em"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.90661 10.8953C11.7319 10.8953 13.2117 9.41554 13.2117 7.59021C13.2117 5.76488 11.7319 4.28516 9.90661 4.28516C8.08128 4.28516 6.60156 5.76488 6.60156 7.59021C6.60156 9.41554 8.08128 10.8953 9.90661 10.8953Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M4.67578 16.0858V15.6801C4.67578 13.0369 6.81816 10.8945 9.46136 10.8945H10.1138C12.757 10.8945 14.8994 13.0369 14.8994 15.6801V16.0858"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M9.70968 17.7742C14.5199 17.7742 18.4194 14.0192 18.4194 9.3871C18.4194 4.75503 14.5199 1 9.70968 1C4.89946 1 1 4.75503 1 9.3871C1 14.0192 4.89946 17.7742 9.70968 17.7742Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M21.0011 20.9992L15.8398 15.8379"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <a href="#!">Tuyển&nbsp;dụng</a>
                    </li>
                </ul>
            </nav>
            <nav className={styles.navMain}>
                <ul>
                    <li>
                        <Link to="/">FM</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to={`/?keyword=Nam`}>Nam</Link>
                    </li>
                    <li>
                        <Link to={`/?keyword=Nữ`}>Nữ</Link>
                    </li>
                    <li>
                        <Link to={`/?keyword=Đồ đôi`}>Đồ đôi</Link>
                    </li>
                    <li>
                        <Link to={`/?keyword=Trẻ em`}>Trẻ em</Link>
                    </li>
                    <li>
                        <a href="#!">Sale</a>
                    </li>
                    <li>
                        <a href="#!">Bộ sưu tập</a>
                    </li>
                    <li>
                        <Link to="/news">Tin tức</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <InputSearch/>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/lich-su-mua-hang" className={styles.btn}>
                            Lịch sử mua
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li onClick={handleOpenSideBar} style={{ cursor: "pointer" }}>
                        <svg
                            fontSize={24}
                            width="1em"
                            height="1em"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2.5 23.8889C2.5 23.2752 3.00877 22.7778 3.63636 22.7778H26.3636C26.9912 22.7778 27.5 23.2752 27.5 23.8889C27.5 24.5025 26.9912 25 26.3636 25H3.63636C3.00877 25 2.5 24.5025 2.5 23.8889Z"
                                fill="#3A3A3A"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2.5 15C2.5 14.3864 3.00877 13.8889 3.63636 13.8889H26.3636C26.9912 13.8889 27.5 14.3864 27.5 15C27.5 15.6137 26.9912 16.1111 26.3636 16.1111H3.63636C3.00877 16.1111 2.5 15.6137 2.5 15Z"
                                fill="#3A3A3A"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2.5 6.11111C2.5 5.49746 3.00877 5 3.63636 5H26.3636C26.9912 5 27.5 5.49746 27.5 6.11111C27.5 6.72476 26.9912 7.22222 26.3636 7.22222H3.63636C3.00877 7.22222 2.5 6.72476 2.5 6.11111Z"
                                fill="#3A3A3A"
                            />
                        </svg>
                    </li>
                </ul>
            </nav>
            {
                isOpenSideBar && (
                    <SideBar status={handleDataFromChild} />
                )
            }
        </header>
    );
}

export default HeaderHome;