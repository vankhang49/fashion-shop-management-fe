import axiosInstance from '../../utils/axiosInstance';

export const getAllCategory =async ()=> {
    try {
        let temp = await axiosInstance.get(`/category`)
        return temp.data;
    } catch (e) {
        throw e.response.data.message;
    }
}