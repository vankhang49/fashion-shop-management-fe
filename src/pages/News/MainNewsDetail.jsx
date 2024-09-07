import styles from './MainNewsDetail.module.scss'
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as NewsService from '../../services/news/NewsService'
import Moment from 'moment';

function MainNewsDetail(props) {

    const { newsId } = useParams();
    const [news, setNews] = useState(null);
    useEffect(() => {
        window.scrollTo(0, 0);
        getNewsById()
    }, []);

    const getNewsById = async () => {
        const response = await NewsService.getNewsById(newsId)
        setNews(response)
    }

    return (

        <main id={styles.main}>
            <div className={styles.nav}>
                <Link to='/'>Trang chủ</Link>
                <Link to={`/news`}>Tin tức</Link>
                <Link to={`/news/${news?.newsId}`}>{news?.title}</Link>
                <br />
                <hr />
            </div>
            <section className={styles.sectionOne}>
                <div className={styles.item}>
                    <div className={styles.header}>
                        <h2>{news?.title}</h2>
                        <span>{news?.fullName}</span>
                        <span>{Moment(news?.dateCreate).format('DD/MM/YYYY')}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: news?.content }} />
                </div>
            </section>
        </main>
    );
}

export default MainNewsDetail;