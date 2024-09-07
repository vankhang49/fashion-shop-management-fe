import React, {useEffect, useState} from "react";
import './warehouse.scss';
import * as pricingService from '../../../../services/products/pricing-service';
import {NavLink, useLocation, useParams} from "react-router-dom";
import DownloadImageFromFireBase from "../../../../firebase/DownloadImageFromFireBase";
import {DashboardMain} from "../../../../components/Dashboard/DashboardMain";

export const PricingView = () => {
    const {role} = useParams();
    const {state} = useLocation()
    const [pricings, setPricings] = useState([]);
    const [isShowSidebar, setIsShowSidebar] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [ascending, setAscending] = useState(true);
    const [clickCount, setClickCount] = useState(0); // Biến đếm số lần click

    useEffect(() => {
        getAllPricingByProductId(state?.productId, keyword, sortBy, ascending, pageNumber);
    }, [state?.productId, sortBy, ascending, pageNumber]);


    const getAllPricingByProductId = (productId, pageNumber) => {
        pricingService.getAllPricingByProductId(productId, pageNumber).then(res => {
            setPricings(res.content);
            console.log(res.content)
            console.log(res.totalPages)
            setTotalPages(res.totalPages);
        })
            .catch(err => console.error("Error fetching pricings: ", err));
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
        getAllPricingByProductId(state?.productId, keyword, sortBy, ascending, pageNumber);
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
                <div className='content-element'>
                    <div className="header-content">
                        <form onSubmit={handleSearch} className="form-search">
                            <input type="text" placeholder="Search..." className="search-bar" value={keyword}
                                   onChange={(e) => setKeyword(e.target.value)}/>
                            <button onClick={handleSearch} className="btn btn-search">Search</button>
                        </form>
                        <NavLink className="link-move" to={`/dashboard/${role}/create-pricing`}>Thêm Hàng Hóa</NavLink>
                    </div>
                    <div className="box-content" id='warehouse-table'>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>STT</th>
                                <th onClick={() => handleSort('pricingCode')}>
                                    Mã hàng
                                    {getSortIndicator('pricingCode')}
                                </th>
                                <th onClick={() => handleSort('pricingName')}>
                                    Tên
                                    {getSortIndicator('pricingName')}
                                </th>
                                <th onClick={() => handleSort('quantity')}>
                                    Số Lượng
                                    {getSortIndicator('quantity')}
                                </th>
                                <th onClick={() => handleSort('size')}>
                                    Size
                                    {getSortIndicator('size')}
                                </th>
                                <th>Ảnh</th>
                                <th onClick={() => handleSort('color.colorName')}>
                                    Màu
                                    {getSortIndicator('color.colorName')}
                                </th>
                                <th>QR Code</th>
                                <th onClick={() => handleSort('price')}>
                                    Đơn giá
                                    {getSortIndicator('price')}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {pricings.length === 0 ? <tr>
                                    <td colSpan="9" className='container'>Không có kết quả</td>
                                </tr> :
                                pricings.map((item, index) => (
                                    <tr key={item.pricingCode}>
                                        <td>{index + 1}</td>
                                        <td>{item.pricingCode}</td>
                                        <td>{item.pricingName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.size}</td>
                                        <td><DownloadImageFromFireBase key={index} imagePath={item.pricingImgUrl}/></td>
                                        <td>{item.color.colorName}</td>
                                        <td><DownloadImageFromFireBase key={index} imagePath={item.qrCode}/></td>
                                        <td>{item.price}</td>
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
                </div>
            </div>
        }/>
    );
};
export default PricingView;
