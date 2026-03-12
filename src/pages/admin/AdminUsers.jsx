import { useState, useEffect } from 'react';
import { getUsersByRole, toggleUserStatus, updateUserAdmin } from '../../services/api/AuthApi';
import { toast } from 'react-toastify';
import { FaUsers, FaSearch, FaFilter, FaEdit, FaLock, FaUnlock, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../../asset/style/AdminAccountManagement.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', phone: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getUsersByRole('USER');
            const sortedData = (Array.isArray(res) ? res : []).sort((a, b) => b.id - a.id);
            setUsers(sortedData);
        } catch (error) { toast.error("Lỗi tải danh sách khách hàng"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ fullName: user.fullName, phone: user.phone || '' });
        setIsModalOpen(true);
    };

    const validateForm = () => {
        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$/;
        if (!nameRegex.test(formData.fullName.trim())) { toast.error("Họ tên không hợp lệ"); return false; }
        if (formData.phone) {
            const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (!phoneRegex.test(formData.phone.trim())) { toast.error("Số điện thoại sai định dạng"); return false; }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await updateUserAdmin(editingUser.id, { fullName: formData.fullName.trim(), phone: formData.phone?.trim() });
            toast.success("Cập nhật khách hàng thành công!");
            setIsModalOpen(false);
            fetchData();
        } catch (error) { toast.error("Cập nhật thất bại"); }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const action = currentStatus === 'ACTIVE' ? 'KHÓA' : 'MỞ KHÓA';
        if (window.confirm(`Xác nhận ${action} tài khoản khách hàng này? (Họ sẽ không thể đăng nhập)`)) {
            try {
                await toggleUserStatus(id);
                toast.success(`Đã ${action.toLowerCase()} tài khoản!`);
                fetchData();
            } catch (error) { toast.error("Lỗi hệ thống"); }
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchSearch = 
            u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <h2 className="aa-title"><FaUsers color="#3b82f6" /> Quản lý Khách Hàng</h2>
                    <p className="aa-desc">Quản lý thông tin và trạng thái hoạt động của người dùng hệ thống.</p>
                </div>
            </div>

            <div className="aa-filter-card">
                <div className="aa-filter-group" style={{ flex: 2, minWidth: '250px' }}>
                    <label>Tìm kiếm Khách hàng</label>
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
                                <th>Thông tin Liên hệ</th>
                                <th>Ngày đăng ký</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>Không tìm thấy khách hàng nào!</td></tr>
                            ) : (
                                paginatedUsers.map(u => (
                                    <tr key={u.id}>
                                        <td><span className="aa-username-badge">@{u.username}</span></td>
                                        <td>
                                            <div className="aa-user-name">{u.fullName}</div>
                                            <div className="aa-user-email"><FaEnvelope /> {u.email}</div>
                                            {u.phone && <div className="aa-user-email"><FaPhone /> {u.phone}</div>}
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <span className={`aa-badge ${u.status === 'ACTIVE' ? 'aa-badge-active' : 'aa-badge-inactive'}`}>
                                                {u.status === 'ACTIVE' ? 'Hoạt động' : 'Bị Khóa'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <button className="aa-action-btn aa-btn-edit" onClick={() => handleEdit(u)}><FaEdit /> Sửa</button>
                                                {u.status === 'ACTIVE' ? (
                                                    <button className="aa-action-btn aa-btn-lock" onClick={() => handleToggleStatus(u.id, u.status)}><FaLock /> Khóa</button>
                                                ) : (
                                                    <button className="aa-action-btn aa-btn-unlock" onClick={() => handleToggleStatus(u.id, u.status)}><FaUnlock /> Mở khóa</button>
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
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1}</b> - <b>{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</b> trong <b>{filteredUsers.length}</b> KH</span>
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
                            <h3><FaEdit color="#3b82f6" /> Sửa thông tin Khách hàng</h3>
                            <button className="aa-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="aa-modal-body">
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
                                <button type="submit" className="aa-btn-submit">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;