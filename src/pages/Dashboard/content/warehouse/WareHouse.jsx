import React, { useEffect, useState } from "react";
import './warehouse.scss';
import * as productService from '../../../../services/products/product-service';
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import { DashboardMain } from "../../../../components/Dashboard/DashboardMain";
import {BiSolidShow} from "react-icons/bi";
import {MdOutlineModeEdit} from "react-icons/md";
import {IoTrashSharp} from "react-icons/io5";
import {ProductDetailModal} from "./ProductDetailModal";
import ModalDelete from "../../../../ui/ModalDelete";
import * as productService1 from '../../../../services/products/ProductService';
import {toast} from "react-toastify";
import {isWarehouse} from "../../../../services/auth/AuthenticationService";
import * as authenticationService from "../../../../services/auth/AuthenticationService";

export const WareHouse = () => {
    const {role} = useParams();
    const isWarehouse = authenticationService.isWarehouse();
    const isAdmin = authenticationService.isAdmin();
    const navigate = useNavigate()
    const [products, setProducts] = useState([]);
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [ascending, setAscending] = useState(true); // true for ascending, false for descending
    const [clickCount, setClickCount] = useState(0); // Biến đếm số lần click
    const [productId, setProductId] = useState(null);
    const [productDelete, setProductDelete] = useState(null);
    const [product, setProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenD, setIsModalOpenD] = useState(false);

    // Function to toggle sidebar visibility
    const callbackFunction = (childData) => {
        setIsShowSidebar(childData);
    };

    // Function to fetch products based on page number, keyword, sortBy, and ascending
    useEffect(() => {
        getAllProduct(keyword,sortBy, ascending,pageNumber);
    }, [pageNumber,sortBy, ascending]);
    console.log(products)

    const getAllProduct = ( keyword, sortBy, ascending, pageNumber) => {
        productService.getAllProduct(keyword, sortBy, ascending, pageNumber)
            .then(res => {
                setProducts(res.content);
                setTotalPages(res.totalPages);
            })
            .catch(err => console.error("Error fetching products: ", err));
    };

    const openDetailModal = (productId) => {
        setIsModalOpen(true);
        setProductId(productId);
        console.log(productId)
    }
    const openDeleteModal =(productId)=>{
        setIsModalOpenD(true);
        setProductDelete(productId);
        console.log(productId)
    }
    const closeDeleteModal =()=> setIsModalOpenD(false)


    const closeDetailModal = () => setIsModalOpen(false);


    const showView = (productId) => {
        navigate(`/dashboard/pricingView`, { state: { productId: productId } })
    };

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setAscending(!ascending);
        } else {
            setSortBy(columnName);
            setAscending(true);
        }
        // Tăng biến đếm lần click
        setClickCount(clickCount + 1);
    };

    useEffect(() => {
        // Nếu click lần thứ ba, reset lại các trạng thái
        if (clickCount === 3) {
            setSortBy('');
            setAscending(true);
            setClickCount(0); // Đặt lại biến đếm lần click về 0
        }
    }, [clickCount]);

    const getSortIndicator = (columnName) => {
        if (sortBy === columnName) {
            return ascending ? <span>&#9650;</span> : <span>&#9660;</span>;
        }
        return null;
    };
    const handleSearch = (e) => {
        e.preventDefault();
        // setPage(0);
        getAllProduct( keyword, sortBy, ascending,pageNumber);
    };
    const  handleDelete = (productDelete,product)=>{
        productService.deleteProduct(productDelete,product).then(
            ()=>{
                toast.success('xóa thành công');
                closeDeleteModal();
                getAllProduct(keyword,sortBy,ascending,pageNumber);
            }
        ).catch(err=>console.log(err))
    }
    useEffect(() => {
        getProductById(productDelete);
    }, [productDelete]);
    const getProductById =  (id) => {
        productService1.getProductById(id).then(res=> setProduct(res)).catch(err=>console.log(err));
    };

    const showPageNo = () => {
        let pageNoTags = [];
        for (let i = 0; i < totalPages; i++) {
            pageNoTags.push(<a key={i} className="page-a" onClick={() => handlePage(i)}>{i + 1}</a>);
        }
        return pageNoTags;
    }

    const handlePage = (pageNo) => {
        setPageNumber(pageNo);
    }

    return (
        <DashboardMain path={role} content={
            <div className="content-body">
                <div className="content-element">
                    <div className="header-content">
                        <form onSubmit={handleSearch} className="form-search">
                            <input type="text" placeholder="Search..." className="search-bar" value={keyword}
                                   onChange={(e)=>setKeyword(e.target.value)} />
                            <button onClick={handleSearch} className="btn btn-search">Search</button>
                        </form>

                        {/*{isWarehouse && isAdmin &&*/}
                        {/*<NavLink className="link-move" to={`/dashboard/${role}/create-pricing`}>Thêm Hàng Hóa</NavLink>*/}
                        {/*}*/}

                        <NavLink className="link-move" to={`/dashboard/${role}/create-pricing`}>Thêm Hàng Hóa</NavLink>

                    </div>
                    <div className="box-content" id='warehouse-table'>
                        <p>Danh sách nhân viên</p>
                        {/* Data table content */}
                        <table className="table">
                            <thead>
                            <tr>
                                <th>
                                    STT
                                </th>
                                <th onClick={() => handleSort('productCode')}>
                                    Mã hàng
                                    {getSortIndicator('productCode')}
                                </th>
                                <th onClick={() => handleSort('productName')}>
                                    Tên
                                    {getSortIndicator('productName')}
                                </th>
                                <th onClick={() => handleSort('description')}>
                                    Mô tả
                                    {getSortIndicator('description')}
                                </th>
                                <th onClick={() => handleSort('productType.category.categoryName')}>
                                    Loại
                                    {getSortIndicator('productType.category.categoryName')}
                                </th>
                                <th onClick={() => handleSort('productType.typeName')}>
                                    Danh mục
                                    {getSortIndicator('productType.typeName')}
                                </th>
                                <th>
                                    Pricing
                                </th>
                                <th>
                                    Chọn
                                </th>
                                <th>
                                    Thêm Pricing
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {!products ? <tr><td colSpan="7" className='container'>Không có kết quả</td></tr> :
                                products?.map((item, index) => (
                                    <tr key={item.productId}>
                                        <td>{index + 1}</td>
                                        <td>{item.productCode}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.description}</td>
                                        <td>{item.productType.category.categoryName}</td>
                                        <td>{item.productType.typeName}</td>
                                        <td><a onClick={() => showView(item.productId)} style={{ color: 'green', padding: '5px' }}>Pricing in {item.productName}</a></td>
                                        <td className={"edit-emp"}>
                                            <a onClick={() => openDetailModal(item.productId)}>
                                                <BiSolidShow fill="#3dc8d8"/>
                                            </a>
                                            <Link to={`/dashboard/${role}/update-pricing/${item.productId}`}>
                                                <MdOutlineModeEdit fill="#00a762"/>
                                            </Link>
                                            <a onClick={() => openDeleteModal(item.productId)}>
                                                <IoTrashSharp fill="red"/>
                                            </a>
                                        </td>
                                        <td style={{textAlign:"center",color:"lightskyblue"}}>
                                            <Link to={`/dashboard/${role}/create-pricing/${item.productId}`}>
                                                +
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="page">
                        <div className="page-box">
                            {pageNumber !== 0 &&
                                <a className="page-a" onClick={() => handlePage(pageNumber - 1)}>Trang trước</a>
                            }
                            <span>
                                    {showPageNo()}
                                </span>
                            {pageNumber < (totalPages - 1) &&
                                <a className="page-a" onClick={() => handlePage(pageNumber + 1)}>Trang sau</a>
                            }
                        </div>
                    </div>

                    <ProductDetailModal
                        isOpen={isModalOpen}
                        onClose={closeDetailModal}
                        id={productId}
                    />
                    <ModalDelete isOpen={isModalOpenD} onClose={closeDeleteModal} title={`Bạn có muốn xóa ${productDelete}`} content={'Bạn hãy xác nhận lại'} submit={()=>handleDelete(productDelete,product)} />
                </div>
            </div>
        } />
    );
};
