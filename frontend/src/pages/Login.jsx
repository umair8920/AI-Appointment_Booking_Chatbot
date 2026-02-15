import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "@/api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const jwt = res.data?.data?.token;

      if (!jwt) {
        setError("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      login(jwt);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
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
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>Welcome back</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Sign in to your account to continue</p>
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.5rem" }}>Login</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email field */}
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

            {/* Password field */}
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

            {/* Error message */}
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "44px",
                marginTop: "1.5rem",
                background: isLoading ? "linear-gradient(to right, #1d4ed8, #7e22ce)" : "linear-gradient(to right, #2563eb, #9333ea)",
                color: "white",
                fontWeight: 600,
                borderRadius: "0.5rem",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: isLoading ? 0.5 : 1,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
              onHover={(e) => {
                if (!isLoading) {
                  e.target.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.15)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      animation: "spin 1s linear infinite"
                    }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      opacity="0.75"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", padding: "0 0.5rem" }}>NEW USER?</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
          </div>

          {/* Signup link */}
          <Link
            to="/signup"
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
            Create an account
          </Link>
        </div>

        {/* Footer text */}
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#64748b", marginTop: "1.5rem" }}>
          By signing in, you agree to our{" "}
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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}