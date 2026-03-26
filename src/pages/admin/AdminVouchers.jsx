import { useState, useEffect, useMemo } from 'react';
import { getAllVouchers, createVoucher, updateVoucher, deleteVoucher, getVoucherUsages } from '../../services/api/VoucherApi';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaPlus, FaEdit, FaHistory, FaBan, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
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


    // Pagination states for vouchers
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    
    const voucherStats = useMemo(() => ({
        total: vouchers.length,
        active: vouchers.filter(v => v.status === 1).length,
        expired: vouchers.filter(v => new Date(v.expiryDate) < new Date()).length,
        used: vouchers.filter(v => v.usedCount >= v.quantity).length
    }), [vouchers]);

    const totalPages = useMemo(() => Math.ceil(vouchers.length / itemsPerPage) || 1, [vouchers.length, itemsPerPage]);
    const paginatedVouchers = useMemo(() => vouchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [vouchers, currentPage, itemsPerPage]);


    const getPaginationButtons = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) { pages.push(1, 2, 3, 4, '...', totalPages); }
            else if (currentPage >= totalPages - 2) { pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages); }
            else { pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages); }
        }
        return pages;
    };


    // Pagination states for usage history
    const usageItemsPerPage = 5;
    const [usageCurrentPage, setUsageCurrentPage] = useState(1);
    const usageTotalPages = useMemo(() => Math.ceil(voucherUsages.length / usageItemsPerPage) || 1, [voucherUsages.length, usageItemsPerPage]);
    const paginatedUsages = useMemo(() => voucherUsages.slice((usageCurrentPage - 1) * usageItemsPerPage, usageCurrentPage * usageItemsPerPage), [voucherUsages, usageCurrentPage, usageItemsPerPage]);


    const getUsagePaginationButtons = () => {
        let pages = [];
        if (usageTotalPages <= 5) {
            for (let i = 1; i <= usageTotalPages; i++) pages.push(i);
        } else {
            if (usageCurrentPage <= 3) { pages.push(1, 2, 3, 4, '...', usageTotalPages); }
            else if (usageCurrentPage >= usageTotalPages - 2) { pages.push(1, '...', usageTotalPages - 3, usageTotalPages - 2, usageTotalPages - 1, usageTotalPages); }
            else { pages.push(1, '...', usageCurrentPage - 1, usageCurrentPage, usageCurrentPage + 1, '...', usageTotalPages); }
        }
        return pages;
    };


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
            setUsageCurrentPage(1);
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

            <div className="av-stats-container">
                <div className="av-stat-card av-stat-primary">
                    <div className="av-stat-icon"><FaTicketAlt /></div>
                    <div className="av-stat-info">
                        <span className="av-stat-label">Tổng số Voucher</span>
                        <span className="av-stat-value">{voucherStats.total}</span>
                    </div>
                </div>
                <div className="av-stat-card av-stat-success">
                    <div className="av-stat-icon"><FaCheckCircle /></div>
                    <div className="av-stat-info">
                        <span className="av-stat-label">Đang hoạt động</span>
                        <span className="av-stat-value">{voucherStats.active}</span>
                    </div>
                </div>
                <div className="av-stat-card av-stat-warning">
                    <div className="av-stat-icon"><FaClock /></div>
                    <div className="av-stat-info">
                        <span className="av-stat-label">Hết lượt dùng</span>
                        <span className="av-stat-value">{voucherStats.used}</span>
                    </div>
                </div>
                <div className="av-stat-card av-stat-danger">
                    <div className="av-stat-icon"><FaTimesCircle /></div>
                    <div className="av-stat-info">
                        <span className="av-stat-label">Đã hết hạn</span>
                        <span className="av-stat-value">{voucherStats.expired}</span>
                    </div>
                </div>
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
                                paginatedVouchers.map((v) => (
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
                   
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px 0', borderTop: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1}</b> - <b>{Math.min(currentPage * itemsPerPage, vouchers.length)}</b> trong tổng <b>{vouchers.length}</b> voucher</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', background: currentPage === 1 ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px' }}>Trước</button>
                                {getPaginationButtons().map((page, index) => (
                                    <button key={index} onClick={() => typeof page === 'number' && setCurrentPage(page)} disabled={page === '...'} style={{ padding: '6px 12px', background: currentPage === page ? '#3b82f6' : (page === '...' ? 'transparent' : '#fff'), color: currentPage === page ? '#fff' : (page === '...' ? '#94a3b8' : '#475569'), border: page === '...' ? 'none' : (currentPage === page ? '1px solid #3b82f6' : '1px solid #cbd5e1'), borderRadius: '6px', fontWeight: currentPage === page ? 'bold' : '600', cursor: page === '...' ? 'default' : 'pointer', fontSize: '13px' }}>{page}</button>
                                ))}
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '6px 12px', background: currentPage === totalPages ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px' }}>Sau</button>
                            </div>
                        </div>
                    )}
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
                                <>
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
                                        {paginatedUsages.map(usage => (
                                            <tr key={usage.id}>
                                                <td style={{ fontWeight: '600', color: '#0f172a' }}>{usage.customerName}</td>
                                                <td style={{ color: '#64748b', fontSize: '13px' }}>{usage.email || 'N/A'}</td>
                                                <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '13px' }}>#{usage.bookingId}</span></td>
                                                <td>{new Date(usage.usedAt).toLocaleString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {usageTotalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px 15px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                        <span style={{ fontSize: '13px', color: '#64748b' }}>Hiển thị <b>{(usageCurrentPage - 1) * usageItemsPerPage + 1}</b>-<b>{Math.min(usageCurrentPage * usageItemsPerPage, voucherUsages.length)}</b> / <b>{voucherUsages.length}</b> lượt</span>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => setUsageCurrentPage(prev => Math.max(prev - 1, 1))} disabled={usageCurrentPage === 1} style={{ padding: '4px 8px', background: usageCurrentPage === 1 ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: usageCurrentPage === 1 ? 'not-allowed' : 'pointer', color: usageCurrentPage === 1 ? '#94a3b8' : '#475569', fontSize: '12px' }}>Trước</button>
                                            {getUsagePaginationButtons().map((page, index) => (
                                                <button key={index} onClick={() => typeof page === 'number' && setUsageCurrentPage(page)} disabled={page === '...'} style={{ padding: '4px 8px', background: usageCurrentPage === page ? '#3b82f6' : (page === '...' ? 'transparent' : '#fff'), color: usageCurrentPage === page ? '#fff' : (page === '...' ? '#94a3b8' : '#475569'), border: page === '...' ? 'none' : (usageCurrentPage === page ? '1px solid #3b82f6' : '1px solid #cbd5e1'), borderRadius: '4px', cursor: page === '...' ? 'default' : 'pointer', fontSize: '12px' }}>{page}</button>
                                            ))}
                                            <button onClick={() => setUsageCurrentPage(prev => Math.min(prev + 1, usageTotalPages))} disabled={usageCurrentPage === usageTotalPages} style={{ padding: '4px 8px', background: usageCurrentPage === usageTotalPages ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: usageCurrentPage === usageTotalPages ? 'not-allowed' : 'pointer', color: usageCurrentPage === usageTotalPages ? '#94a3b8' : '#475569', fontSize: '12px' }}>Sau</button>
                                        </div>
                                    </div>
                                )}
                            </>
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

