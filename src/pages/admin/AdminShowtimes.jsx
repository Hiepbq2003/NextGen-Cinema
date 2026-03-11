import { useState, useEffect } from 'react';
import { getAllShowtimes, createShowtime, cancelShowtime } from '../../services/api/ShowtimeApi';
import { getAllMovies } from '../../services/api/MovieApi';
import { getAllRooms } from '../../services/api/RoomApi';
import { toast } from 'react-toastify';

const AdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        movieId: '',
        roomId: '',
        startTime: '',
        basePrice: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [showtimesRes, moviesRes, roomsRes] = await Promise.all([
                getAllShowtimes(),
                getAllMovies(),
                getAllRooms()
            ]);
            setMovies(moviesRes.filter(m => m.status === 'ONGOING' || m.status === 'UPCOMING'));
            setRooms(roomsRes);
            setShowtimes(showtimesRes);
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
        if (!formData.movieId) {
            toast.error("Vui lòng chọn Phim"); return false;
        }
        if (!formData.roomId) {
            toast.error("Vui lòng chọn Phòng chiếu"); return false;
        }
        if (!formData.startTime) {
            toast.error("Vui lòng chọn Giờ bắt đầu chiếu"); return false;
        }
        if (!formData.basePrice || Number(formData.basePrice) <= 0) {
            toast.error("Giá vé cơ bản phải lớn hơn 0"); return false;
        }

        const startTimeDate = new Date(formData.startTime);
        const now = new Date();

        if (startTimeDate <= now) {
            toast.error("Lỗi: Không thể xếp lịch chiếu cho thời gian trong quá khứ!");
            return false;
        }

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
            toast.success("Thêm suất chiếu thành công! Đã tự động sinh ghế trống.");
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi xếp lịch! (Có thể do trùng phòng)");
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn HỦY suất chiếu này?")) {
            try {
                await cancelShowtime(id);
                toast.success("Đã hủy suất chiếu");
                fetchData();
            } catch (error) {
                toast.error("Thao tác thất bại");
            }
        }
    };

    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2>📅 Quản lý Lịch chiếu</h2>
                <button className="btn-add" onClick={openModal}>➕ Xếp lịch chiếu mới</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Phim</th>
                        <th>Phòng</th>
                        <th>Thời gian chiếu</th>
                        <th>Thời gian kết thúc</th>
                        <th>Giá vé (Gốc)</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {showtimes.map((st) => (
                        <tr key={st.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={st.posterUrl} alt="poster" style={{ width: '40px', borderRadius: '4px' }} />
                                    <strong>{st.movieTitle}</strong>
                                </div>
                            </td>
                            <td>Phòng {st.roomName}</td>
                            <td><span className="time-badge start-time">{new Date(st.startTime).toLocaleString('vi-VN')}</span></td>
                            <td><span className="time-badge end-time">{new Date(st.endTime).toLocaleString('vi-VN')}</span></td>
                            <td style={{ color: '#e71a0f', fontWeight: 'bold' }}>{formatVND(st.basePrice)}</td>
                            <td>
                                <span className={`status-badge ${(st.status || 'SCHEDULED').toLowerCase()}`}>
                                    {(st.status || 'SCHEDULED') === 'SCHEDULED' && 'Đã xếp lịch'}
                                    {st.status === 'NOW_SHOWING' && 'Đang chiếu'}
                                    {st.status === 'ENDED' && 'Đã kết thúc'}
                                    {st.status === 'CANCELLED' && 'Đã hủy'}
                                </span>
                            </td>
                            <td>
                                {(st.status || 'SCHEDULED') === 'SCHEDULED' && (
                                    <button className="btn-delete" onClick={() => handleCancel(st.id)}>Hủy lịch</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>Tạo lịch chiếu phim</h3>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Chọn Phim *</label>
                                <select className="form-input" value={formData.movieId} onChange={e => setFormData({ ...formData, movieId: e.target.value })} required>
                                    <option value="">-- Chọn phim --</option>
                                    {movies.map(m => (
                                        <option key={m.id} value={m.id}>{m.title} ({m.durationMinutes} phút)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Chọn Phòng chiếu *</label>
                                <select className="form-input" value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} required>
                                    <option value="">-- Chọn phòng --</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>Phòng {r.name} ({r.totalSeats} ghế)</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Giờ bắt đầu chiếu *</label>
                                    <input
                                        className="form-input"
                                        type="datetime-local"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                    />
                                    <small style={{ color: '#888', marginTop: '4px' }}>Giờ kết thúc sẽ tự động tính = Thời lượng phim + 15p dọn rạp</small>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Giá vé cơ bản (VNĐ) *</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        placeholder="Ví dụ: 80000"
                                        value={formData.basePrice}
                                        onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn-save">Xác nhận xếp lịch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShowtimes;