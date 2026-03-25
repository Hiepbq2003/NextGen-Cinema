import { useState, useEffect } from 'react';
import { getUsersByRole, toggleUserStatus, createStaffAccount, updateUserAdmin } from '../../services/api/AuthApi';
import { toast } from 'react-toastify';
import { FaUserTie, FaPlus, FaSearch, FaFilter, FaEdit, FaLock, FaUnlock, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../../asset/style/AdminAccountManagement.css';

const AdminStaffs = () => {
    const [staffs, setStaffs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', fullName: '', email: '', phone: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getUsersByRole('STAFF');
            const sortedData = (Array.isArray(res) ? res : []).sort((a, b) => b.id - a.id);
            setStaffs(sortedData);
        } catch (error) { 
            toast.error("Lỗi tải danh sách nhân viên"); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            setFormData({ fullName: staff.fullName, phone: staff.phone || '', email: staff.email, username: staff.username });
        } else {
            setEditingStaff(null);
            setFormData({ username: '', password: '', fullName: '', email: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const validateForm = () => {
        if (!editingStaff) {
            const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
            if (!usernameRegex.test(formData.username)) { toast.error("Username 3-20 ký tự, không ký tự đặc biệt"); return false; }
            if (formData.password.length < 6) { toast.error("Mật khẩu ít nhất 6 ký tự"); return false; }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) { toast.error("Email không đúng định dạng"); return false; }
        }

        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$/;
        if (!nameRegex.test(formData.fullName.trim())) { toast.error("Họ tên không chứa số hoặc ký tự đặc biệt"); return false; }

        if (formData.phone) {
            const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (!phoneRegex.test(formData.phone.trim())) { toast.error("Số điện thoại không đúng"); return false; }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            if (editingStaff) {
                await updateUserAdmin(editingStaff.id, { fullName: formData.fullName.trim(), phone: formData.phone?.trim() });
                toast.success("Cập nhật nhân viên thành công!");
            } else {
                await createStaffAccount({ ...formData, fullName: formData.fullName.trim(), phone: formData.phone?.trim() });
                toast.success("Tạo tài khoản nhân viên mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const action = currentStatus === 'ACTIVE' ? 'KHÓA' : 'MỞ KHÓA';
        if (window.confirm(`Xác nhận ${action} tài khoản nhân viên này?`)) {
            try {
                await toggleUserStatus(id);
                toast.success(`Đã ${action.toLowerCase()} tài khoản!`);
                fetchData();
            } catch (error) { toast.error("Lỗi hệ thống"); }
        }
    };

    const filteredStaffs = staffs.filter((s) => {
        const matchSearch = 
            s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage) || 1;
    const paginatedStaffs = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
        else {
            if (currentPage <= 3) { pages.push(1, 2, 3, 4, '...', totalPages); }
            else if (currentPage >= totalPages - 2) { pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages); }
            else { pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages); }
        }
        return pages;
    };

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

    return (
        <div className="aa-page">
            <div className="aa-header">
                <div>
                    <h2 className="aa-title"><FaUserTie color="#3b82f6" /> Quản lý Nhân Viên</h2>
                    <p className="aa-desc">Quản lý tài khoản, phân quyền và cấp tài khoản cho nhân viên rạp.</p>
                </div>
                <button className="aa-btn-primary" onClick={() => openModal()}>
                    <FaPlus /> Thêm Nhân Viên Mới
                </button>
            </div>

            <div className="aa-filter-card">
                <div className="aa-filter-group" style={{ flex: 2, minWidth: '250px' }}>
                    <label>Tìm kiếm nhân viên</label>
                    <div className="aa-input-wrapper">
                        <FaSearch className="aa-input-icon" />
                        <input type="text" className="aa-input" placeholder="Tên, Email hoặc Username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="aa-filter-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label>Trạng thái tài khoản</label>
                    <div className="aa-input-wrapper">
                        <FaFilter className="aa-input-icon" />
                        <select className="aa-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="INACTIVE">Bị khóa</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="aa-table-card">
                <div className="aa-table-wrapper">
                    <table className="aa-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Thông tin Nhân viên</th>
                                <th>Ngày cấp</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                            ) : paginatedStaffs.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>Không tìm thấy nhân viên nào!</td></tr>
                            ) : (
                                paginatedStaffs.map(s => (
                                    <tr key={s.id}>
                                        <td><span className="aa-username-badge">@{s.username}</span></td>
                                        <td>
                                            <div className="aa-user-name">{s.fullName}</div>
                                            <div className="aa-user-email"><FaEnvelope /> {s.email}</div>
                                            {s.phone && <div className="aa-user-email"><FaPhone /> {s.phone}</div>}
                                        </td>
                                        <td>{new Date(s.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <span className={`aa-badge ${s.status === 'ACTIVE' ? 'aa-badge-active' : 'aa-badge-inactive'}`}>
                                                {s.status === 'ACTIVE' ? 'Hoạt động' : 'Bị Khóa'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <button className="aa-action-btn aa-btn-edit" onClick={() => openModal(s)}><FaEdit /> Sửa</button>
                                                {s.status === 'ACTIVE' ? (
                                                    <button className="aa-action-btn aa-btn-lock" onClick={() => handleToggleStatus(s.id, s.status)}><FaLock /> Khóa</button>
                                                ) : (
                                                    <button className="aa-action-btn aa-btn-unlock" onClick={() => handleToggleStatus(s.id, s.status)}><FaUnlock /> Mở khóa</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1}</b> - <b>{Math.min(currentPage * itemsPerPage, filteredStaffs.length)}</b> trong <b>{filteredStaffs.length}</b> nv</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', background: currentPage === 1 ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px' }}>Trước</button>
                            {getPageNumbers().map((page, index) => (
                                <button key={index} onClick={() => typeof page === 'number' && setCurrentPage(page)} disabled={page === '...'} style={{ padding: '6px 12px', background: currentPage === page ? '#3b82f6' : (page === '...' ? 'transparent' : '#fff'), color: currentPage === page ? '#fff' : (page === '...' ? '#94a3b8' : '#475569'), border: page === '...' ? 'none' : (currentPage === page ? '1px solid #3b82f6' : '1px solid #cbd5e1'), borderRadius: '6px', fontWeight: currentPage === page ? 'bold' : '600', cursor: page === '...' ? 'default' : 'pointer', fontSize: '13px' }}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '6px 12px', background: currentPage === totalPages ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px' }}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="aa-modal-overlay">
                    <div className="aa-modal-content">
                        <div className="aa-modal-header">
                            <h3>{editingStaff ? <><FaEdit color="#3b82f6" /> Cập nhật nhân viên</> : <><FaPlus color="#3b82f6" /> Tạo nhân viên mới</>}</h3>
                            <button className="aa-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="aa-modal-body">
                                {!editingStaff && (
                                    <>
                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                            <div className="aa-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                                <label>Username *</label>
                                                <input className="aa-form-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="staff_01" required />
                                            </div>
                                            <div className="aa-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                                <label>Mật khẩu *</label>
                                                <input className="aa-form-input" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Tối thiểu 6 ký tự" required />
                                            </div>
                                        </div>
                                        <div className="aa-form-group">
                                            <label>Email *</label>
                                            <input className="aa-form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="nv@cinema.com" required />
                                        </div>
                                    </>
                                )}
                                <div className="aa-form-group">
                                    <label>Họ và tên *</label>
                                    <input className="aa-form-input" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Nguyễn Văn A" required />
                                </div>
                                <div className="aa-form-group">
                                    <label>Số điện thoại</label>
                                    <input className="aa-form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xxxx" />
                                </div>
                            </div>
                            <div className="aa-modal-footer">
                                <button type="button" className="aa-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="aa-btn-submit">{editingStaff ? 'Lưu thay đổi' : 'Tạo tài khoản'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStaffs;