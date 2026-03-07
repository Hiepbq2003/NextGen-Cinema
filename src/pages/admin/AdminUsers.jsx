import { useState, useEffect } from 'react';
import { getUsersByRole, toggleUserStatus, updateUserAdmin } from '../../services/api/AuthApi';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', phone: '' });

    const fetchData = async () => {
        try {
            const res = await getUsersByRole('USER');
            setUsers(res);
        } catch (error) { toast.error("Lỗi tải dữ liệu"); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ fullName: user.fullName, phone: user.phone || '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserAdmin(editingUser.id, formData);
            toast.success("Cập nhật thành công!");
            setIsModalOpen(false);
            fetchData();
        } catch (error) { toast.error("Cập nhật thất bại"); }
    };

    return (
        <div className="admin-page">
            <h2>👥 Quản lý Khách hàng</h2>
            <table className="admin-table">
                <thead>
                    <tr><th>ID</th><th>Username</th><th>Họ tên</th><th>Email</th><th>Trạng thái</th><th>Thao tác</th></tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td><td>{u.username}</td><td>{u.fullName}</td><td>{u.email}</td>
                            <td><span className={`status-badge ${u.status === 'ACTIVE' ? 'ongoing' : 'inactive'}`}>{u.status}</span></td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(u)}>Sửa</button>
                                <button className={u.status === 'ACTIVE' ? "btn-delete" : "btn-add"} style={{marginLeft: '10px'}} 
                                    onClick={async () => { await toggleUserStatus(u.id); fetchData(); }}>
                                    {u.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>Sửa thông tin khách hàng</h3>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group"><label>Họ tên</label><input className="form-input" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required /></div>
                            <div className="form-group"><label>Số điện thoại</label><input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-save">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminUsers;