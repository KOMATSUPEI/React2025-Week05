import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({getProducts,setIsAuth}){
    // 定義表單狀態
      const [formData,setFormData]=useState({
        username:"",
        password:""
      });

      
    // 帳號密碼輸入
    const handleInputChange=(e)=>{
        const {name,value}=e.target;
        console.log(name,value);
        setFormData((preData)=>({
        ...preData,
        [name]:value
        }))
    };

    // 登入
    const handleSubmit=async(e)=>{
        try{
        e.preventDefault();
        const res=await axios.post(`${API_BASE}/admin/signin`,formData)
        // 取得token
        // console.log(res.data.token)
        const {token,expired}=res.data;

        // 設定 cookie & token
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        axios.defaults.headers.common['Authorization'] = token;
        // 取得產品列表資料
        getProducts();
        // 切換登入狀態
        setIsAuth(true);
        }catch(error){
        // setIsAuth(false);
        console.log(error.response?.data.message);
        }
    };



    return (
    <>
    <div className="container login">
        <form className="form-floating" onSubmit={(e)=>handleSubmit(e)}>
          <h1 className="mb-5">請先登入</h1>
          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="username" 
              placeholder="name@example.com"
              name="username"
              value={formData.username}
              onChange={(e)=>handleInputChange(e)}
            />
            <label htmlFor="username">使用者帳號</label>
          </div>
          <div className="form-floating">
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={(e)=>handleInputChange(e)}
            />
            <label htmlFor="password">使用者密碼</label>
          </div>
          <button className="btn btn-warning btn-lg w-100 mt-5" type="submit">登入</button>
        </form>
    </div>
    
    </>);
}

export default Login;