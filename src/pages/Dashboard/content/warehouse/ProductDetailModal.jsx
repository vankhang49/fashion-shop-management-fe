import styles from "./ProductDetailModal.module.scss";
import React, {useEffect, useState} from "react";
import * as productService from "../../../../services/products/ProductService";
import DownloadImageFromFireBase from "../../../../firebase/DownloadImageFromFireBase";

export const ProductDetailModal = ({isOpen, onClose, id}) => {
    const [product, setProduct] = useState(null);
    const [hasOpened, setHasOpened] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getProductById(id);
        };

        if (isOpen && hasOpened) {
            fetchData().then().catch();
        } else if (isOpen) {
            setHasOpened(true);
        }
    }, [isOpen, id, hasOpened]);

    const getProductById = async (id) => {
        const temp = await productService.getProductById(id)
        setProduct(temp);
    };

    return (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            {!product ? <h5 colSpan="7" className='container'>Không có kết quả</h5> :
                <div className={styles.modalContent}>
                    <div className={styles.info}>
                        <div className={styles.productCode}>
                            <label className={styles.title}>Mã sản phẩm: </label>
                            <span>{product.productCode}</span>
                        </div>
                        <div className={styles.productName}>
                            <label className={styles.title}>Tên sản phẩm: </label>
                            <span>{product.productName}</span>
                        </div>
                        <div className={styles.description}>
                            <label className={styles.title}>Mô tả: </label>
                            <span>{product.description}</span>
                        </div>
                        <div className={styles.productType}>
                            <label className={styles.title}>Loại sản phẩm: </label>
                            <span>{product.productType?.typeName}</span>
                        </div>
                        <div className={styles.productImages}>
                            <label className={styles.title}>Ảnh sản phẩm: </label>
                            <div className={styles.images}>
                                {product.productImages.map((img, index) => (
                                    <DownloadImageFromFireBase key={index} imagePath={img.imageUrl}/>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.button}>
                        <button onClick={onClose}>Đóng</button>
                    </div>

                </div>
            }
        </div>
    );
};
