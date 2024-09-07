import axiosInstance from '../../utils/axiosInstance';

export const getAll = async () => {
    try {
        const temp = await axiosInstance.get("customer-type");
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}
