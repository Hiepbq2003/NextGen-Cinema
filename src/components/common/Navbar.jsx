import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.navbar}>
            <div style={styles.logo}>CGV</div>

            <div style={styles.menu}>
                <div>PHIM</div>
                <div>RẠP CGV</div>
                <div>THÀNH VIÊN</div>
                <div>CULTUREPLEX</div>
            </div>

            <div 
                style={styles.buyBtn}
                onClick={() => navigate("/home")}
            >
                MUA VÉ NGAY
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 40px",
        background: "#e8e1d6",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000"
    },
    logo: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "red"
    },
    menu: {
        display: "flex",
        gap: "40px",
        fontWeight: "600",
        cursor: "pointer"
    },
    buyBtn: {
        background: "red",
        color: "#fff",
        padding: "10px 18px",
        fontWeight: "600",
        cursor: "pointer",
        borderRadius: "6px"
    }
};

export default Navbar;