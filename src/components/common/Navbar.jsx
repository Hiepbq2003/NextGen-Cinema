import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css"; // Tạo thêm file CSS này

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="main-navbar">
            <div className="navbar-content">
                <ul className="nav-links">
                    <li><Link to="/home">LỊCH CHIẾU</Link></li>
                    <li><Link to="/movies">PHIM</Link></li>
                    <li><Link to="/info/contact">RẠP</Link></li>
                    <li><Link to="/info/terms">GIÁ VÉ</Link></li>
                    <li><Link to="/info/faq">ƯU ĐÃI</Link></li>
                    <li><Link to="/info/about">GIỚI THIỆU</Link></li>
                </ul>

                <div className="nav-right">
                    <button className="btn-buy-now" onClick={() => navigate("/home")}>
                        MUA VÉ NGAY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;