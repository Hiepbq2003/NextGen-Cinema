import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

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
        <div
          style={styles.loginLink}
          onClick={() => navigate("/login")}
        >
          ĐĂNG NHẬP / ĐĂNG KÝ
        </div>
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
    background: "#e5e1d8"
  },
  left: {
    fontSize: "14px"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  loginLink: {
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Header;