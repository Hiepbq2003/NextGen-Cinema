import {getAuth} from "../../utils/Auth.jsx";

const SeatApi = {
    getSeatsByShowtime: async (showtimeId) => {
        let api = `http://localhost:8080/api/seats/public/showtime/${showtimeId}`;
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },

    reserveSeats: async (showtimeId, seatIds) => {
        const auth = getAuth();
        console.log("Token: " + auth.token);
        let api = `http://localhost:8080/api/seats/reserve`;
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify({showtimeId: showtimeId, seatIds: seatIds}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },

    releaseSeats: async (showtimeId) => {
        let api = `http://localhost:8080/api/seats/public/release?showtimeId=${showtimeId}`;
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },
}
export default SeatApi;