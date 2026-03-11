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

    const [isEditingMap, setIsEditingMap] = useState(false);
    const [editRoomName, setEditRoomName] = useState('');
    const [activeType, setActiveType] = useState('NORMAL');
    const [modifiedSeatIds, setModifiedSeatIds] = useState(new Set());

    const styles = {
        container: { padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
        headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
        card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' },
        formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' },
        input: { width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' },
        label: { fontWeight: '600', color: '#495057', display: 'block', marginBottom: '8px' },
        btnPrimary: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
        btnSave: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
        btnCancel: { backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
        btnEdit: { backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
        screenBar: { width: '70%', height: '30px', background: '#b2d1f0', margin: '0 auto 40px auto', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transform: 'rotateX(-45deg)', textAlign: 'center', fontSize: '11px', color: '#101315', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '10px' },
        seatUnit: (type, isModified) => ({
            width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
            ...(type === 'VIP' ? { background: '#fff3cd', border: '2px solid #ffc107', color: '#856404' } :
                type === 'COUPLE' ? { background: '#f8d7da', border: '2px solid #dc3545', color: '#721c24' } :
                    { background: '#ffffff', border: '2px solid #6c757d', color: '#6c757d' }),
            ...(isModified ? { boxShadow: '0 0 8px #007bff' } : {})
        }),
        legendItem: (isActive) => ({
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 12px', borderRadius: '20px',
            border: isActive ? '2px solid #007bff' : '2px solid transparent',
            backgroundColor: isActive ? '#e7f1ff' : 'transparent',
            transition: '0.2s'
        }),
        legendBox: (type) => ({
            width: '18px', height: '18px', borderRadius: '4px', display: 'inline-block',
            ...(type === 'VIP' ? { background: '#ffc107' } : type === 'COUPLE' ? { background: '#dc3545' } : { background: '#6c757d' })
        }),
        table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
        td: { padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #eee' }
    };

    // --- Actions ---
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
            setSelectedRoom(room);
            setEditRoomName(room.name);
            setShowSeatMap(true);
            setIsEditingMap(false);
            setModifiedSeatIds(new Set());
        } catch (error) { toast.error("Lỗi tải sơ đồ!"); }
    };

    const handleSeatClick = (seat) => {
        if (!isEditingMap) return;
        setSeats(seats.map(s => s.id === seat.id ? { ...s, seatType: activeType } : s));
        setModifiedSeatIds(prev => new Set(prev).add(seat.id));
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
            fetchRooms();
            setIsEditingMap(false);
            setModifiedSeatIds(new Set());
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi lưu!");
        }
    };

    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.rowName]) acc[seat.rowName] = [];
        acc[seat.rowName].push(seat);
        return acc;
    }, {});

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={{ margin: 0 }}>🚪 Quản lý Phòng Chiếu</h2>
                {!showSeatMap && !showForm && (
                    <button style={styles.btnPrimary} onClick={() => {
                        setCurrentRoom({ name: '', totalSeats: 0, vipSeatsCount: 0, coupleSeatsCount: 0 });
                        setShowForm(true);
                    }}>+ Thêm Phòng</button>
                )}
            </div>

            {/* FORM THÊM MỚI */}
            {showForm && (
                <div style={styles.card}>
                    <h3 style={{ marginTop: 0 }}>Tạo phòng chiếu mới</h3>
                    <form onSubmit={handleCreateRoom}>
                        <div style={styles.formGrid}>
                            <div className="form-group">
                                <label style={styles.label}>Tên phòng</label>
                                <input style={styles.input} type="text" value={currentRoom.name}
                                    onChange={e => setCurrentRoom({ ...currentRoom, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label style={styles.label}>Tổng số ghế</label>
                                <input style={styles.input} type="number" value={currentRoom.totalSeats}
                                    onChange={e => setCurrentRoom({ ...currentRoom, totalSeats: parseInt(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label style={styles.label}>Số ghế VIP</label>
                                <input style={styles.input} type="number" value={currentRoom.vipSeatsCount}
                                    onChange={e => setCurrentRoom({ ...currentRoom, vipSeatsCount: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label style={styles.label}>Số ghế Couple</label>
                                <input style={styles.input} type="number" value={currentRoom.coupleSeatsCount}
                                    onChange={e => setCurrentRoom({ ...currentRoom, coupleSeatsCount: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" style={styles.btnSave}>Lưu dữ liệu</button>
                            <button type="button" style={styles.btnCancel} onClick={() => setShowForm(false)}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {/* SƠ ĐỒ GHẾ & CHẾ ĐỘ SỬA */}
            {showSeatMap && (
                <div style={{ ...styles.card, borderTop: '5px solid #007bff' }}>
                    <div style={styles.headerRow}>
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
                                <button style={styles.btnEdit} onClick={() => setIsEditingMap(true)}>Sửa</button>
                            ) : (
                                <button style={styles.btnSave} onClick={handleSaveEdit}>Lưu</button>
                            )}
                            <button style={styles.btnCancel} onClick={() => setShowSeatMap(false)}>Đóng</button>
                        </div>
                    </div>

                    {/* Legend cho phép chọn loại ghế khi đang sửa */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center' }}>
                        {['NORMAL', 'VIP', 'COUPLE'].map(type => (
                            <div
                                key={type}
                                style={styles.legendItem(isEditingMap && activeType === type)}
                                onClick={() => isEditingMap && setActiveType(type)}
                            >
                                <i style={styles.legendBox(type)}></i>
                                <span style={{ fontWeight: '600' }}>{type}</span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.screenBar}>MÀN HÌNH</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.keys(groupedSeats).sort().map(rowName => (
                            <div key={rowName} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                <span style={{ width: '30px', fontWeight: 'bold', color: '#adb5bd' }}>{rowName}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {groupedSeats[rowName].map(seat => (
                                        <div
                                            key={seat.id}
                                            style={styles.seatUnit(seat.seatType, modifiedSeatIds.has(seat.id))}
                                            onClick={() => handleSeatClick(seat)}
                                        >
                                            {seat.seatNumber}
                                        </div>
                                    ))}
                                </div>
                                <span style={{ width: '30px', fontWeight: 'bold', color: '#adb5bd' }}>{rowName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* DANH SÁCH PHÒNG */}
            {!showSeatMap && !showForm && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
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
                                    <td style={styles.td}>
                                        <strong>{room.name}</strong>
                                        {room.status === 'INACTIVE' && (
                                            <span style={{
                                                marginLeft: '8px',
                                                fontSize: '10px',
                                                backgroundColor: '#6c757d',
                                                color: '#fff',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontWeight: '600'
                                            }}>ĐANG ẨN</span>
                                        )}
                                    </td>
                                    <td style={styles.td}>{room.totalSeats} ghế</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                            
                                        <button
                                            style={{
                                                ...styles.btnPrimary,
                                                backgroundColor: '#17a2b8',
                                                marginRight: '10px',
                                                borderRadius: '20px',
                                                padding: '8px 16px'
                                            }}
                                            onClick={() => handleOpenMap(room)}
                                        >
                                         Sơ đồ
                                        </button>

                                        <button
                                            style={{
                                                ...styles.btnPrimary,
                                                backgroundColor: room.status === 'ACTIVE' ? '#dc3545' : '#28a745',
                                                color: 'white',
                                                borderRadius: '20px',
                                                padding: '8px 16px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'all 0.3s'
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