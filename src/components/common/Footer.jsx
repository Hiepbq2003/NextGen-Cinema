import { FaFacebook, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import '@/asset/style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        <div className="footer-column">
          <h2 className="footer-logo">NEXTGEN <span>CINEMA</span></h2>
          <p className="footer-desc">
            Trải nghiệm điện ảnh đỉnh cao với công nghệ chiếu phim hiện đại nhất.
            Nơi kết nối đam mê và những khoảnh khắc giải trí tuyệt vời.
          </p>
        </div>

        <div className="footer-column">
          <h3>CHÍNH SÁCH</h3>
          <ul>
            <li><Link to="/info/about">Giới thiệu</Link></li>
            <li><Link to="/info/contact">Liên hệ</Link></li>
            <li><Link to="/info/terms">Điều khoản chung</Link></li>
            <li><Link to="/info/privacy">Chính sách bảo mật</Link></li>
            <li><Link to="/info/refund">Chính sách hoàn tiền</Link></li>
            <li><Link to="/info/faq">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>HỖ TRỢ</h3>
          <ul className="contact-info">
            <li><FaPhoneAlt /> Hotline: 1900 1234</li>
            <li><FaEnvelope /> Email: support@nextgen.vn</li>
            <li><FaMapMarkerAlt /> Hải Phòng, Việt Nam</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>KẾT NỐI</h3>
          <div className="social-links">
            <a href="https://facebook.com" className="fb"><FaFacebook /></a>
            <a href="https://instagram.com" className="ig"><FaInstagram /></a>
            <a href="https://youtube.com" className="yt"><FaYoutube /></a>
          </div>
          <p className="footer-app-text">Tải ứng dụng ngay:</p>
          <div className="app-download">
            <button className="btn-app">Google Play</button>
            <button className="btn-app">App Store</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 NEXTGEN CINEMA. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;