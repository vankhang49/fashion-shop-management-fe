import React, { useState, useRef,useEffect } from 'react';
import styles from './InputSearch.module.scss';
import * as ProductService from '../../services/products/ProductService';
import { Link } from 'react-router-dom';
import { fCurrency } from '../../utils/format-number';

function InputSearch() {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const showResultRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showResultRef.current && !showResultRef.current.contains(event.target)) {
                setShowResult(false);
                setResult([]);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    
    useEffect(() => {
        let debounceTimeout;

        const handleSearch = async () => {
            if (search === '') {
                setShowResult(false);
                setResult([]);
                return;
            }

            setLoading(true);
            setResult([]);
            setError(false);

            try {
                const response = await ProductService.searchProduct(search);
                setResult(response.content);
                setLoading(false);
                setShowResult(true);
                if (response.content.length === 0) {
                    setResult([]);
                }
            } catch (error) {
                setLoading(false);
                setResult([]);
                console.error('Error while searching:', error);
            }
        };

        const delayedSearch = () => {
            clearTimeout(debounceTimeout);
            setShowResult(false);
            debounceTimeout = setTimeout(handleSearch, 2000);
        };

        delayedSearch();

        return () => clearTimeout(debounceTimeout);
    }, [search]);

    const handleClear = () => {
        setSearch('');
        setShowResult(false);
        setResult([]);
    };

    const handleEnter = async (e) => {
        if (e.key === 'Enter') {
            setShowResult(true);
            setLoading(true);
            setResult([]);
            setError(false);
            setSearch(e.target.value);
            if (search === '') {
                setShowResult(false);
                setResult([]);
                return;
            }
            try {
                const response = await ProductService.searchProduct(search);
                setResult(response.content);
                setLoading(false);
                setShowResult(true);
                if (response.content.length === 0) {
                    setResult([]);
                }
            } catch (error) {
                setLoading(false);
                setResult([]);
                console.error('Error while searching:', error);
            }
        }
    };

    const renderResult = () => {
        if (loading) {
            return <div className={styles.loading}>Loading...</div>;
        }
        if (error) {
            return <div className={styles.error}>Có lỗi xảy ra</div>;
        }
        if (result.length === 0) {
            return <div className={styles.noResult}>Không tìm thấy kết quả !</div>;
        }
        return (
            <div>
                <b className={styles.title}>Kết quả: </b>
                <div className={styles.productListSearch}>
                    {result?.map((item, index) => (
                        <Link to={`/product/${item?.productId}`} key={index} className={styles.item}>
                            <img src={item?.pricingList[0]?.pricingImgUrl} alt="" />
                            <p>{item.productName}
                                <br />
                                Giá: <span>{fCurrency(item?.pricingList[0]?.price)}</span> VND
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <svg
                fontSize={23}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 19.809 18.809"
            >
                <g transform="translate(0.75 0.75)">
                    <ellipse
                        cx="7.297"
                        cy="7.235"
                        rx="7.297"
                        ry="7.235"
                        fill="none"
                        stroke="#333333"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M5.98,5.211.66.49"
                        transform="translate(12.02 11.789)"
                        fill="none"
                        stroke="#333333"
                        strokeWidth="1.5"
                    />
                </g>
            </svg>
            <input
                type="text"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleEnter}
            />
            {search && (
                <button className={styles.clearButton} onClick={handleClear}>
                    &times;
                </button>
            )}
            {showResult && <div className={styles.result} ref={showResultRef}>
                {renderResult()}
            </div>}
        </div>
    );
}

export default InputSearch;
