import React from 'react';
import HeaderHome from '../../components/Header/HeaderHome';
import FooterHome from '../../components/Footer/FooterHome';
import MainNews from './MainNews';

function NewsPage(props) {
    return (
        <>
            <HeaderHome />
            <MainNews />
            <FooterHome />
        </>
    );
}

export default NewsPage;