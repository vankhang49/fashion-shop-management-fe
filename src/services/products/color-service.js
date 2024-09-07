import axiosInstance from '../../utils/axiosInstance';

export const getAllColor =async ()=>{
    try {
        let temp = await axiosInstance.get(`/color`)
        return temp.data;
    }catch (e) {
        throw e.response.data.message;
    }
}