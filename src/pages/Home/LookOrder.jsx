import React from 'react';
import HeaderHome from '../../components/Header/HeaderHome';
import FooterHome from '../../components/Footer/FooterHome';
import MainLookOrder from './components/MainLookOrder';

function LookOrder(props) {
    return (
        <>
            <HeaderHome />
            <MainLookOrder/>
            <FooterHome />
        </>
    );
}

export default LookOrder;