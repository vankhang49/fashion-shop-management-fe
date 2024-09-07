import axiosInstance from '../../utils/axiosInstance';
export const generateUniqueCode =async (url)=>{
    try {
        const temp = await axiosInstance.post(url);
        return temp.data.code;
    } catch (error) {
        console.error('Error checking code uniqueness:', error);
        return false;
    }
}