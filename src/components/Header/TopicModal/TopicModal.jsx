import React, {useEffect, useState} from "react";
import styles from "./TopicModal.module.scss";

export const TopicModal = ({isOpen, onClose}) => {
    const [topic, setTopic] = useState(null);

    useEffect(() => {
        const topicStorage = localStorage.getItem("topic");
        setTopic(topicStorage);
        document.documentElement.classList.add(topicStorage);
    }, [])
    const handleTopicMode = (topic) => {
        setTopic(prevTopic => {
            if (prevTopic !== topic) {
                document.documentElement.classList.remove(prevTopic);
                document.documentElement.classList.add(topic);
                localStorage.setItem("topic", topic);
            } else  {
                document.documentElement.classList.remove(topic);
                console.log(topic);
                localStorage.removeItem("topic");
            }
            return topic;
        });
    }

    return (
        <div className={`${styles.modal} ${isOpen ? styles.appear : ''}`}>
            <div className={styles.modalContent}>
                <div className={styles.topic}>
                    <div className={`${styles.topicElement} ${styles.spring}`} onClick={() => handleTopicMode('spring')}></div>
                    <div className={`${styles.topicElement} ${styles.summer}`} onClick={() => handleTopicMode('summer')}></div>
                    <div className={`${styles.topicElement} ${styles.autumn}`} onClick={() => handleTopicMode('autumn')}></div>
                    <div className={`${styles.topicElement} ${styles.winter}`} onClick={() => handleTopicMode('winter')}></div>
                </div>
                <div className={styles.button}>
                    <button onClick={() => handleTopicMode(null)}>Khôi phục</button>
                    <button onClick={onClose} style={{background: "#dcdcdc"}}>Đóng</button>
                </div>
            </div>
        </div>
    );
}