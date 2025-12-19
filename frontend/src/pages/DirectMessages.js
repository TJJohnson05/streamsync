import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

export default function DirectMessages() {
  const token = getToken();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // NEW: user search + results
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // If signed out, token is missing => access disabled
  useEffect(() => {
    if (!token) setError("Please log in to use Direct Messages.");
  }, [token]);

  // Load conversations
  useEffect(() => {
    if (!token) return;

    fetch("/api/dm/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || `Request failed (HTTP ${r.status})`);
        setConversations(d.conversations || []);
      })
      .catch((e) => setError(e.message || "Network error — cannot reach backend"));
  }, [token]);

  // Load messages for active conversation
  useEffect(() => {
    if (!token || !activeId) return;

    fetch(`/api/dm/messages/${activeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || `Request failed (HTTP ${r.status})`);
        setMessages(d.messages || []);
      })
      .catch((e) => setError(e.message || "Network error — cannot reach backend"));
  }, [token, activeId]);

  // Search users (requires backend route: GET /api/users/search?q=...)
  async function searchUsers() {
    setError("");
    if (!token) return;

    const q = search.trim();
    if (!q) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Search failed");
        return;
      }
      setResults(data.users || []);
    } catch {
      setError("Network error — cannot reach backend");
    }
  }

  // Start (or get) a DM conversation with a user
  async function startDM(otherUserId) {
    setError("");
    if (!token) return;

    try {
      const res = await fetch("/api/dm/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Failed to start DM");
        return;
      }

      const convo = data.conversation;
      setActiveId(convo._id);

      // Refresh convo list so it appears immediately
      const r2 = await fetch("/api/dm/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d2 = await r2.json().catch(() => ({}));
      if (r2.ok) setConversations(d2.conversations || []);

      // Clear search UI
      setSearch("");
      setResults([]);
    } catch {
      setError("Network error — cannot reach backend");
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Please log in.");
      return;
    }

    // ✅ NEW: Clear, user-friendly feedback instead of "nothing happens"
    if (!activeId) {
      setError("Select a conversation first.");
      return;
    }

    if (!text.trim()) return;

    try {
      const res = await fetch("/api/dm/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId: activeId, text }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Failed to send.");
        return;
      }

      setMessages((prev) => [...prev, data.message]);
      setText("");
    } catch {
      setError("Network error — cannot reach backend");
    }
  }

  return (
    <div style={{ display: "flex", gap: 16, padding: 16 }}>
      <div style={{ width: 320, borderRight: "1px solid #ddd", paddingRight: 12 }}>
        <h2>Direct Messages</h2>
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {/* MESSAGE SEARCH UI */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users (email/username)…"
              style={{ flex: 1, padding: 8 }}
            />
            <button type="button" onClick={searchUsers} style={{ padding: "8px 10px" }}>
              Search
            </button>
          </div>

          {results.length > 0 && (
            <div style={{ border: "1px solid #ddd", marginTop: 8, padding: 8 }}>
              {results.map((u) => (
                <button
                  key={u._id}
                  onClick={() => startDM(u._id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: 8,
                    background: "white",
                    border: "1px solid #eee",
                    marginBottom: 6,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{u.username || "(no username)"}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{u.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONVERSATIONS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conversations.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveId(c._id)}
              style={{
                textAlign: "left",
                padding: 10,
                border: activeId === c._id ? "2px solid #000" : "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {c.isGroup ? c.title || "Group Chat" : "Conversation"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {c.membersInfo?.map((m) => m.username || m.email).join(", ")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT PANE */}
      <div style={{ flex: 1 }}>
        <h3>Chat</h3>

        <div
          style={{
            height: 420,
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 12,
            background: "#fff",
          }}
        >
          {messages.map((m) => (
            <div key={m._id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {m.sender?.username || m.sender?.email || "User"}
              </div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>

        {/* ✅ NEW: helper text so users know what to do */}
        {!activeId && (
          <p style={{ color: "crimson", marginBottom: 8 }}>
            Select a conversation to start chatting.
          </p>
        )}

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: 10 }}
          />

          {/* ✅ NEW: button disabled until valid */}
          <button
            type="submit"
            disabled={!activeId || !text.trim()}
            style={{ padding: "10px 14px", opacity: !activeId || !text.trim() ? 0.6 : 1 }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}




