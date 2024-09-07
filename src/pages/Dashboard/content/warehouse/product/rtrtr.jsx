import React, {useEffect, useState} from 'react';
import styles from './createPricing.module.scss';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as productService from '../../../../../services/products/product-service';
import * as colorService from '../../../../../services/products/color-service';
import * as categoryService from '../../../../../services/products/category-service';
import * as productTypeService from '../../../../../services/products/productType-service';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import {generateAndUploadQRCode} from '../../../../../firebase/generateAndUploadQRCode';
import {DashboardMain} from '../../../../../components/Dashboard/DashboardMain';
import {generateUniqueCode} from '../../../../../services/bill/random_mhd';
import {UploadMultipleImage, UploadOneImage} from '../../../../../firebase/UploadImage';

const schema = yup.object().shape({
    productId: yup.string().default(''),
    productCode: yup.string().required('Mã sản phẩm là bắt buộc'),
    productName: yup.string().required('Tên sản phẩm là bắt buộc'),
    description: yup.string().required('Mô tả là bắt buộc'),
    productType: yup.string().required('Loại sản phẩm là bắt buộc'),
    pricingList: yup.array().of(
        yup.object().shape({
            pricingId: yup.string().default(''),
            pricingName: yup.string().required('Tên giá là bắt buộc'),
            pricingCode: yup.string().required('Mã giá là bắt buộc'),
            price: yup.number().required('Giá là bắt buộc').positive('Giá phải là số dương'),
            size: yup.string().required('Kích thước là bắt buộc'),
            qrCode: yup.string().default(''),
            color: yup.string().required('Màu sắc là bắt buộc'),
            pricingImgUrl: yup.string().url('Phải là URL hợp lệ').required('Ảnh giá là bắt buộc'),
        })
    ),
    productImages: yup.array().of(
        yup.object().shape({
            imageId: yup.string().default(''),
            imageUrl: yup.string().url('Phải là URL hợp lệ').required('URL ảnh là bắt buộc'),
        })
    ).required('Ảnh là bắt buộc'),
});

