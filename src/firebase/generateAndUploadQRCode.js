import {storage} from "./firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';

export const generateAndUploadQRCode = async (productData) => {
    const {  pricingCode, pricingName } = productData;

    const qrData = JSON.stringify({
        pricingCode,
        pricingName
    });

    try {
        // Tạo mã QR dưới dạng data URL
        const qrDataURL = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 1,
            margin: 1
        });

        // Tạo Blob từ QR data URL
        const qrImageBlob = await fetch(qrDataURL).then(res => res.blob());

        // Đường dẫn lưu trữ trên Firebase Storage
        const fileName = `product_${pricingCode}.png`;
        const filePath = `QR/${fileName}`;

        // Tham chiếu đến vị trí lưu trữ trên Firebase Storage
        const storageReference = storageRef(storage, filePath);

        // Tải lên vào Firebase Storage
        const snapshot = await uploadBytes(storageReference, qrImageBlob);
        console.log('Uploaded QR Code to Firebase Storage:', snapshot);

        // Lấy đường dẫn public của ảnh từ Firebase Storage
        const qrImageUrl = await getDownloadURL(storageReference);
        console.log('QR Code download URL:', qrImageUrl);


        return qrImageUrl; // Trả về đường dẫn public của ảnh QR trên Firebase Storage
    } catch (error) {
        console.error('Error uploading QR Code to Firebase:', error);
        throw error;
    }
};
