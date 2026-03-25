import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div>
      <h2>Liên Hệ</h2>
      <p>Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp từ quý khách hàng.</p>
      
      
      <div style={{ marginTop: '30px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.9751510440665!2d106.67961817502582!3d20.832709880768007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7115f37d12fb%3A0xad7a0c64ee9d474c!2zQUVPTiBNQUxMIEjhuqNpIFBow7JuZyBMw6ogQ2jDom4!5e0!3m2!1sen!2s!4v1773097122887!5m2!1sen!2s" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ NextGen Cinema"
        ></iframe>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p><FaMapMarkerAlt /> <strong>Địa chỉ:</strong> Tầng 5, TTTM NextGen, Hải Phòng.</p>
        <p><FaPhoneAlt /> <strong>Hotline:</strong> 1900 1234 (9:00 - 22:00 hàng ngày).</p>
        <p><FaEnvelope /> <strong>Email:</strong> support@nextgen.vn</p>
      </div>

      <h4 style={{ marginTop: '30px' }}>Gửi tin nhắn cho chúng tôi</h4>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Họ và tên" 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
        />
        <textarea 
          placeholder="Nội dung" 
          rows="4" 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
        ></textarea>
        <button 
          type="button" 
          style={{ background: '#e71a0f', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Gửi Liên Hệ
        </button>
      </form>
    </div>
  );
};

export default Contact;