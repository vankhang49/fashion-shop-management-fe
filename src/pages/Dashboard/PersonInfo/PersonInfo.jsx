import React, {useEffect, useState} from "react";
import * as authenticationService from "../../../services/auth/AuthenticationService";
import {useForm} from "react-hook-form";
import "./info.scss";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {toast} from "react-toastify";
import {DashboardMain} from "../../../components/Dashboard/DashboardMain";
import {useNavigate, useParams} from "react-router-dom";
import {MdOutlineModeEdit} from "react-icons/md";
import {UploadOneImage} from "../../../firebase/UploadImage";
import * as userService from "../../../services/auth/UserService";
import spinner from "../../../assets/icons/Spinner.gif";

export function PersonInfo() {
    const {role} = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [openEyeOne, setOpenEyeOne] = useState(false);
    const [openEyeTwo, setOpenEyeTwo] = useState(false);
    const [openEyeThree, setOpenEyeThree] = useState(false);
    const [roles, setRoles] = useState([]);
    const [validateError, setValidateError] = useState([])
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const {register, handleSubmit, setValue, getValues, formState: {errors}} = useForm({
        criteriaMode: "all"
    });

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo();
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (avatarUrl !== null) {
                await updateAvatarAndBackgroundImage(avatarUrl, backgroundImage);
            }
            if (backgroundImage !== null) {
                await updateAvatarAndBackgroundImage(avatarUrl, backgroundImage);
            }
        }
        fetchData().then().catch();
    }, [avatarUrl, backgroundImage]);

    const getUserInfo = async () => {
        try {
            const temp = await authenticationService.getYourProfile();
            if (temp) {
                setUserInfo(temp);
                setValue("userId", temp.userId);
                setValue("username", temp.username);
                setRoles(temp.roles);
            }
        } catch (e) {
            if (e.response.status === 401) {
                await authenticationService.logout();
                window.location.href = "/login";
            }
        }
    }

    const updateAvatarAndBackgroundImage = async (avatar, backgroundImage) => {
        try {
            const temp = await userService.updateAvatarAndBackgroundImage(userInfo.username, avatar, backgroundImage);
            if (temp.statusCode === 200) {
                setUserInfo(temp);
                setValue("userId", temp.userId);
                setValue("username", temp.username);
                setRoles(temp.roles);
                toast.success(temp.message);
            } else {
                toast.error(temp.message);
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setTimeout(function () {
                setIsLoading(false);
            }, 3000);
        }
    }

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token");
            const response = await authenticationService.updatePasswordUser(data, token);
            toast.success(response.message);
            setTimeout(function () {
                authenticationService.logout();
                navigate("/login");
            }, 1000);
        } catch (error) {
            setValidateError(error);
            toast.error(error.message);
        }
    }

    const handleShowPassword = (data) => {
        if (data === 1) {
            setOpenEyeOne(!openEyeOne);
        }
        if (data === 2) {
            setOpenEyeTwo(!openEyeTwo);
        }
        if (data === 3) {
            setOpenEyeThree(!openEyeThree);
        }
    }

    const handleOneImageUrlChange = (uploadedImageUrl, field) => {
        if (field === "avatar") {
            setAvatarUrl(uploadedImageUrl);
        }
        if (field === "background") {
            setBackgroundImage(uploadedImageUrl);
        }
    };

    const triggerFileInput = (inputClass) => {
        setIsLoading(true);
        document.querySelector(inputClass).click();
    };

    return (
        <DashboardMain path={role} content={
            <div className="content-body">
                <div className="content-element">
                    <div className="avatar" style={{backgroundImage: `url(${userInfo.backgroundImage})`}}>
                        <div className="update-avatar">
                            <img src={userInfo.avatar} alt="avatar"/>
                            {isLoading ?
                                <div className="edit-button">
                                    <img className="spinner" src={spinner} alt="spinner"/>
                                </div>
                                :
                                <div className="edit-button" onClick={() => triggerFileInput(".avatar-input")}>
                                    <MdOutlineModeEdit/>
                                </div>
                            }
                            <div className="input-file">
                                <UploadOneImage
                                    className={"avatar-input"}
                                    getDisabled={(e) => setDisabled(e)}
                                    onImageUrlChange={(url) => handleOneImageUrlChange(url, "avatar")}/>
                            </div>
                            <div className="person-name">
                                <span>{userInfo.fullName}</span>
                            </div>
                        </div>
                        {isLoading ?
                            <div className="update-bg">
                                <div className="edit-button">
                                    <img className="spinner" src={spinner} alt="spinner"/>
                                </div>
                                <div className="input-file">
                                    <UploadOneImage
                                        className={"background-input"}
                                        style={{display: "none"}}
                                        getDisabled={(e) => setDisabled(e)}
                                        onImageUrlChange={(url) => handleOneImageUrlChange(url, "background")}/>
                                </div>
                                <span>Chỉnh sửa ảnh bìa</span>
                            </div>
                            :
                            <div className="update-bg" onClick={() => triggerFileInput(".background-input")}>
                                <div className="edit-button">
                                    <MdOutlineModeEdit/>
                                </div>
                                <div className="input-file">
                                    <UploadOneImage
                                        className={"background-input"}
                                        style={{display: "none"}}
                                        getDisabled={(e) => setDisabled(e)}
                                        onImageUrlChange={(url) => handleOneImageUrlChange(url, "background")}/>
                                </div>
                                <span>Chỉnh sửa ảnh bìa</span>
                            </div>
                        }
                    </div>
                    <div className="flex-content">
                        <div className="person-info">
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Tên nhân viên: </span>
                                    <span className="element-value">{userInfo.fullName}</span>
                                </label>
                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Mã nhân viên: </span>
                                    <span className="element-value">{userInfo.userCode}</span>
                                </label>
                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Ngày sinh: </span>
                                    <span className="element-value">{userInfo.dateOfBirth}</span>
                                </label>
                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Giới tính: </span>
                                    <span className="element-value">
                                        {userInfo?.gender === 0 ? "Nam" : userInfo.gender === 1 ? "Nữ" : "Khác"}
                                    </span>

                                </label>
                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Email: </span>
                                    <span className="element-value">{userInfo.email}</span>
                                </label>
                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Địa chỉ: </span>
                                    <span className="element-value">{userInfo.address}</span>
                                </label>
                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Số điện thoại: </span>
                                    <span className="element-value">{userInfo.phoneNumber}</span>
                                </label>

                            </div>
                            <div className="info-element">
                                <label>
                                    <span className={"element-title"}>Chức vụ: </span>
                                    <span className="element-value">
                                        {userInfo.role?.roleName === "ROLE_MANAGER" ? "Quản lý cửa hàng"
                                            : userInfo.role?.roleName === "ROLE_WAREHOUSE" ? "Quản lý kho"
                                                : "Nhân viên bán hàng"}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <form className="form-operation" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-element">
                                <label>Tên tài khoản: </label>
                                <input type="text" {...register("username")}
                                       style={{color: "var(--sidebar-main-color)"}}
                                       disabled name="username"/>
                            </div>
                            <div className="old-password form-element">
                                <label>Mật khẩu cũ: </label>
                                <span className="inputValue">
                                        <input type={openEyeOne ? "text" : "password"}
                                               name="oldPassword" {...register("oldPassword", {
                                            required: "Mật khẩu không được để trống"
                                        })}/>
                                    {openEyeOne ? <FaEye onClick={() => handleShowPassword(1)}/>
                                        : <FaEyeSlash onClick={() => handleShowPassword(1)}/>}
                                </span>
                                {errors.password && <p className="validate-error">{errors.password.message}</p>}
                                {validateError && <p className="validate-error">{validateError.password}</p>}
                            </div>
                            <div className="new-password form-element">
                                <label>Mật khẩu mới: </label>
                                <span className="inputValue">
                                            <input type={openEyeTwo ? "text" : "password"}
                                                   name="newPassword" {...register("newPassword", {
                                                required: "Mật khẩu không được để trống!",
                                                minLength: {value: 8, message: "Mật khẩu phải từ 8 đến 50 chữ!"},
                                                maxLength: {value: 50, message: "Mật khẩu phải từ 8 đến 50 chữ!"},
                                                pattern: {
                                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,50}$/,
                                                    message: "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, và một chữ số, và phải dài từ 8 đến 50 ký tự!"
                                                }
                                            })}/>
                                    {openEyeTwo ? <FaEye onClick={() => handleShowPassword(2)}/>
                                        : <FaEyeSlash onClick={() => handleShowPassword(2)}/>}
                                        </span>
                                {errors.newPassword && <p className="validate-error">{errors.newPassword.message}</p>}
                                {validateError && <p className="validate-error">{validateError.newPassword}</p>}
                            </div>
                            <div className="confirm-password form-element">
                                <label>Nhập lại mật khẩu: </label>
                                <span className="inputValue">
                                        <input type={openEyeThree ? "text" : "password"}
                                               name="confirmPassword" {...register("confirmPassword"
                                            , {
                                                validate: value => value === getValues('newPassword') || "Mật khẩu không trùng khớp!"
                                            })}/>
                                    {openEyeThree ? <FaEye onClick={() => handleShowPassword(3)}/>
                                        : <FaEyeSlash onClick={() => handleShowPassword(3)}/>}
                                        </span>
                                {errors.confirmPassword &&
                                    <p className="validate-error">{errors.confirmPassword.message}</p>}
                                {validateError && <p className="validate-error">{validateError.confirmPassword}</p>}
                            </div>
                            <div className="form-element">
                                <button type="submit" className="btn-submit">
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        }/>
    );
}