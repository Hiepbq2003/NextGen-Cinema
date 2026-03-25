import AxiosClient from "./AxiosClient";

export const getAllRooms = () => {
    return AxiosClient.get('/rooms');
};

export const createRoom = (data) => {
    return AxiosClient.post('/rooms', data);
};

export const updateRoom = (id, data) => {
    return AxiosClient.put(`/rooms/${id}`, data);
};

export const deleteRoom = (id) => {
    return AxiosClient.delete(`/rooms/${id}`);
};

export const getSeatsByRoomId = (roomId) => {
    return AxiosClient.get(`/rooms/${roomId}/seats`);
};

export const updateSeatType = (seatId, type) => {
    return AxiosClient.patch(`/rooms/seats/${seatId}`, null, {
        params: { type }
    });
};

export const getRoomById = (id) => {
    return AxiosClient.get(`/rooms/${id}`);
};