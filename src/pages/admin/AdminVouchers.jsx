import { useState, useEffect } from 'react';
import { getAllVouchers, createVoucher, updateVoucher, deleteVoucher, getVoucherUsages } from '../../services/api/VoucherApi';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaPlus, FaEdit, FaHistory, FaBan, FaCalendarAlt } from 'react-icons/fa';
import '../../asset/style/AdminVoucher.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);

    const [usageModalOpen, setUsageModalOpen] = useState(false);
    const [voucherUsages, setVoucherUsages] = useState([]);
    const [selectedVoucherCode, setSelectedVoucherCode] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discountPercent: '',
        maxDiscountAmount: '',
        minOrderValue: '',
        quantity: '',
        startDate: '',
        expiryDate: '',
    });

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await getAllVouchers();
            const now = new Date();

            const processedVouchers = (res || []).map(voucher => {
         
                if (new Date(voucher.expiryDate) < now && voucher.status === 1) {
                    return { ...voucher, status: 0 };
                }
                return voucher;
            });

            setVouchers(processedVouchers);
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
            });
            setPreviewUrl(voucher.imageUrl || '');
            setImageFile(null);
        } else {
            setEditingVoucher(null);
            setFormData({
                code: '', discountPercent: '', maxDiscountAmount: '', minOrderValue: '',
                quantity: '', startDate: '', expiryDate: '',
            });
            setPreviewUrl('');
            setImageFile(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(editingVoucher ? editingVoucher.imageUrl : '');
        }
    };


    const validateForm = () => {
        if (!formData.code.trim()) { toast.error("Vui lòng nhập mã Voucher"); return false; }
        if (/\s/.test(formData.code)) { toast.error("Mã Voucher không được chứa khoảng trắng"); return false; }
        if (!formData.discountPercent || formData.discountPercent <= 0 || formData.discountPercent > 100) { toast.error("Phần trăm giảm giá phải từ 1 đến 100"); return false; }
        if (!formData.quantity || formData.quantity <= 0) { toast.error("Số lượng phải lớn hơn 0"); return false; }
        if (formData.minOrderValue === '' || Number(formData.minOrderValue) < 0) { toast.error("Đơn tối thiểu không hợp lệ"); return false; }
        if (formData.maxDiscountAmount === '' || Number(formData.maxDiscountAmount) < 0) { toast.error("Giảm tối đa không hợp lệ"); return false; }
        if (!formData.startDate) { toast.error("Vui lòng chọn Thời gian bắt đầu"); return false; }
        if (!formData.expiryDate) { toast.error("Vui lòng chọn Thời gian kết thúc"); return false; }

        const start = new Date(formData.startDate);
        const end = new Date(formData.expiryDate);
        const now = new Date();

        if (start >= end) { toast.error("Thời gian kết thúc phải lớn hơn Thời gian bắt đầu"); return false; }
        if (!editingVoucher && start < now) { toast.error("Thời gian bắt đầu không được ở trong quá khứ"); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        const voucherData = {
            code: formData.code,
            discountPercent: Number(formData.discountPercent),
            maxDiscountAmount: Number(formData.maxDiscountAmount),
            minOrderValue: Number(formData.minOrderValue),
            quantity: Number(formData.quantity),
            startDate: formData.startDate,
            expiryDate: formData.expiryDate,
        };
        formDataToSend.append('voucher', new Blob([JSON.stringify(voucherData)], { type: 'application/json' }));
        if (imageFile) {
            formDataToSend.append('imageFile', imageFile);
        }

        try {
            if (editingVoucher) {
                await updateVoucher(editingVoucher.id, formDataToSend);
                toast.success("Cập nhật Voucher thành công!");
            } else {
                await createVoucher(formDataToSend);
                toast.success("Thêm Voucher mới thành công!");
            }
            setIsModalOpen(false);
            fetchVouchers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn ngừng hoạt động mã Voucher này?")) {
            try {
                await deleteVoucher(id);
                toast.success("Đã ngừng hoạt động Voucher!");
                fetchVouchers();
            } catch (error) {
                toast.error("Thao tác thất bại!");
            }
        }
    };

    return (
        <div className="av-page">

            <div className="av-header">
                <div>
                    <h2 className="av-title">
                        <FaTicketAlt color="#ef4444" /> Quản lý Voucher & Khuyến mãi
                    </h2>
                    <p className="av-desc">Tạo mã giảm giá, kiểm soát số lượng và theo dõi lịch sử sử dụng.</p>
                </div>
                <button className="av-btn-primary" onClick={() => openModal()}>
                    <FaPlus /> Thêm Voucher
                </button>
            </div>

            <div className="av-table-card">
                <div className="av-table-wrapper">
                    <table className="av-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Mã Khuyến Mãi</th>
                                <th>Chi tiết giảm</th>
                                <th>Số lượng</th>
                                <th>Hạn sử dụng</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                            ) : vouchers.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chưa có Voucher nào trong hệ thống.</td></tr>
                            ) : (
                                vouchers.map((v) => (
                                    <tr key={v.id}>
                                        <td>
                                            <img
                                                src={v.imageUrl || "https://img.freepik.com/free-vector/special-offer-modern-sale-banner-template_1017-20667.jpg"}
                                                alt="thumb"
                                                style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                            />
                                        </td>
                                        <td>
                                            <span className="av-code-badge">{v.code}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '700', color: '#0f172a' }}>Giảm {v.discountPercent}%</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                                Tối đa {v.maxDiscountAmount.toLocaleString()}đ (Đơn từ {v.minOrderValue.toLocaleString()}đ)
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '600' }}>{v.quantity - v.usedCount} <span style={{ color: '#94a3b8', fontWeight: '400' }}>còn lại</span></div>
                                            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>Đã dùng: {v.usedCount}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                                                <FaCalendarAlt color="#cbd5e1" /> {new Date(v.expiryDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td>
                                            {new Date(v.expiryDate) < new Date() ? (
                                                <span className="av-badge av-badge-inactive">
                                                    Đã hết hạn
                                                </span>
                                            ) : (
                                                 <span className={`av-badge ${v.status === 1 ? 'av-badge-active' : 'av-badge-inactive'}`}>
                                                    {v.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <button className="av-action-btn av-btn-edit" onClick={() => openModal(v)} title="Sửa thông tin">
                                                    <FaEdit /> Sửa
                                                </button>
                                                <button className="av-action-btn av-btn-history" onClick={() => handleViewUsages(v)} title="Xem lịch sử dùng">
                                                    <FaHistory /> Lịch sử
                                                </button>

                                                {v.status === 1 && new Date(v.expiryDate) >= new Date() && (
                                                    <button className="av-action-btn av-btn-danger" onClick={() => handleDelete(v.id)} title="Ngừng hoạt động">
                                                        <FaBan /> Ngừng
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL THÊM / SỬA VOUCHER */}
            {isModalOpen && (
                <div className="av-modal-overlay">
                    <div className="av-modal-content">
                        <div className="av-modal-header">
                            <h3>{editingVoucher ? "Cập nhật mã khuyến mãi" : "Tạo mã khuyến mãi mới"}</h3>
                            <button className="av-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="av-modal-body">
                                <div className="av-form-group">
                                    <label>Ảnh đại diện (không bắt buộc)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="av-input"
                                        onChange={handleFileChange}
                                    />
                                    {previewUrl && (
                                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '150px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    objectFit: 'contain',
                                                    backgroundColor: '#f8fafc'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="av-form-row">
                                    <div className="av-form-group" style={{ flex: 2 }}>
                                        <label>Mã Code (Tự động in hoa) *</label>
                                        <input
                                            className="av-input"
                                            style={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#ef4444' }}
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="VD: SIEUSALE50"
                                            required
                                        />
                                    </div>
                                    <div className="av-form-group" style={{ flex: 1 }}>
                                        <label>Giảm giá (%) *</label>
                                        <input className="av-input" type="number" value={formData.discountPercent} onChange={e => setFormData({ ...formData, discountPercent: e.target.value })} placeholder="VD: 15" required />
                                    </div>
                                </div>

                                <div className="av-form-row">
                                    <div className="av-form-group">
                                        <label>Đơn tối thiểu (VNĐ) *</label>
                                        <input className="av-input" type="number" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })} placeholder="VD: 100000" required />
                                    </div>
                                    <div className="av-form-group">
                                        <label>Giảm tối đa (VNĐ) *</label>
                                        <input className="av-input" type="number" value={formData.maxDiscountAmount} onChange={e => setFormData({ ...formData, maxDiscountAmount: e.target.value })} placeholder="VD: 50000" required />
                                    </div>
                                </div>

                                <div className="av-form-row">
                                    <div className="av-form-group">
                                        <label>Thời gian bắt đầu *</label>
                                        <input className="av-input" type="datetime-local" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                                    </div>
                                    <div className="av-form-group">
                                        <label>Thời gian kết thúc *</label>
                                        <input className="av-input" type="datetime-local" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} required />
                                    </div>
                                    <div className="av-form-group" style={{ maxWidth: '120px' }}>
                                        <label>Số lượng *</label>
                                        <input className="av-input" type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} placeholder="100" required />
                                    </div>
                                </div>
                            </div>

                            <div className="av-modal-footer">
                                <button type="button" className="av-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="av-btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '5px' }}></span>
                                            Đang xử lý...
                                        </>
                                    ) : 'Lưu Voucher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL LỊCH SỬ SỬ DỤNG */}
            {usageModalOpen && (
                <div className="av-modal-overlay">
                    <div className="av-modal-content wide">
                        <div className="av-modal-header">
                            <h3>Lịch sử dùng mã: <span className="av-code-badge" style={{ marginLeft: '10px' }}>{selectedVoucherCode}</span></h3>
                            <button className="av-modal-close" onClick={() => setUsageModalOpen(false)}>&times;</button>
                        </div>

                        <div className="av-modal-body" style={{ padding: '0' }}>
                            {voucherUsages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                                    <FaHistory size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                    <div>Chưa có khách hàng nào sử dụng mã này.</div>
                                </div>
                            ) : (
                                <table className="av-table">
                                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th>Khách hàng</th>
                                            <th>Email</th>
                                            <th>Mã Đơn hàng (Booking)</th>
                                            <th>Thời gian sử dụng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voucherUsages.map(usage => (
                                            <tr key={usage.id}>
                                                <td style={{ fontWeight: '600', color: '#0f172a' }}>{usage.customerName}</td>
                                                <td style={{ color: '#64748b', fontSize: '13px' }}>{usage.email || 'N/A'}</td>
                                                <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '13px' }}>#{usage.bookingId}</span></td>
                                                <td>{new Date(usage.usedAt).toLocaleString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="av-modal-footer">
                            <button className="av-btn-cancel" onClick={() => setUsageModalOpen(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVouchers;