import { useState, useEffect } from 'react';
import { getAllVouchers, createVoucher, updateVoucher, deleteVoucher, getVoucherUsages } from '../../services/api/VoucherApi';
import { toast } from 'react-toastify';

const AdminVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);

    const [usageModalOpen, setUsageModalOpen] = useState(false);
    const [voucherUsages, setVoucherUsages] = useState([]);
    const [selectedVoucherCode, setSelectedVoucherCode] = useState('');

    const [formData, setFormData] = useState({
        code: '',
        discountPercent: '',
        maxDiscountAmount: '',
        minOrderValue: '',
        quantity: '',
        startDate: '',
        expiryDate: '',
        imageUrl: '',
    });

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await getAllVouchers();
            setVouchers(res || []);
        } catch (error) {
            toast.error("Không thể tải danh sách Voucher!");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    const openModal = (voucher = null) => {
        if (voucher) {
            setEditingVoucher(voucher);
            setFormData({
                code: voucher.code,
                discountPercent: voucher.discountPercent || '',
                maxDiscountAmount: voucher.maxDiscountAmount ?? '',
                minOrderValue: voucher.minOrderValue ?? '',
                quantity: voucher.quantity,
                startDate: formatDateTimeForInput(voucher.startDate),
                expiryDate: formatDateTimeForInput(voucher.expiryDate),
                imageUrl: voucher.imageUrl || '',
            });
        } else {
            setEditingVoucher(null);
            setFormData({
                code: '',
                discountPercent: '',
                maxDiscountAmount: '',
                minOrderValue: '',
                quantity: '',
                startDate: '',
                expiryDate: '',
                imageUrl: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleViewUsages = async (voucher) => {
        try {
            const res = await getVoucherUsages(voucher.id);
            setVoucherUsages(res || []);
            setSelectedVoucherCode(voucher.code);
            setUsageModalOpen(true);
        } catch (error) {
            toast.error("Không thể tải lịch sử sử dụng!");
        }
    };

    const validateForm = () => {
        if (!formData.code.trim()) {
            toast.error("Vui lòng nhập mã Voucher"); return false;
        }
        if (/\s/.test(formData.code)) {
            toast.error("Mã Voucher không được chứa khoảng trắng"); return false;
        }
        if (!formData.discountPercent || formData.discountPercent <= 0 || formData.discountPercent > 100) {
            toast.error("Phần trăm giảm giá phải từ 1 đến 100"); return false;
        }
        if (!formData.quantity || formData.quantity <= 0) {
            toast.error("Số lượng phải lớn hơn 0"); return false;
        }
        if (formData.minOrderValue === '' || formData.minOrderValue === null || Number(formData.minOrderValue) < 0) {
            toast.error("Vui lòng nhập Đơn tối thiểu hợp lệ (lớn hơn hoặc bằng 0)"); return false;
        }
        if (formData.maxDiscountAmount === '' || formData.maxDiscountAmount === null || Number(formData.maxDiscountAmount) < 0) {
            toast.error("Vui lòng nhập Giảm tối đa hợp lệ (lớn hơn hoặc bằng 0)"); return false;
        }
        if (!formData.startDate) {
            toast.error("Vui lòng chọn Thời gian bắt đầu"); return false;
        }
        if (!formData.expiryDate) {
            toast.error("Vui lòng chọn Thời gian kết thúc"); return false;
        }

        const start = new Date(formData.startDate);
        const end = new Date(formData.expiryDate);
        const now = new Date();

        if (start >= end) {
            toast.error("Thời gian kết thúc phải lớn hơn Thời gian bắt đầu"); return false;
        }
        if (!editingVoucher && start < now) {
            toast.error("Thời gian bắt đầu không được ở trong quá khứ"); return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...formData,
            discountPercent: Number(formData.discountPercent),
            quantity: Number(formData.quantity),
            minOrderValue: Number(formData.minOrderValue),
            maxDiscountAmount: Number(formData.maxDiscountAmount)
        };

        try {
            if (editingVoucher) {
                await updateVoucher(editingVoucher.id, payload);
                toast.success("Cập nhật Voucher thành công!");
            } else {
                await createVoucher(payload);
                toast.success("Thêm Voucher mới thành công!");
            }
            setIsModalOpen(false);
            fetchVouchers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn ngừng hoạt động mã Voucher này?")) {
            try {
                await deleteVoucher(id);
                toast.success("Cập nhật trạng thái thành công");
                fetchVouchers();
            } catch (error) {
                toast.error("Thao tác thất bại!");
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2>🎟️ Quản lý Voucher</h2>
                <button className="btn-add" onClick={() => openModal()}>➕ Thêm Voucher</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Mã Voucher</th>
                        <th>Giảm giá (%)</th>
                        <th>Số lượng / Đã dùng</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((v) => (
                        <tr key={v.id}>
                            <td>
                                <img 
                                    src={v.imageUrl || "https://img.freepik.com/free-vector/special-offer-modern-sale-banner-template_1017-20667.jpg"} 
                                    alt="thumb" 
                                    style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </td>
                            <td><strong>{v.code}</strong></td>
                            <td>{v.discountPercent}%</td>
                            <td>{v.quantity} / {v.usedCount}</td>
                            <td>{new Date(v.expiryDate).toLocaleDateString('vi-VN')}</td>
                            <td>
                                <span className={`status-badge ${v.status === 1 ? 'status-active' : 'status-inactive'}`}>
                                    {v.status === 1 ? 'Đang hoạt động' : 'Ngừng / Hết hạn'}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button className="btn-edit" onClick={() => openModal(v)}>Sửa</button>
                                    <button className="btn-info" onClick={() => handleViewUsages(v)}>Lịch sử</button>
                                    <button className="btn-delete" onClick={() => handleDelete(v.id)}>Ngừng hoạt động</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>{editingVoucher ? "Cập nhật Voucher" : "Thêm Voucher mới"}</h3>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Link ảnh Voucher</label>
                                <input
                                    className="form-input"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/banner.jpg"
                                />
                                {formData.imageUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        <label style={{ fontSize: '12px', color: '#666' }}>Xem trước:</label>
                                        <img 
                                            src={formData.imageUrl} 
                                            alt="Preview" 
                                            style={{ display: 'block', height: '60px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Mã Voucher *</label>
                                <input
                                    className="form-input"
                                    style={{ textTransform: 'uppercase' }}
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="VD: SALE50..."
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Giảm giá (%) *</label>
                                    <input className="form-input" type="number" value={formData.discountPercent} onChange={e => setFormData({ ...formData, discountPercent: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Số lượng phát hành *</label>
                                    <input className="form-input" type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Đơn tối thiểu (VNĐ) *</label>
                                    <input className="form-input" type="number" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Giảm tối đa (VNĐ) *</label>
                                    <input className="form-input" type="number" value={formData.maxDiscountAmount} onChange={e => setFormData({ ...formData, maxDiscountAmount: e.target.value })} required />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Thời gian bắt đầu *</label>
                                    <input className="form-input" type="datetime-local" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Thời gian kết thúc *</label>
                                    <input className="form-input" type="datetime-local" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} required />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn-save">Lưu Voucher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL LỊCH SỬ SỬ DỤNG GIỮ NGUYÊN */}
            {usageModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container" style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h3>Lịch sử dùng mã: <span style={{ color: '#d92d20' }}>{selectedVoucherCode}</span></h3>
                        </div>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '15px' }}>
                            {voucherUsages.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>Chưa có người dùng nào sử dụng mã voucher này.</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Người dùng</th>
                                            <th>Mã Booking</th>
                                            <th>Thời gian dùng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voucherUsages.map(usage => (
                                            <tr key={usage.id}>
                                                <td><strong>{usage.customerName}</strong></td>
                                                <td><span className="status-badge ongoing">#{usage.bookingId}</span></td>
                                                <td>{new Date(usage.usedAt).toLocaleString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setUsageModalOpen(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVouchers;