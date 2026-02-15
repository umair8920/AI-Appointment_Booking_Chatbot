import { useEffect, useState } from "react";
import { getChatSessions, startChatSession } from "@/api/axios";

export default function Sidebar({ activeSession, onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions");
    }
  };

  const handleNewSession = async () => {
    try {
      setLoading(true);
      const session = await startChatSession();
      setSessions((prev) => [session, ...prev]);
      onSelectSession(session.id);
    } catch (err) {
      console.error("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside style={{
      width: "256px",
      borderRight: "1px solid #e2e8f0",
      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 56px)",
      boxShadow: "1px 0 3px 0 rgba(0, 0, 0, 0.05)"
    }}>
      {/* Header with New Chat Button */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #e2e8f0"
      }}>
        <h2 style={{
          fontWeight: 600,
          color: "#0f172a",
          fontSize: "0.875rem",
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          Conversations
        </h2>
        <button
          onClick={handleNewSession}
          disabled={loading}
          style={{
            height: "32px",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            background: "linear-gradient(to right, #2563eb, #9333ea)",
            color: "white",
            fontWeight: 600,
            borderRadius: "0.375rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            fontSize: "0.75rem",
            fontFamily: "inherit",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
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
          {loading ? "..." : "+ New"}
        </button>
      </div>

      {/* Sessions List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        {sessions.length === 0 ? (
          <div style={{
            padding: "2rem 1rem",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.875rem"
          }}>
            <p style={{ margin: 0, marginBottom: "0.5rem" }}>No conversations yet</p>
            <p style={{ margin: 0, fontSize: "0.75rem" }}>Create one to get started</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "all 0.2s",
                background: activeSession === session.id
                  ? "linear-gradient(to right, #2563eb, #9333ea)"
                  : "transparent",
                color: activeSession === session.id ? "white" : "#475569",
                fontWeight: activeSession === session.id ? 600 : 500,
                border: activeSession === session.id
                  ? "1px solid #1e40af"
                  : "1px solid transparent",
                boxShadow: activeSession === session.id
                  ? "0 4px 6px -1px rgba(37, 99, 235, 0.1)"
                  : "none"
              }}
              onMouseEnter={(e) => {
                if (activeSession !== session.id) {
                  e.target.style.background = "#f1f5f9";
                  e.target.style.color = "#0f172a";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSession !== session.id) {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#475569";
                }
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Session #{session.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div style={{
        paddingTop: "1rem",
        borderTop: "1px solid #e2e8f0",
        fontSize: "0.75rem",
        color: "#94a3b8"
      }}>
        <p style={{ margin: 0, marginBottom: "0.25rem" }}>💡 Tip: Click on any conversation to view chat history</p>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}