import styles from './News.module.scss';
import {useState, useEffect } from 'react';
import Loading from '../../ui/Loading';
import * as NewsService from '../../services/news/NewsService'
import Moment from 'moment';
import { Link} from 'react-router-dom';


function MainNews(props) {
    const [newsList, setNewsList] = useState([]);
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        if (initialLoad) {
            loadInitialNewsList();
        }
    }, [initialLoad]);

    const loadInitialNewsList = async () => {
        setLoading(true);
        const response = await NewsService.getAllNews(page);
        if (!response || !response.content) {
            setHasMore(false);
        } else {
            setNewsList(response.content);
            setPage(1);
            if (response.last) {
                setHasMore(false);
            }
        }

        setLoading(false);
        setInitialLoad(false);
    }

    const loadMoreNews = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const response = await NewsService.getAllNews(page);
        if (!response || !response.content) {
            setHasMore(false);
        } else {
            setNewsList(prevNews => [...prevNews, ...response.content]);
            setPage(prevPage => prevPage + 1);
            if (response.last) {
                setHasMore(false);
            }
        }

        setLoading(false);
    };

    return (
        <main id={styles.main}>
            <section className={styles.section}>
                <h3>Tin tức thời trang</h3>
                <div className={styles.list}>
                    {newsList?.map((news) => (
                        <div className={styles.item} key={news.newsId}>
                            <Link to={`/news/${news?.newsId}`}>
                                <figure>
                                    <img
                                        src={news.newsImgUrl}
                                        alt={news.title}
                                        width="100%"
                                    />
                                </figure>
                                <figcaption>
                                    <p>{news.title}</p>
                                    <p>{news.newsDescription}</p>
                                    <p>
                                        <span>{news.fullName}</span>
                                        <span>{Moment(news.dateCreate).format('DD/MM/YYYY')}</span>
                                    </p>
                                </figcaption>
                            </Link>
                        </div>
                    ))}
                </div>
                {loading && <Loading />}
                    {hasMore && !loading &&
                        (<button className={styles.button}>
                            <a onClick={loadMoreNews}>Xem thêm</a>
                        </button>)
                    }
                    {
                        newsList?.length == 0 && !loading &&
                        (<p style={{ display: "block", textAlign: "center" }}>Không tìm thấy bài viết !</p>)
                    }
            </section>
        </main>
    );
}

export default MainNews;
