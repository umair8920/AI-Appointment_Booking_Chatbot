import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <header style={{
      height: "56px",
      borderBottom: "1px solid #e2e8f0",
      background: "linear-gradient(to right, #ffffff, #f8fafc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
    }}>
      {/* Logo and Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          background: "linear-gradient(to bottom right, #2563eb, #9333ea)",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#0f172a",
          margin: 0
        }}>
          AI Appointment Assistant
        </h1>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          height: "40px",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          border: "1px solid #e2e8f0",
          background: "white",
          color: "#334155",
          fontWeight: 500,
          borderRadius: "0.5rem",
          cursor: "pointer",
          transition: "all 0.2s",
          fontSize: "0.875rem",
          fontFamily: "inherit"
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "#cbd5e1";
          e.target.style.background = "#f1f5f9";
          e.target.style.color = "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.background = "white";
          e.target.style.color = "#334155";
        }}
      >
        Logout
      </button>
    </header>
  );
}