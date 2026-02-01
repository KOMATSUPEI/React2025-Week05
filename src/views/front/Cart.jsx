import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart(){
    const [cart,setCart]=useState([]);
    // 取得購物車資料
    useEffect(()=>{
        const getCart=async()=>{
            try{
                const res=await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
                // console.log(res.data.data);
                setCart(res.data.data);
            }catch(error){
                console.log(error.data.data);
            }
        };
        getCart();
    },[])
    // 更新購物車數量
    const updateCart=async(cartId,productId,qty=1)=>{
        if (qty <= 0) {
        alert("商品數量不可小於 1");
        return; 
        }
        try{
            const data={
                product_id: productId,
                qty
            };
            const res=await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`,{data});
            console.log(res);
            // 重新取得購物車資料
            const resUpdate=await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(resUpdate.data.data);
        }catch(error){
            console.log(error.response);
        }
    };
    // 刪除單筆商品
    const delCart=async(cartId)=>{
        try{
            const res=await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
            console.log(res);
            // 重新取得購物車資料
            const resUpdate=await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(resUpdate.data.data);
        }catch(error){
            console.log(error.response);
        }
    };
    // 清空購物車
    const clearCart=async()=>{
        try{
            const res=await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
            console.log(res);
            // 重新取得購物車資料
            const resUpdate=await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(resUpdate.data.data);
        }catch(error){
            console.log(error.response);
        }
    };

    return (
    <>
        <div className="container">
            <h2>購物車列表</h2>
            <div className="text-end mt-4">
                <button 
                    type="button" 
                    className="btn btn-outline-danger"
                    onClick={()=>clearCart()}
                >
                清空購物車
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">品名</th>
                    <th scope="col">數量/單位</th>
                    <th scope="col">小計</th>
                </tr>
                </thead>
                <tbody>
                    {
                        cart?.carts?.map(cartItem=>(
                            <tr key={cartItem.id}>
                                <td>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger btn-sm" 
                                        onClick={()=>delCart(cartItem.id)}
                                    >
                                        刪除
                                    </button>
                                </td>
                                <th scope="row">
                                    {cartItem.product.title}
                                </th>
                                <td>
                                    <div className="input-group input-group-sm mb-3">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        aria-label="Sizing example input" 
                                        aria-describedby="inputGroup-sizing-sm"
                                        value={cartItem.qty}
                                        onChange={(e)=>updateCart(cartItem.id,cartItem.product_id,Number(e.target.value))}
                                    />
                                    <span className="input-group-text" id="inputGroup-sizing-sm">
                                        {cartItem.product.unit}
                                    </span>
                                    </div>
                                </td>
                                <td className="text-end">
                                    {currency(cartItem.final_total)}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                <tr>
                    <td className="text-end" colSpan="3">
                    總計
                    </td>
                    <td className="text-end">
                        {currency(cart?.final_total)}
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    </>)
};

export default Cart;