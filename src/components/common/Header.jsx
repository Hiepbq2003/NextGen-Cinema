import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">

      <div className="menu">
        <div className="menu-item" onClick={() => navigate("/movies")}>
          PHIM
        </div>

        <div className="menu-item" onClick={() => navigate("/cinemas")}>
          RẠP NEXT_GEN
        </div>

        <div className="menu-item" onClick={() => navigate("/member")}>
          THÀNH VIÊN
        </div>

        <div className="menu-item" onClick={() => navigate("/cultureplex")}>
          CULTUREPLEX
        </div>
      </div>

      <div className="right" onClick={() => navigate("/login")}>
        ĐĂNG NHẬP / ĐĂNG KÝ
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
  },
  left: {
    fontSize: "14px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  loginLink: {
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Header;
