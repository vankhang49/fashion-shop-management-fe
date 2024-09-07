import axiosInstance from "../../utils/axiosInstance";

export const getAllRoles = async () => {
    try {
        const response = await axiosInstance.get(`roles`);
        console.log('Response:', response.data);
        return response.data;
    }catch (e) {
        console.log(e);
        return [];
    }
};