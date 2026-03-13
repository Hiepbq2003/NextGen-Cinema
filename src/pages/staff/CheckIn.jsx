import { useState } from "react";
import { checkInTicket } from "../../services/api/StaffApi";

const CheckIn = () => {

  const [qrCode, setQrCode] = useState("");
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {

    try {

      const res = await checkInTicket(qrCode);

      setMessage(res.data.message);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div>

      <h2>Ticket Check-In</h2>

      <input
        type="text"
        placeholder="Enter QR code"
        value={qrCode}
        onChange={(e) => setQrCode(e.target.value)}
      />

      <button onClick={handleCheckIn}>
        Check In
      </button>

      <p>{message}</p>

    </div>
  );
};

export default CheckIn;