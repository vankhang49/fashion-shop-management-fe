import { DashboardMain } from '../../../components/Dashboard/DashboardMain';
import './Customer.scss'
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import * as CustomerService from '../../../services/customer/CustomerService'
import { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from "react-router-dom";
function CustomerCreate() {
    const {role} = useParams();
    const [codeAutoCustomer, setCodeAutoCustomer] = useState(null)
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const [validateError, setValidateError] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getCodeAutoCustomer()
    }, []);

    const getCodeAutoCustomer = async () => {
        try {
            const response = await CustomerService.codeAuto();
            setCodeAutoCustomer(response);
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (data) => {
        try {
            data.customerCode = codeAutoCustomer;
            await CustomerService.createCustomer(data);
            reset();
            setValidateError([])
            setCodeAutoCustomer(null)
            navigate(`/dashboard/${role}/customers`)
            toast.success("Thêm mới khách hàng thành công")
        } catch (error) {
            console.log(error);
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
                    <h2>Thêm mới khách hàng</h2>
                    <div className="create">
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="item1">
                                <label htmlFor="">
                                    <span>Mã khách hàng*</span>
                                    <input type="text" placeholder="" value={codeAutoCustomer} {...register("customerCode", {
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
                                        <option value="">-- Chọn giới tính --</option>
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
                            </div>
                            <div className="item2">
                                <input type="submit" className="btn add" value="Thêm" />
                                <Link to={`/dashboard/${role}/customers`} className="btn cancel">Hủy</Link>
                            </div>
                        </form>
                    </div>
                </main>
            }
        />

    );
}

export default CustomerCreate;