import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaUserCircle, FaSignOutAlt, FaUser, FaChevronDown } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="header-container">
      {/* Logo bên trái */}
      <div className="header-left" onClick={() => navigate("/")}>
        <span className="logo-text">NEXTGEN CINEMA</span>
      </div>

      {/* Menu/User bên phải */}
      <div className="header-right">
        {auth ? (
          <div 
            className="user-section-wrapper"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="user-section">
              <FaUserCircle className="user-avatar-icon" />
              <span className="user-name-text">
                {auth.fullName || auth.username}
              </span>
              <FaChevronDown className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu shadow-lg">
                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                  <FaUser className="menu-icon" /> 
                  <span>Thông tin cá nhân</span>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <FaSignOutAlt className="menu-icon" /> 
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-login-header" onClick={() => navigate("/login")}>
            ĐĂNG NHẬP
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;