import { useState, useEffect } from 'react';
import { getAllMovies, deleteMovie } from '../../api/MovieApi';
import { toast } from 'react-toastify';

const AdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const res = await getAllMovies();
            setMovies(res.data);
        } catch (error) {
            toast.error("Không thể tải danh sách phim!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phim này không? (Phim sẽ bị ẩn đi)")) {
            try {
                await deleteMovie(id);
                toast.success("Xóa phim thành công!");
                fetchMovies();
            } catch (error) {
                toast.error("Lỗi khi xóa phim!");
            }
        }
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🎬 Quản lý Phim</h2>
                <button className="btn-add">➕ Thêm Phim Mới</button>
            </div>

            {isLoading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Poster</th>
                            <th>Tên Phim</th>
                            <th>Thời lượng</th>
                            <th>Ngày chiếu</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.length > 0 ? (
                            movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td>
                                        <img 
                                            src={movie.posterUrl || "https://via.placeholder.com/50x75"} 
                                            alt={movie.title} 
                                            style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td><strong>{movie.title}</strong></td>
                                    <td>{movie.durationMinutes} phút</td>
                                    <td>{movie.releaseDate}</td>
                                    <td>
                                        <span className={`status-badge ${movie.status.toLowerCase()}`}>
                                            {movie.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-edit" style={{ marginRight: '10px' }}>Sửa</button>
                                        <button className="btn-delete" onClick={() => handleDelete(movie.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có bộ phim nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminMovies;