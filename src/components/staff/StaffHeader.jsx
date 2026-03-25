import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaUserTie, FaSignOutAlt, FaBell, FaHome } from "react-icons/fa";
import "../../asset/style/AdminHeader.css"; 

const StaffHeader = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/staff/dashboard")) return "Tổng quan Dashboard";
    if (path.includes("/staff/bookings")) return "Quản lý & Soát vé";
    if (path.includes("/staff/pos")) return "Bán vé tại quầy (POS)";
    return "Cổng Nhân Viên";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h2 className="admin-page-title">{getPageTitle()}</h2>
      </div>

      <div className="admin-header-right">
        <div 
          className="admin-home-btn"
          onClick={() => navigate("/home")}
          title="Về trang chủ"
        >
          <FaHome size={18} color="#666" />
          <span className="admin-home-text">Trang Chủ</span>
        </div>

        <div className="admin-icon-badge">
          <FaBell size={18} color="#666" />
          <span className="admin-badge-count">1</span>
        </div>

        {/* PROFILE STAFF */}
        <div 
          className="admin-profile"
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <div className="admin-info">
            <div className="admin-avatar">
               <FaUserTie size={20} color="#fff" />
            </div>
            <div className="admin-text-details">
              <span className="admin-name">{auth?.fullName || "Nhân viên"}</span>
              <span className="admin-role">Staff Quầy Vé</span>
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

export default StaffHeader;