import axiosInstance from '../../utils/axiosInstance';

export const getAllCustomer =async (keyWord,pages)=>{
    try {
        const temp = await axiosInstance.get(`/customer?keyword=${keyWord}&page=${pages}`);
        return temp.data;
    }catch (e)
    {
        console.log(e)
    }
}