import React, { useEffect, useState } from 'react';
import './billForm.scss';
import QRCodeReader from './scanQr/QRCodeReader';
import CustomerModal from "./customerModal/CustomerModal";
import InvoiceModal from "./invoice/InvoiceModal";
import { DashboardMain } from "../../../../components/Dashboard/DashboardMain";
import { generateUniqueCode } from "../../../../services/bill/random_mhd";
import * as pricingService from "../../../../services/products/pricing-service"
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as billService from "../../../../services/bill/bill-service";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import Moment from "moment";
import PromotionModal from "./promotionModal/PromotionModal";

// Define Yup validation schema
const schema = yup.object().shape({
    billCode: yup.string().required('Mã hóa đơn không được để trống').matches(/^HD-\d{6,}$/, 'Mã hóa đơn phải được bắt đầu bằng HD- và kết thúc với 6 chữ số!'),
    dateCreate: yup.string().required('Ngày tạo không được để trống'),
    customer: yup.string().required("Mã khách hàng không được để trống"),
    billItemList: yup.array().of(
        yup.object().shape({
            pricing: yup.string().required('ID mặt hàng không được để trống'),
            quantity: yup.number().required('Số lượng không được để trống').min(1, 'Số lượng phải lớn hơn 0'),
        })
    ),
});

