import axiosInstance from "../../utils/axiosInstance";

export const updateAvatarAndBackgroundImage = async (username, avatar, backgroundImage) => {
    try {
        const userData = {
            username: username,
            avatar: avatar,
            backgroundImage: backgroundImage
        }
        const response = await axiosInstance.patch(`/update-image`, userData)
        return response.data;
    } catch (error) {
        error.message = "Cập nhật hình ảnh thất bại!"
        throw error;
    }
}