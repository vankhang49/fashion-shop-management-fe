import "./HeaderDashboard.scss";
import avatar from "./avatar.jpg";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import * as authenticationService from "../../services/auth/AuthenticationService";
import {getAllByStatusRead} from "../../services/notification/NotificationService";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {isSalesMan, isWarehouse} from "../../services/auth/AuthenticationService";
import {TiArrowSortedDown} from "react-icons/ti";
import {FaRegBell} from "react-icons/fa";
import {FaRegUserCircle} from "react-icons/fa";
import {IoIosLogOut} from "react-icons/io";
import {TopicModal} from "./TopicModal/TopicModal";
import {GiLargePaintBrush} from "react-icons/gi";
import {toast} from "react-toastify";

export function HeaderDashboard(props) {
    const [roleName, setRoleName] = useState("");
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isShowUserMenu, setIsShowUserMenu] = useState(false);
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [quantityUnread, setQuantityUnread] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/notification", (message) => {
                    console.log("useEffect ở header đang hoaạt động")
                    getQuantityNotificationUnread();
                }
            )
        });
        setStompClient(stompClient);
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getRoleName();
        }
        fetchData().then().catch();
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/createNotification', (message) => {
                getQuantityNotificationUnread();
                toast("Bạn vừa có thông báo mới!", {autoClose: 500})
            });

            if (isSalesMan()) {
                stompClient.subscribe('/topic/salesman/createNotification', (message) => {
                    getQuantityNotificationUnread();
                    toast("Bạn vừa có thông báo mới!", {autoClose: 500})
                });
            }

            if (isWarehouse()) {
                console.log(isWarehouse());
                stompClient.subscribe('/topic/warehouse/createNotification', (message) => {
                    getQuantityNotificationUnread();
                    toast("Bạn vừa có thông báo mới!", {autoClose: 500})
                });
            }
            stompClient.subscribe("/topic/notification", (message) => {
                    console.log(message.body);
                    getQuantityNotificationUnread();
                }
            );
        });
        setStompClient(stompClient);
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        getUserName();
        getAvatar();
        getQuantityNotificationUnread();
    }, [])

    const getRoleName = async () => {
        const role = await authenticationService.getRole();
        if (role === 'ROLE_ADMIN') {
            setRoleName("admin");
        }
        if (role === 'ROLE_WAREHOUSE') {
            setRoleName("warehouse");
        }
        if (role === 'ROLE_SALESMAN') {
            setRoleName("salesman");
        }
        if (role === 'ROLE_MANAGER') {
            setRoleName("storeManager");
        }
    }

    const getQuantityNotificationUnread = async () => {
        const temp = await getAllByStatusRead(0);
        console.log(temp.length);
        if (temp.length > 99) {
            setQuantityUnread("99+")
        } else {
            setQuantityUnread(temp.length);
        }

    };

    const getUserName = () => {
        const fullName = localStorage.getItem('fullName')
        setFullName(fullName);
    }

    const getAvatar = () => {
        const avatar = localStorage.getItem('avatar')
        setAvatarUrl(avatar)
    }

    const handleShowUserMenu = () => {
        setIsShowUserMenu(!isShowUserMenu);
    }

    const handleShowSidebar = () => {
        setIsShowSidebar(!isShowSidebar);
        props.parentCallback(isShowSidebar);
    }

    const handleLogout = async () => {
        try {
            const temp = authenticationService.logout();
            toast.success(temp);
            navigate("/login");
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('fullName');
            localStorage.removeItem('avatar');
            localStorage.removeItem('id');
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('lastTime');
        } catch (e) {
            toast.error(e.message);
        }
    }

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => setIsModalOpen(false);

    return (
        <header className="dashboard-header">
            <div className="btn-bar" onClick={handleShowSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0
  256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0
  17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                    />
                </svg>
            </div>
            <div className="search-header">
                <input className="search-bar" placeholder="Tìm kiếm..." type="text"/>
            </div>
            {/*-------------logon-brand----------*/}
            <div className="logo-brand">
                <span>FM Style</span>
            </div>
            {/*-----------login-box-----------*/}
            <div className="login-btn">
                {/*------------------notification-----------------------------*/}
                {
                    (isSalesMan() || isWarehouse()) && (
                        <div className="layout-notif" id="btn-notification" onClick={props.onClick}>
                            <div className="notification">
                                <FaRegBell size={27}/>
                                <span className="quantity">{quantityUnread}</span>
                            </div>
                        </div>
                    )
                }
                <div className="user-box show-dropdown" onClick={handleShowUserMenu}>
                    <div className="avatar">
                        {avatarUrl ? <img src={avatarUrl} alt="avatar"/> : <img src={avatar} alt="avatar"/>}
                    </div>
                    <div className="username">{fullName}</div>
                    <TiArrowSortedDown/>
                </div>
                {isShowUserMenu &&
                    <div className="dropdown-content">
                        <div className="user-full-name">
                            <div className="avatar">
                                {avatarUrl ? <img src={avatarUrl} alt="avatar"/> : <img src={avatar} alt="avatar"/>}
                            </div>
                            {fullName}
                        </div>
                        <Link to={`/dashboard/${roleName}/infor`}>
                            <FaRegUserCircle/>
                            Thông tin cá nhân
                        </Link>
                        <a className="mode-switch" title="Switch Theme" onClick={openModal}>
                            <GiLargePaintBrush/>
                            Chủ đề giao diện
                        </a>
                        <a onClick={handleLogout}>
                            <IoIosLogOut/>
                            Đăng xuất
                        </a>
                    </div>
                }
            </div>
            <TopicModal isOpen={isModalOpen} onClose={closeModal}></TopicModal>
        </header>
    );
}
