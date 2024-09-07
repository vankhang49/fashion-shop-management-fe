import { useState, useEffect } from 'react';
import { DashboardMain } from '../../../components/Dashboard/DashboardMain';
import './Customer.scss'
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import * as CustomerService from '../../../services/customer/CustomerService'
import * as CustomerTypeService from '../../../services/customer/CustomerTypeService'
import ModalDelete from '../../../ui/ModalDelete';
import { useParams, useNavigate, Link } from 'react-router-dom';

function CustomerUpdate() {
    const {role} = useParams();
    const [isModalOpen, setModalOpen] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [customerType, setCustomerType] = useState(null);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const { id } = useParams()
    const [validateError, setValidateError] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getCustomer()
        getAllCustomerType()
    }, []);

    useEffect(() => {
        if (customer !== null) {
            setValue('customerCode', customer?.customerCode);
            setValue('customerName', customer?.customerName);
            setValue('dateOfBirth', customer?.dateOfBirth);
            setValue('gender', customer?.gender);
            setValue('email', customer?.email);
            setValue('phoneNumber', customer?.phoneNumber);
            setValue('address', customer?.address);
            setValue('accumulatedPoints', customer?.accumulatedPoints);
            setValue('customerType', JSON.stringify(customer.customerType));
        }
    }, [customer]);

    const getCustomer = async () => {
        try {
            const response = await CustomerService.findById(id);
            setCustomer(response);
        } catch (e) {
            console.log(e);
        }
    }

    const getAllCustomerType = async () => {
        try {
            const response = await CustomerTypeService.getAll();
            setCustomerType(response)
        } catch (e) {
            console.log(e);
        }
    }

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleSubmitDelete = async () => {
        try{
            await CustomerService.deleteCustomer(customer?.customerId)
            toast.success("Xóa khách hàng thành công")
            navigate(`/dashboard/${role}/customers`)
            closeModal();
        }catch(error){
            closeModal();
            toast.error("Xóa khách hàng thất bại")
        }
    };

    const handleChangeSelect = (event) => {
        setValue('customerType', event.target.value);
    };

    const onSubmit = async (data) => {
        try {
            data.customerCode = customer?.customerCode;
            data.customerType = JSON.parse(data.customerType)
            await CustomerService.updateCustomer(id, data);
            setValidateError([])
            navigate(`/dashboard/${role}/customers`)
            toast.success("Sửa khách hàng thành công")
        } catch (error) {
            setValidateError(error);
        }
    };



    const validateDateOfBirth = (value) => {
        const selectedDate = new Date(value);
        const currentDate = new Date();
        if (selectedDate >= currentDate) {
            return 'Ngày sinh phải là ngày quá khứ !';
        }
        return true;
    };

    return (
        <DashboardMain path={role}
            content={
                <main id="main-customer">
                    <h2>Sửa khách hàng</h2>
                    {
                        customer  &&
                        <div className="create">
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="item1">
                                <label htmlFor="">
                                    <span>Mã khách hàng*</span>
                                    <input type="text" placeholder="" value={customer?.customerCode} {...register("customerCode", {
                                        required: 'Mã khách hàng không được để trống !', pattern: {
                                            value: /^KH-\d{4,}$/,
                                            message: 'Mã khách hàng phải có định dạng KH-XXXX',
                                        },
                                        disabled: true
                                    })} />
                                    {errors.customerCode && <small>{errors.customerCode.message}</small>}
                                    <small>{validateError?.customerCode}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Giới tính*</span>
                                    <select id="" {...register("gender", { required: 'Giới tính không được để trống !', })}>
                                        <option value="" disabled>-- Chọn giới tính --</option>
                                        <option value="0">Nam</option>
                                        <option value="1">Nữ</option>
                                        <option value="2">Khác</option>
                                    </select>
                                    {errors.gender && <small>{errors.gender.message}</small>}
                                    <small>{validateError?.gender}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Họ tên*</span>
                                    <input type="text" {...register("customerName", { required: 'Tên khách hàng không được để trống !', })} placeholder="" />
                                    {errors.customerName && <small>{errors.customerName.message}</small>}
                                    <small>{validateError?.customerName}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Số điện thoại*</span>
                                    <input type="text" {...register("phoneNumber", {
                                        required: 'Số điện thoại không được để trống !', pattern: {
                                            value: /^(\+84|0\d{9})$/,
                                            message: 'Số điện thoại phải bắt đầu bằng +84 hoặc 0 và kết thúc với 9 số!',
                                        },
                                    })} placeholder="" />
                                    {errors.phoneNumber && <small>{errors.phoneNumber.message}</small>}
                                    <small>{validateError?.phoneNumber}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Ngày sinh*</span>
                                    <input type="date" {...register("dateOfBirth", { required: 'Ngày sinh không được để trống !', validate: validateDateOfBirth })} placeholder="" />
                                    {errors.dateOfBirth && <small>{errors.dateOfBirth.message}</small>}
                                    <small>{validateError?.dateOfBirth}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Email*</span>
                                    <input type="text" {...register("email", { required: 'Địa chỉ email không được để trống !', })} placeholder="" />
                                    {errors.email && <small>{errors.email.message}</small>}
                                    <small>{validateError?.email}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Địa chỉ*</span>
                                    <input type="text" {...register("address", { required: 'Địa chỉ không được để trống !', })} placeholder="" />
                                    {errors.address && <small>{errors.address.message}</small>}
                                    <small>{validateError?.address}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Điểm*</span>
                                    <input type="text" {...register("accumulatedPoints", {})} placeholder="" />
                                    <small>{validateError?.accumulatedPoints}</small>
                                </label>
                                <label htmlFor="">
                                    <span>Cấp bậc*</span>
                                    <select {...register("customerType", {required: 'Cấp bậc không được để trống !',})}  onChange={handleChangeSelect}>
                                        <option value="" disabled>-- Chọn cấp bậc --</option>
                                        {
                                            customerType?.map((item) => (
                                                <option key={item.id} value={JSON.stringify(item)} >{item.typeName}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.customerType && <small>{errors.customerType.message}</small>}
                                </label>
                            </div>
                            <div className="item2">
                                <input type="submit" className="btn add" value="Sửa" />
                                <input
                                    onClick={openModal}
                                    type="button"
                                    className="btn delete"
                                    defaultValue="Xóa"
                                />
                                <Link to={`/dashboard/${role}/customers`} className="btn cancel">Hủy</Link>
                            </div>
                        </form>
                    </div>
                    }
                    <ModalDelete isOpen={isModalOpen} onClose={closeModal} title={"Xóa khách hàng"} content={`Xác nhận xóa khách hàng tên: ${customer?.customerName} có mã: ${customer?.customerCode}`} submit={handleSubmitDelete} />
                </main>

            }
        />
    );
}

export default CustomerUpdate;