import "./ListOfNotification.scss";
import {useEffect, useState, useCallback} from "react";
import * as notificationService from "../../../services/notification/NotificationService";
import {toast} from "react-toastify";
import DetailModal from "../modal/DetailModal";
import {formatDistanceToNow} from "date-fns";
import {vi} from "date-fns/locale";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {over} from "stompjs";
import {isSalesMan, isWarehouse} from "../../../services/auth/AuthenticationService";

export default function ListOfNotification(props) {
    const [overflow, setOverflow] = useState("hidden");
    const [listNotification, setListNotification] = useState([]);
    const [listByRead, setListByRead] = useState([]);
    const [listByUnRead, setListByUnRead] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    const fetchData = async () => {
        await getAllByStatusRead(1);
        await getAllByStatusRead(0);
    };

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/createNotification', (message) => {
                getAllByStatusRead(0);
                toast("Bạn vừa có thông báo mới!", {autoClose: 500})
            });

            if (isSalesMan()) {
                stompClient.subscribe('/topic/salesman/createNotification', (message) => {
                    getAllByStatusRead(0);
                    toast("Bạn vừa có thông báo mới!", {autoClose: 500})
                });
            }
            if (isWarehouse()) {
                console.log(isWarehouse());
                stompClient.subscribe('/topic/warehouse/createNotification', (message) => {
                    getAllByStatusRead(0);
                    toast("Bạn vừa có thông báo mới!", {autoClose: 500})
                });
            }
            ;
            stompClient.subscribe("/topic/notification", (message) => {
                    console.log(message.body);
                    getAllByStatusRead(0);
                }
            );
        });
        setStompClient(stompClient);
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        fetchData();
        getAllNotification();
    }, []);

    const getAllByStatusRead = async (statusRead) => {
        const temp = await notificationService.getAllByStatusRead(statusRead);
        if (statusRead) {
            setListByRead(temp);
        } else {
            setListByUnRead(temp);
        }
    };
    const getAllNotification = async () => {
        const temp = await notificationService.getAllNotification();
        setListNotification(temp);
    };

    const markAll = async () => {
        const response = await notificationService.markAllRead();
        await fetchData();
        if (response) {
            toast.success("Đánh dấu đã đọc tất cả thành công ");
        } else {
            toast.error("Tất cả đã được đọc rồi nhé !");
        }
        if (stompClient && stompClient.connected) {
            stompClient.send("/app/detailNotification", {}, "ban vua doc thong bao");
        } else {
            console.error("Stomp client is not connected");
        }
    };

    const getItem = useCallback(async (item) => {
        setNotification(item);
        setShowModal(true);
        await notificationService.seeViewDetail(item.notifId);
        await fetchData();
        if (stompClient && stompClient.connected) {
            stompClient.send("/app/detailNotification", {}, "ban vua doc thong bao");
        } else {
            console.error("Stomp client is not connected");
        }
    }, [stompClient]);

    const handleSeeAllNotification = useCallback(() => {
        setOverflow((prevOverflow) => (prevOverflow === "hidden" ? "auto" : "hidden"));
    }, []);

    return (
        <>
            <div className="container-listNotification-nhi" style={{
                width: props.widthList,
                backgroundColor: props.backgroundColorList,
                marginTop: props.marginTopList,
                margin: props.marginList,
                padding: props.paddingList,
                maxHeight: props.heightList,
                height: props.heightList
            }}>
                <header className="header-notification-nhi" style={{fontSize: props.fontSizeHeader}}>
                    <div className="notif_box">
                        <h2 className="title">
                            Thông báo
                            <DetailModal/>
                        </h2>
                        <span id="notifes">{listByUnRead.length}</span>
                    </div>
                    <p className="tag-p-notification" id="mark_all" onClick={markAll}>
                        Đánh dấu tất cả đã đọc
                    </p>
                </header>
                <main className="main-notification-nhi"
                      style={{overflowY: overflow, height: props.heightMain, fontSize: props.fontSizeMain}}>
                    {
                        listByUnRead.map((item) => (
                            <div key={item.notifId} onClick={() => getItem(item)} className="notif_card unread"
                                 style={{padding: props.paddingCard}}>
                                <img
                                    className="img-tag-notification-nhi"
                                    alt="manager--v2"
                                    height="52"
                                    src="https://img.icons8.com/3d-fluency/94/manager--v2.png"
                                    width="18"
                                    style={{width: props.widthImg, height: props.heightImg}}
                                />
                                <div className="description">
                                    <p className="user_activity tag-p-notification">
                                        <strong className="strong-tag-notification-nhi">
                                            Quản lý cửa hàng
                                        </strong>
                                        {' '} có thông báo cho bạn về {' '}
                                        <b>{item.topic} </b>
                                    </p>
                                    <p className="time tag-p-notification">
                                        {formatDistanceToNow(new Date(item.createDate), {
                                            addSuffix: true,
                                            locale: vi
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                    {listByRead.map((item) => (
                        <div key={item.notifId} onClick={() => getItem(item)} className="notif_card"
                             style={{padding: props.paddingCard}}>
                            <img
                                className="img-tag-notification-nhi"
                                alt="manager--v2"
                                height="52"
                                src="https://img.icons8.com/3d-fluency/94/manager--v2.png"
                                width="18"
                                style={{width: props.widthImg, height: props.heightImg}}
                            />
                            <div className="description">
                                <p className="user_activity tag-p-notification">
                                    <strong className="strong-tag-notification-nhi">
                                        Quản lý cửa hàng
                                    </strong>
                                    {' '} có thông báo cho bạn về {' '}
                                    <b>{item.topic} </b>
                                </p>
                                <p className="time tag-p-notification">
                                    <span>
                                        {formatDistanceToNow(new Date(item.createDate), {
                                            addSuffix: true,
                                            locale: vi
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                    {listNotification.length === 0 && (
                        <div
                            className="p-tag-no-data-notification-nhi bg-gray-300 rounded-2xl h-full text-3xl text-gray-500 flex justify-center items-center"
                            style={{fontSize: props.fontSizeNodata}}>
                            <p>Không có dữ liệu hiển thị</p>
                        </div>
                    )}
                    {showModal && (
                        <DetailModal notification={notification} showModal={showModal} setShowModal={setShowModal}/>
                    )}
                </main>
                {listNotification.length > 0 && (
                    <div className="see-all-button" style={{backgroundColor: props.seeAllBackgroundColor}}>
                        <button onClick={handleSeeAllNotification}>
                            Xem tất cả
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}