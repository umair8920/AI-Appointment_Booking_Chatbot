import { useState, useEffect, useRef } from "react";
import {
  getConversation,
  sendChatMessage,
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
} from "@/api/axios";

export default function ChatContent({ activeSession }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const messagesEndRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      setAppointments([]);
      return;
    }
    loadConversation(activeSession);
    loadAppointments();
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (sessionId) => {
    const data = await getConversation(sessionId);
    setMessages(data);
  };

  const loadAppointments = async () => {
    const data = await getMyAppointments();
    setAppointments(data);
  };

  const handleSend = async () => {
    if (!text.trim() || !activeSession || loading) return;

    setErrorMessage(null); // Clear previous error
    setLoading(true);

    try {
      const updatedConversation = await sendChatMessage(activeSession, text);
      setMessages(updatedConversation);
      setText("");
    } catch (err) {
      if (err.response?.status === 429) {
        setErrorMessage("You've reached the chat limit. Please try again in a few minutes.");
      } else {
        setErrorMessage(
          err.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilitySubmit = async () => {
    if (!availabilityDate || !availabilityTime) return;
    const isoDate = new Date(`${availabilityDate}T${availabilityTime}:00Z`).toISOString();
    setLoading(true);
    const updatedConversation = await sendChatMessage(activeSession, "Checking availability", {
      appointment_date: isoDate,
    });
    setMessages(updatedConversation);
    setActiveForm(null);
    setAvailabilityDate("");
    setAvailabilityTime("");
    setLoading(false);
  };

  const handleBookingSubmit = async () => {
    if (!bookingDate || !bookingTime) return;
    const isoDate = new Date(`${bookingDate}T${bookingTime}:00Z`).toISOString();
    setLoading(true);
    try {
      const booking = await bookAppointment(isoDate);
      const updatedConversation = await sendChatMessage(activeSession, "Booking completed", {
        backend_result: booking,
      });
      setMessages(updatedConversation);
      await loadAppointments();
    } catch (err) {
      const updatedConversation = await sendChatMessage(activeSession, "Booking failed", {
        error: err.response?.data?.message,
      });
      setMessages(updatedConversation);
    }
    setActiveForm(null);
    setBookingDate("");
    setBookingTime("");
    setLoading(false);
  };

  const handleCancelSubmit = async () => {
    if (!selectedAppointmentId) return;
    setLoading(true);
    try {
      const cancelled = await cancelAppointment(selectedAppointmentId);
      const updatedConversation = await sendChatMessage(activeSession, "Cancellation completed", {
        backend_result: cancelled,
      });
      setMessages(updatedConversation);
      await loadAppointments();
    } catch (err) {
      const updatedConversation = await sendChatMessage(activeSession, "Cancellation failed", {
        error: err.response?.data?.message,
      });
      setMessages(updatedConversation);
    }
    setActiveForm(null);
    setSelectedAppointmentId("");
    setLoading(false);
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);

    return today.toISOString().split("T")[0];
  };

  const minDate = getTomorrowDate();

  if (!activeSession) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#94a3b8",
        fontSize: "1rem"
      }}>
        <div style={{ textAlign: "center" }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ opacity: 0.5, margin: "0 auto 1rem" }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ margin: 0, marginBottom: "0.5rem" }}>Select or create a chat session to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      maxWidth: "900px",
      margin: "0 auto",
      padding: "1.5rem"
    }}>
      {/* MESSAGES */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginBottom: "1.5rem",
        paddingRight: "0.5rem"
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                wordWrap: "break-word",
                background: msg.sender === "user"
                  ? "linear-gradient(to right, #2563eb, #9333ea)"
                  : "#f1f5f9",
                color: msg.sender === "user" ? "white" : "#334155",
                fontWeight: msg.sender === "user" ? 500 : 400,
                boxShadow: msg.sender === "user"
                  ? "0 4px 6px -1px rgba(37, 99, 235, 0.1)"
                  : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                animation: "fadeIn 0.3s ease-out"
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            color: "#94a3b8",
            fontSize: "0.875rem",
            marginTop: "1rem"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#94a3b8",
              animation: "pulse 1.4s infinite"
            }}></div>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#94a3b8",
              animation: "pulse 1.4s infinite 0.2s"
            }}></div>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#94a3b8",
              animation: "pulse 1.4s infinite 0.4s"
            }}></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ACTION SECTION */}
      <div style={{
        borderTop: "1px solid #e2e8f0",
        paddingTop: "1.5rem",
        background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => {
              setActiveForm("availability");
              setAvailabilityDate(minDate);
            }}
            disabled={loading}
            style={{
              paddingLeft: "1rem",
              paddingRight: "1rem",
              height: "40px",
              background: "linear-gradient(to right, #2563eb, #9333ea)",
              color: "white",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              fontSize: "0.875rem",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
              fontFamily: "inherit"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                e.target.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.2)";
              }
            }}
          >
            📅 Check Availability
          </button>

          <button
            onClick={() => {
              setActiveForm("booking");
              setBookingDate(minDate);
            }}
            disabled={loading}
            style={{
              paddingLeft: "1rem",
              paddingRight: "1rem",
              height: "40px",
              background: "linear-gradient(to right, #2563eb, #9333ea)",
              color: "white",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              fontSize: "0.875rem",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
              fontFamily: "inherit"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                e.target.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.2)";
              }
            }}
          >
            ✅ Book Appointment
          </button>

          <button
            onClick={() => setActiveForm("cancel")}
            disabled={loading || appointments.filter(a => a.status === "confirmed").length === 0}
            style={{
              paddingLeft: "1rem",
              paddingRight: "1rem",
              height: "40px",
              background: appointments.filter(a => a.status === "confirmed").length === 0
                ? "#e2e8f0"
                : "linear-gradient(to right, #2563eb, #9333ea)",
              color: appointments.filter(a => a.status === "confirmed").length === 0
                ? "#94a3b8"
                : "white",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              cursor: (loading || appointments.filter(a => a.status === "confirmed").length === 0) ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              fontSize: "0.875rem",
              opacity: loading ? 0.7 : 1,
              boxShadow: appointments.filter(a => a.status === "confirmed").length === 0
                ? "none"
                : "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
              fontFamily: "inherit"
            }}
            onMouseEnter={(e) => {
              if (!loading && appointments.filter(a => a.status === "confirmed").length > 0) {
                e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                e.target.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && appointments.filter(a => a.status === "confirmed").length > 0) {
                e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.2)";
              }
            }}
          >
            ❌ Cancel Appointment
          </button>
        </div>

        {/* Availability Form */}
        {activeForm === "availability" && (
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "1rem",
            borderRadius: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>Select Date</label>
            <input
              type="date"
              min={minDate}
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
              style={{
                height: "40px",
                padding: "0 1rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                background: "white",
                color: "#0f172a",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            />

            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>Select Time</label>
            <select
              value={availabilityTime}
              onChange={(e) => setAvailabilityTime(e.target.value)}
              style={{
                height: "40px",
                padding: "0 1rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                background: "white",
                color: "#0f172a",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleAvailabilitySubmit}
                disabled={!availabilityDate || !availabilityTime}
                style={{
                  flex: 1,
                  height: "40px",
                  background: !availabilityDate || !availabilityTime ? "#e2e8f0" : "linear-gradient(to right, #2563eb, #9333ea)",
                  color: !availabilityDate || !availabilityTime ? "#94a3b8" : "white",
                  fontWeight: 600,
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: !availabilityDate || !availabilityTime ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                  if (availabilityDate && availabilityTime) {
                    e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (availabilityDate && availabilityTime) {
                    e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                  }
                }}
              >
                Check
              </button>
              <button
                onClick={() => setActiveForm(null)}
                style={{
                  flex: 1,
                  height: "40px",
                  background: "white",
                  color: "#334155",
                  fontWeight: 600,
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f1f5f9";
                  e.target.style.borderColor = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#cbd5e1";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {activeForm === "booking" && (
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "1rem",
            borderRadius: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>Select Date</label>
            <input
              type="date"
              min={minDate}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              style={{
                height: "40px",
                padding: "0 1rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                background: "white",
                color: "#0f172a",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            />

            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>Select Time</label>
            <select
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              style={{
                height: "40px",
                padding: "0 1rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                background: "white",
                color: "#0f172a",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleBookingSubmit}
                disabled={!bookingDate || !bookingTime}
                style={{
                  flex: 1,
                  height: "40px",
                  background: !bookingDate || !bookingTime ? "#e2e8f0" : "linear-gradient(to right, #2563eb, #9333ea)",
                  color: !bookingDate || !bookingTime ? "#94a3b8" : "white",
                  fontWeight: 600,
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: !bookingDate || !bookingTime ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                  if (bookingDate && bookingTime) {
                    e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (bookingDate && bookingTime) {
                    e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                  }
                }}
              >
                Book
              </button>
              <button
                onClick={() => setActiveForm(null)}
                style={{
                  flex: 1,
                  height: "40px",
                  background: "white",
                  color: "#334155",
                  fontWeight: 600,
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f1f5f9";
                  e.target.style.borderColor = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#cbd5e1";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cancel Form */}
        {activeForm === "cancel" && (
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "1rem",
            borderRadius: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>Select Appointment</label>
            <select
              value={selectedAppointmentId}
              onChange={(e) => setSelectedAppointmentId(e.target.value)}
              style={{
                height: "40px",
                padding: "0 1rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                background: "white",
                color: "#0f172a",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Select Appointment</option>
              {appointments
                .filter(a => a.status === "confirmed")
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {new Date(a.appointment_date).toUTCString()}
                  </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleCancelSubmit}
                disabled={!selectedAppointmentId}
                style={{
                  flex: 1,
                  height: "40px",
                  background: !selectedAppointmentId ? "#e2e8f0" : "linear-gradient(to right, #2563eb, #9333ea)",
                  color: !selectedAppointmentId ? "#94a3b8" : "white",
                  fontWeight: 600,
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: !selectedAppointmentId ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                  if (selectedAppointmentId) {
                    e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAppointmentId) {
                    e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                  }
                }}
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => setActiveForm(null)}
                style={{
                  flex: 1,
                  height: "40px",
                  background: "white",
                  color: "#334155",
                  fontWeight: 600,
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                  fontFamily: "inherit"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f1f5f9";
                  e.target.style.borderColor = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#cbd5e1";
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              border: "1px solid #fecaca"
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Chat Input */}
        <div style={{
          display: "flex",
          gap: "0.75rem"
        }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your appointment..."
            disabled={loading}
            style={{
              flex: 1,
              height: "44px",
              padding: "0 1rem",
              border: "1px solid #cbd5e1",
              borderRadius: "0.5rem",
              background: "white",
              color: "#0f172a",
              fontSize: "0.875rem",
              fontFamily: "inherit",
              transition: "all 0.2s",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "text"
            }}
            onFocus={(e) => {
              if (!loading) {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#cbd5e1";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              height: "44px",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              background: loading ? "#e2e8f0" : "linear-gradient(to right, #2563eb, #9333ea)",
              color: loading ? "#94a3b8" : "white",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              fontSize: "0.875rem",
              fontFamily: "inherit",
              boxShadow: loading ? "none" : "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(to right, #1d4ed8, #7e22ce)";
                e.target.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = "linear-gradient(to right, #2563eb, #9333ea)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.2)";
              }
            }}
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}