import styles from './MainLookOrder.module.scss';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import ModalDelete from '../../../ui/ModalDelete';

function MainLookOrder(props) {
    const [isModalOpen, setModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onSubmit = (data) => {
        setModalOpen(true);
    };
    
    const closeModal = () => {
        setModalOpen(false);
    };
    
    const handleSubmitDelete = () => {
        reset();
        closeModal();
    };

    return (
        <main id={styles.main}>
            <h3>Tra cứu lịch sử mua hàng</h3>
            <div className={styles.mainLookOrder}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.search}>
                        <input
                            type="text"
                            placeholder="Mã hóa đơn *"
                            {...register('orderCode', { required: true })}
                        />
                        {errors.orderCode && <small style={{ color: "red" }}>Mã hóa đơn là bắt buộc!</small>}

                        <input
                            type="text"
                            placeholder='Số điện thoại khách hàng *'
                            {...register('customerPhone', { required: true })}
                        />
                        {errors.customerPhone && <small style={{ color: "red" }}>Số điện thoại là bắt buộc!</small>}<br />

                        <button type="submit">Tìm kiếm</button>
                    </div>
                </form>
                <ModalDelete
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={"Tra cứu lịch sử mua hàng"}
                    content={`Tính năng tra cứu lịch sử đơn hàng đang trong quá trình phát triển, vui lòng quay lại sau!`}
                    submit={handleSubmitDelete}
                />
            </div>
        </main>
    );
}

export default MainLookOrder;
