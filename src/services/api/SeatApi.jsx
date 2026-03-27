import {getAuth} from "../../utils/Auth.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const SeatApi = {
    getSeatsByShowtime: async (showtimeId) => {
        let api = `${BASE_URL}/seats/public/showtime/${showtimeId}`;
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
        let api = `${BASE_URL}/seats/reserve`;
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
        let api = `${BASE_URL}/seats/public/release?showtimeId=${showtimeId}`;
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

    toggleSeatHold: async (showtimeId, seatId) => {
        const auth = getAuth();
        let api = `${BASE_URL}/seats/toggle-hold`;
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth?.token}`
            },
            body: JSON.stringify({showtimeId: showtimeId, seatId: seatId}),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    }

}
export default SeatApi;