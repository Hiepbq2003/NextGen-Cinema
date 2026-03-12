import { useState, useEffect } from 'react';
import { getAllShowtimes, createShowtime, cancelShowtime } from '../../services/api/ShowtimeApi';
import { getAllMovies } from '../../services/api/MovieApi';
import { getAllRooms } from '../../services/api/RoomApi';
import { toast } from 'react-toastify';
import { FaCalendarPlus, FaSearch, FaFilter, FaDoorOpen, FaClock, FaTicketAlt, FaFilm , FaPlus  } from 'react-icons/fa';
import '../../asset/style/AdminShowtimes.css';

const AdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [roomFilter, setRoomFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({ movieId: '', roomId: '', startTime: '', basePrice: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [showtimesRes, moviesRes, roomsRes] = await Promise.all([
                getAllShowtimes(), getAllMovies(), getAllRooms()
            ]);
            setMovies(moviesRes.filter(m => m.status === 'ONGOING' || m.status === 'UPCOMING'));
            setRooms(roomsRes);
            setShowtimes(Array.isArray(showtimesRes) ? showtimesRes.sort((a, b) => b.id - a.id) : []);
        } catch (error) {
            toast.error("Không thể tải dữ liệu Lịch chiếu!");
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setFormData({ movieId: '', roomId: '', startTime: '', basePrice: '' });
        setIsModalOpen(true);
    };

    const validateForm = () => {
        if (!formData.movieId) { toast.error("Vui lòng chọn Phim"); return false; }
        if (!formData.roomId) { toast.error("Vui lòng chọn Phòng chiếu"); return false; }
        if (!formData.startTime) { toast.error("Vui lòng chọn Giờ bắt đầu"); return false; }
        if (!formData.basePrice || Number(formData.basePrice) <= 0) { toast.error("Giá vé phải lớn hơn 0"); return false; }
        if (new Date(formData.startTime) <= new Date()) { toast.error("Không thể xếp lịch cho quá khứ!"); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await createShowtime({
                ...formData,
                movieId: parseInt(formData.movieId),
                roomId: parseInt(formData.roomId),
                basePrice: parseFloat(formData.basePrice)
            });
            toast.success("Thêm suất chiếu thành công!");
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi xếp lịch (Có thể trùng phòng)");
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn HỦY suất chiếu này?")) {
            try {
                await cancelShowtime(id);
                toast.success("Đã hủy suất chiếu");
                fetchData();
            } catch (error) { toast.error("Thao tác thất bại"); }
        }
    };

    const filteredShowtimes = showtimes.filter(st => {
        const matchSearch = st.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRoom = roomFilter === 'ALL' || st.roomId?.toString() === roomFilter;
        const matchStatus = statusFilter === 'ALL' || st.status === statusFilter;
        return matchSearch && matchRoom && matchStatus;
    });

    const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage) || 1;
    const paginatedShowtimes = filteredShowtimes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
        else {
            if (currentPage <= 3) pages.push(1, 2, 3, 4, '...', totalPages);
            else if (currentPage >= totalPages - 2) pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            else pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
        return pages;
    };

    useEffect(() => { setCurrentPage(1); }, [searchTerm, roomFilter, statusFilter]);

    const formatVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="as-page">

            <div className="as-header">
                <div>
                    <h2 className="as-title"><FaCalendarPlus color="#3b82f6" /> Quản lý Lịch chiếu</h2>
                    <p className="as-desc">Sắp xếp khung giờ chiếu phim và quản lý phòng trống.</p>
                </div>
                <button className="as-btn-primary" onClick={openModal}><FaPlus /> Xếp lịch mới</button>
            </div>

            <div className="as-filter-card">
                <div className="as-filter-group" style={{ flex: 2 }}>
                    <label>Tìm kiếm phim</label>
                    <div className="as-input-wrapper">
                        <FaSearch className="as-input-icon" />
                        <input type="text" className="as-input" placeholder="Nhập tên phim..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="as-filter-group">
                    <label>Phòng chiếu</label>
                    <div className="as-input-wrapper">
                        <FaDoorOpen className="as-input-icon" />
                        <select className="as-select" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
                            <option value="ALL">Tất cả phòng</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>Phòng {r.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="as-filter-group">
                    <label>Trạng thái</label>
                    <div className="as-input-wrapper">
                        <FaFilter className="as-input-icon" />
                        <select className="as-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="ALL">Tất cả</option>
                            <option value="SCHEDULED">Đã xếp lịch</option>
                            <option value="NOW_SHOWING">Đang chiếu</option>
                            <option value="ENDED">Đã kết thúc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="as-table-card">
                <div className="as-table-wrapper">
                    <table className="as-table">
                        <thead>
                            <tr>
                                <th>Phim & Phòng</th>
                                <th>Thời gian</th>
                                <th>Giá vé gốc</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td></tr>
                            ) : paginatedShowtimes.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Không có lịch chiếu nào.</td></tr>
                            ) : (
                                paginatedShowtimes.map(st => (
                                    <tr key={st.id}>
                                        <td>
                                            <div className="as-movie-cell">
                                                <img src={st.posterUrl} alt="p" className="as-poster" onError={e => e.target.src='https://via.placeholder.com/45x65?text=No+Img'} />
                                                <div className="as-movie-info">
                                                    <strong>{st.movieTitle}</strong>
                                                    <span className="as-room-tag">Phòng {st.roomName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="as-time-badge">
                                                <span className="as-time-start"><FaClock size={12} /> {new Date(st.startTime).toLocaleString('vi-VN')}</span>
                                                <span className="as-time-end">Kết thúc: {new Date(st.endTime).toLocaleTimeString('vi-VN')}</span>
                                            </div>
                                        </td>
                                        <td><span className="as-price">{formatVND(st.basePrice)}</span></td>
                                        <td>
                                            <span className={`as-badge as-badge-${(st.status || 'SCHEDULED').toLowerCase()}`}>
                                                {st.status === 'SCHEDULED' ? 'Đã xếp lịch' : st.status === 'NOW_SHOWING' ? 'Đang chiếu' : st.status === 'CANCELLED' ? 'Đã hủy' : 'Kết thúc'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {st.status === 'SCHEDULED' && (
                                                <button className="as-btn-cancel" onClick={() => handleCancel(st.id)}>Hủy lịch</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="as-pagination">
                        <span className="as-page-info">Trang <b>{currentPage}</b> / <b>{totalPages}</b></span>
                        <div className="as-page-controls">
                            <button className="as-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Trước</button>
                            {getPageNumbers().map((n, i) => (
                                <button key={i} className={`as-page-btn ${currentPage === n ? 'active' : ''}`} onClick={() => typeof n === 'number' && setCurrentPage(n)} disabled={n === '...'}>{n}</button>
                            ))}
                            <button className="as-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="as-modal-overlay">
                    <div className="as-modal-content">
                        <div className="as-modal-header">
                            <h3>🎬 Xếp lịch chiếu mới</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="as-modal-body">
                                <div className="as-form-group">
                                    <label>Chọn Phim *</label>
                                    <select className="as-form-input" value={formData.movieId} onChange={e => setFormData({ ...formData, movieId: e.target.value })} required>
                                        <option value="">-- Chọn phim --</option>
                                        {movies.map(m => <option key={m.id} value={m.id}>{m.title} ({m.durationMinutes}p)</option>)}
                                    </select>
                                </div>
                                <div className="as-form-group">
                                    <label>Chọn Phòng *</label>
                                    <select className="as-form-input" value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} required>
                                        <option value="">-- Chọn phòng --</option>
                                        {rooms.map(r => <option key={r.id} value={r.id}>Phòng {r.name} ({r.totalSeats} ghế)</option>)}
                                    </select>
                                </div>
                                <div className="as-form-group">
                                    <label>Giờ bắt đầu *</label>
                                    <input className="as-form-input" type="datetime-local" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required />
                                </div>
                                <div className="as-form-group">
                                    <label>Giá vé cơ bản (VNĐ) *</label>
                                    <input className="as-form-input" type="number" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} placeholder="VD: 85000" required />
                                </div>
                            </div>
                            <div className="as-modal-footer">
                                <button type="button" className="as-btn-cancel" style={{ border: '1px solid #cbd5e1', color: '#475569' }} onClick={() => setIsModalOpen(false)}>Đóng</button>
                                <button type="submit" className="as-btn-primary">Xác nhận xếp lịch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShowtimes;