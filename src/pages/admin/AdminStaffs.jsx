import { useState, useEffect } from 'react';
import { getUsersByRole, toggleUserStatus, createStaffAccount, updateUserAdmin } from '../../services/api/AuthApi';
import { toast } from 'react-toastify';

const AdminStaffs = () => {
    const [staffs, setStaffs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', fullName: '', email: '', phone: '' });

    const fetchData = async () => {
        try {
            const res = await getUsersByRole('STAFF');
            setStaffs(res);
        } catch (error) { toast.error("Lỗi tải danh sách"); }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                await updateUserAdmin(editingStaff.id, { fullName: formData.fullName, phone: formData.phone });
                toast.success("Cập nhật thành công!");
            } else {
                await createStaffAccount(formData);
                toast.success("Thêm nhân viên mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) { toast.error(error.response?.data?.message || "Thao tác thất bại"); }
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>🛠️ Quản lý Nhân viên</h2>
                <button className="btn-add" onClick={() => openModal()}>➕ Thêm Nhân Viên</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th>Username</th><th>Họ tên</th><th>Email</th><th>Trạng thái</th><th>Hành động</th></tr>
                </thead>
                <tbody>
                    {staffs.map(s => (
                        <tr key={s.id}>
                            <td>{s.username}</td><td>{s.fullName}</td><td>{s.email}</td>
                            <td><span className={`status-badge ${s.status === 'ACTIVE' ? 'ongoing' : 'inactive'}`}>{s.status}</span></td>
                            <td>
                                <button className="btn-edit" onClick={() => openModal(s)}>Sửa</button>
                                <button className="btn-delete" style={{marginLeft: '10px'}} onClick={async () => { await toggleUserStatus(s.id); fetchData(); }}>
                                    {s.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>{editingStaff ? "Sửa nhân viên" : "Thêm nhân viên mới"}</h3>
                        <form onSubmit={handleSubmit} className="profile-form">
                            {!editingStaff && (
                                <><div className="form-group"><label>Username</label><input className="form-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required /></div>
                                <div className="form-group"><label>Mật khẩu</label><input className="form-input" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
                                <div className="form-group"><label>Email</label><input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div></>
                            )}
                            <div className="form-group"><label>Họ tên</label><input className="form-input" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required /></div>
                            <div className="form-group"><label>Số điện thoại</label><input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-save">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminStaffs;