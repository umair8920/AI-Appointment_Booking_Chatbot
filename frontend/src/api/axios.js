import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// Chat API Functions
// ==============================

export const getChatSessions = async () => {
  const res = await api.get("/chat/sessions");
  return res.data.data;
};

export const startChatSession = async () => {
  const res = await api.post("/chat/start");
  return res.data.data; // returns session object
};

export const getConversation = async (sessionId) => {
  const res = await api.get(`/chat/${sessionId}`);
  return res.data.data;
};

export const sendChatMessage = async (sessionId, message, extra = {}) => {
  const res = await api.post("/chat/message", {
    session_id: sessionId,
    message,
    ...extra
  });

  return res.data.data; // full updated conversation
};

export const bookAppointment = async (appointment_date) => {
  const res = await api.post("/appointments/book", {
    appointment_date,
  });

  return res.data.data;
};

export const cancelAppointment = async (id) => {
  const res = await api.put(`/appointments/${id}/cancel`);
  return res.data.data;
};

export const getMyAppointments = async () => {
  const res = await api.get("/appointments/mine");
  return res.data.data;
};

export default api;