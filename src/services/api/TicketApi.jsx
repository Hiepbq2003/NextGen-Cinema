import AxiosClient from "./AxiosClient";

export const checkInTicket = (qrCode) => {
    return AxiosClient.patch(`/admin/tickets/check-in/${qrCode}`);
};