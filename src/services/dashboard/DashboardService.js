import axiosInstance from "../../utils/axiosInstance";

export const getTotalCustomer = async () => {
    try {
        const temp = await axiosInstance.get(`/dashboard/total-customer`)
        return temp.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const getTotalBills = async () => {
    try {
        const temp = await axiosInstance.get(`/dashboard/total-bill`)
        return temp.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const getRevenues = async (option) => {
    try {
        const temp = await axiosInstance.get(`/dashboard/revenues/${option}`)
        return temp.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const getBestSalespersons = async () => {
    try {
        const temp = await axiosInstance.get(`/dashboard/best-salesperson`)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getNewBills = async () => {
    try {
        const temp = await axiosInstance.get(`/dashboard/new-bills`)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}