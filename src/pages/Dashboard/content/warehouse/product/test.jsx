import React, {useEffect, useState} from 'react';
import styles from './createPricing.module.scss';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as productService from '../../../../../services/products/product-service'
import * as colorService from '../../../../../services/products/color-service'
import * as categoryService from '../../../../../services/products/category-service'
import * as productTypeService from '../../../../../services/products/productType-service'
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {color} from "framer-motion";
import {generateAndUploadQRCode} from "../../../../../firebase/generateAndUploadQRCode";
import {DashboardMain} from "../../../../../components/Dashboard/DashboardMain";
import {generateUniqueCode} from "../../../../../services/bill/random_mhd";
import {UploadMultipleImage,UploadOneImage} from "../../../../../firebase/UploadImage";

const schema = yup.object().shape({
    productCode: yup.string().required('Product Code is required'),
    productName: yup.string().required('Product Name is required'),
    description: yup.string().required('Description is required'),
    productType: yup.string().required('Product Type is required'),
    // category: yup.string().required('Category is required'),
    pricingList: yup.array().of(
        yup.object().shape({
            pricingName: yup.string().required('Pricing Name is required'),
            pricingCode: yup.string().required('Pricing Code is required'),
            price: yup.number().required('Price is required').positive('Price must be positive'),
            size: yup.string().required('Size is required'),
            qrCode: yup.string().default(''),
            // inventory: yup.number().required('Inventory is required').integer('Inventory must be an integer'),
            color: yup.string().required('Color is required'),
            pricingImgUrl: yup.string().url('Must be a valid URL').required('Pricing Image  is required'),
        })
    ),
    // productImages: yup.mixed().required('Images are required'), // Define images field in your schema
    productImages: yup.array().of(
        yup.object().shape({
            imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
        })
    ).required('Images are required'),
});

const CreatePricing = () => {
    const {role} = useParams();
    const navigate = useNavigate();
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [colors, setColors] = useState([])
    const [categories, setCategories] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [productTypesByCategory, setProductTypesByCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('Nữ')
    // Khai báo biến productImages ở đây
    const [productImages, setProductImages] = useState([]);
    const [productCode, setProductCode] = useState('');
    const [pricingCode, setPricingCode] = useState('');
    const [disabled,setDisabled] = useState(true)
    const {control, handleSubmit, formState: {errors}, setValue} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            pricingList: [],
            productImages: [], // Initialize images as an empty array
        }
    });
    useEffect(() => {
        console.log(disabled)
    }, [disabled]);

    const {fields, append, remove} = useFieldArray({
        control,
        name: 'pricingList',
    });
    const {fieldI, appendI, removeI} = useFieldArray({
        control,
        name: 'productImages',
    });

    const callbackFunction = (childData) => {
        setIsShowSidebar(childData);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAllCategory(); // Xóa bỏ cái asyc await đi nha
            await getAllColor();
            await getAllProductType();
            await  fetchUniqueProductCode();
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
        generateUniqueCode(`/products/generateAndCheckProductCode`).then(res=>{
            setValue('productCode', res);
        }).catch(err=>console.log(err));
    };
    const fetchUniquePricingCode = async (index) => {
        return generateUniqueCode(`/pricing/generateAndCheckPricingCode`)
            .then(res => {
                setValue(`pricingList[${index}].pricingCode`, res);
                return res;
            })
            .catch(err => console.log(err));
    };

    // get colors
    const getAllCategory = () => {
        categoryService.getAllCategory().then(res => setCategories(res)).catch(err => console.log(err))
    }
    // get category
    const getAllColor = () => {
        colorService.getAllColor().then(res => setColors(res)).catch(err => console.log(err))
    }
    useEffect(() => {
        // Filter product types when selectedCategory changes
        setProductTypesByCategory(
            productTypes?.filter(item => item.category?.categoryName === selectedCategory)

        );
    }, [selectedCategory, productTypes]);

