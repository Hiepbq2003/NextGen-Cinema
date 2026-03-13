import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StaffLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Staff Panel</h2>

        <div style={styles.menuItem} onClick={() => navigate("/staff")}>
          Dashboard
        </div>

        <div style={styles.menuItem} onClick={() => navigate("/staff/checkin")}>
          Soát vé
        </div>

        <div style={styles.menuItem} onClick={() => navigate("/staff/support")}>
          Hỗ trợ giao dịch
        </div>

        <div style={styles.logout} onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* Page content */}
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },

  sidebar: {
    width: "220px",
    background: "#1f2937",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  logo: {
    marginBottom: "20px",
  },

  menuItem: {
    cursor: "pointer",
    padding: "10px",
    borderRadius: "6px",
  },

  logout: {
    marginTop: "auto",
    cursor: "pointer",
    padding: "10px",
    background: "#e71a0f",
    borderRadius: "6px",
    textAlign: "center",
  },

  content: {
    flex: 1,
    padding: "30px",
    background: "#f5f5f5",
  },
};

export default StaffLayout;