import axios from "axios";
import {jwtDecode} from "jwt-decode";
import axiosInstance from "../../utils/axiosInstance";
import {useNavigate} from "react-router-dom";

const baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

const rememberMe = {
    "remember" : false,
    "username" : ""
}

export const setRemember = (data) => {
    rememberMe.remember = true;
    rememberMe.username = data;
    localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
}

export const setDefaultRemember = () => {
    rememberMe.remember = false;
    rememberMe.username = "";
}

export const getRemember = () => {
    return rememberMe;
}

export const login = async (data) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/authenticate`, data)
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

export const register = async (userData) => {
    try{
        const response = await axios.post(`${baseURL}/api/auth/register`, userData)
        return response.data;
    }catch(err){
        throw err;
    }
}

export const getYourProfile = async () => {
    try{
        const response = await axiosInstance.get(`get-profile`);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const updatePasswordUser = async (userData) => {
    try{
        const response = await axiosInstance.put(`update-password`, userData);
        return response.data;
    }catch(err){
        console.log(err)
        err.message = "Vui lòng nhập đúng mật khẩu!"
        throw err;
    }
}

/**AUTHENTICATION CHECKER */
export const logout = async () => {
    try {
        const response = await axiosInstance.post(`${baseURL}/api/auth/logout`)
        return response.data;
    } catch (e) {
        e.message = "Đăng xuất thất bại!";
        throw e;
    }
}
export const getRole = async () => {
    try {
        const response = await axiosInstance.get(`${baseURL}/api/auth/user-role`)
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

export const isAdmin = async () =>{
    const roleName = await getRole();
    return roleName === 'ROLE_ADMIN';
}
export const isWarehouse = async () =>{
    const roleName = await getRole();
    return roleName === 'ROLE_WAREHOUSE';
}

export const isSalesMan = async () =>{
    const roleName = await getRole();
    return roleName === 'ROLE_SALESMAN';
}

export const isStoreManager = async () =>{
    const roleName = await getRole();
    return roleName === 'ROLE_MANAGER';
}

export const adminOnly = () =>{
    return localStorage.getItem('isAuthenticated') && this.isAdmin();
}