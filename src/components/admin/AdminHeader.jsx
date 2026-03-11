import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaUserShield, FaSignOutAlt, FaBars, FaBell } from "react-icons/fa";

const AdminHeader = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Hàm lấy tiêu đề dựa trên đường dẫn hiện tại
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
    <header style={styles.header}>
      <div style={styles.left}>
        <h2 style={styles.pageTitle}>{getPageTitle()}</h2>
      </div>

      <div style={styles.right}>
        {/* Thông báo giả lập */}
        <div style={styles.iconBadge}>
          <FaBell size={18} color="#666" />
          <span style={styles.badgeCount}>3</span>
        </div>

        {/* Khu vực thông tin Admin */}
        <div 
          style={styles.adminProfile}
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <div style={styles.adminInfo}>
            <div style={styles.avatar}>
               <FaUserShield size={20} color="#fff" />
            </div>
            <div style={styles.textDetails}>
              <span style={styles.adminName}>{auth?.fullName || "Quản trị viên"}</span>
              <span style={styles.adminRole}>Admin Hệ Thống</span>
            </div>
          </div>

          {isProfileOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>
                Thông tin cá nhân
              </div>
              <div 
                style={{ ...styles.dropdownItem, color: "#d9534f" }} 
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

const styles = {
  header: {
    height: "70px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderBottom: "1px solid #eee",
  },
  pageTitle: {
    fontSize: "20px",
    margin: 0,
    color: "#333",
    fontWeight: "600"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "25px"
  },
  iconBadge: {
    position: "relative",
    cursor: "pointer"
  },
  badgeCount: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#d9534f",
    color: "white",
    fontSize: "10px",
    borderRadius: "50%",
    padding: "2px 5px"
  },
  adminProfile: {
    position: "relative",
    padding: "5px 0",
    cursor: "pointer"
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  avatar: {
    width: "38px",
    height: "38px",
    background: "#007bff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textDetails: {
    display: "flex",
    flexDirection: "column"
  },
  adminName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },
  adminRole: {
    fontSize: "11px",
    color: "#888"
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "white",
    minWidth: "160px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    border: "1px solid #eee",
    zIndex: 1000
  },
  dropdownItem: {
    padding: "12px 15px",
    fontSize: "14px",
    transition: "background 0.2s",
    "&:hover": {
      background: "#f8f9fa"
    }
  }
};

export default AdminHeader;