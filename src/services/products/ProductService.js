import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const getAllNew = async (page = 0) => {
    try {
        const temp = await axios.get(`${apiUrl}/api/public/product/new?page=${page}`);
        return temp.data;
    } catch (e) {
        return []
    }
}
export const getAll = async (page = 0) => {
    try {
        const temp = await axios.get(`${apiUrl}/api/public/product/nam-nu?page=${page}`);
        return temp.data;
    } catch (e) {
        return []
    }
}

export const getProductById = async (id) => {
    try {
        const temp = await axios.get(`${apiUrl}/api/public/product/${id}`);
        return temp.data;
    } catch (e) {
        return {};
    }
}

export const searchProduct = async (keyword, page=0) => {
    try {
        const temp = await axios.get(`${apiUrl}/api/public/product/search?keyword=${keyword}&page=${page}`);
        return temp.data;
    } catch (e) {
        return [];
    }
}