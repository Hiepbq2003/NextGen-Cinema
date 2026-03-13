import React from "react";
import { FaTicketAlt, FaRegClock, FaInfoCircle } from 'react-icons/fa';
import '../../asset/style/VoucherModalStyle.css';

const VoucherModal = ({ isOpen, onClose, vouchers, onApply, selectedVoucher, totalPrice }) => {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    return (
        <div className="voucher-overlay" onClick={onClose}>
            <div className="voucher-modal" onClick={e => e.stopPropagation()}>
                <div className="voucher-header">
                    <div className="voucher-header-left">
                        <FaTicketAlt className="header-icon-main" />
                        <h2 className="voucher-header-title">Ưu đãi của bạn</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="voucher-list-container">
                    {vouchers.length === 0 ? (
                        <div className="empty-voucher">Hiện chưa có mã giảm giá nào dành cho bạn.</div>
                    ) : (
                        <div className="voucher-list">
                            {vouchers.map(voucher => {
                                const isExpired = new Date(voucher.expiryDate) < new Date();
                                const outOfStock = voucher.usedCount >= voucher.quantity;
                                const isSelected = selectedVoucher?.id === voucher.id;
                                const notReachedMin = totalPrice < voucher.minOrderValue;
                                const isDisabled = isExpired || outOfStock;

                                return (
                                    <div key={voucher.id} 
                                        className={`voucher-card ${isDisabled ? "disabled" : ""} ${isSelected ? "selected" : ""}`}
                                    >
                                        <div className="voucher-left">
                                            <img
                                                src={voucher.imageUrl || "https://img.freepik.com/free-vector/special-offer-modern-sale-banner-template_1017-20667.jpg"}
                                                alt="voucher-thumb"
                                                className="voucher-image"
                                            />
                                            <div className="ticket-cut"></div>
                                        </div>

                                        <div className="voucher-content">
                                            <div className="voucher-top-info">
                                                <h3 className="voucher-name">{voucher.code}</h3>
                                                <span className="voucher-percent">Giảm {voucher.discountPercent}%</span>
                                            </div>

                                            <div className="voucher-details">
                                                <p><FaInfoCircle /> Tối đa <strong>{voucher.maxDiscountAmount.toLocaleString()}đ</strong></p>
                                                <p className={notReachedMin ? "condition-alert" : ""}>
                                                    <FaTicketAlt /> Đơn tối thiểu {voucher.minOrderValue.toLocaleString()}đ
                                                </p>
                                                <p className="voucher-expiry"><FaRegClock /> HSD: {formatDate(voucher.expiryDate)}</p>
                                            </div>

                                            <div className="voucher-action">
                                                {isExpired ? (
                                                    <span className="voucher-status danger">Đã hết hạn</span>
                                                ) : outOfStock ? (
                                                    <span className="voucher-status danger">Hết lượt dùng</span>
                                                ) : (
                                                    <button
                                                        className={`apply-btn ${isSelected ? "active" : ""}`}
                                                        onClick={() => onApply(voucher)}
                                                    >
                                                        {isSelected ? "Đang chọn" : "Áp dụng"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;