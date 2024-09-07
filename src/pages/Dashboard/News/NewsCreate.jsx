import { DashboardMain } from '../../../components/Dashboard/DashboardMain';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
import './News.scss';
import { UploadOneImage } from "../../../firebase/UploadImage";
import { useState } from 'react';
import * as NewsService from '../../../services/news/NewsService'
import Editor from '../../../components/Editer';

function NewsCreate(props) {
    const { role } = useParams();
    const [content, setContent] = useState('');
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [disabled, setDisabled] = useState(true);
    const [validateError, setValidateError] = useState([])
    const navigate = useNavigate()
    const onSubmit = async (data) => {

        if(data.newsImgUrl == null){
            toast.warn("Vui lòng chọn ảnh cho tin tức !")            
            return;
        }
        try {
            data.content = content;
            console.log(data);
            setDisabled(true)
            await NewsService.createNews(data)
            reset();
            setDisabled(false)
            setValue("newsImgUrl", '');
            setContent('');
            setValidateError([])
            navigate(`/dashboard/${role}/news`)
            toast.success("Thêm mới tin tức thành công")
        } catch (error) {
            console.log(error);
            setValidateError(error);
        }
    };

    const handleOneImageUrlChange = async (url, fieldName) => {
        setDisabled(false)
        setValue(fieldName, url);
    }

    const handeleChangeContent = (value) => {
        setContent(value);
    }
    return (
        <DashboardMain content={
            <main id="main-news">
                <h2>Thêm mới tin tức</h2>
                <div className="create">
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="item1">
                            <label htmlFor="">
                                <span>Tiêu đề *</span>
                                <input type="text" placeholder=""  {...register("title", {})} />
                                <small>{validateError?.title}</small>
                            </label>
                            <label htmlFor="">
                                <span>Ảnh *</span>
                                <input type="text" style={{display: "none"}} {...register("newsImgUrl", {})} />
                                <UploadOneImage
                                    className={"input-img"}
                                    getDisabled={(e)=>setDisabled(e)}
                                    onImageUrlChange ={(url) => handleOneImageUrlChange(url, "newsImgUrl",{})}/>
                                <small>{validateError?.newsImgUrl}</small>    
                            </label>
                            <label htmlFor="">
                                <span>Mô tả *</span>
                                <input type="text" placeholder=""  {...register("newsDescription", {
                                })} />
                                <small>{validateError?.newsDescription}</small>
                            </label>
                            <label htmlFor="">
                                <span>Nội dung *</span>
                                <textarea rows="1" placeholder="" value={content} style={{display: "none"}} {...register("content",{})}></textarea>
                                <Editor value={content} onChange={handeleChangeContent} className="custom-editor"  />
                                <small>{validateError?.content}</small>
                            </label>

                        </div>
                        <div className="item2">
                            <input type="submit" className="btn add" value="Thêm" disabled={disabled}  />
                            <Link to={`/dashboard/${role}/news`} className="btn cancel">Hủy</Link>
                        </div>
                    </form>
                </div>
            </main>
        } />
    );
}

export default NewsCreate;