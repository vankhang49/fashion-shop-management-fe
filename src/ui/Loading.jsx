import React from 'react';
import styles from './ui.module.scss';

function Loading(props) {
    return (
        <div id={styles.loading}>
            <figure className={styles.loader}>
                <div className={`${styles.dot} ${styles.white}`}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </figure>
        </div>
    );
}

export default Loading;
