import { useState } from "react";
import { searchUser } from "../../services/api/StaffApi";

const StaffSupport = () => {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await searchUser(keyword.trim());

      console.log(res.data);

      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Staff Support</h2>

      <input
        type="text"
        placeholder="Enter customer email"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {data?.message && <p style={{ color: "red" }}>{data.message}</p>}

      {data && (
        <div>
          <h3>User Info</h3>

          <p>Username: {data.username}</p>

          <p>Email: {data.email}</p>

          <h3>Tickets</h3>

          {data?.tickets?.length === 0 ? (
            <p>User chưa mua vé</p>
          ) : (
            data.tickets.map((ticket) => (
              <div key={ticket.id}>
                QR: {ticket.qrCode}
                <br />
                CheckIn: {ticket.checkInStatus ? "Yes" : "No"}
                <hr />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StaffSupport;
