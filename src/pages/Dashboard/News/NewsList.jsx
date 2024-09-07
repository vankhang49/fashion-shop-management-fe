import { useState, useEffect } from 'react';
import { DashboardMain } from '../../../components/Dashboard/DashboardMain';
import { Link, useParams } from 'react-router-dom';
import './NewsList.scss'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Moment from 'moment';
import ModalDelete from '../../../ui/ModalDelete';
import { toast } from "react-toastify";
import * as  NewsService from '../../../services/news/NewsService'

function NewsList(props) {
    const { role } = useParams();
    const [newsList, setNewsList] = useState([]);
    const [newsDelete, setNewsDelete] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        getNewsList()

    }, []);
    const getNewsList = async () => {
        try {
            const response = await NewsService.getAllNews()
            setNewsList(response.content)
            setTotalPages(response.totalPages);
        } catch (error) {
            console.log(error)
        }

    }
    const handleSubmitDelete = async () => {
        try {
            await NewsService.deleteNews(newsDelete?.newsId);
            getNewsList();
            toast.success("Xóa tin tức thành công");
            closeModal();
        } catch (error) {
            closeModal();
            toast.error("Xóa tin tức thất bại");
        }
    };
    const openModal = (item) => {
        setNewsDelete(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setNewsDelete(null);
        setModalOpen(false);
    };

    const goToPage = async (pageNumber) => {
        setPage(pageNumber);
        const response = await NewsService.getAllNews(pageNumber);
        setNewsList(response.content);
    };

    return (
        <>
            <DashboardMain content={
                <div id="news-list">
                    <div className="box-contents">
                        <div className="box-content-header">
                            <h2>Danh sách tin tức</h2>
                            <br />
                        </div>
                        <div className="flex-box">
                            <div></div>
                            <div className="button-crud">
                                <Link to={`/dashboard/${role}/news/create`}>
                                    <button className="addNew">Thêm mới</button>
                                </Link>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="table box-element">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tiêu đề</th>
                                        <th>Mô tả</th>
                                        <th>Người tạo</th>
                                        <th>Ngày tạo</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsList?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td> <img src={item?.newsImgUrl} alt={item.title} width={"120x"} style={{padding: "4px 0", aspectRatio: "4/3",objectFit:"cover"}} /> <div style={{padding: "4px 0"}}>{item.title}</div> </td>
                                            <td>{item.newsDescription}</td>
                                            <td>{item.fullName}</td>
                                            <td>{Moment(item.dateCreate).format('DD/MM/YYYY')}</td>
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                <i onClick={() => openModal(item)} style={{ cursor: "pointer", marginLeft: "4px" }}><MdDelete size={22} color='red' /></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <ModalDelete isOpen={isModalOpen} onClose={closeModal} title={"Xóa tin tức"} content={`Xác nhận xóa tin tức có tiêu đề: ${newsDelete?.title}`} submit={handleSubmitDelete} />
                        </div>
                        <div className="pagination">
                            {page > 0 && (
                                <button onClick={() => goToPage(page - 1)}>Trang trước</button>
                            )}
                            <span>Trang {page + 1} / {totalPages}</span>
                            {page + 1 < totalPages && (
                                <button onClick={() => goToPage(page + 1)}>Trang sau</button>
                            )}
                        </div>
                    </div>
                </div>
            } />
        </>

    );
}

export default NewsList;