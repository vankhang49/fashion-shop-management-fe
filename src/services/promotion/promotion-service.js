import axiosInstance from '../../utils/axiosInstance';

export const getPromotionByPromotionCode = async (promotionCode) => {
    try {
        const temp = await axiosInstance.get(`/promotions?promotionCode=${promotionCode}`);
        return temp.data;
    }catch (e)
    {
        console.log(e)
    }
}

export const usePromotionByPromotionCode = async (promotionCode) => {
    try {
        const temp = await axiosInstance.post(`/promotions/use?promotionCode=${promotionCode}`);
        return temp.data;
    } catch (e) {
        console.log(e);
    }
};