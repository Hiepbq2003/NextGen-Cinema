import { useState, useEffect } from 'react';
import {
    getAllRooms,
    deleteRoom,
    createRoom,
    updateRoom,
    getSeatsByRoomId,
    updateSeatType
} from '../../services/api/RoomApi.jsx';
import { toast } from 'react-toastify';
import '../../asset/style/SeatMapStyle.css';
import '../../asset/style/AdminRooms.css';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentRoom, setCurrentRoom] = useState({
        name: '',
        totalSeats: 0,
        vipSeatsCount: 0,
        coupleSeatsCount: 0
    });

    const [showSeatMap, setShowSeatMap] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    const [seats, setSeats] = useState([]);
    const [originalSeats, setOriginalSeats] = useState([]);

    const [isEditingMap, setIsEditingMap] = useState(false);
    const [editRoomName, setEditRoomName] = useState('');
    const [activeType, setActiveType] = useState('NORMAL');
    const [modifiedSeatIds, setModifiedSeatIds] = useState(new Set());

    useEffect(() => { fetchRooms(); }, []);

    const fetchRooms = async () => {
        try {
            const res = await getAllRooms();
            setRooms(res);
        } catch (error) { toast.error("Lỗi tải danh sách phòng!"); }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            await createRoom(currentRoom);
            toast.success("Tạo phòng mới thành công!");
            setShowForm(false);
            fetchRooms();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi tạo phòng!");
        }
    };

    const handleOpenMap = async (room) => {
        try {
            const res = await getSeatsByRoomId(room.id);
            setSeats(res);
            setOriginalSeats(res);
            setSelectedRoom(room);
            setEditRoomName(room.name);
            setShowSeatMap(true);
            setIsEditingMap(false);
            setModifiedSeatIds(new Set());
        } catch (error) { toast.error("Lỗi tải sơ đồ!"); }
    };

    const handleSeatClick = (seat) => {
        if (!isEditingMap) return;

        const originalType = originalSeats.find(s => s.id === seat.id).seatType;
        let newType;

        if (seat.seatType === activeType) {
            newType = originalType;
        } else {
            newType = activeType;
        }

        setSeats(seats.map(s => s.id === seat.id ? { ...s, seatType: newType } : s));

        setModifiedSeatIds(prev => {
            const newSet = new Set(prev);
            if (newType === originalType) {
                newSet.delete(seat.id);
            } else {
                newSet.add(seat.id);
            }
            return newSet;
        });
    };

    const handleSaveEdit = async () => {
        try {
            if (editRoomName !== selectedRoom.name) {
                await updateRoom(selectedRoom.id, {
                    name: editRoomName,
                    totalSeats: Number(selectedRoom.totalSeats)
                });
                setSelectedRoom(prev => ({ ...prev, name: editRoomName }));
            }

            const updatePromises = Array.from(modifiedSeatIds).map(id => {
                const seat = seats.find(s => s.id === id);
                return updateSeatType(id, seat.seatType);
            });
            await Promise.all(updatePromises);

            toast.success("Đã lưu thay đổi!");
            
            setOriginalSeats([...seats]);
            setModifiedSeatIds(new Set());
            setIsEditingMap(false);
            fetchRooms();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi lưu!");
        }
    };

    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.rowName]) acc[seat.rowName] = [];
        acc[seat.rowName].push(seat);
        return acc;
    }, {});

    const getAdminSeatClass = (seatType, isModified) => {
        let baseClass = 'seat available'; 
        
        if (seatType === 'VIP') baseClass += ' vip';
        else if (seatType === 'COUPLE') baseClass += ' couple';

        if (isModified) {
            baseClass += ' admin-modified';
        }
        return baseClass;
    };

    return (
        <div className="admin-rooms-container">
            <div className="admin-rooms-header-row">
                <h2 style={{ margin: 0 }}>🚪 Quản lý Phòng Chiếu</h2>
                {!showSeatMap && !showForm && (
                    <button className="admin-rooms-btn-primary" onClick={() => {
                        setCurrentRoom({ name: '', totalSeats: 0, vipSeatsCount: 0, coupleSeatsCount: 0 });
                        setShowForm(true);
                    }}>+ Thêm Phòng</button>
                )}
            </div>

            {showForm && (
                <div className="admin-rooms-card">
                    <h3 style={{ marginTop: 0 }}>Tạo phòng chiếu mới</h3>
                    <form onSubmit={handleCreateRoom}>
                        <div className="admin-rooms-form-grid">
                            <div className="form-group">
                                <label className="admin-rooms-label">Tên phòng</label>
                                <input className="admin-rooms-input" type="text" value={currentRoom.name}
                                    onChange={e => setCurrentRoom({ ...currentRoom, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="admin-rooms-label">Tổng số ghế</label>
                                <input className="admin-rooms-input" type="number" value={currentRoom.totalSeats}
                                    onChange={e => setCurrentRoom({ ...currentRoom, totalSeats: parseInt(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label className="admin-rooms-label">Số ghế VIP</label>
                                <input className="admin-rooms-input" type="number" value={currentRoom.vipSeatsCount}
                                    onChange={e => setCurrentRoom({ ...currentRoom, vipSeatsCount: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label className="admin-rooms-label">Số ghế Couple</label>
                                <input className="admin-rooms-input" type="number" value={currentRoom.coupleSeatsCount}
                                    onChange={e => setCurrentRoom({ ...currentRoom, coupleSeatsCount: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" className="admin-rooms-btn-save" style={{ marginRight: '10px' }}>Lưu dữ liệu</button>
                            <button type="button" className="admin-rooms-btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {showSeatMap && (
                <div className="admin-rooms-card" style={{ borderTop: '5px solid #007bff' }}>
                    <div className="admin-rooms-header-row">
                        {isEditingMap ? (
                            <input
                                style={{ fontSize: '1.2rem', padding: '8px', border: '1px solid #007bff', borderRadius: '4px' }}
                                value={editRoomName}
                                onChange={e => setEditRoomName(e.target.value)}
                            />
                        ) : (
                            <h3 style={{ margin: 0 }}>Sơ đồ phòng: {selectedRoom?.name}</h3>
                        )}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {!isEditingMap ? (
                                <button className="admin-rooms-btn-edit" onClick={() => setIsEditingMap(true)}>Sửa Layout</button>
                            ) : (
                                <button className="admin-rooms-btn-save" onClick={handleSaveEdit}>Lưu</button>
                            )}
                            <button className="admin-rooms-btn-cancel" onClick={() => setShowSeatMap(false)}>Đóng</button>
                        </div>
                    </div>

                    {isEditingMap && (
                        <div className="seat-legend" style={{ marginBottom: '30px' }}>
                            {['NORMAL', 'VIP', 'COUPLE'].map(type => {
                                const mapTypeClass = type === 'NORMAL' ? 'available' : type.toLowerCase();
                                const isActive = activeType === type;
                                return (
                                    <div
                                        key={type}
                                        className={`admin-seat-legend-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setActiveType(type)}
                                    >
                                        <span className={`seat-demo ${mapTypeClass}`}></span>
                                        <span style={{ fontWeight: '600' }}>{type}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="seat-map-container" style={{ padding: 0 }}>
                        <div className="screen">MÀN HÌNH</div>

                        <div className="seats-wrapper">
                            {Object.keys(groupedSeats).sort().map(rowName => (
                                <div key={rowName} className="seat-row">
                                    <span className="row-label" style={{ color: '#adb5bd' }}>{rowName}</span>
                                    <div className="seats-in-row">
                                        {groupedSeats[rowName]
                                            .sort((a, b) => a.seatNumber - b.seatNumber)
                                            .map(seat => (
                                                <div
                                                    key={seat.id}
                                                    className={getAdminSeatClass(seat.seatType, modifiedSeatIds.has(seat.id))}
                                                    onClick={() => handleSeatClick(seat)}
                                                >
                                                    {seat.seatNumber}
                                                </div>
                                            ))}
                                    </div>
                                    <span className="row-label" style={{ color: '#adb5bd' }}>{rowName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!showSeatMap && !showForm && (
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-rooms-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Tên Phòng</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Số Ghế</th>
                                <th style={{ textAlign: 'center', padding: '10px' }}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.id} style={{ opacity: room.status === 'INACTIVE' ? 0.7 : 1 }}>
                                    <td className="admin-rooms-td">
                                        <strong>{room.name}</strong>
                                        {room.status === 'INACTIVE' && (
                                            <span style={{
                                                marginLeft: '8px', fontSize: '10px', backgroundColor: '#6c757d',
                                                color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: '600'
                                            }}>ĐANG ẨN</span>
                                        )}
                                    </td>
                                    <td className="admin-rooms-td">{room.totalSeats} ghế</td>
                                    <td className="admin-rooms-td" style={{ textAlign: 'center' }}>
                                        <button
                                            className="admin-rooms-btn-primary"
                                            style={{ backgroundColor: '#17a2b8', marginRight: '10px', borderRadius: '20px', padding: '8px 16px' }}
                                            onClick={() => handleOpenMap(room)}
                                        >
                                            Sơ đồ
                                        </button>

                                        <button
                                            className="admin-rooms-btn-primary"
                                            style={{
                                                backgroundColor: room.status === 'ACTIVE' ? '#dc3545' : '#28a745',
                                                borderRadius: '20px', padding: '8px 16px'
                                            }}
                                            onClick={() => {
                                                const actionName = room.status === 'ACTIVE' ? "Ngừng hoạt động" : "Kích hoạt lại";
                                                if (window.confirm(`Bạn có chắc muốn ${actionName} phòng này?`)) {
                                                    deleteRoom(room.id).then(fetchRooms);
                                                }
                                            }}
                                        >
                                            {room.status === 'ACTIVE' ? "🚫 Ngừng hoạt động" : "✅ Kích hoạt lại"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminRooms;