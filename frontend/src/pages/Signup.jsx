import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    preferred_timezone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom right, #f8fafc, #ffffff)" }}>
      {/* Decorative blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: "25%",
          width: "24rem",
          height: "24rem",
          background: "#dbeafe",
          borderRadius: "9999px",
          opacity: 0.2,
          filter: "blur(3rem)",
          mixBlendMode: "multiply",
          animation: "blob 7s infinite"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: 0,
          right: "25%",
          width: "24rem",
          height: "24rem",
          background: "#e9d5ff",
          borderRadius: "9999px",
          opacity: 0.2,
          filter: "blur(3rem)",
          mixBlendMode: "multiply",
          animation: "blob 7s infinite 2s"
        }}></div>
      </div>

      {/* Main container - MAX WIDTH 448px */}
      <div style={{ width: "100%", maxWidth: "448px", position: "relative", zIndex: 10, padding: "1rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            background: "linear-gradient(to bottom right, #2563eb, #9333ea)",
            borderRadius: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Start booking appointments with our AI assistant</p>
        </div>

        {/* Card */}
        <div style={{
          width: "100%",
          borderRadius: "0.75rem",
          border: "1px solid #e2e8f0",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "2rem"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* First + Last Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* First Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="first_name" style={{ color: "#334155", fontWeight: 600, fontSize: "0.875rem" }}>
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  style={{
                    height: "44px",
                    padding: "0 1rem",
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    background: "white",
                    color: "#0f172a",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.outline = "none";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Last Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="last_name" style={{ color: "#334155", fontWeight: 600, fontSize: "0.875rem" }}>
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  style={{
                    height: "44px",
                    padding: "0 1rem",
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    background: "white",
                    color: "#0f172a",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.outline = "none";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="email" style={{ color: "#334155", fontWeight: 600, fontSize: "0.875rem" }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  height: "44px",
                  padding: "0 1rem",
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  background: "white",
                  color: "#0f172a",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  fontFamily: "inherit"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.outline = "none";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="password" style={{ color: "#334155", fontWeight: 600, fontSize: "0.875rem" }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  height: "44px",
                  padding: "0 1rem",
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  background: "white",
                  color: "#0f172a",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  fontFamily: "inherit"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.outline = "none";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="phone" style={{ color: "#334155", fontWeight: 600, fontSize: "0.875rem" }}>
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
                style={{
                  height: "44px",
                  padding: "0 1rem",
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  background: "white",
                  color: "#0f172a",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  fontFamily: "inherit"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.outline = "none";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "1rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.5rem"
              }}>
                <p style={{ fontSize: "0.875rem", color: "#b91c1c", fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "44px",
                marginTop: "1.5rem",
                background: loading ? "linear-gradient(to right, #1d4ed8, #7e22ce)" : "linear-gradient(to right, #2563eb, #9333ea)",
                color: "white",
                fontWeight: 600,
                borderRadius: "0.5rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: loading ? 0.5 : 1,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "1rem",
                fontFamily: "inherit"
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", padding: "0 0.5rem" }}>HAVE AN ACCOUNT?</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
          </div>

          {/* Login link */}
          <Link
            to="/login"
            style={{
              display: "block",
              width: "100%",
              padding: "0.75rem 1rem",
              textAlign: "center",
              border: "2px solid #cbd5e1",
              borderRadius: "0.5rem",
              fontWeight: 600,
              color: "#334155",
              textDecoration: "none",
              transition: "all 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.background = "#eff6ff";
              e.target.style.color = "#1e40af";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#cbd5e1";
              e.target.style.background = "transparent";
              e.target.style.color = "#334155";
            }}
          >
            Login to your account
          </Link>
        </div>

        {/* Footer text */}
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#64748b", marginTop: "1.5rem" }}>
          By signing up, you agree to our{" "}
          <a href="#" style={{ color: "#2563eb", textDecoration: "none", cursor: "pointer" }}
            onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.target.style.textDecoration = "none"}
          >
            Terms of Service
          </a>
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}