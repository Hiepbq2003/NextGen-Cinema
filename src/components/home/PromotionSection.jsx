import { useState, useEffect } from 'react';
import { getActiveVouchers } from '../../services/api/VoucherApi';
import '../../asset/style/PromotionSection.css';

const PromotionSection = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setLoading(true);
    
                const res = await getActiveVouchers();
                
                setVouchers(res.slice(0, 10));
            } catch (error) {
                console.error("Lỗi tải voucher:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    if (loading) return null;

    return (
        <div className="promotion">
            <h2 className="promo-title">KHUYẾN MÃI</h2>
            <div className="promo-list">
                {vouchers.length > 0 ? (
                    vouchers.map((voucher, index) => (
                        <div key={voucher.id} className="promo-item">
                            <div className="promo-image-wrapper">
                                <img 
                     
                                    src={voucher.imageUrl || defaultPromoImages[index % defaultPromoImages.length]} 
                                    alt={voucher.code}
                                    onError={(e) => {
                       
                                        e.target.src = defaultPromoImages[index % defaultPromoImages.length];
                                    }}
                                />
                            </div>
                            <div className="promo-info">
                                <h3>{voucher.code}</h3>
                                <p>Giảm ngay {voucher.discountPercent}%</p>
                                <span className="promo-date">HSD: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    ))
                ) : (
    
                    defaultPromoImages.map((img, index) => (
                        <div key={index} className="promo-item">
                            <img src={img} alt="Promotion Default" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PromotionSection;