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
        } catch (error) { 
            toast.error("Lỗi tải danh sách nhân viên"); 
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            setFormData({ 
                fullName: staff.fullName, 
                phone: staff.phone || '', 
                email: staff.email, 
                username: staff.username 
            });
        } else {
            setEditingStaff(null);
            setFormData({ username: '', password: '', fullName: '', email: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const validateForm = () => {
        // 1. Validate Username (nếu tạo mới)
        if (!editingStaff) {
            const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
            if (!usernameRegex.test(formData.username)) {
                toast.error("Tên đăng nhập từ 3-20 ký tự, không chứa ký tự đặc biệt");
                return false;
            }
            if (formData.password.length < 6) {
                toast.error("Mật khẩu phải có ít nhất 6 ký tự");
                return false;
            }
            // Validate Email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Email không đúng định dạng");
                return false;
            }
        }

        // 2. Validate Họ tên (Cả tạo và sửa)
        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$/;
        if (!nameRegex.test(formData.fullName.trim())) {
            toast.error("Họ tên không được chứa số hoặc ký tự đặc biệt");
            return false;
        }

        // 3. Validate Số điện thoại (Nếu có nhập)
        if (formData.phone) {
            const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (!phoneRegex.test(formData.phone.trim())) {
                toast.error("Số điện thoại không đúng định dạng Việt Nam");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            if (editingStaff) {
                // Hành động Edit
                await updateUserAdmin(editingStaff.id, { 
                    fullName: formData.fullName.trim(), 
                    phone: formData.phone?.trim() 
                });
                toast.success("Cập nhật thông tin nhân viên thành công!");
            } else {
                // Hành động Create
                await createStaffAccount({
                    ...formData,
                    fullName: formData.fullName.trim(),
                    phone: formData.phone?.trim()
                });
                toast.success("Tạo tài khoản nhân viên mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            // Hiển thị lỗi check trùng từ Backend (400 Bad Request)
            const errorMsg = error.response?.data?.message || "Thao tác thất bại";
            toast.error(errorMsg);
        }
    };

    const handleToggleStatus = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái nhân viên này?")) {
            try {
                await toggleUserStatus(id);
                toast.success("Cập nhật trạng thái thành công!");
                fetchData();
            } catch (error) { 
                toast.error("Không thể cập nhật trạng thái"); 
            }
        }
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>🛠️ Quản lý Nhân viên</h2>
                <button className="btn-add" onClick={() => openModal()}>➕ Thêm Nhân Viên Mới</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map(s => (
                        <tr key={s.id}>
                            <td><strong>{s.username}</strong></td>
                            <td>{s.fullName}</td>
                            <td>{s.email}</td>
                            <td>{s.phone || '---'}</td>
                            <td>{new Date(s.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>
                                <span className={`status-badge ${s.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                                    {s.status === 'ACTIVE' ? 'Đang hoạt động' : 'Bị khóa'}
                                </span>
                            </td>
                            <td>
                                <button className="btn-edit" onClick={() => openModal(s)}>Sửa</button>
                                <button 
                                    className={s.status === 'ACTIVE' ? "btn-delete" : "btn-add"} 
                                    style={{marginLeft: '10px'}} 
                                    onClick={() => handleToggleStatus(s.id)}
                                >
                                    {s.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>{editingStaff ? "Cập nhật nhân viên" : "Tạo nhân viên mới"}</h3>
                        <form onSubmit={handleSubmit} className="profile-form">
                            {!editingStaff && (
                                <>
                                    <div className="form-group">
                                        <label>Tên đăng nhập (Username) *</label>
                                        <input 
                                            className="form-input" 
                                            value={formData.username} 
                                            onChange={e => setFormData({...formData, username: e.target.value})} 
                                            placeholder="VD: staff_01"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mật khẩu *</label>
                                        <input 
                                            className="form-input" 
                                            type="password" 
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})} 
                                            placeholder="Tối thiểu 6 ký tự"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input 
                                            className="form-input" 
                                            type="email" 
                                            value={formData.email} 
                                            onChange={e => setFormData({...formData, email: e.target.value})} 
                                            placeholder="example@cinema.com"
                                            required 
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Họ và tên *</label>
                                <input 
                                    className="form-input" 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                                    placeholder="Nhập họ và tên đầy đủ"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input 
                                    className="form-input" 
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                    placeholder="09xxx hoặc +84xxx"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn-save">Lưu dữ liệu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStaffs;