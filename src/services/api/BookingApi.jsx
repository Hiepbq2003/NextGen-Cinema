import {getAuth} from "../../utils/Auth.jsx";

const auth = getAuth();
const BookingApi = {
    createBooking: async (data) => {
        let api = `http://localhost:8080/api/bookings`;
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },

    confirmBooking: async (bookingId) => {
        let api = `http://localhost:8080/api/bookings/${bookingId}/confirm`;
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },

    cancelBooking: async (bookingId) => {
        let api = `http://localhost:8080/api/bookings/${bookingId}/cancel`;
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    },
}
export default BookingApi;