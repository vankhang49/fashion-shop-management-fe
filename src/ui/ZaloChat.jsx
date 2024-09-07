import React from 'react';
import ZaloIcon from '../assets/icons/zalo.svg'

function ZaloChat(props) {
    return (
        <div className='fixed bottom-4 right-4'>
            <img src={ZaloIcon} alt="Zalo Icon" />
        </div>
    );
}

export default ZaloChat;