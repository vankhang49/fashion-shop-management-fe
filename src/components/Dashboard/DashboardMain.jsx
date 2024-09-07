import {HeaderDashboard} from "../Header/HeaderDashboard";
import {SidebarDashboard} from "../Sidebar/SidebarDashboard";
import {useEffect, useState} from "react";
import "./DashboardMain.scss";
import ListOfNotification from "../Notification/list/ListOfNotification";
import * as authenticationService from "../../services/auth/AuthenticationService";

export function DashboardMain({content, path}) {
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [showNotificationList, setShowNotificationList] = useState(false);

    const handleLogout = async () => {
        await authenticationService.logout();
    };

    const checkMidnightLogout = () => {
        const now = new Date();
        const lastLoginDate = localStorage.getItem("lastTime");
        if (lastLoginDate) {
            const lastLogin = new Date(lastLoginDate);
            // Chỉ đăng xuất nếu ngày hiện tại khác ngày đăng nhập cuối cùng và đã qua 0 giờ
            if (
                now.getDate() !== lastLogin.getDate() ||
                now.getMonth() !== lastLogin.getMonth() ||
                now.getFullYear() !== lastLogin.getFullYear()
            ) {
                handleLogout();
            }
        }
    };

    useEffect(() => {
        // Kiểm tra ngay khi trang được tải lại
        checkMidnightLogout();

        // Thiết lập kiểm tra mỗi phút
        const interval = setInterval(checkMidnightLogout, 60000); // Kiểm tra mỗi phút

        return () => clearInterval(interval);
    }, []);


    const callbackFunction = (childData) => {
        setIsShowSidebar(childData);
    };

    const displayNotification = (event) => {
        event.stopPropagation(); // Ngăn sự kiện click lan đến phần tử cha
        setShowNotificationList(prevState => !prevState);
    };

    const turnOffNotification = () => {
        if (showNotificationList) {
            setShowNotificationList(false);
        }
    };

    return (
        <div className="app-container" onClick={turnOffNotification}>
            <HeaderDashboard parentCallback={callbackFunction} onClick={displayNotification}></HeaderDashboard>
            {showNotificationList && (
                <div className="overlay-nhi" onClick={(event) => event.stopPropagation()}>
                    <div className="notification-content-header-nhi">
                        <ListOfNotification
                            widthList={"300px"}
                            backgroundColorList={"white"}
                            marginTopList={"-10px"}
                            marginList={"-10px -30px"}
                            paddingList={"10px"}
                            heightList={"550px"}
                            heightMain={"400px"}
                            seeAllBackgroundColor={"white"}
                            fontSizeMain={"11px"}
                            paddingCard={"0.6rem 0.125rem"}
                            widthImg={"45px"}
                            heightImg={"40px"}
                            fontSizeNodata={"12px"}
                            fontSizeHeader={"12px"}
                        />
                    </div>
                </div>
            )}
            <div id="content-wrapper">
                <SidebarDashboard showSidebar={isShowSidebar} path = {path}></SidebarDashboard>
                <div className="app-content">
                    {content}
                </div>
            </div>
        </div>
    );
}
