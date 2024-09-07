import React from 'react';
import HeaderHome from '../../components/Header/HeaderHome';
import FooterHome from '../../components/Footer/FooterHome';
import MainNewsDetail from './MainNewsDetail';

function NewsDetailPage(props) {
    return (
        <>
            <HeaderHome />
            <MainNewsDetail />
            <FooterHome />
        </>
    );
}

export default NewsDetailPage;