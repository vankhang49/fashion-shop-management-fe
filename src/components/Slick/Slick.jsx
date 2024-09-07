import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Slick.module.scss'

function Slick() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnHover: false,
        autoplaySpeed: 3000,
      };
      
    return (
        <div className={styles.sliderHome}>
            <Slider {...settings}>
                <div className={styles.item}>
                    <img src="https://media.fmplus.com.vn/uploads/sliders/2c2abd60-aa84-42de-9ace-1c0219007a0d.png" alt="" />
                </div>
                <div className={styles.item}>
                    <img src="https://media.fmplus.com.vn/uploads/sliders/3db10944-7817-4c48-9565-dcf816a840ee.jpg" alt="" />
                </div>
                <div className={styles.item}>
                    <img src="https://media.fmplus.com.vn/uploads/sliders/9ec34c1e-ac69-4b8d-a543-9b3fc37cdc99.png" alt="" />
                </div>
            </Slider>
        </div>
    );
}

export default Slick;