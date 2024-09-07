import "./DetailModal.scss";
import {MdCancel} from "react-icons/md";
import {format} from 'date-fns';

export default function DetailModal({notification, showModal, setShowModal}) {

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl min-w-96 ">
                            {/*content*/}
                            <div
                                className="rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-90">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5">
                                    <h3 className="text-3xl font-semibold text-blue-900">
                                        Thông báo
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:cursor-pointer"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <MdCancel/>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="px-10">
                                    <div
                                        className="text-black text-xl flex justify-center items-center h-full">
                                        <b className="justify-text">{notification.topic}</b>
                                    </div>
                                    <div className="relative p-6 flex-auto overflow-auto max-h-60">
                                        <div className="formatted-text my-4 text-blueGray-500 text-lg leading-relaxed text-sm ">
                                            {notification.content}
                                        </div>
                                    </div>
                                    <div className="text-blue-200 relative p-6 flex justify-center items-center ">
                                        <span>{format(new Date(notification.createDate), "dd-MM-yyyy HH:mm")}</span>

                                    </div>
                                </div>

                                {/*footer*/}
                                <div className="flex items-center justify-end px-5 py-5 ">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}