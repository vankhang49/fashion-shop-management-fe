import axiosInstance from '../../utils/axiosInstance';

export const createCustomer = async (item) => {
    try {
        const temp = await axiosInstance.post("/customer/create",item);
        return temp.data;
    } catch (error) {
        throw error.response.data.errors;
    }
}

export const updateCustomer = async (id,item) => {
    try {
        const temp = await axiosInstance.put(`/customer/${id}`,item);
        return temp.data;
    } catch (error) {
        throw error.response.data.errors;
    }
}

export const findById = async (id) => {
    try {
        const temp = await axiosInstance.get(`/customer/${id}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return null;
    }
}

export const codeAuto = async () => {
    try {
        const temp = await axiosInstance.get(`/customer/code-auto`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return null;
    }
}

export const deleteCustomer = async (id)=>{
    try {
        const temp = await axiosInstance.patch(`/customer/${id}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        throw e;
    }
 
}

export const getCustomers = async (keyWord, pages = 0) => {
    try {
        const temp = await axiosInstance.get(`/customer?keyword=${keyWord}&page=${pages}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}