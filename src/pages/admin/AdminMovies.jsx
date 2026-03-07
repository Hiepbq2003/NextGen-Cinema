import { useState, useEffect } from 'react';
import { getAllMovies, deleteMovie, createMovie, updateMovie } from '../../services/api/MovieApi';
import { toast } from 'react-toastify';
import './AdminPage.css'; 

const AdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        durationMinutes: '',
        releaseDate: '',
        posterUrl: '',
        status: 'UPCOMING'
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const res = await getAllMovies();
            setMovies(res || []); 
        } catch (error) {
            toast.error("Không thể tải danh sách phim!");
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (movie = null) => {
        if (movie) {
            setEditingMovie(movie);
            setFormData({
                title: movie.title,
                description: movie.description || '',
                durationMinutes: movie.durationMinutes,
                releaseDate: movie.releaseDate,
                posterUrl: movie.posterUrl,
                status: movie.status
            });
        } else {
            setEditingMovie(null);
            setFormData({
                title: '',
                description: '',
                durationMinutes: '',
                releaseDate: '',
                posterUrl: '',
                status: 'UPCOMING'
            });
        }
        setIsModalOpen(true);
    };

    const validateMovieForm = () => {
        if (!formData.title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return false; }
        if (!formData.durationMinutes || formData.durationMinutes <= 0) { toast.error("Thời lượng phải > 0"); return false; }
        if (!formData.releaseDate) { toast.error("Vui lòng chọn ngày phát hành"); return false; }
        if (!formData.posterUrl.trim()) { toast.error("Vui lòng nhập link poster"); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateMovieForm()) return;

        try {
            if (editingMovie) {
                await updateMovie(editingMovie.id, formData);
                toast.success("Cập nhật phim thành công!");
            } else {
                await createMovie(formData);
                toast.success("Thêm phim mới thành công!");
            }
            setIsModalOpen(false);
            fetchMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn ngừng chiếu phim này?")) {
            try {
                await deleteMovie(id);
                toast.success("Đã thay đổi trạng thái phim");
                fetchMovies();
            } catch (error) {
                toast.error("Lỗi khi thực hiện!");
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2>🎬 Quản lý Phim</h2>
                <button className="btn-add" onClick={() => openModal()}>➕ Thêm Phim Mới</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Poster</th>
                        <th>Tên Phim</th>
                        <th>Thời lượng</th>
                        <th>Ngày chiếu</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>
                                <img src={movie.posterUrl} alt="poster" className="table-img" />
                            </td>
                            <td><strong>{movie.title}</strong></td>
                            <td>{movie.durationMinutes} phút</td>
                            <td>{movie.releaseDate}</td>
                            <td>
                                <span className={`status-badge ${movie.status?.toLowerCase()}`}>
                                    {movie.status === 'ONGOING' ? 'Đang chiếu' : movie.status === 'UPCOMING' ? 'Sắp chiếu' : 'Ngừng chiếu'}
                                </span>
                            </td>
                            <td>
                                <button className="btn-edit" onClick={() => openModal(movie)}>Sửa</button>
                                <button className="btn-delete" style={{ marginLeft: '10px' }} onClick={() => handleDelete(movie.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container movie-modal">
                        <div className="modal-header">
                            <h3>{editingMovie ? "🛠️ Cập nhật thông tin phim" : "🎬 Thêm phim mới"}</h3>
                            <button className="close-x" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body-split">
                                {/* CỘT TRÁI: Thông tin cơ bản */}
                                <div className="modal-col">
                                    <div className="form-group">
                                        <label>Tiêu đề phim *</label>
                                        <input className="form-input" value={formData.title} 
                                            onChange={e => setFormData({...formData, title: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả chi tiết</label>
                                        <textarea className="form-input" style={{ height: '120px' }} value={formData.description} 
                                            onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Link ảnh Poster *</label>
                                        <input className="form-input" value={formData.posterUrl} 
                                            onChange={e => setFormData({...formData, posterUrl: e.target.value})} required />
                                    </div>
                                </div>

                                {/* CỘT PHẢI: Thông số & Preview */}
                                <div className="modal-col">
                                    <div className="form-row">
                                        <div className="form-group flex-1">
                                            <label>Thời lượng (phút) *</label>
                                            <input type="number" className="form-input" value={formData.durationMinutes} 
                                                onChange={e => setFormData({...formData, durationMinutes: e.target.value})} required />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label>Ngày phát hành *</label>
                                            <input type="date" className="form-input" value={formData.releaseDate} 
                                                onChange={e => setFormData({...formData, releaseDate: e.target.value})} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Trạng thái phim</label>
                                        <select className="form-input" value={formData.status} 
                                            onChange={e => setFormData({...formData, status: e.target.value})}>
                                            <option value="UPCOMING">Sắp chiếu</option>
                                            <option value="ONGOING">Đang chiếu</option>
                                            <option value="ENDED">Kết thúc</option>
                                            <option value="INACTIVE">Ngừng hoạt động</option>
                                        </select>
                                    </div>

                                    <div className="poster-preview-area">
                                        <label>Xem trước Poster:</label>
                                        <div className="preview-box">
                                            {formData.posterUrl ? (
                                                <img src={formData.posterUrl} alt="Preview" 
                                                     onError={(e) => e.target.src = 'https://via.placeholder.com/150x220?text=Invalid+Link'} />
                                            ) : (
                                                <div className="no-image">Chưa có ảnh</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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

export default AdminMovies;