// Function to fetch all product types
    const getAllProductType = () => {
        productTypeService.getAllProductType()
            .then(res => setProductTypes(res))
            .catch(err => console.log(err));
    };

    const handleAddPricingRow = () => {
        append({});
    };

    const handleRemovePricingRow = (index) => {
        remove(index);
    };

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const updatedPricingList = await Promise.all(data.pricingList.map(async (item) => {
                try {
                    // Generate and upload QR code for each pricing item
                    const qrDataURL = await generateAndUploadQRCode({
                        pricingCode: item.pricingCode,
                        pricingName: item.pricingName,
                    });

                    // Return updated item with QR code URL
                    return {
                        ...item,
                        qrCode: qrDataURL
                    };
                } catch (error) {
                    console.error('Error generating QR code:', error);
                    throw error; // Throw error for handling in the catch block of Promise.all
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
                    toast.success('Create Success');
                    navigate(`/dashboard/${role}/warehouse`);
                })
                .catch(err => {
                    toast.error('Create Failed');
                    console.error('Error creating product:', err);
                });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Submission Failed');
        }
    };

    const handleImageUrlChange = async (uploadedImageUrls) => {
        // Đảm bảo rằng đã có giá trị hiện tại của productImages
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
                        <label>Product Code:</label>
                        <Controller
                            name="productCode"
                            control={control}
                            render={({field}) => <input type="text" {...field}  disabled={true} />}
                        />
                        {errors.productCode && <p>{errors.productCode.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Product Name:</label>
                        <Controller
                            name="productName"
                            control={control}
                            render={({field}) => <input type="text" {...field} />}
                        />
                        {errors.productName && <p>{errors.productName.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description:</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({field}) => <input type="text" {...field} />}
                        />
                        {errors.description && <p>{errors.description.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Images:</label>
                        <Controller
                            name="productImages"
                            control={control}
                            render={({field}) => (
                                <UploadMultipleImage onImageUrlChange={handleImageUrlChange}/>
                            )}
                        />
                        {errors.productImages && <p>{errors.productImages.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        {/*<label>Category:</label>*/}
                        {/*<Controller*/}
                        {/*    name="category"*/}
                        {/*    control={control}*/}
                        {/*    render={({field}) =>*/}
                        {/*        (*/}
                        <select onChange={event => setSelectedCategory(event.target.value)}>
                            <option value=''>--choose Category --</option>
                            {
                                categories?.map((item, index) => (
                                    <option value={item.categoryName} key={item.categoryId}>{item.categoryName}</option>
                                ))
                            }
                        </select>
                        {/*        )}*/}
                        {/*/>*/}
                        {/*{errors.category && <p>{errors.category.message}</p>}*/}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Type:</label>
                        <Controller
                            name="productType"
                            control={control}
                            render={({field}) =>
                                (
                                    <select {...field} >
                                        <option value=''>--choose Product type --</option>
                                        {
                                            productTypesByCategory?.map((item, index) => (
                                                <option value={JSON.stringify(item)}
                                                        key={item.typeId}>{item.typeName}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                        />
                        {errors.productType && <p>{errors.productType.message}</p>}
                    </div>

                    <div className={styles.pricingContainer}>
                        {fields.map((item, index) => (
                            <div key={item.id} className={styles.pricingRow}>
                                <div className={styles.formGroup}>
                                    <label>Pricing Code:</label>
                                    <Controller
                                        name={`pricingList[${index}].pricingCode`}
                                        control={control}
                                        render={({field}) => <input type="text" {...field} disabled={true}/>}
                                    />
                                    {errors.pricingList?.[index]?.pricingCode &&
                                        <p>{errors.pricingList[index].pricingCode.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Pricing Name:</label>
                                    <Controller
                                        name={`pricingList[${index}].pricingName`}
                                        control={control}
                                        defaultValue={item.pricingName}
                                        render={({field}) => <input type="text" {...field} />}
                                    />
                                    {errors.pricingList?.[index]?.pricingName &&
                                        <p>{errors.pricingList[index].pricingName.message}</p>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Price:</label>
                                    <Controller
                                        name={`pricingList[${index}].price`}
                                        control={control}
                                        defaultValue={item.price}
                                        render={({field}) => <input type="number" {...field} />}
                                    />
                                    {errors.pricingList?.[index]?.price &&
                                        <p>{errors.pricingList[index].price.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Size:</label>
                                    <Controller
                                        name={`pricingList[${index}].size`}
                                        control={control}
                                        defaultValue={item.size}
                                        render={({field}) => <input type="text" {...field} />}
                                    />
                                    {errors.pricingList?.[index]?.size &&
                                        <p>{errors.pricingList[index].size.message}</p>}
                                </div>
                                <div className={styles.formGroup} style={{display:"none"}}>
                                    <label>QR Code:</label>
                                    <Controller
                                        name={`pricingList[${index}].qrCode`}
                                        control={control}
                                        defaultValue={item.qrCode}
                                        render={({field}) => <input type="text" {...field} disabled={true}/>}
                                    />
                                    {errors.pricingList?.[index]?.qrCode &&
                                        <p>{errors.pricingList[index].qrCode.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Color:</label>
                                    <Controller
                                        name={`pricingList[${index}].color`}
                                        control={control}
                                        defaultValue={item.color}
                                        render={({field}) =>
                                            (
                                                <select {...field}>
                                                    <option value=''>--choose Color --</option>
                                                    {
                                                        colors?.map((item, index) => (
                                                            <option value={JSON.stringify(item)}
                                                                    key={item.colorId}>{item.colorName}</option>
                                                        ))
                                                    }
                                                </select>
                                            )}
                                    />
                                    {errors.pricingList?.[index]?.color &&
                                        <p>{errors.pricingList[index].color.message}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Pricing Image URL:</label>
                                    <Controller
                                        name={`pricingList[${index}].pricingImgUrl`}
                                        control={control}
                                        defaultValue={item.pricingImgUrl}
                                        render={({field}) => (
                                            <UploadOneImage
                                                onImageUrlChange={(url) => handleOneImageUrlChange(url, index)}
                                                getDisabled={(e)=>setDisabled(e)}
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
                        <button type="submit" className={styles.submitButton} disabled={disabled}>
                            Xác nhận
                        </button>
                        <button type="button" onClick={handleAddPricingRow} className={
                            styles.addButton}>
                            +
                        </button>
                    </div>
                </form>
            </div>
        }/>
    );
};

export default CreatePricing;