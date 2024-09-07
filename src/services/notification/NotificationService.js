import axiosInstance from '../../utils/axiosInstance';

export const getAllNotification = async () => {
    try {
        const temp = await axiosInstance.get(`/notification/list`);
        return temp.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}
export const getAllByStatusRead = async (statusRead) => {
    try {
        const temp = await axiosInstance.get(`/notification/listByStatusRead/${statusRead}`);
        return temp.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const markAllRead = async () => {
    try {
        const temp = await axiosInstance.get(`/notification/markAllRead`);
        return temp.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}
export const seeViewDetail = async (notifId) => {
    try {
        const temp = await axiosInstance.get(`/notification/getInfoNotification/${notifId}`);
        return temp.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}
export const getAllRole = async () => {
    try {
        const roles = await axiosInstance.get("/users/roles");
        return roles.data;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const addNewNotification = async (data) => {
    try {
        const temp = await axiosInstance.post("/notification/create", data);
        return temp.data;
    } catch (error) {
        throw error.response.data.errors;
    }
}
