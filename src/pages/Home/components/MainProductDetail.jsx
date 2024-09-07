import styles from './MainProductDetail.module.scss';
import { useState, useEffect } from 'react';
import * as ProductService from '../../../services/products/ProductService';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { fCurrency } from '../../../utils/format-number';

function MainProductDetail(props) {
    const [product, setProduct] = useState();
    const [currentPricing, setCurrentPricing] = useState();
    const { productId } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        getProductById();
    }, [productId]);

    const getProductById = async () => {
        const response = await ProductService.getProductById(productId);
        setProduct(response);
        setCurrentPricing(response?.pricingList ? response?.pricingList[0] : "");
    };

    const handlePricingChange = (index) => {
        setCurrentPricing(product.pricingList[index]);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        autoplaySpeed: 3000,
    };

    return (
        <main id={styles.main}>
            <div className={styles.nav}>
                <Link to='/'>Trang chủ</Link>
                <Link to={`/?keyword=${product?.productType?.typeName}`}>{product?.productType?.typeName}</Link>
                <Link to={`/product/${product?.productId}`}>{product?.productName}</Link>
                <br />
                <hr />
            </div>
            <section className={styles.sectionOne}>
                <div className={styles.item}>
                    <div className={styles.container}>
                        <Slider {...settings}>
                            <div>
                                <img src={currentPricing?.pricingImgUrl} alt={`Product Image ${currentPricing?.pricingName}`} />
                            </div>
                            {product?.productImages?.map((image, index) => (
                                <div key={index}>
                                    <img src={image.imageUrl} alt={`Product Image ${index + 1}`} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className={styles.item}>
                    <b>{product?.productName}</b>
                    <p>Mã sản phẩm: {currentPricing?.pricingCode}</p>
                    <p>Size: {currentPricing?.size}</p>
                    <p>Màu: {currentPricing?.color?.colorName}</p>
                    <p>Số lượng còn lại: {currentPricing?.quantity === 0 ? 'Hết hàng' : currentPricing?.quantity}</p>
                    <p>Giá: <span>{fCurrency(currentPricing?.price)} </span> VND</p>
                    <>
                        <p>Danh sách sản phẩm:</p>
                        <div className={styles.listSize}>
                            {product?.pricingList?.map((pricing, index) => (
                                <button
                                    key={pricing.pricingId}
                                    onClick={() => handlePricingChange(index)}
                                    className={`${styles.itemSize} ${currentPricing === pricing ? styles.active : ''}`}
                                >
                                    {product?.productName} size {pricing.size} màu {pricing.color.colorName}
                                </button>
                            ))}
                        </div>
                    </>
                </div>
            </section>
            <section className={styles.sectionTwo}>
                <h4>Mô tả sản phẩm</h4>
                <p>{product?.description}</p>
            </section>
        </main>
    );
}

export default MainProductDetail;
