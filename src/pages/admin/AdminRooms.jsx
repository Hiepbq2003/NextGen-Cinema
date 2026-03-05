import { useState, useEffect } from 'react';
import { getAllRooms, deleteRoom, createRoom, updateRoom, getSeatsByRoomId } from '../../services/api/RoomApi.jsx';
import { toast } from 'react-toastify';
import './AdminPage.css';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [showForm, setShowForm] = useState(false);
    const [currentRoom, setCurrentRoom] = useState({ name: '', totalSeats: 0 });

    const [showSeatMap, setShowSeatMap] = useState(false);
    const [selectedRoomName, setSelectedRoomName] = useState("");
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const res = await getAllRooms();
            setRooms(res); 
        } catch (error) {
            toast.error("Không thể tải danh sách phòng!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentRoom.id) {
                await updateRoom(currentRoom.id, currentRoom);
                toast.success("Cập nhật phòng thành công!");
            } else {
                await createRoom(currentRoom);
                toast.success("Thêm phòng mới thành công! Hệ thống đã tự động tạo sơ đồ ghế.");
            }
            setShowForm(false);
            fetchRooms();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi thao tác!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
            try {
                await deleteRoom(id);
                toast.success("Xóa thành công!");
                fetchRooms();
            } catch (error) {
                toast.error("Phòng đang có dữ liệu ràng buộc, không thể xóa!");
            }
        }
    };

    const handleViewSeats = async (roomId, roomName) => {
        try {
            const res = await getSeatsByRoomId(roomId);
            setSeats(res);
            setSelectedRoomName(roomName);
            setShowSeatMap(true);
        } catch (error) {
            toast.error("Không thể lấy sơ đồ ghế!");
        }
    };

    const getGroupedSeats = () => {
        return seats.reduce((acc, seat) => {
            if (!acc[seat.rowName]) acc[seat.rowName] = [];
            acc[seat.rowName].push(seat);
            return acc;
        }, {});
    };

    const groupedSeats = getGroupedSeats();

    return (
        <div className="admin-page" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>🚪 Quản lý Phòng Chiếu</h2>
                {!showForm && !showSeatMap && (
                    <button className="btn-add" onClick={() => { setCurrentRoom({ name: '', totalSeats: 0 }); setShowForm(true); }}>
                        ➕ Thêm Phòng
                    </button>
                )}
            </div>

            {/* FORM THÊM/SỬA PHÒNG */}
            {showForm && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>{currentRoom.id ? 'Sửa phòng' : 'Thêm phòng mới'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Tên phòng</label>
                            <input className="form-control" value={currentRoom.name} onChange={(e) => setCurrentRoom({...currentRoom, name: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Số ghế</label>
                            <input className="form-control" type="number" value={currentRoom.totalSeats} onChange={(e) => setCurrentRoom({...currentRoom, totalSeats: e.target.value})} required />
                        </div>
                        <button type="submit" className="btn-submit" style={{ width: 'auto', marginTop: 0 }}>Lưu</button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn-delete" style={{ background: '#6c757d' }}>Hủy</button>
                    </form>
                </div>
            )}

            {/* SƠ ĐỒ GHẾ (MODAL HOẶC PANEL BÊN DƯỚI) */}
            {showSeatMap && (
                <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Màn hình chiếu - Phòng {selectedRoomName}</h3>
                        <button onClick={() => setShowSeatMap(false)} className="btn-delete" style={{ background: '#6c757d' }}>Đóng sơ đồ</button>
                    </div>
                    
                    {/* Vệt màn hình */}
                    <div style={{ width: '100%', height: '40px', background: '#ccc', borderRadius: '50% 50% 0 0', marginBottom: '40px', textAlign: 'center', color: '#050404', paddingTop: '10px' }}>
                        MÀN HÌNH
                    </div>

                    {/* Lưới render ghế */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        {Object.keys(groupedSeats).map(rowName => (
                            <div key={rowName} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <strong style={{ width: '30px', textAlign: 'center' }}>{rowName}</strong>
                                {groupedSeats[rowName].map(seat => (
                                    <div 
                                        key={seat.id} 
                                        style={{
                                            width: '40px', 
                                            height: '40px', 
                                            border: '2px solid #007bff', 
                                            borderRadius: '5px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#007bff'
                                        }}
                                        title={`Ghế ${rowName}${seat.seatNumber} - Loại: ${seat.seatType}`}
                                    >
                                        {seat.seatNumber}
                                    </div>
                                ))}
                                <strong style={{ width: '30px', textAlign: 'center' }}>{rowName}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* BẢNG DANH SÁCH */}
            {!showSeatMap && (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Phòng</th>
                            <th>Tổng số ghế</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td>{room.id}</td>
                                <td><strong>{room.name}</strong></td>
                                <td>{room.totalSeats} ghế</td>
                                <td>
                                    <button onClick={() => handleViewSeats(room.id, room.name)} style={{ marginRight: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Xem sơ đồ</button>
                                    <button className="btn-edit" onClick={() => { setCurrentRoom(room); setShowForm(true); }}>Sửa</button>
                                    <button className="btn-delete" onClick={() => handleDelete(room.id)} style={{ marginLeft: '10px' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminRooms;