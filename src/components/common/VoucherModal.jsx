import React from "react";
import '../../asset/style/VoucherModalStyle.css';

const VoucherModal = ({
                          isOpen,
                          onClose,
                          vouchers,
                          onApply,
                          selectedVoucher
                      }) => {

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const isExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date();
    };

    return (
        <div className="voucher-overlay">
            <div className="voucher-modal">
                <div className="voucher-header">
                    <div className="voucher-header-left">
                        <span className="voucher-icon">🎟</span>
                        <h2 className="voucher-header-title">Chọn Voucher</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="voucher-list-container">
                    <div className="voucher-list">
                        {vouchers.map(voucher => {
                            const expired = isExpired(voucher.expiryDate);
                            const outOfStock = voucher.usedCount >= voucher.quantity;
                            const isSelected = selectedVoucher?.id === voucher.id;

                            return (
                                <div
                                    key={voucher.id}
                                    className={`voucher-card 
                                    ${expired || outOfStock ? "disabled" : ""}
                                    ${isSelected ? "selected" : ""}
                                `}
                                >
                                    {/* LEFT AREA: Hiển thị ảnh voucher */}
                                    <div className="voucher-left">
                                        <img
                                            src={voucher.imageUrl || "https://img.freepik.com/free-vector/special-offer-modern-sale-banner-template_1017-20667.jpg"}
                                            alt="voucher-thumb"
                                            className="voucher-image"
                                            onError={(e) => {
                                                e.target.src = "https://img.freepik.com/free-vector/special-offer-modern-sale-banner-template_1017-20667.jpg";
                                            }}
                                        />
                                    </div>

                                    {/* RIGHT CONTENT */}
                                    <div className="voucher-content">
                                        <h3 className="voucher-name">
                                            {voucher.name || voucher.code}
                                        </h3>

                                        <p className="voucher-title">
                                            Giảm {voucher.discountPercent}%
                                            (Tối đa {voucher.maxDiscountAmount.toLocaleString()}đ)
                                        </p>

                                        <p className="voucher-condition">
                                            Đơn tối thiểu {voucher.minOrderValue.toLocaleString()}đ
                                        </p>

                                        <p className="voucher-expiry">
                                            HSD: {formatDate(voucher.expiryDate)}
                                        </p>

                                        <div className="voucher-action">
                                            {expired ? (
                                                <span className="voucher-status expired">Hết hạn</span>
                                            ) : outOfStock ? (
                                                <span className="voucher-status expired">Hết lượt</span>
                                            ) : (
                                                <button
                                                    className="apply-btn"
                                                    disabled={isSelected}
                                                    onClick={() => onApply(voucher)}
                                                >
                                                    {isSelected ? "Đã chọn" : "Áp dụng"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;