import axios from "axios";

const API_URL = "http://localhost:8080/api/staff";

export const getDashboardStats = () => {
  return axios.get(`${API_URL}/dashboard`);
};

export const getTicketByQr = (qrCode) => {
  return axios.get(`${API_URL}/ticket?qrCode=${qrCode}`);
};

export const checkInTicket = (qrCode) => {
  const formData = new FormData();
  formData.append("qrCode", qrCode);

  return axios.post(`${API_URL}/checkin`, formData);
};

export const searchUser = (keyword) => {
  return axios.get(`${API_URL}/search-user`, {
    params: { keyword }
  });
};