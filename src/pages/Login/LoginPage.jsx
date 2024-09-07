import {Link, Navigate, useNavigate} from "react-router-dom";

import logo from "../../assets/images/logo.png";
import "./LoginPage.scss";
import FooterHome from "../../components/Footer/FooterHome";
import {useForm} from "react-hook-form";
import * as authenticationService from "../../services/auth/AuthenticationService";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import spinner from "../../assets/icons/Spinner.gif";

function LoginPage(props) {
    const isAuthenticated = !!localStorage.getItem("isAuthenticated");
    const [openEye, setOpenEye] = useState(false);
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('')
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const {register, handleSubmit, formState: {errors}, setValue} = useForm({
        criteriaMode: "all"
    });
    const [showPopupElement, setShowPopupElement] = useState(false);

    useEffect(() => {
        checkRememberMe();
    }, []);

    useEffect(() => {
        setTimeout(function () {
            setShowPopupElement(false);
        }, 3000);
    }, [showPopupElement]);

    const checkRememberMe = () => {
        let rememberMe = JSON.parse(localStorage.getItem("rememberMe"));
        if (rememberMe === undefined) {
            rememberMe = authenticationService.getRemember();
        }
        if (rememberMe?.remember === true) {
            setValue("username", rememberMe.username);
            setValue("rememberMe", rememberMe.remember);
        }
    }

    const onSubmit = async (data) => {
        const remember = data.rememberMe;
        setIsLoading(true);
        setTimeout(async () => {
            try {
                const userData = await authenticationService.login(data);
                setIsLoading(false);
                if (userData.statusCode === 200) {
                    localStorage.setItem("id", userData.userId);
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('fullName', userData.fullName);
                    localStorage.setItem('avatar', userData.avatar);
                    localStorage.setItem('isAuthenticated', "authenticated");
                    localStorage.setItem('lastTime', new Date().toISOString());
                    if (remember) {
                        authenticationService.setRemember(data.username);
                    } else {
                        authenticationService.setDefaultRemember();
                        localStorage.removeItem("rememberMe");
                    }
                    navigate("/dashboard");
                    toast.success("Đăng nhập thành công!");
                } else {
                    setLoginError(userData.message);
                    setShowPopupElement(true);
                }
            } catch (error) {
                toast.error(error.message);
                setIsLoading(false);
            }
        }, 2000)
    }


    if (isAuthenticated) {
        return <Navigate to="/dashboard"/>
    }

    return (
        <div id="container">
            <div className="header">
                <div className="logo-brand">
                    <img src={logo} alt="logo"/>
                    <span>Đăng nhập</span>
                </div>
                <div className="middle-part"></div>
                <div className="right-part">
                    <Link to={"/dashboard"}>Quay lại trang chủ</Link>
                </div>
            </div>
            <div className="content">
                <div className="box">
                    <div className="form-box">
                        <div className="form sign_in">
                            <div className="form-content">
                                <h3>Đăng nhập</h3>
                                <form onSubmit={handleSubmit(onSubmit)} id="form_input">
                                    {showPopupElement &&
                                        <div className="popup">
                                            <p className="validate-error">
                                                {loginError}
                                            </p>
                                        </div>
                                    }
                                    <div className="type">
                                        <input
                                            type="text" {...register("username")}
                                            className="login-input"
                                            placeholder="Tên đăng nhập"
                                            id="username"
                                            style={showPopupElement ? {border: "1px solid #DA1075FF"} : {}}

                                        />
                                        {errors.username &&
                                            <p style={{color: "red", fontSize: "16px"}}>{errors.username.message}</p>}

                                    </div>
                                    <div className="type">
                                        <input
                                            type={openEye ? "text" : "password"} {...register("password")}
                                            className="login-input"
                                            placeholder="Mật khẩu"
                                            id="password"
                                            style={showPopupElement ? {border: "1px solid #DA1075FF"} : {}}
                                        />
                                        {openEye ? <FaEye onClick={() => setOpenEye(!openEye)}></FaEye> :
                                            <FaEyeSlash onClick={() => setOpenEye(!openEye)}></FaEyeSlash>}
                                        {errors.password &&
                                            <p style={{color: "red", fontSize: "16px"}}>{errors.password.message}</p>}

                                    </div>
                                    <div className="remember-me-and-forgot">
                                        <label>
                                            <input type="checkbox" {...register("rememberMe")}/>
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <button type={"submit"} disabled={isLoading}
                                            style={isLoading ? {background: "#ccc"} : null} className="btn bkg">
                                        {isLoading ?
                                            <img src={spinner} alt="spinner"/>
                                            :
                                            "Đăng nhập"
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="overlay">
                        <div className="page page_signIn">
                            <h3>Rất vui được gặp lại bạn!</h3>
                            <p>Hãy đăng nhập để khám phá những điều mới mẻ</p>
                        </div>
                        <div className="page page_signUp">
                            <h3>Hello Friend!</h3>
                            <p>Enter your personal details and start journey with us</p>
                        </div>
                    </div>
                </div>
            </div>
            <FooterHome/>
        </div>
    );
}

export default LoginPage;