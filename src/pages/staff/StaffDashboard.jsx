const StaffDashboard = () => {
    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2>👋 Xin chào, Nhân viên!</h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #17a2b8' }}>
                    <h3 style={{ color: '#666', margin: 0 }}>Ca chiếu đang diễn ra</h3>
                    <h1 style={{ margin: '10px 0 0', fontSize: '30px' }}>5</h1>
                </div>
                
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #28a745' }}>
                    <h3 style={{ color: '#666', margin: 0 }}>Vé chờ soát hôm nay</h3>
                    <h1 style={{ margin: '10px 0 0', fontSize: '30px' }}>124</h1>
                </div>

                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #ffc107' }}>
                    <h3 style={{ color: '#666', margin: 0 }}>Khách mua tại quầy</h3>
                    <h1 style={{ margin: '10px 0 0', fontSize: '30px' }}>32</h1>
                </div>
            </div>
            
            <div style={{ marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3>Nhiệm vụ cần làm</h3>
                <p>1. Hỗ trợ khách hàng check-in vé qua mã đơn.</p>
                <p>2. Xử lý đặt vé trực tiếp cho khách Walk-in (Bán tại quầy).</p>
                <p>3. Giải quyết khiếu nại hoặc hủy đơn nếu có sự cố phòng chiếu.</p>
            </div>
        </div>
    );
};

export default StaffDashboard;