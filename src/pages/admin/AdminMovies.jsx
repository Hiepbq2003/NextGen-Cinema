import { useState, useEffect, useMemo } from 'react';
import { getAllMovies, deleteMovie, createMovie, updateMovie } from '../../services/api/MovieApi';
import { toast } from 'react-toastify';
import { FaFilm, FaPlus, FaSearch, FaFilter, FaEdit, FaBan, FaClock, FaCalendarAlt, FaPlayCircle, FaFastForward, FaTimesCircle } from 'react-icons/fa';
import '../../asset/style/AdminMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [posterFile, setPosterFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const itemsPerPage = 6;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        durationMinutes: '',
        releaseDate: '',
        status: 'UPCOMING'
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const res = await getAllMovies();
   
            const sortedData = (Array.isArray(res) ? res : []).sort((a, b) => b.id - a.id);
            setMovies(sortedData);
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
                status: movie.status
            });
            setPreviewUrl(movie.posterUrl);
            setPosterFile(null);
        } else {
            setEditingMovie(null);
            setFormData({
                title: '', description: '', durationMinutes: '',
                releaseDate: '', status: 'UPCOMING'
            });
            setPreviewUrl('');
            setPosterFile(null);
        }
        setIsModalOpen(true);
    };

    const validateMovieForm = () => {
        if (!formData.title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return false; }
        if (!formData.durationMinutes || formData.durationMinutes <= 0) { toast.error("Thời lượng phải lớn hơn 0"); return false; }
        if (!formData.releaseDate) { toast.error("Vui lòng chọn ngày phát hành"); return false; }

        if (!editingMovie && !posterFile) {
            toast.error("Vui lòng chọn ảnh poster");
            return false;
        }
        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPosterFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(editingMovie ? editingMovie.posterUrl : '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateMovieForm()) return;
        setIsSubmitting(true);
        const formDataToSend = new FormData();
        const movieData = {
            title: formData.title,
            description: formData.description,
            durationMinutes: formData.durationMinutes,
            releaseDate: formData.releaseDate,
            status: formData.status
        };
        formDataToSend.append('movie', new Blob([JSON.stringify(movieData)], { type: 'application/json' }));
        if (posterFile) {
            formDataToSend.append('posterFile', posterFile);
        }

        try {
            if (editingMovie) {
                await updateMovie(editingMovie.id, formDataToSend);
                toast.success("Cập nhật phim thành công!");
            } else {
                await createMovie(formDataToSend);
                toast.success("Thêm phim mới thành công!");
            }
            setIsModalOpen(false);
            fetchMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn ngừng chiếu phim này? Trạng thái sẽ được chuyển thành Ngừng hoạt động.")) {
            try {
                await deleteMovie(id);
                toast.success("Đã thay đổi trạng thái phim thành công!");
                fetchMovies();
            } catch (error) {
                toast.error("Lỗi khi thực hiện thay đổi trạng thái!");
            }
        }
    };

   
    const filteredMovies = useMemo(() => {
        return movies.filter((m) => {
            const matchSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [movies, searchTerm, statusFilter]);

    const movieStats = useMemo(() => ({
        total: filteredMovies.length,
        ongoing: filteredMovies.filter(m => m.status === 'ONGOING').length,
        upcoming: filteredMovies.filter(m => m.status === 'UPCOMING').length,
        inactive: filteredMovies.filter(m => m.status === 'INACTIVE').length
    }), [filteredMovies]);

    const totalPages = useMemo(() => Math.ceil(filteredMovies.length / itemsPerPage) || 1, [filteredMovies.length, itemsPerPage]);
    const paginatedMovies = useMemo(() => filteredMovies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ), [filteredMovies, currentPage, itemsPerPage]);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'ONGOING': return 'am-badge am-badge-ongoing';
            case 'UPCOMING': return 'am-badge am-badge-upcoming';
            case 'INACTIVE': return 'am-badge am-badge-inactive';
            default: return 'am-badge';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ONGOING': return 'Đang chiếu';
            case 'UPCOMING': return 'Sắp chiếu';
            case 'INACTIVE': return 'Ngừng hoạt động';
            default: return status;
        }
    };

    return (
        <div className="am-page">
   
            <div className="am-header">
                <div>
                    <h2 className="am-title">
                        <FaFilm color="#3b82f6" /> Quản lý Kho Phim
                    </h2>
                    <p className="am-desc">Thêm mới phim, cập nhật trạng thái chiếu và quản lý poster.</p>
                </div>
                <button className="am-btn-primary" onClick={() => openModal()}>
                    <FaPlus /> Thêm Phim Mới
                </button>
            </div>

            <div className="am-stats-container">
                <div className="am-stat-card am-stat-primary">
                    <div className="am-stat-icon"><FaFilm /></div>
                    <div className="am-stat-info">
                        <span className="am-stat-label">Tổng số phim</span>
                        <span className="am-stat-value">{movieStats.total}</span>
                    </div>
                </div>
                <div className="am-stat-card am-stat-success">
                    <div className="am-stat-icon"><FaPlayCircle /></div>
                    <div className="am-stat-info">
                        <span className="am-stat-label">Đang chiếu</span>
                        <span className="am-stat-value">{movieStats.ongoing}</span>
                    </div>
                </div>
                <div className="am-stat-card am-stat-warning">
                    <div className="am-stat-icon"><FaFastForward /></div>
                    <div className="am-stat-info">
                        <span className="am-stat-label">Sắp chiếu</span>
                        <span className="am-stat-value">{movieStats.upcoming}</span>
                    </div>
                </div>
                <div className="am-stat-card am-stat-danger">
                    <div className="am-stat-icon"><FaTimesCircle /></div>
                    <div className="am-stat-info">
                        <span className="am-stat-label">Ngừng chiếu</span>
                        <span className="am-stat-value">{movieStats.inactive}</span>
                    </div>
                </div>
            </div>

            <div className="am-filter-card">
                <div className="am-filter-group" style={{ flex: 2, minWidth: '250px' }}>
                    <label>Tìm kiếm Phim</label>
                    <div className="am-input-wrapper">
                        <FaSearch className="am-input-icon" />
                        <input 
                            type="text" 
                            className="am-input"
                            placeholder="Nhập tên phim cần tìm..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="am-filter-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label>Trạng thái chiếu</label>
                    <div className="am-input-wrapper">
                        <FaFilter className="am-input-icon" />
                        <select 
                            className="am-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả phim</option>
                            <option value="ONGOING">Đang chiếu (Hôm nay)</option>
                            <option value="UPCOMING">Sắp chiếu (Trailer)</option>
                            <option value="INACTIVE">Ngừng hoạt động</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="am-table-card">
                <div className="am-table-wrapper">
                    <table className="am-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Poster</th>
                                <th>Thông tin Phim</th>
                                <th>Ngày ra mắt</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Đang tải danh sách phim...</td></tr>
                            ) : paginatedMovies.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                                        <FaFilm size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                        <div style={{ fontSize: '16px', fontWeight: '500' }}>Không tìm thấy phim nào phù hợp!</div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedMovies.map((movie) => (
                                    <tr key={movie.id}>
                                        <td>
                                            <img src={movie.posterUrl} alt="poster" className="am-poster-img" onError={(e) => e.target.src = 'https://png.pngtree.com/template/20220118/ourmid/pngtree-movie-poster-background-psd-template-image_811769.jpg'} />
                                        </td>
                                        <td>
                                            <div className="am-movie-title">{movie.title}</div>
                                            <div className="am-movie-duration">
                                                <FaClock color="#94a3b8" /> {movie.durationMinutes} phút
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px' }}>
                                                <FaCalendarAlt color="#cbd5e1" /> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getStatusClass(movie.status)}>
                                                {getStatusText(movie.status)}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button className="am-action-btn am-btn-edit" onClick={() => openModal(movie)} title="Sửa phim">
                                                    <FaEdit /> Sửa
                                                </button>
                                                {movie.status !== 'INACTIVE' && (
                                                    <button className="am-action-btn am-btn-danger" onClick={() => handleDelete(movie.id)} title="Ngừng chiếu">
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

                {!isLoading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                            Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1}</b> - <b>{Math.min(currentPage * itemsPerPage, filteredMovies.length)}</b> trong tổng số <b>{filteredMovies.length}</b> phim
                        </span>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '6px 12px', background: currentPage === 1 ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                            >
                                Trước
                            </button>
                            
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    disabled={page === '...'}
                                    style={{
                                        padding: '6px 12px',
                                        background: currentPage === page ? '#3b82f6' : (page === '...' ? 'transparent' : '#fff'),
                                        color: currentPage === page ? '#fff' : (page === '...' ? '#94a3b8' : '#475569'),
                                        border: page === '...' ? 'none' : (currentPage === page ? '1px solid #3b82f6' : '1px solid #cbd5e1'),
                                        borderRadius: '6px',
                                        fontWeight: currentPage === page ? 'bold' : '600',
                                        cursor: page === '...' ? 'default' : 'pointer',
                                        fontSize: '13px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ padding: '6px 12px', background: currentPage === totalPages ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL THÊM / SỬA PHIM */}
            {isModalOpen && (
                <div className="am-modal-overlay">
                    <div className="am-modal-content">
                        <div className="am-modal-header">
                            <h3>{editingMovie ? <><FaEdit color="#3b82f6" /> Cập nhật thông tin Phim</> : <><FaPlus color="#3b82f6" /> Thêm Phim Mới</>}</h3>
                            <button className="am-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="am-modal-body">
                                <div className="am-modal-col-left">
                                    {/* Các trường text giữ nguyên */}
                                    <div className="am-form-group">
                                        <label>Tiêu đề phim *</label>
                                        <input className="am-form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="VD: Avengers: Endgame" required />
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div className="am-form-group" style={{ flex: 1 }}>
                                            <label>Thời lượng (phút) *</label>
                                            <input type="number" className="am-form-input" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} placeholder="VD: 120" required />
                                        </div>
                                        <div className="am-form-group" style={{ flex: 1 }}>
                                            <label>Ngày phát hành *</label>
                                            <input type="date" className="am-form-input" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} required />
                                        </div>
                                    </div>
                                    <div className="am-form-group">
                                        <label>Trạng thái</label>
                                        <select className="am-form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ cursor: 'pointer' }}>
                                            <option value="UPCOMING">Sắp chiếu (Chỉ hiện Trailer)</option>
                                            <option value="ONGOING">Đang chiếu (Cho phép đặt vé)</option>
                                            <option value="INACTIVE">Ngừng hoạt động (Ẩn khỏi web)</option>
                                        </select>
                                    </div>
                                    <div className="am-form-group" style={{ marginBottom: 0 }}>
                                        <label>Mô tả nội dung</label>
                                        <textarea className="am-form-input" style={{ height: '110px', resize: 'none' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Nhập tóm tắt nội dung phim..." />
                                    </div>
                                </div>

                                <div className="am-modal-col-right">
                                    <div className="am-form-group">
                                        <label>Ảnh Poster *</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="am-form-input"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="am-poster-preview">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có ảnh</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="am-modal-footer">
                                <button type="button" className="am-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="am-btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '5px' }}></span>
                                            Đang xử lý...
                                        </>
                                    ) : (editingMovie ? 'Lưu thay đổi' : 'Thêm phim')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMovies;