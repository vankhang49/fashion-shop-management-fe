import React, {useEffect, useState} from "react";
import * as employeeService from "../../../services/employee/EmployeeService";
import {useForm} from "react-hook-form";
import "./Employee.scss";
import {Link, useNavigate, useParams} from "react-router-dom";
import {MdOutlineModeEdit} from "react-icons/md";
import {BiSolidShow} from "react-icons/bi";
import {IoTrashSharp} from "react-icons/io5";
import {DashboardMain} from "../../../components/Dashboard/DashboardMain";
import {EmployeeDetailModal} from "./employDetailModal/EmployeeDetailModal";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import {DisableEmployeeModal} from "./DisableEmployeeModal/DisableEmployeeModal";
import {DeleteEmployeeModal} from "./DeleteEmployeeModal/DeleteEmployeeModal";
import * as roleService from "../../../services/employee/RoleService";

export function EmployeeList() {
    const {role} = useParams();
    const [employeeList, setEmployeeList] = useState([]);
    const [totalPages, setTotalPages] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const [searchContent, setSearchContent] = useState('');
    const [roleName, setRoleName] = useState('');
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [userId, setUserId] = useState(null);
    const currentUserId = Number.parseInt(localStorage.getItem("id"));
    const [roles, setRoles] = useState([]);
    const [message, setMessage] = useState(null);
    const {register, handleSubmit, formState: {errors}} = useForm({
        criteriaMode: "all"
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDisableOpen, setIsModalDisableOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const [employeeDisable, setEmployeeDisable] = useState({
        employeeId: null,
        employeeCode: "",
        employeeName: ""
    });

    const [employeeDelete, setEmployeeDelete] = useState({
        employeeId: null,
        employeeCode: "",
        employeeName: ""
    });

    const [codeSort, setCodeSort] = useState({
        field: "",
        direction: ""
    });

    const [nameSort, setNameSort] = useState({
        field: "",
        direction: ""
    });
    const [roleSort, setRoleSort] = useState({
        field: "",
        direction: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            await getEmployeeList('', '', roleName, codeSort.field, codeSort.direction,
                nameSort.field, nameSort.direction, roleSort.field, roleSort.direction);
            await getRoleList();
        };
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await getEmployeeList(pageNumber, searchContent, roleName, codeSort.field, codeSort.direction,
                nameSort.field, nameSort.direction, roleSort.field, roleSort.direction);
        }
        fetchData();
    }, [pageNumber])

    useEffect(() => {
        const fetchData = async () => {
            await getEmployeeList(pageNumber, searchContent, roleName, codeSort.field, codeSort.direction,
                nameSort.field, nameSort.direction, roleSort.field, roleSort.direction);
        }
        fetchData();
    }, [codeSort, nameSort, roleSort]);

    const getEmployeeList = async (page, searchContent, roleName, codeSort, codeDirection, nameSort, nameDirection,
                                   roleSort, roleDirection) => {
        try {
            const temp = await employeeService.getAllEmployees(page, searchContent, roleName, codeSort, codeDirection,
                nameSort, nameDirection, roleSort, roleDirection);
            setEmployeeList(temp.content);
            setTotalPages(temp.totalPages);
        }catch (e) {
            setMessage(e);
        }
    }

    const getRoleList = async () => {
        const temp = await roleService.getAllRoles();
        setRoles(temp);
    }

    const onSubmit = async (data) => {
        try {
            const temp = await employeeService.getAllEmployees('', data.searchContent, data.roleName, codeSort.field,
                codeSort.direction, nameSort.field, nameSort.direction, roleSort.field, roleSort.direction);
            setSearchContent(data.searchContent);
            setRoleName(data.roleName);
            setEmployeeList(temp.content);
            setTotalPages(temp.totalPages);
            setMessage(null);
        } catch (error) {
            setMessage(error);
            setEmployeeList([]);
            setTotalPages({})
        }
    }

    const openDetailModal = (id) => {
        setIsModalOpen(true);
        setUserId(id);
    }

    const openDisableModal = (employee) => {
        setIsModalDisableOpen(true);
        setEmployeeDisable({
            employeeId: employee.userId,
            employeeCode: employee.userCode,
            employeeName: employee.fullName
        });
    }

    const openDeleteModal = (employee) => {
        setIsModalDeleteOpen(true);
        setEmployeeDelete({
            employeeId: employee.userId,
            employeeCode: employee.userCode,
            employeeName: employee.fullName
        });
    }

    const closeDetailModal = () => setIsModalOpen(false);
    const closeDisableModal = () => setIsModalDisableOpen(false);
    const closeDeleteModal = () => setIsModalDeleteOpen(false);

    const showPageNo = () => {
        let pageNoTags = [];
        for (let i = 0; i < totalPages; i++) {
            pageNoTags.push(<a key={i} className="page-a" onClick={() => handlePage(i)}>{i + 1}</a>);
        }
        return pageNoTags;
    }

    const handlePage = (pageNo) => {
        setPageNumber(pageNo);
    }

    const handleUpdateEmployeeFlag = async () => {
        setIsModalDisableOpen(false);
        setIsModalOpen(false);
        setIsModalDeleteOpen(false);
        await getEmployeeList(pageNumber, searchContent, roleName, codeSort.field, codeSort.direction,
            nameSort.field, nameSort.direction, roleSort.field, roleSort.direction); // Gọi lại getEmployeeList sau khi xóa
    }

    return (
        <DashboardMain path={role}
            content={
                <div className="content-body">
                    <div className="content-element">
                        <div className="header-content">
                            <form onSubmit={handleSubmit(onSubmit)} className="form-search">
                                <label className="search-title"> Tên/Mã nhân viên:</label>
                                <input type="text" {...register("searchContent")} className="search-bar"
                                       placeholder="Nhập nội dung tìm kiếm"/>
                                <select {...register("roleName")}  className="search-bar">
                                    <option value="">--Chọn một chức vụ--</option>
                                    {roles.map(role => (
                                        <option key={role.roleId} value={role.roleName}>
                                            {role.roleId === 1 ? "Admin"
                                                : role.roleId === 2 ? "Quản lý cửa hàng"
                                                    : role.roleId === 3 ? "Nhân viên bán hàng"
                                                        : "Quản lý kho"}
                                        </option>
                                        ))}
                                </select>
                                <button className="btn btn-search">Tìm kiếm</button>
                            </form>
                            <Link to={"/dashboard/storeManager/employee-create"} className="link-move">Thêm mới nhân
                                viên</Link>
                        </div>
                        <div className="box-content">
                            <p>Danh sách nhân viên</p>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className={"no"}>
                                        STT
                                    </th>
                                    <th className={"emp-code"}>
                                        <span>Mã nhân viên</span>
                                        {codeSort.direction === "" ?
                                            <button className="sort-button"
                                                    onClick={() => setCodeSort({field: "userCode", direction: "asc"})}>
                                                <TiArrowUnsorted/>
                                            </button>
                                            : codeSort.direction === "asc" ?
                                                <button className="sort-button"
                                                        onClick={() => setCodeSort({
                                                            field: "userCode",
                                                            direction: "desc"
                                                        })}>
                                                    <TiArrowSortedDown/>
                                                </button>
                                                : <button className="sort-button"
                                                          onClick={() => setCodeSort({field: "", direction: ""})}>
                                                    <TiArrowSortedUp/>
                                                </button>
                                        }
                                    </th>
                                    <th className={"emp-name"}>
                                        <span>Họ và tên</span>
                                        {nameSort.direction === "" ?
                                            <button className="sort-button"
                                                    onClick={() => setNameSort({
                                                        field: "fullName",
                                                        direction: "asc"
                                                    })}>
                                                <TiArrowUnsorted/>
                                            </button>
                                            : nameSort.direction === "asc" ?
                                                <button className="sort-button"
                                                        onClick={() => setNameSort({
                                                            field: "fullName",
                                                            direction: "desc"
                                                        })}>
                                                    <TiArrowSortedDown/>
                                                </button>
                                                : <button className="sort-button"
                                                          onClick={() => setNameSort({
                                                              field: "",
                                                              direction: ""
                                                          })}>
                                                    <TiArrowSortedUp/>
                                                </button>
                                        }
                                    </th>
                                    <th className={"emp-role"}>
                                        <span>Chức vụ</span>
                                        {roleSort.direction === "" ?
                                            <button className="sort-button"
                                                    onClick={() => setRoleSort({
                                                        field: "role",
                                                        direction: "asc"
                                                    })}>
                                                <TiArrowUnsorted/>
                                            </button>
                                            : roleSort.direction === "asc" ?
                                                <button className="sort-button"
                                                        onClick={() => setRoleSort({
                                                            field: "role",
                                                            direction: "desc"
                                                        })}>
                                                    <TiArrowSortedDown/>
                                                </button>
                                                : <button className="sort-button"
                                                          onClick={() => setRoleSort({
                                                              field: "",
                                                              direction: ""
                                                          })}>
                                                    <TiArrowSortedUp/>
                                                </button>
                                        }
                                    </th>
                                    <th className={"status"}>
                                        trạng thái
                                    </th>
                                    <th className={"email"}>
                                        Email
                                    </th>
                                    <th className={"phoneNumber"}>
                                        Số điện thoại
                                    </th>
                                    <th className={"edit-emp"}>Chỉnh sửa</th>
                                </tr>
                                </thead>
                                <tbody>
                                {employeeList && employeeList.filter((employee) => employee.userId !== currentUserId
                                )?.map((employee, index) => (
                                    <tr key={employee.userId}>
                                        <td className={"no"}>{++index}</td>
                                        <td className={"emp-code"}>{employee.userCode}</td>
                                        <td className={"emp-name"}>{employee.fullName}</td>
                                        <td className={"emp-role"}>
                                            {employee.role.roleId === 1 ? "Admin"
                                                : employee.role.roleId === 2 ? "Quản lý cửa hàng"
                                                    : employee.role.roleId === 3? "Nhân viên bán hàng"
                                                        : "Quản lý kho"}
                                        </td>
                                        <td className={"status"}>
                                            {employee.enabled === true ?
                                                <span style={{color: "green"}}>Kích hoạt</span>
                                                : <span style={{color: "red"}}>Bất hoạt</span>
                                            }
                                        </td>
                                        <td className={"email"}>{employee.email}</td>
                                        <td className={"phoneNumber"}>{employee.phoneNumber}</td>
                                        <td className={"edit-emp"}>
                                            <a onClick={() => openDetailModal(employee.userId)}>
                                                <BiSolidShow fill="#3dc8d8"/>
                                            </a>
                                            <Link to={`/dashboard/storeManager/employee-create/${employee.userId}`}>
                                                <MdOutlineModeEdit fill="#00a762"/>
                                            </Link>
                                            {employee.enabled ?
                                                <a onClick={() => openDisableModal(employee)}>
                                                    <MdCancel fill="red"/>
                                                </a>
                                                :
                                                <a onClick={() => openDeleteModal(employee)}>
                                                    <IoTrashSharp fill="red"/>
                                                </a>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {message !== null && <p className="list-error">{message}</p>}
                        </div>

                        <div className="page">
                            <div className="page-box">
                                {pageNumber !== 0 &&
                                    <a className="page-a" onClick={() => handlePage(pageNumber - 1)}>Trang trước</a>
                                }
                                <span>
                                    {showPageNo()}
                                </span>
                                {pageNumber < (totalPages - 1) &&
                                    <a className="page-a" onClick={() => handlePage(pageNumber + 1)}>Trang sau</a>
                                }
                            </div>
                        </div>

                    </div>
                    <EmployeeDetailModal
                        isOpen={isModalOpen}
                        onClose={closeDetailModal}
                        id={userId}
                        onEnableSuccess={handleUpdateEmployeeFlag}
                    >
                    </EmployeeDetailModal>
                    <DisableEmployeeModal
                        isOpen={isModalDisableOpen}
                        onClose={closeDisableModal}
                        employeeDisable= {employeeDisable}
                        onDisableSuccess={handleUpdateEmployeeFlag}
                    >
                    </DisableEmployeeModal>
                    <DeleteEmployeeModal
                        isOpen={isModalDeleteOpen}
                        onClose={closeDeleteModal}
                        employeeDelete = {employeeDelete}
                        onDeleteSuccess={handleUpdateEmployeeFlag}
                    >
                    </DeleteEmployeeModal>
                </div>
            }>
        </DashboardMain>
    );
}