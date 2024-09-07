import React from 'react';
import HeaderHome from '../../components/Header/HeaderHome';
import Main from './components/Main';
import FooterHome from '../../components/Footer/FooterHome';

function HomePage(props) {
    return (
        <>
            <HeaderHome />
            <Main />
            <FooterHome />
        </>
    );
}

export default HomePage;