import { useState, useEffect } from 'react';
import { getAllVouchers } from '../../services/api/VoucherApi'; // Giả sử bạn đã có hàm này
import "./PromotionSection.css";

const PromotionSection = () => {
    const [vouchers, setVouchers] = useState([]);

    const defaultPromoImages = [
        "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/122025/ONL_N_O_240x201.png",
        "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2026/022026/MOC_KHOA_N_O_240x201.png",
        "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2026/022026/240x201_37_.jpg",
        "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/102025/240x201_11_.jpg",
        "https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2025/072025/CGV---240x201.jpg"
    ];

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await getAllVouchers();
           
                const activeVouchers = res.filter(v => v.status === 1).slice(0, 3);
                setVouchers(activeVouchers);
            } catch (error) {
                console.error("Lỗi tải voucher:", error);
            }
        };
        fetchVouchers();
    }, []);

    return (
        <div className="promotion">
            <h2>KHUYẾN MÃI</h2>
            <div className="promo-list">
                {vouchers.length > 0 ? (
                    vouchers.map((voucher, index) => (
                        <div key={voucher.id} className="promo-item">
                            <img 
                                src={defaultPromoImages[index % defaultPromoImages.length]} 
                                alt={voucher.code} 
                            />
                            <div className="promo-info">
                                <h3>{voucher.code}</h3>
                                <p>Giảm ngay {voucher.discountPercent}%</p>
                            </div>
                        </div>
                    ))
                ) : (

                    defaultPromoImages.map((img, index) => (
                        <img key={index} src={img} alt="Promotion" />
                    ))
                )}
            </div>
        </div>
    );
};

export default PromotionSection;