import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
const apiUrl = process.env.REACT_APP_API_URL;

export const createNews = async (item) => {
    try {
        const temp = await axiosInstance.post(`/news/create`, item);
        return temp.data;
    } catch (error) {
        throw error.response.data.errors;
    }
}

export const getAllNews = async (page = 0) => {
    try {
        const temp = await axios.get(`${apiUrl}/api/public/news?page=${page}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getNewsById = async (id) => {
    try {
        const temp = await axios.get(`${apiUrl}/api/public/news/${id}`);
        return temp.data;
    } catch (e) {
        return null;
    }
}

export const deleteNews = async (id) => {
    try {
        const temp = await axiosInstance.delete(`/news/${id}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        throw new Error("Không thể xóa tin tức")
    }
}
