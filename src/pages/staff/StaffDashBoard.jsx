import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/api/StaffApi";

const StaffDashboard = () => {

  const [stats, setStats] = useState({
    showtimes: 0,
    ticketsSold: 0,
    checkedIn: 0,
    notCheckedIn: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const res = await getDashboardStats();

      setStats(res.data);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div>

      <h2>Staff Dashboard</h2>

      <p>Showtimes: {stats.showtimes}</p>

      <p>Tickets Sold: {stats.ticketsSold}</p>

      <p>Checked In: {stats.checkedIn}</p>

      <p>Not Checked In: {stats.notCheckedIn}</p>

    </div>
  );
};

export default StaffDashboard;