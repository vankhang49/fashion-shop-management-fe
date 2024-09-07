import "./CreateNotification.scss";
import {useEffect, useRef, useState} from "react";
import {format} from "date-fns";
import {useForm} from "react-hook-form";
import * as notificationService from "../../../services/notification/NotificationService";
import {toast} from "react-toastify";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

export default function CreateNotification(props) {
    let ROLE_SALESMAN = "ROLE_SALESMAN";
    let ROLE_WAREHOUSE = "ROLE_WAREHOUSE";
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [roles, setRoles] = useState([]);
    const {register, handleSubmit, formState: {errors}, reset, setError} = useForm();
    const [validateError, setValidateError] = useState([]);
    const urlSocketRef = useRef('');
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm:ss");
            setCurrentDateTime(formattedDateTime);
        }
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);

    }, []);

    const handleCancel = () => {
        reset({
            createDate: currentDateTime,
            topic: '',
            content: '',
            listRole: ''
        })
    }
    const getRole = async () => {
        const role = await notificationService.getAllRole();
        setRoles(role);
        console.log(roles);
    };
    useEffect(() => {
        getRole();
    }, []);
    const filterRole = (data) => {
        const mapRole = new Map();
        roles.map((role) => {
            mapRole.set(role.roleName, role.roleId)
        });
        const arrayRole = [];
        if (data === 'all') {
            arrayRole.push(mapRole.get(ROLE_SALESMAN));
            arrayRole.push(mapRole.get(ROLE_WAREHOUSE));
            urlSocketRef.current = "/app/sendNotification";
        }
        if (data === ROLE_SALESMAN) {
            arrayRole.push(mapRole.get(ROLE_SALESMAN));
            urlSocketRef.current = "/app/salesman/sendNotification";
        }
        if (data === ROLE_WAREHOUSE) {
            arrayRole.push(mapRole.get(ROLE_WAREHOUSE));
            urlSocketRef.current = "/app/warehouse/sendNotification";
        }
        console.log(arrayRole)
        return arrayRole;
    }
    const onSubmit = async data => {
        try {
            data.listRole = filterRole(data.listRole);
            console.log(data);
            await notificationService.addNewNotification(data);
            setValidateError([]);
            const socket = new SockJS("http://localhost:8080/ws");
            const stompClient = over(socket);
            stompClient.connect({}, () => {
                stompClient.send(urlSocketRef.current, {}, JSON.stringify(data));
                console.log("urlSocket ở create: ", urlSocketRef.current)
            });
            toast.success("Đăng thông báo thành công", {autoClose: 700})
            handleCancel();
        } catch (error) {
            console.log('tang component nay', error)
            setValidateError(error);
            toast.error("Đăng thông báo thất bại.", {autoClose: 700})
        }
    }
    return (
        <div
            className="container-createNotification-nhi"
        >
            <div className="title-createNotification-nhi">
                <b className="b-tag-create-notification">ĐĂNG THÔNG BÁO</b>
            </div>
            {
                console.log("urlSocket ở create: ", urlSocketRef.current)
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="user-details">
                    <div className="input-box">
                        <span className="details">
                            <b>Ngày đăng</b>
                        </span>
                        <input className="user-details-input-nhi" defaultValue={currentDateTime}
                               type="datetime-local"
                               readOnly={currentDateTime}
                               {...register(
                                   "createDate",
                                   {required: "* Bắt buộc nhập trường này"}
                               )
                               }
                        />
                    </div>
                    <div className="input-box">
                        <span className="details">
                            <b>Chủ đề</b>
                        </span>
                        <input className="user-details-input-nhi"
                               placeholder="Nhập chủ đề thông báo"
                               type="text" {...register("topic", {
                            required: "* Bắt buộc nhập trường này",
                            maxLength: {value: 255, message: "* Độ dài tối đa 255 ký tự"}
                        })} />
                        {errors.topic && <span className="error-create-notification">{errors.topic.message}</span>}
                        <span className="error-create-notification">{validateError?.topic}</span>

                    </div>
                    <div className="input-box">
                        <span className="details">
                            <b>Nội dung</b>
                        </span>
                        <textarea {...register("content", {required: "* Bắt buộc nhập trường này",})} />
                        {errors.content &&
                            <span className="error-create-notification">{errors.content.message}</span>}
                        <span className="error-create-notification"> {validateError?.content}</span>
                    </div>
                    <div className="object-receive">
                        <span className="details"><b>Người nhận</b></span>
                        <div className="category">
                            <input
                                id="dot-1"
                                type="radio"
                                value={'all'}
                                {...register("listRole", {
                                    required: "* Bắt buộc nhập trường này"
                                })}
                            />
                            <label htmlFor="dot-1">
                                <span className="dot one"/>
                                <span className="gender">Tất cả</span>
                            </label>
                            <input
                                id="dot-2"
                                type="radio"
                                value={[ROLE_WAREHOUSE]}
                                {...register("listRole", {
                                    required: "* Bắt buộc nhập trường này"
                                })}
                            />
                            <label htmlFor="dot-2">
                                <span className="dot two"/>
                                <span className="gender">Quản lý kho hàng</span>
                            </label>
                            <input
                                id="dot-3"
                                type="radio"
                                value={[ROLE_SALESMAN]}
                                {...register("listRole", {
                                    required: "* Bắt buộc nhập trường này"
                                })}
                            />
                            <label htmlFor="dot-3">
                                <span className="dot three"/>
                                <span className="gender">Người bán hàng</span>
                            </label>
                        </div>
                        {errors.listRole &&
                            <span className="error-create-notification">{errors.listRole.message}</span>}
                        <span className="error-create-notification">{validateError?.listRole}</span>
                    </div>
                </div>
                <div className="button-post-notification">
                    <input
                        className="send"
                        type="submit"
                        value="Gửi"
                        onSubmit={handleSubmit(onSubmit)}
                    />
                    <input
                        className="cancel"
                        value="Hủy bỏ"
                        type="button"
                        onClick={handleCancel}
                    />
                </div>
            </form>
        </div>
    );
}