const CreatePricing = () => {
    const {role,pricingId} = useParams();
    const navigate = useNavigate();
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [colors, setColors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [productTypesByCategory, setProductTypesByCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Nữ');
    const [productImages, setProductImages] = useState([]);
    const [productCode, setProductCode] = useState('');
    const {register, handleSubmit, formState: {errors}, setValue, control} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            pricingList: [],
            productImages: [],
        }
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: 'pricingList',
    });
    const {fields: imageFields, append: appendImage, remove: removeImage} = useFieldArray({
        control,
        name: 'productImages',
    });

    const callbackFunction = (childData) => {
        setIsShowSidebar(childData);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAllCategory();
            await getAllColor();
            await getAllProductType();
            await fetchUniqueProductCode();
        };

        fetchData().then().catch();
    }, []);

    useEffect(() => {
        const fetchCodes = async () => {
            for (let i = 0; i < fields.length; i++) {
                await fetchUniquePricingCode(i);
            }
        };
        fetchCodes().catch(err => console.log(err));
    }, [productCode, fields, setValue]);

    const fetchUniqueProductCode = () => {
        generateUniqueCode(`/products/generateAndCheckProductCode`).then(res => {
            setValue('productCode', res);
        }).catch(err => console.log(err));
    };

    const fetchUniquePricingCode = async (index) => {
        return generateUniqueCode(`/pricing/generateAndCheckPricingCode`)
            .then(res => {
                setValue(`pricingList[${index}].pricingCode`, res);
                return res;
            })
            .catch(err => console.log(err));
    };

    const getAllCategory = () => {
        categoryService.getAllCategory().then(res => setCategories(res)).catch(err => console.log(err));
    };

    const getAllColor = () => {
        colorService.getAllColor().then(res => setColors(res)).catch(err => console.log(err));
    };

    useEffect(() => {
        setProductTypesByCategory(
            productTypes?.filter(item => item.category?.categoryName === selectedCategory)
        );
    }, [selectedCategory, productTypes]);

    const getAllProductType = () => {
        productTypeService.getAllProductType()
            .then(res => setProductTypes(res))
            .catch(err => console.log(err));
    };
    console.log(productTypes);

    const handleAddPricingRow = () => {
        append({});
    };

    const handleRemovePricingRow = (index) => {
        remove(index);
    };

    const onSubmit = async (data) => {
        try {
            const updatedPricingList = await Promise.all(data.pricingList.map(async (item) => {
                try {
                    const qrDataURL = await generateAndUploadQRCode({
                        pricingCode: item.pricingCode,
                        pricingName: item.pricingName,
                    });
                    return {
                        ...item,
                        qrCode: qrDataURL
                    };
                } catch (error) {
                    console.error('Error generating QR code:', error);
                    throw error;
                }
            }));

            const updatedData = {
                ...data,
                pricingList: updatedPricingList.map(item => ({
                    ...item,
                    color: JSON.parse(item.color)
                })),
                productType: JSON.parse(data.productType)
            };
            console.log(updatedData);
            productService.createProduct(updatedData)
                .then(() => {
                    toast.success('Tạo thành công');
                    navigate(`/dashboard/${role}/warehouse`);
                })
                .catch(err => {
                    toast.error('Tạo thất bại');
                    console.error('Error creating product:', err);
                });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Gửi thất bại');
        }
    };

    const handleImageUrlChange = async (uploadedImageUrls) => {
        const currentImages = productImages.map(img => ({...img}));

        for (let url of uploadedImageUrls) {
            currentImages.push({imageUrl: url});
        }

        await setValue('productImages', currentImages);
    };

    const handleOneImageUrlChange = async (uploadedImageUrl, index) => {
        await setValue(`pricingList[${index}].pricingImgUrl`, uploadedImageUrl);
    };

    return (
        <DashboardMain path={role} content={
            <div className="content-body">
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formGroup}>
                        <label>Mã sản phẩm:</label>
                        <input type="text" {...register('productCode')} disabled={true}/>
                        {errors.productCode && <p>{errors.productCode.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Tên sản phẩm:</label>
                        <input type="text" {...register('productName')} />
                        {errors.productName && <p>{errors.productName.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Mô tả:</label>
                        <input type="text" {...register('description')} />
                        {errors.description && <p>{errors.description.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Images:</label>
                        <Controller
                            name="productImages"
                            control={control}
                            render={({field}) => (
                                <UploadMultipleImage onImageUrlChange={handleImageUrlChange} />
                            )}
                        />
                        {errors.productImages && <p>{errors.productImages.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Danh mục:</label>
                        <select  onChange={event => setSelectedCategory(event.target.value)}>
                            <option value=''>--chọn danh mục--</option>
                            {
                                categories?.map((item, index) => (
                                    <option value={item.categoryName} key={item.categoryId}>{item.categoryName}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Loại sản phẩm:</label>
                        <select {...register('productType')} >
                            <option value=''>--chọn loại sản phẩm--</option>
                            {
                                productTypesByCategory?.map((item, index) => (
                                    <option value={JSON.stringify(item)} key={item.typeId}>{item.typeName}</option>
                                ))
                            }
                        </select>
                        {errors.productType && <p>{errors.productType.message}</p>}
                    </div>
                    <div className={styles.pricingContainer}>
                        {fields.map((item, index) => (
                            <div key={item.id} className={styles.pricingRow}>
                                <div className={styles.formGroup}>
                                    <label>Mã sản pẩm chi tiết:</label>
                                    <input type="text" {...register(`pricingList[${index}].pricingCode`)}
                                           disabled={true}/>
                                    {errors.pricingList?.[index]?.pricingCode &&
                                        <p>{errors.pricingList[index].pricingCode.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tên sản phẩm chi tiết:</label>
                                    <input type="text" {...register(`pricingList[${index}].pricingName`)} />
                                    {errors.pricingList?.[index]?.pricingName &&
                                        <p>{errors.pricingList[index].pricingName.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Giá:</label>
                                    <input type="number" {...register(`pricingList[${index}].price`)} />
                                    {errors.pricingList?.[index]?.price &&
                                        <p>{errors.pricingList[index].price.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Kích thước:</label>
                                    <input type="text" {...register(`pricingList[${index}].size`)} />
                                    {errors.pricingList?.[index]?.size &&
                                        <p>{errors.pricingList[index].size.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Màu sắc:</label>
                                    <select {...register(`pricingList[${index}].color`)}>
                                        <option value=''>--chọn màu--</option>
                                        {
                                            colors?.map((item, colorIndex) => (
                                                <option value={JSON.stringify(item)}
                                                        key={colorIndex}>{item.colorName}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.pricingList?.[index]?.color &&
                                        <p>{errors.pricingList[index].color.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Ảnh sản phẩm chi tiết:</label>
                                    <Controller
                                        name={`pricingList[${index}].pricingImgUrl`}
                                        control={control}
                                        defaultValue={item.pricingImgUrl}
                                        render={({field}) => (
                                            <UploadOneImage
                                                onImageUrlChange={(url) => handleOneImageUrlChange(url, index)}
                                            />
                                        )}/>
                                    {errors.pricingList?.[index]?.pricingImgUrl &&
                                        <p>{errors.pricingList[index].pricingImgUrl.message}</p>}
                                </div>
                                <button type="button" onClick={() => handleRemovePricingRow(index)}
                                        className={styles.removeButton}>
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.buttonWrapper}>
                        <button type="submit" className={styles.submitButton}>
                            Thêm mới
                        </button>
                        <button type="button" onClick={handleAddPricingRow} className={
                            styles.addButton}>
                            +
                        </button>
                    </div>
                </form>
            </div>
        } callbackFunction={callbackFunction} isShowSidebar={isShowSidebar}/>
    );
};

export default CreatePricing;
