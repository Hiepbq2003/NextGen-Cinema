import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        TIN MỚI & ƯU ĐÃI
      </div>

      <div style={styles.right}>
        {auth ? (
    
          <div 
            style={styles.userSection} 
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div style={styles.userInfo}>
              <FaUserCircle size={24} style={{ color: "#d9534f" }} />
              <span style={styles.userName}>{auth.fullName || auth.username}</span>
            </div>

            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>
                  <FaUser style={styles.icon} /> Thông tin cá nhân
                </div>
                <div style={styles.dropdownItem} onClick={handleLogout}>
                  <FaSignOutAlt style={styles.icon} /> Đăng xuất
                </div>
              </div>
            )}
          </div>
        ) : (
       

          <div
            style={styles.loginLink}
            onClick={() => navigate("/login")}
          >
            ĐĂNG NHẬP / ĐĂNG KÝ
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 20px",
    background: "#e5e1d8",
    position: "relative",
    zIndex: 1000
  },
  left: {
    fontSize: "14px",
    fontWeight: "500"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  loginLink: {
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px"
  },
 
  userSection: {
    position: "relative",
    cursor: "pointer",
    padding: "5px 0"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  userName: {
    fontWeight: "600",
    fontSize: "14px"
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    minWidth: "180px",
    boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    padding: "8px 0",
    marginTop: "5px",
    border: "1px solid #ddd"
  },
  dropdownItem: {
    padding: "10px 15px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#333",
    transition: "background 0.2s",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  icon: {
    fontSize: "16px",
    color: "#666"
  }
};

export default Header;