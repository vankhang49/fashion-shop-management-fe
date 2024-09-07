import axiosInstance from "../../utils/axiosInstance";

export const getPricingList = async (token) => {
    try {
        const response = await axiosInstance.get("/pricing/list");
        return response.data; 
    } catch (error) {
        console.error("Error retrieving pricings:", error);
        throw error;
    }
}

export const createReceipt = async (token) => {
    try {
        const response = await axiosInstance.get("/pricing/update")
        return response.data; 
    } catch (error) {
        console.error("Error creating receipt:", error);
        throw error;
    }
};

export const updatePricingQuantity = async (token, warehouseReceipt) => {
    try {
        const response = await axiosInstance.put("/pricing/update", warehouseReceipt);
        console.log(response.data); 
        return response.data; 
    } catch (error) {
        console.error("Error updating pricing quantity:", error);
        throw error; 
    }
};
