// src/pages/DirectMessages.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/DirectMessages.css";
import { isLoggedIn } from "../utils/auth";

export default function DirectMessages() {
  // If you already have states/logic in your file, keep them—this is just a UI shell.
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [threads] = useState([]); // placeholder list
  const [activeThread, setActiveThread] = useState(null);
  const [chat, setChat] = useState([]); // placeholder messages

  useEffect(() => {
    // Optional: redirect if not logged in (if you already do this elsewhere, remove)
    if (!isLoggedIn()) {
      // no navigate here to avoid breaking if you don't use router hooks in this page
      // you can handle route protection at the router level too
    }
  }, []);

  function handleSelectThread(t) {
    setActiveThread(t);
    // TODO: load messages for the thread from backend
    setChat([]);
  }

  function handleSend(e) {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    // TODO: call backend send endpoint and then append on success
    setChat((prev) => [
      ...prev,
      { id: Date.now(), fromMe: true, text, ts: new Date().toISOString() },
    ]);
    setMessage("");
  }

  const filteredThreads = threads.filter((t) =>
    (t?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />

      <div className="page-container">
        <div className="dm-shell">
          <aside className="dm-sidebar">
            <div className="dm-sidebar-header">
              <h2 className="page-title">Direct Messages</h2>

              <input
                className="dm-search"
                placeholder="Search chats…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="dm-thread-list">
              {filteredThreads.length === 0 ? (
                <div className="dm-empty">
                  <p>No conversations yet.</p>
                  <p className="muted">
                    Tip: once you hook up the backend, show recent DMs here.
                  </p>
                </div>
              ) : (
                filteredThreads.map((t) => (
                  <button
                    key={t.id}
                    className={
                      "dm-thread" +
                      (activeThread?.id === t.id ? " dm-thread-active" : "")
                    }
                    onClick={() => handleSelectThread(t)}
                  >
                    <div className="dm-thread-avatar">
                      {(t.name || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="dm-thread-meta">
                      <div className="dm-thread-top">
                        <span className="dm-thread-name">{t.name}</span>
                        <span className="dm-thread-time">{t.time || ""}</span>
                      </div>
                      <div className="dm-thread-preview">{t.preview || ""}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <main className="dm-main">
            {!activeThread ? (
              <div className="dm-blank">
                <h3>Select a conversation</h3>
                <p className="muted">
                  Choose a chat on the left to view messages.
                </p>
              </div>
            ) : (
              <>
                <div className="dm-header">
                  <div className="dm-header-title">
                    <div className="dm-thread-avatar lg">
                      {(activeThread?.name || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="dm-thread-name">
                        {activeThread?.name}
                      </div>
                      <div className="muted small">
                        @{activeThread?.username || "user"}
                      </div>
                    </div>
                  </div>

                  <button className="dm-action" type="button">
                    View Profile
                  </button>
                </div>

                <div className="dm-chat">
                  {chat.length === 0 ? (
                    <div className="dm-empty-chat">
                      <p>No messages yet.</p>
                      <p className="muted small">
                        Send the first message to start the conversation.
                      </p>
                    </div>
                  ) : (
                    chat.map((m) => (
                      <div
                        key={m.id}
                        className={"dm-bubble " + (m.fromMe ? "me" : "them")}
                      >
                        {m.text}
                        <div className="dm-bubble-time">
                          {new Date(m.ts).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form className="dm-compose" onSubmit={handleSend}>
                  <input
                    className="dm-input"
                    placeholder="Type a message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="dm-send" type="submit">
                    Send
                  </button>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


