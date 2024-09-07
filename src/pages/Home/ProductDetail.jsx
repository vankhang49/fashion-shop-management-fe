import React from 'react';
import HeaderHome from '../../components/Header/HeaderHome';
import FooterHome from '../../components/Footer/FooterHome';
import Main from './components/Main';
import MainProductDetail from './components/MainProductDetail';

function ProductDetail(props) {
    return (
        <>
            <HeaderHome />
            <MainProductDetail />
            <FooterHome />
        </>
    );
}

export default ProductDetail;