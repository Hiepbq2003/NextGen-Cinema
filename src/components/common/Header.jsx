import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Dropdown, Nav } from "react-bootstrap";
import {
  FaUserCircle, FaSignOutAlt, FaUser, FaChevronDown,
  FaUserShield, FaUserTie, FaTicketAlt, FaBell
} from "react-icons/fa";
import '../../asset/style/Header.css';

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  let timeoutId = null;

  // Giữ logic hover
  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
      <header className={`header-container ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">

          <div className="header-left" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <span className="logo-text">NEXTGEN<span className="logo-highlight">CINEMA</span></span>
          </div>

          <div className="header-right">
            {auth && (
                <div className="header-icon-btn">
                  <FaBell />
                  <span className="notification-badge"></span>
                </div>
            )}

            <div className="divider-vertical"></div>

            {auth ? (
                /* SỬ DỤNG REACT BOOTSTRAP DROPDOWN */
                <Dropdown
                    show={isDropdownOpen}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="user-section-wrapper"
                >
                  <Dropdown.Toggle as="div" className="user-section" id="dropdown-user">
                    <FaUserCircle className="user-avatar-icon" />
                    <div className="user-info-brief">
                      <span className="user-name-text">{auth.fullName || auth.username}</span>
                      <span className="user-role-text">
                    {(auth.role || '').replace('ROLE_', '')}
                  </span>
                    </div>
                    <FaChevronDown className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu renderOnMount align="end" className="shadow-lg border-0 dropdown-menu-custom">
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      <FaUser className="menu-icon" />
                      <span>Thông tin cá nhân</span>
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate("/my-tickets")}>
                      <FaTicketAlt className="menu-icon" />
                      <span>Vé của tôi</span>
                    </Dropdown.Item>

                    {(auth.role === 'ADMIN' || auth.role === 'ROLE_ADMIN') && (
                        <Dropdown.Item className="admin-item" onClick={() => navigate("/admin")}>
                          <FaUserShield className="menu-icon" />
                          <span>Trang Quản Trị</span>
                        </Dropdown.Item>
                    )}

                    {(auth.role === 'STAFF' || auth.role === 'ROLE_STAFF') && (
                        <Dropdown.Item className="staff-item" onClick={() => navigate("/staff/dashboard")}>
                          <FaUserTie className="menu-icon" />
                          <span>Cổng Nhân Viên</span>
                        </Dropdown.Item>
                    )}

                    <Dropdown.Divider />

                    <Dropdown.Item className="logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="menu-icon" />
                      <span>Đăng xuất</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            ) : (
                <button className="btn-login-header" onClick={() => navigate("/login")}>
                  ĐĂNG NHẬP
                </button>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;