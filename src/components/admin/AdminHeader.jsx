import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaUserShield, FaSignOutAlt, FaBars, FaBell, FaHome } from "react-icons/fa";
import "../../asset/style/AdminHeader.css"; 

const AdminHeader = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const contentElement = document.querySelector('.admin-content');
      if (!contentElement) return;

      const currentScrollY = contentElement.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    const contentElement = document.querySelector('.admin-content');
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollY]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Bảng điều khiển";
    if (path.includes("/admin/movies")) return "Quản lý Phim";
    if (path.includes("/admin/rooms")) return "Quản lý Phòng chiếu";
    if (path.includes("/admin/showtimes")) return "Lịch chiếu hệ thống";
    return "Hệ thống Quản trị";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`admin-header ${!isVisible ? "hidden" : ""}`}>
      <div className="admin-header-left">
        <h2 className="admin-page-title">{getPageTitle()}</h2>
      </div>

      <div className="admin-header-right">

        <div 
          className="admin-home-btn"
          onClick={() => navigate("/home")}
          title="Về trang chủ khách hàng"
        >
          <FaHome size={18} color="#666" />
          <span className="admin-home-text">Trang Chủ</span>
        </div>

        <div className="admin-icon-badge">
          <FaBell size={18} color="#666" />
          <span className="admin-badge-count">3</span>
        </div>

        {/* PROFILE ADMIN */}
        <div 
          className="admin-profile"
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <div className="admin-info">
            <div className="admin-avatar">
               <FaUserShield size={20} color="#fff" />
            </div>
            <div className="admin-text-details">
              <span className="admin-name">{auth?.fullName || "Quản trị viên"}</span>
              <span className="admin-role">Admin Hệ Thống</span>
            </div>
          </div>

          {isProfileOpen && (
            <div className="admin-dropdown">
              <div className="admin-dropdown-item" onClick={() => navigate("/profile")}>
                Thông tin cá nhân
              </div>
              <div 
                className="admin-dropdown-item logout" 
                onClick={handleLogout}
              >
                <FaSignOutAlt style={{ marginRight: "8px" }} /> Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;