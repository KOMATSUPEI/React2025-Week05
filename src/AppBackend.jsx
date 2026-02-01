import {useState} from "react";
import {useEffect} from "react";
import {useRef} from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "./views/Login";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA={
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size:""
};

function App() {
  // 定義表單狀態
  // const [formData,setFormData]=useState({
  //   username:"",
  //   password:""
  // });
  // 定義登入狀態
  const [isAuth,setIsAuth]=useState(false);
  // 定義產品狀態
  const [products,setProducts]=useState([]);
  // 定義分頁狀態
  const [pagination,setPagination]=useState({});
  // modal實體
  const productModalRef=useRef(null);
  // modal類型
  const [modalType,setModalType]=useState("");
  // 定義輸入資料
  const [templateProduct,setTemplateProduct]=useState(INITIAL_TEMPLATE_DATA);

  // 帳號密碼輸入
  // const handleInputChange=(e)=>{
  //   const {name,value}=e.target;
  //   console.log(name,value);
  //   setFormData((preData)=>({
  //     ...preData,
  //     [name]:value
  //   }))
  // };

  // 登入
  // const handleSubmit=async(e)=>{
  //   try{
  //     e.preventDefault();
  //     const res=await axios.post(`${API_BASE}/admin/signin`,formData)
  //     // 取得token
  //     // console.log(res.data.token)
  //     const {token,expired}=res.data;

  //     // 設定 cookie & token
  //     document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
  //     axios.defaults.headers.common['Authorization'] = token;
  //     // 取得產品列表資料
  //     getProducts();
  //     // 切換登入狀態
  //     setIsAuth(true);
  //   }catch(error){
  //     // setIsAuth(false);
  //     console.log(error.response?.data.message);
  //   }
  // };

  // 取得產品
  const getProducts=async(page=1)=>{
    try{
      const res=await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`)
      // console.log(res.data.products);
      setProducts(res.data.products);// 取得產品
      setPagination(res.data.pagination);// 取得分頁
      setIsAuth(true);// 切換登入狀態
      // 取得產品列表資料
    }catch(error){
      console.log(error.response?.data.message);
    }
  };

  // 更新產品
  // const updateProduct=async(id)=>{
  //   let url=`${API_BASE}/api/${API_PATH}/admin/product`;
  //   let method="post";

  //   if(modalType === "edit"){
  //     url=`${API_BASE}/api/${API_PATH}/admin/product/${id}`;
  //     method="put";
  //   };
  //   // 資料結構轉換
  //   const productData={
  //     data:{
  //       ...templateProduct,
  //       origin_price:Number(templateProduct.origin_price),
  //       price:Number(templateProduct.price),
  //       is_enabled:templateProduct.is_enabled ? 1 : 0,
  //       // 移除空連結
  //       imagesUrl:[...templateProduct.imagesUrl.filter(url=>url !== "")]
  //     }
  //   }
  //   try{
  //     const res=await axios[method](url,productData);
  //     console.log(res.data);
  //     getProducts();
  //     closeModal();
  //   }catch(error){
  //     console.log(error.response?.data.message);
  //   }
  // }

  // 刪除產品
  // const delProduct=async(id)=>{
  //   try{
  //     const res=await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
  //     console.log(res.data);
  //     closeModal();
  //     getProducts();
  //   }catch(error){
  //     console.log(error.response?.data.message);
  //   }
  // };
  
  // 登入狀態與權限驗證
  useEffect(()=>{
    // 讀取cookie
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];
    // 取得token才放入header
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
    };
    // Modal實體綁定
    productModalRef.current=new bootstrap.Modal('#productModal',{keyboard: false});
    // Modal 關閉時移除焦點
      document
        .querySelector("#productModal")
        .addEventListener("hide.bs.modal", () => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        });
    // 確認是否登入
    const checkLogin=async()=>{
      try{
        const res=await axios.post(`${API_BASE}/api/user/check`)
        console.log(res.data);
        setIsAuth(true);
        getProducts();
      }catch(error){
        console.log(error.response?.data.message);
      }
    };
    checkLogin();
  },[]);

  // Modal開啟
  const openModal=(type,product)=>{
    setModalType(type);
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product
    });
    productModalRef.current.show();
  };

  // Modal關閉
  const closeModal=()=>{
    productModalRef.current.hide();
  };

  // Modal產品更新
  // const handleModalInputChange=(e)=>{
  //   const {name,value,checked,type}=e.target;
  //   setTemplateProduct((preData)=>({
  //     ...preData,
  //     [name]: type==="checkbox" ? checked : value,
  //   }))
  // };

  // Modal產品圖片
  // const handleModalImageChange=(index,value)=>{
  //   setTemplateProduct((preImage)=>{
  //     const newImage=[...preImage.imagesUrl];
  //     newImage[index]=value;

  //     if(value !== "" && index === newImage.length-1 && newImage.length<5){
  //       newImage.push("");
  //     };

  //     if(value ==="" && newImage.length>1 && newImage[newImage.length-1] === ""){
  //       newImage.pop();
  //     };

  //     return{
  //       ...preImage,
  //       imagesUrl:newImage
  //     }
  //   })
  // };

  // Modal新增圖片
  // const handleAddImage=()=>{
  //   setTemplateProduct((preImage)=>{
  //     const newImage=[...preImage.imagesUrl];
  //     newImage.push("");
  //     return{
  //       ...preImage,
  //       imagesUrl:newImage
  //     }
  //   })
  // };

  // Modal刪除圖片
  // const handleREmoveImage=()=>{
  //   setTemplateProduct((preImage)=>{
  //     const newImage=[...preImage.imagesUrl];
  //     newImage.pop();
  //     return{
  //       ...preImage,
  //       imagesUrl:newImage
  //     }
  //   })
  // };

  // Modal上傳圖片
  // const uploadImage=async (e)=>{
  //   // 只上傳一張圖
  //   const file=e.target.files?.[0]
  //   // 防呆沒選擇圖片上傳
  //   if(!file){
  //     return alert("沒有選擇圖片上傳");
  //   };

  //   try{
  //     const formData=new FormData();
  //     formData.append("file-to-upload",file)

  //     const res=await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`,formData);

  //     setTemplateProduct((pre)=>({
  //       ...pre,
  //       imageUrl:res.data.imageUrl
  //     }));      

  //   }catch(error){
  //     console.log(error.response);
  //   };

  // };

  return (
    <>
    { !isAuth ? (
      <Login getProducts={getProducts} setIsAuth={setIsAuth}/>
      // <div className="container login">
      //   <form className="form-floating" onSubmit={(e)=>handleSubmit(e)}>
      //     <h1 className="mb-5">請先登入</h1>
      //     <div className="form-floating mb-3">
      //       <input 
      //         type="email" 
      //         className="form-control" 
      //         id="username" 
      //         placeholder="name@example.com"
      //         name="username"
      //         value={formData.username}
      //         onChange={(e)=>handleInputChange(e)}
      //       />
      //       <label htmlFor="username">使用者帳號</label>
      //     </div>
      //     <div className="form-floating">
      //       <input 
      //         type="password" 
      //         className="form-control" 
      //         id="password" 
      //         placeholder="Password"
      //         name="password"
      //         value={formData.password}
      //         onChange={(e)=>handleInputChange(e)}
      //       />
      //       <label htmlFor="password">使用者密碼</label>
      //     </div>
      //     <button className="btn btn-warning btn-lg w-100 mt-5" type="submit">登入</button>
      //   </form>
      // </div>
    ) : (
      <div className="container">
        {/*產品列表*/}
        <h2 className="my-3">產品列表</h2>
        <div className="text-end my-4">
          <button
            type="button"
            className="btn btn-warning"
            onClick={()=>openModal("create",INITIAL_TEMPLATE_DATA)}>
            建立新的產品
          </button>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">分類</th>
                    <th scope="col">商品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">編輯</th>
                </tr>
            </thead>
            <tbody>
                {/* 列表渲染 */}
                {
                    products.map(product=>(
                        <tr key={product.id}>
                            <td>{product.category}</td>
                            <th scope="row">{product.title}</th>
                            <td>{product.origin_price}</td>
                            <td>{product.price}</td>
                            <td className={`${product.is_enabled && "text-success"}`}>
                              {product.is_enabled ? "啟用" : "未啟用"}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                <button type="button" 
                                        className="btn btn-outline-primary"
                                        onClick={()=>openModal("edit",product)}>
                                          編輯
                                </button>
                                <button type="button" 
                                        className="btn btn-outline-danger"
                                        onClick={()=>openModal("delete",product)}>
                                          刪除
                                </button>
                              </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <Pagination pagination={pagination} onChangePage={getProducts}/>
      </div>
    ) }

    {/* Modal */}
    <ProductModal
      modalType={modalType}
      templateProduct={templateProduct}
      getProducts={getProducts}
      // handleModalInputChange={handleModalInputChange}
      // handleModalImageChange={handleModalImageChange}
      // handleAddImage={handleAddImage}
      // handleREmoveImage={handleREmoveImage}
      // delProduct={delProduct}
      // updateProduct={updateProduct}
      // uploadImage={uploadImage}
      closeModal={closeModal}
    
    />
    </>
  )
}


export default App
