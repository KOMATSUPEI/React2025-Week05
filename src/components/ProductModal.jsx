import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
    modalType,
    templateProduct,
    getProducts,
    // handleModalInputChange,
    // handleModalImageChange,
    // handleAddImage,
    // handleREmoveImage,
    // updateProduct,
    // delProduct,
    // uploadImage,
    closeModal,
}){
    // 避免汙染外層的值,定義setTempData為setTemplateProduct
    // 定義tempData為templateProduct
    const [tempData,setTempData]=useState(templateProduct);

    useEffect(()=>{
        setTempData(templateProduct)
    },[templateProduct]);

    // Modal產品更新
    const handleModalInputChange=(e)=>{
        const {name,value,checked,type}=e.target;
        setTempData((preData)=>({
        ...preData,
        [name]: type==="checkbox" ? checked : value,
        }))
    };

    // Modal產品圖片
    const handleModalImageChange=(index,value)=>{
        setTempData((preImage)=>{
        const newImage=[...preImage.imagesUrl];
        newImage[index]=value;

        if(value !== "" && index === newImage.length-1 && newImage.length<5){
            newImage.push("");
        };

        if(value ==="" && newImage.length>1 && newImage[newImage.length-1] === ""){
            newImage.pop();
        };

        return{
            ...preImage,
            imagesUrl:newImage
        }
        })
    };

    // Modal新增圖片
    const handleAddImage=()=>{
        setTempData((preImage)=>{
        const newImage=[...preImage.imagesUrl];
        newImage.push("");
        return{
            ...preImage,
            imagesUrl:newImage
        }
        })
    };

    // Modal刪除圖片
    const handleREmoveImage=()=>{
        setTempData((preImage)=>{
        const newImage=[...preImage.imagesUrl];
        newImage.pop();
        return{
            ...preImage,
            imagesUrl:newImage
        }
        })
    };

    // 更新產品API
    const updateProduct=async(id)=>{
        let url=`${API_BASE}/api/${API_PATH}/admin/product`;
        let method="post";

        if(modalType === "edit"){
        url=`${API_BASE}/api/${API_PATH}/admin/product/${id}`;
        method="put";
        };
        // 資料結構轉換
        const productData={
        data:{
            ...tempData,
            origin_price:Number(tempData.origin_price),
            price:Number(tempData.price),
            is_enabled:tempData.is_enabled ? 1 : 0,
            // 移除空連結
            imagesUrl:[...tempData.imagesUrl.filter(url=>url !== "")]
        }
        }
        try{
        const res=await axios[method](url,productData);
        console.log(res.data);
        getProducts();
        closeModal();
        }catch(error){
        console.log(error.response?.data.message);
        }
    };

    // 刪除產品API
    const delProduct=async(id)=>{
        try{
        const res=await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
        console.log(res.data);
        closeModal();
        getProducts();
        }catch(error){
        console.log(error.response?.data.message);
        }
    };

    // Modal上傳圖片API
    const uploadImage=async (e)=>{
        // 只上傳一張圖
        const file=e.target.files?.[0]
        // 防呆沒選擇圖片上傳
        if(!file){
        return alert("沒有選擇圖片上傳");
        };

        try{
        const formData=new FormData();
        formData.append("file-to-upload",file)

        const res=await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`,formData);

        setTempData((pre)=>({
            ...pre,
            imageUrl:res.data.imageUrl
        }));      

        }catch(error){
        console.log(error.response);
        };

    };

    return (<>
        {/* Modal */}
        <div className="modal fade" 
                id="productModal" 
                tabIndex="-1" 
                aria-labelledby="productModalLabel" 
                aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content border-0">
                <div className={`modal-header bg-${modalType === "delete" ? "danger" : "primary"} text-white`}>
                    <h5 id="productModalLabel" className="modal-title">
                    <span>{modalType === "delete" ? "刪除" :
                            modalType === "edit" ? "編輯" : "新增"}產品
                    </span>
                    </h5>
                    <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    {
                    modalType === "delete" ? (
                        <div className="modal-body">
                        <p className="fs-4">
                            確定要刪除
                            <span className="text-danger">{tempData.title}</span>嗎？
                        </p>
                        </div>
                    ) : (
                        <div className="row">
                        <div className="col-sm-4">
                            <div className="mb-2">
                                {/* 上傳圖片 */}
                                <div className="mb-3">
                                    <label  htmlFor="fileUpload"
                                            className="form-label"
                                    >
                                    上傳圖片
                                    </label>
                                    <input  className="form-label" 
                                            type="file" 
                                            name="fileUpload" 
                                            id="fileUpload" 
                                            accept=".jpg,.jpeg,.png"
                                            onChange={(e)=>uploadImage(e)}
                                    />
                                </div>
                                {/* 輸入圖片網址 */}
                            <div className="mb-3">
                                <label htmlFor="imageUrl" className="form-label">
                                輸入圖片網址
                                </label>
                                <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                className="form-control"
                                placeholder="請輸入圖片連結"
                                value={tempData.imageUrl}
                                onChange={(e=>handleModalInputChange(e))}
                                />
                            </div>
                            {
                                tempData.imageUrl && (
                                <img  className="img-fluid" 
                                    src={tempData.imageUrl} 
                                    alt="主圖" />
                                )
                            }
                            </div>
                            <div>
                            {tempData.imagesUrl.map((url,index)=>(
                                <div key={index}>
                                <label htmlFor="imageUrl" className="form-label">
                                    輸入圖片網址
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`圖片網址${index + 1}`}
                                    value={url}
                                    onChange={(e)=>handleModalImageChange(index,e.target.value)}
                                />
                                {
                                    url && (
                                    <img
                                        className="img-fluid"
                                        src={url}
                                        alt={`副圖${index + 1}`}
                                    />
                                    )
                                }
                                </div>
                                ))
                            }
                            {
                                tempData.imagesUrl.length < 5 &&
                                tempData.imagesUrl[tempData.imagesUrl.length - 1] !== "" &&
                                (<button className="btn btn-outline-primary btn-sm d-block w-100"
                                        onClick={()=>handleAddImage()}>
                                新增圖片
                                </button>)
                            }
                            </div>
                            <div>
                            {
                                tempData.imagesUrl.length >= 1 &&
                                (<button className="btn btn-outline-danger btn-sm d-block w-100"
                                        onClick={()=>handleREmoveImage()}>
                                    刪除圖片
                                </button>)
                            }
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="mb-3">
                            <label htmlFor="title" className="form-label">標題</label>
                            <input
                                name="title"
                                id="title"
                                type="text"
                                className="form-control"
                                placeholder="請輸入標題"
                                value={tempData.title}
                                onChange={(e)=>handleModalInputChange(e)}
                                />
                            </div>

                            <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="category" className="form-label">分類</label>
                                <input
                                name="category"
                                id="category"
                                type="text"
                                className="form-control"
                                placeholder="請輸入分類"
                                value={tempData.category}
                                onChange={(e)=>handleModalInputChange(e)}
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="unit" className="form-label">單位</label>
                                <input
                                name="unit"
                                id="unit"
                                type="text"
                                className="form-control"
                                placeholder="請輸入單位"
                                value={tempData.unit}
                                onChange={(e)=>handleModalInputChange(e)}
                                />
                            </div>
                            </div>

                            <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="origin_price" className="form-label">原價</label>
                                <input
                                name="origin_price"
                                id="origin_price"
                                type="number"
                                min="0"
                                className="form-control"
                                placeholder="請輸入原價"
                                value={tempData.origin_price}
                                onChange={(e)=>handleModalInputChange(e)}
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="price" className="form-label">售價</label>
                                <input
                                name="price"
                                id="price"
                                type="number"
                                min="0"
                                className="form-control"
                                placeholder="請輸入售價"
                                value={tempData.price}
                                onChange={(e)=>handleModalInputChange(e)}
                                />
                            </div>
                            </div>
                            <hr />

                            <div className="mb-3">
                            <label htmlFor="description" className="form-label">產品描述</label>
                            <textarea
                                name="description"
                                id="description"
                                className="form-control"
                                placeholder="請輸入產品描述"
                                value={tempData.description}
                                onChange={(e)=>handleModalInputChange(e)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                            <label htmlFor="content" className="form-label">說明內容</label>
                            <textarea
                                name="content"
                                id="content"
                                className="form-control"
                                placeholder="請輸入說明內容"
                                value={tempData.content}
                                onChange={(e)=>handleModalInputChange(e)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                    name="is_enabled"
                                    id="is_enabled"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={tempData.is_enabled}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                    <label className="form-check-label" htmlFor="is_enabled">
                                    是否啟用
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-check-label" htmlFor="size">
                                    尺寸
                                </label>
                                <select
                                    id="size"
                                    name="size"
                                    className="form-select"
                                    aria-label="Default select example"
                                    value={tempData.size}
                                    onChange={(e)=>handleModalInputChange(e)}
                                >
                                    <option value="">請選擇</option>
                                    <option value="lg">大杯</option>
                                    <option value="md">中杯</option>
                                    <option value="sm">小杯</option>
                                </select>
                            </div>
                        </div>
                        </div>
                    )
                    }
                </div>
                <div className="modal-footer">
                    {
                    modalType === "delete" ?(
                        <button type="button"
                                className="btn btn-danger"
                                onClick={()=>delProduct(tempData.id)}>
                            刪除
                        </button>
                    ) : (
                        <>
                        <button type="button" 
                                className="btn btn-secondary" 
                                data-bs-dismiss="modal"
                                onClick={()=>closeModal()}>
                                    取消
                        </button>
                        <button type="button" 
                                className="btn btn-primary"
                                onClick={()=>updateProduct(tempData.id)}>
                                    確認
                        </button>
                        </>
                    )
                    }
                </div>
                </div>
            </div>
        </div>
    </>)
};

export default ProductModal;