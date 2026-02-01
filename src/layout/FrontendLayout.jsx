import { Link, Outlet } from "react-router";

function FrontendLayout(){
    return (<>
        <header className="mb-5 bg-body-tertiary">
            <ul className="nav nav-tabs justify-content-center">
                <li className="nav-item">
                    <Link className="nav-link" to="/">首頁</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/products">產品列表</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/cart">購物車</Link>
                </li>
            </ul>
        </header>
        <main>
            <Outlet></Outlet>
        </main>
        <footer className="mt-5 text-center bg-body-tertiary">
            <p className="mb-0">© 2025 React主線任務五</p>
        </footer>
    </>)
};

export default FrontendLayout;