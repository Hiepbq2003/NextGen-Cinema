import { NavLink, Outlet } from "react-router-dom";
import '@/asset/style/Info.css';

const InfoLayout = () => {
  return (
    <div className="policy-container">
      <div className="policy-wrapper">
        <aside className="policy-sidebar">
          <h3>THÔNG TIN</h3>
          <nav>
            <NavLink to="/info/about" className={({ isActive }) => isActive ? "active" : ""}>
              Giới Thiệu
            </NavLink>
            <NavLink to="/info/contact" className={({ isActive }) => isActive ? "active" : ""}>
              Liên Hệ
            </NavLink>
            
            <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></div>
            
            <NavLink to="/info/terms" className={({ isActive }) => isActive ? "active" : ""}>
              Điều Khoản Chung
            </NavLink>
            <NavLink to="/info/privacy" className={({ isActive }) => isActive ? "active" : ""}>
              Chính Sách Bảo Mật
            </NavLink>
            <NavLink to="/info/refund" className={({ isActive }) => isActive ? "active" : ""}>
              Chính Sách Hoàn Tiền
            </NavLink>
            <NavLink to="/info/faq" className={({ isActive }) => isActive ? "active" : ""}>
              Câu Hỏi Thường Gặp
            </NavLink>
          </nav>
        </aside>

        <main className="policy-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InfoLayout;