const BillForm = () => {
    const {role} = useParams();
    const navigate = useNavigate();
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [isQRCodeReaderVisible, setIsQRCodeReaderVisible] = useState(false);
    const [billItems, setBillItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [discountByCustomerType, setDiscountByCustomerType] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [printInvoice, setPrintInvoice] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [billCode, setBillCode] = useState('');
    const [pricingCode, setPricingCode] = useState('');
    const [pricingByCode, setPricingByCode] = useState('');
    const [quantity, setQuantity] = useState('');
    const [customer, setCustomer] = useState('');
    const [discount,setDiscount] = useState('0')
    const [errorMessage, setErrorMessage] = useState('');
    const [validateError, setValidateError] = useState([]);

    // React Hook Form setup
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            billItemList: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'billItemList',
    });

    // Class BillItem definition
    class BillItem {
        constructor(id, code, name, quantity, size, price, total) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.quantity = quantity;
            this.size = size;
            this.price = price;
            this.total = total;
        }
    }

    const addItem = () => {
        if (pricingByCode) {
           if(pricingByCode.quantity>=quantity)
           {
               const newItem = new BillItem(
                   pricingByCode.pricingId,
                   pricingByCode.pricingCode,
                   pricingByCode.pricingName,
                   quantity,
                   pricingByCode.size,
                   pricingByCode.price,
                   pricingByCode.price * quantity
               );

               setBillItems([...billItems, newItem]);
               setQuantity('');
               setPricingCode('');
               setTotal(total + newItem.total);
               append({ pricing: JSON.stringify(pricingByCode), quantity: newItem.quantity });
           }else{
               setErrorMessage('số lương nhập vượt quá số lương trong kho, hiện tại số lượng trong kho là : '+pricingByCode.quantity)
           }
        } else {
            setErrorMessage('mã code không hợp lệ')
        }
    };

    const deleteBillItem = (index) => {
        remove(index);
        const updatedBillItems = [...billItems];
        updatedBillItems.splice(index, 1);
        setBillItems(updatedBillItems);
        const newTotal = updatedBillItems.reduce((acc, item) => acc + item.total, 0);
        setTotal(newTotal);
    };


    useEffect(() => {
        const today = Moment().format("DD/MM/yyyy");
        setValue("dateCreate", today);

        console.log(today)
        fetchUniqueBillCode();
    }, []);


    const fetchUniqueBillCode = () => {
        generateUniqueCode( `/bills/generateAndCheckBillCode`)
            .then(res => {
                setBillCode(res);
                setValue('billCode', res);
            })
            .catch(err => console.log(err)
            );
    };
    useEffect(() => {
        fetchPricingByCode(pricingCode);
    }, [pricingCode]);

    const fetchPricingByCode = (pricingCode) => {
        if (pricingCode.trim() !== '') {
            pricingService.getPricingByPricingCode(pricingCode)
                .then(res => setPricingByCode(res))
                .catch(err => console.log(err));
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const openPayModal = () => setIsModalOpen(true);
    const closePayModal = () => setIsModalOpen(false);

    const callbackFunction = (childData) => setIsShowSidebar(childData);

    const onSubmit =  (data) => {
        try {
            const updatedData = {
                ...data,
                billItemList: data.billItemList.map((item,index)=>(
                    {
                        ...item,
                        pricing:JSON.parse(item.pricing)
                    }
                )),
                customer: JSON.parse(data.customer),
                dateCreate: Moment(data.dateCreate, "DD/MM/yyyy").format("yyyy-MM-DD")
            };
            setValidateError([])
            billService.createBill(updatedData)
                .then(() => {
                    toast.success('Create Success');
                    navigate(`/dashboard/${role}/bill-list`);
                })
                .catch(err => {
                    toast.error('Create Failed');
                    console.error('Error creating product:', err);
                });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Submission Failed');
            setValidateError(error);
        }
    };

    const handleScan = (data) => {
        setPricingCode(data.pricingCode);
        setIsQRCodeReaderVisible(false);
    };

    const handleError = (err) => console.error(err);
    const toggleQRCodeReader = () => setIsQRCodeReaderVisible(!isQRCodeReaderVisible);

    // const handlePrintInvoice = () => setPrintInvoice(true);
    const handlePayment =  (promotion) => {
        try {
            if (promotion) {
                setDiscount(promotion.discount);
                setValue("promotionCode", promotion.promotionCode);
            } else {
                setDiscount(0); // Set default discount value if no promotion applied
                setValue("promotionCode", ''); // Set default promotion code if no promotion applied
            }
            handleSubmit(onSubmit)();
            setPrintInvoice(true);
        } catch (error) {
            console.error("Failed to use promotion:", error);
        }
    };

    const handleCustomerSelect = (selectedCustomer) => {
        setCustomer(selectedCustomer);
        setDiscountByCustomerType(selectedCustomer.customerType.discount);
        setValue("customer", JSON.stringify(selectedCustomer));

    };
    useEffect(() => {
        // Update finalTotal when discount changes
        const sum = total - discountByCustomerType*total;
        let newFinalTotal;
        if(discount)
        {
            if (discount <= 1) {
                newFinalTotal = sum - discount * (total + sum);
            } else {
                newFinalTotal = sum - discount;
            }
        }else {
            newFinalTotal = sum;
        }

        setFinalTotal(newFinalTotal);
    }, [billItems,discount,discountByCustomerType]);
    const handleCancel =()=>{
        setCustomer('');
        setBillItems([]);
        setBillCode('');
        setTotal('');
        setFinalTotal('');
    }
    const clearErrorMessage = () => {
        setErrorMessage('');
    };
    return (
        <DashboardMain path={role}
                       content={
                           <div className="content-body">
                               <form className="bill-form" onSubmit={handleSubmit(onSubmit)}>
                                   <div className="form-group">
                                       <label htmlFor="billCode">Mã hóa đơn</label>
                                       <input type="text" id="billCode" disabled={true} {...register('billCode')} className="input-large" />
                                       {errors.billCode && <span>{errors.billCode.message}</span>}
                                       <small>{validateError?.billCode}</small>
                                   </div>
                                   <div className="form-group">
                                       <label htmlFor="customerCode">Mã khách hàng</label>
                                       <input type="text" id="customerCode" value={customer?.customerCode || ''} disabled className="input-large"/>
                                       <button type="button" id="lookupCustomer" onClick={openModal}>Tra cứu khách hàng</button>
                                       {errors.customer &&<p>{errors.customer.message}</p>}
                                       <small>{validateError?.customer}</small>
                                   </div>
                                   <div className="form-group">
                                       <label htmlFor="date">Ngày tháng năm</label>
                                       <input type="text" id="date"  disabled={true} {...register('dateCreate')} className="input-large"/>
                                       {errors.dateCreate && <span>{errors.dateCreate.message}</span>}
                                       <small>{validateError?.dateCreate}</small>
                                   </div>
                                   <div className="form-group">
                                       <label htmlFor="itemCode">Mã hàng</label>
                                       <input type="text" id="itemCode" value={pricingCode} onChange={e => {
                                           setPricingCode(e.target.value);
                                           clearErrorMessage();
                                       }}   className="input-small" />
                                       <label htmlFor="quantity" style={{marginLeft:'30px'}}>Số lượng</label>
                                       <input type="number" id="quantity" style={{width:'10px'}} value={quantity} onChange={e => {
                                           clearErrorMessage();
                                           setQuantity(e.target.value);

                                       }}   className="input-small" />
                                       <button type="button" id="addItem" onClick={addItem}>Nhập</button>
                                   </div>
                                   {errorMessage && <p className="error-message">{errorMessage}</p>}
                                   <div className="table-container">
                                       <table id="billItems">
                                           <thead>
                                           <tr>
                                               <th>STT</th>
                                               <th>Mã hàng</th>
                                               <th>Tên hàng</th>
                                               <th>Số lượng</th>
                                               <th>Size</th>
                                               <th>Đơn giá</th>
                                               <th>Tổng</th>
                                               <th>Action</th>
                                           </tr>
                                           </thead>
                                           <tbody>
                                           {billItems.map((item, index) => (
                                               <tr key={index}>
                                                   <td>{index + 1}</td>
                                                   <td>{item.code}</td>
                                                   <td>{item.name}</td>
                                                   <td>{item.quantity}</td>
                                                   <td>{item.size}</td>
                                                   <td>{item.price}</td>
                                                   <td>{item.total}</td>
                                                   <td><button onClick={() => deleteBillItem(index)}>Xóa</button></td>
                                               </tr>
                                           ))}
                                           </tbody>
                                       </table>
                                   </div>
                                   <div className="summary">
                                       <span>Tổng: <span id="total">{total}</span></span>
                                       <span>Giảm giá: <span id="discount">{discount}</span></span>
                                       <span>Thành tiền: <span id="finalTotal">{finalTotal}</span></span>
                                   </div>
                                   <div className="actions">
                                       <button type="button" id="scanBarcode" onClick={toggleQRCodeReader}>Quét mã</button>
                                       <button type="button" id="pay" onClick={openPayModal}>Thanh toán</button>
                                       {/*<button type="button" id="printInvoice" onClick={handlePrintInvoice}>In hóa đơn</button>*/}
                                       <button type="button" id="cancel" onClick={handleCancel}>Hủy</button>
                                   </div>
                                   {isQRCodeReaderVisible && <QRCodeReader handleScan={handleScan} handleError={handleError} />}
                               </form>
                               <CustomerModal isOpen={modalOpen} onClose={closeModal} getCustomer={handleCustomerSelect} />
                               <PromotionModal
                                   isOpen={isModalOpen}
                                   onClose={closePayModal}
                                   onPayment={handlePayment}
                               />
                               {printInvoice && (
                                   <div className="invoice-print">
                                       <InvoiceModal
                                           billCode={billCode}
                                           customerCode={customer.customerCode}
                                           billItems={billItems}
                                           total={total}
                                           discount={discount}
                                           finalTotal={finalTotal}
                                           onClose={() => setPrintInvoice(false)}
                                       />
                                   </div>
                               )}
                           </div>
                       }
        />
    );
};

export default BillForm;
