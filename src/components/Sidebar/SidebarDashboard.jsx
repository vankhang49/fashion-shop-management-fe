import "./sidebarDashboard.scss";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as authenticationService from "../../services/auth/AuthenticationService";
import { MdDashboard } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { MdPointOfSale } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";


export function SidebarDashboard(props) {
    const [sidebarActive, setSidebarActive] = useState(props.showSidebar);
    const [functionCall, setFunctionCall] = useState(props.path);
    const [showDropdown, setShowDropdown] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSalesMan, setIsSalesMan] = useState(false);
    const [isWarehouse, setIsWarehouse] = useState(false);
    const [isStoreManager, setIsStoreManager] = useState(false);

    useEffect(()=> {
        const fetchData = async () => {
            setIsAdmin(await authenticationService.isAdmin());
            setIsSalesMan(await authenticationService.isSalesMan());
            setIsWarehouse(await authenticationService.isWarehouse());
            setIsStoreManager(await authenticationService.isStoreManager());
        }
        fetchData()
    }, [])

    useEffect(() => {
        setSidebarActive(props.showSidebar);
        setFunctionCall(props.path);
    }, [props.showSidebar, props.path]);

    const handleToggleDropdown = (sidebarName) => {
        setShowDropdown(showDropdown === sidebarName ? "" : sidebarName);
    }

    return (
        <aside className={sidebarActive? "sidebar appear" : "sidebar"}>
            <ul className="sidebar-list">
                <li className={functionCall === "dashboard" ? "sidebar-list-item active" : "sidebar-list-item"}>
                    <Link className="show-dropdown" to={"/dashboard"}>
                        <MdDashboard/>
                        <span>Trang quản lý</span>
                    </Link>
                </li>
                {(isSalesMan || isAdmin) &&
                    <li className={`sidebar-list-item paste-button`}>
                    <a className={functionCall === "salesMan" ? `show-dropdown active`: `show-dropdown`}
                        onClick={() => handleToggleDropdown("salesMan")}>
                        <MdPointOfSale/>
                        <span>
                          Người bán hàng
                          <TiArrowSortedDown />
                        </span>
                    </a>

                    <div className={showDropdown === "salesMan" ? "dropdown-content" : "dropdown-content show"}>
                        <Link to={"/dashboard/salesMan/infor"}>Thông tin cá nhân</Link>
                        <Link to={"/dashboard/salesMan/warehouse"}>Nhà kho</Link>
                        <Link to={"/dashboard/salesMan/payment"}>Thanh toán</Link>
                        <Link to={"/dashboard/salesMan/statistic"}>Thống kê</Link>
                        <Link to={"/dashboard/salesMan/notification"}>Xem thông báo</Link>
                    </div>
                </li>}
                {(isWarehouse || isAdmin) &&
                    <li className={`sidebar-list-item paste-button`}>
                    <a className={functionCall === "warehouse" ? `show-dropdown active`: `show-dropdown`}
                        onClick={() => handleToggleDropdown("warehouse")}>
                        <FaWarehouse/>
                        <span>
                          Quản lý kho
                          <TiArrowSortedDown />
                        </span>
                    </a>
                    <div className={showDropdown === "warehouse" ? "dropdown-content" : "dropdown-content show"}>
                        <Link to={"/dashboard/warehouse/infor"}>Thông tin cá nhân</Link>
                        <Link to={"/dashboard/warehouse/warehouse"}>Nhà kho</Link>
                        <Link to={"/dashboard/warehouse/import-pricing"}>Nhập liệu</Link>
                        <Link to={"/dashboard/warehouse/statistic"}>Thống kê</Link>
                        <Link to={"/dashboard/warehouse/notification"}>Xem thông báo</Link>
                    </div>
                </li>}
                {(isStoreManager || isAdmin) &&
                    <li className={`sidebar-list-item paste-button`}>
                    <a className={functionCall === "storeManager" ? `show-dropdown active`: `show-dropdown`}
                       onClick={() => handleToggleDropdown("storeManager")}>
                        <GrUserManager/>
                        <span>
                          Quản lý cửa hàng
                          <TiArrowSortedDown />
                        </span>
                    </a>
                    <div className={showDropdown === "storeManager" ? "dropdown-content " : "dropdown-content show"}>
                        <Link to={"/dashboard/storeManager/infor"}>Thông tin cá nhân</Link>
                        <Link to={"/dashboard/storeManager/warehouse"}>Nhà kho</Link>
                        <a href="#">Xem báo cáo</a>
                        <Link to={"/dashboard/storeManager/customers"}>Quản lý khách hàng</Link>
                        <Link to={"/dashboard/storeManager/employee-list"}>Quản lý nhân viên</Link>
                        <Link to={"/dashboard/storeManager/notification"}>Đăng thông báo</Link>
                        <a href="#">Sao lưu/Khôi phục</a>
                    </div>
                </li>}
                {isStoreManager &&
                <li className="sidebar-list-item">
                    <Link className="show-dropdown" to={"/dashboard/storeManager/news"}>
                        <PiNewspaperClippingBold/>
                        <span>Tin tức</span>
                    </Link>
                </li>
                }
                <li className="sidebar-list-item">
                    <Link className="show-dropdown" to="/">
                        <FaHome />
                        <span>Trang chủ</span>
                    </Link>
                </li>
            </ul>
        </aside>
    );
}
