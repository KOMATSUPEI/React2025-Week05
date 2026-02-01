import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products(){
    const [products,setProducts]=useState([]);
    const navigate=useNavigate(); 

    // 取得商品列表資料
    useEffect(()=>{
        const getProducts=async()=>{
            try{
                const res=await axios.get(`${API_BASE}/api/${API_PATH}/products`);
                // console.log(res.data.products);
                setProducts(res.data.products);
            }catch(error){
                console.log(error.response);
            }
        }
        getProducts();
    },[]);
    // 查看商品詳情
    const handleView=(id)=>{
        navigate(`/product/${id}`);
        // try{
        //     const res=await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        //     console.log(res.data.product);
        //     navigate(`/product/${id}`,{
        //         state: { productData: res.data.product }
        //     })
        // }catch(error){
        //     console.log(error.response);
        // }
    };

    return (
    <>
        <div className="container">
            <div className="row">
                {
                    products.map(product=>(
                        <div className="col-md-4 mb-3" key={product.id}>
                            <div className="card h-100 bg-success text-white bg-opacity-75">
                                <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">
                                        {product.description}
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
                                        <p className="card-text me-3">
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
                                            onClick={()=>handleView(product.id)}>
                                        飲品詳情
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>)
};

export default Products;