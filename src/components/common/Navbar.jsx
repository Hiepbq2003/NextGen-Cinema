import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import '@/asset/style/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);

    return (
        <div className="main-navbar">
            <div className="navbar-content">
                <ul className="nav-links">
                    <li><Link to="/schedule">LỊCH CHIẾU</Link></li>
                    <li
                        className="dropdown-container"
                        onMouseEnter={() => setIsMoviesDropdownOpen(true)}
                        onMouseLeave={() => setIsMoviesDropdownOpen(false)}
                    >
                        <span className="nav-link-text">PHIM</span>
                        {isMoviesDropdownOpen && (
                            <div className="custom-movies-dropdown">
                                <Link to="/movies" className="dropdown-items">Phim đang chiếu</Link>
                                <Link to="/movies/upcoming" className="dropdown-items">Phim sắp chiếu</Link>
                            </div>
                        )}
                    </li>
                    <li><Link to="/info/contact">RẠP</Link></li>
                    <li><Link to="/info/terms">GIÁ VÉ</Link></li>
                    <li><Link to="/info/faq">ƯU ĐÃI</Link></li>
                    <li><Link to="/info/about">GIỚI THIỆU</Link></li>
                </ul>

                <div className="nav-right">
                    <button
                        className="btn-buy-now"
                        onClick={() => navigate("/schedule")}
                    >
                        🎬 MUA VÉ NGAY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;