import axiosInstance from '../../utils/axiosInstance';

export const getAllProduct = async (keyword, sortBy, ascending, page) => {
    try {
        let url = `/products?page=${page}`;

        // Add keyword if provided
        if (keyword) {
            url += `&keyword=${keyword}`;
        }

        // Add sortBy and ascending if provided
        if (sortBy) {
            url += `&sortBy=${sortBy}&ascending=${ascending}`;
        }

        let temp = await axiosInstance.get(url);
        return temp.data;
    } catch (e) {
        throw e.response.data.message;
    }
};

export const createProduct = async (product)=>{
    try {
        await axiosInstance.post(`/products`,product)
    }catch (e)
    {
        console.log(e)
    }
}
export const deleteProduct = async (productId,product)=>{
    try {
        const temp = await axiosInstance.put(`/products/delete/${productId}`,product);
        return temp.data;
    } catch (error) {
        throw error.response.data.errors;
    }

}
export const updateProduct = async (productId,product)=>{
    try {
        const temp = await axiosInstance.put(`/products/update/${productId}`,product);
        return temp.data;
    } catch (error) {
        throw error.response.data.errors;
    }
}