import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct(){
    // const location=useLocation();
    // const product=location.state?.productData;

    const {id}=useParams();
    const [product,setProduct]=useState();

    useEffect(()=>{
        const handleView=async(id)=>{
            try{
                const res=await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
                // console.log(res.data.product);
                setProduct(res.data.product);
                // navigate(`/product/${id}`,{
                //     state: { productData: res.data.product }
                // })
            }catch(error){
                console.log(error.response);
            }
        };
        handleView(id);
    },[id]);
    
    const addCart=async (id,qty=1)=>{
        try{
            const data={
                product_id: id,
                qty
                };
            
            const res=await axios.post(`${API_BASE}/api/${API_PATH}/cart`,{data});
            console.log(res.data);

        }catch(error){
            console.log(error.response);    
        }
    };

    return (
    <>
        {!product ? (<h2>找不到商品資料</h2>) : (
        <div className="container">
            <div className="card bg-success text-white bg-opacity-75" style={{width: '18rem'}}>
                <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">
                        {product.description}
                    </p>
                    <p className="card-text">
                        原料：{product.content}
                    </p>
                    <div className="d-flex">
                        <p className="card-text me-3">
                            原價：{product.origin_price}
                        </p>
                        <p className="card-text">
                            售價：{product.price}
                        </p>
                    </div>
                    <div className="d-flex">
                        <p className="card-text me-3 ">
                            <small className="text-white">
                                單位：{product.unit}
                            </small>
                        </p>
                        <p>
                            <small className="text-white">
                                類型：{product.category}
                            </small>
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary"
                            onClick={()=>addCart(product.id)}>
                        加入購物車
                    </button>
                </div>
            </div>
        </div>)}
    </>)
};

export default SingleProduct;