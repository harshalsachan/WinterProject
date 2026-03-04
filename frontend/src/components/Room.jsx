import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom"; // Removed useNavigate
import styles from "./Room.module.css";
import Gun from "gun";
import { uploadFileApi, downloadFileApi } from "../api";

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeMembers, setActiveMembers] = useState({}); // New Presence State
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [myUsername] = useState(() => {
    return (
      location.state?.username ||
      sessionStorage.getItem("username") ||
      "Anonymous"
    );
  });

  useEffect(() => {
    if (location.state?.username) {
      sessionStorage.setItem("username", location.state.username);
    }
  }, [location.state]);

  const gunRef = useRef(null);

  // Initialize Gun and Message Sync
  useEffect(() => {
    if (!gunRef.current) {
      gunRef.current = Gun({
        peers: ["http://localhost:3000/gun"],
        localStorage: false,
      });
    }
    setIsConnected(true);

    const roomRef = gunRef.current.get("rooms").get(roomId);
    const messagesRef = roomRef.get("messages");

    messagesRef.map().on((data, id) => {
      if (data && (data.text || data.fileId)) {
        setMessages((prev) => {
          if (prev.find((msg) => msg.id === id)) return prev;
          const newMsgList = [...prev, { ...data, id }];
          return newMsgList.sort((a, b) => a.createdAt - b.createdAt);
        });
      }
    });
  }, [roomId]);

  // Presence System Logic
  useEffect(() => {
    if (!gunRef.current) return;

    const presenceRef = gunRef.current.get("rooms").get(roomId).get("presence");

    // 1. Set self as online
    presenceRef.get(myUsername).put({ online: true, lastSeen: Date.now() });

    // 2. Listen for network presence changes
    presenceRef.map().on((data, username) => {
      if (data) {
        setActiveMembers((prev) => ({
          ...prev,
          [username]: data.online,
        }));
      }
    });

    // 3. Native Browser Tab Close Edge-Case Handling
    const handleUnload = () => {
      presenceRef.get(myUsername).put({ online: false });
    };
    window.addEventListener("beforeunload", handleUnload);

    // 4. React Component Unmount Cleanup
    return () => {
      presenceRef.get(myUsername).put({ online: false });
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [roomId, myUsername]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadFileApi(file);
      const messageData = {
        text: "",
        fileId: result.fileID,
        fileName: result.fileMetaData.fileName,
        sender: myUsername,
        createdAt: Date.now(),
        type: "file_ref",
      };
      gunRef.current.get("rooms").get(roomId).get("messages").set(messageData);
    } catch (error) {
      alert("Upload Failed: " + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleDownload = async (fileId, fileName) => {
    setDownloadingId(fileId);
    try {
      const data = await downloadFileApi(fileId);
      const link = document.createElement("a");
      link.href = data.fileData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Download Failed: " + error.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const messageData = {
      text: newMessage,
      sender: myUsername,
      createdAt: Date.now(),
      type: "text",
    };
    gunRef.current.get("rooms").get(roomId).get("messages").set(messageData);
    setNewMessage("");
  };

  // Convert presence object map to array and filter only online users
  const onlineUsers = Object.entries(activeMembers)
    .filter(([_, isOnline]) => isOnline)
    .map(([username]) => username);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          
          {/* LEFT COLUMN: Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.roomInfo}>
              <h2>Room</h2>
              <h3 className={styles.roomCode}>{roomId}</h3>
              <div className={styles.connectionStatus}>
                <span
                  style={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: isConnected ? "#00ff00" : "#ff0000",
                    borderRadius: "50%",
                    display: "inline-block"
                  }}
                ></span>
                <span className={styles.subHeading}>
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
              </div>
            </div>

            <div className={styles.activeMembersBox}>
              <h3>Active Members ({onlineUsers.length})</h3>
              <ul className={styles.memberList}>
                {onlineUsers.map((user) => (
                  <li key={user} className={user === myUsername ? styles.myUserItem : ""}>
                    <span className={styles.statusDot}></span>
                    {user} {user === myUsername && "(You)"}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Main Chat Area */}
          <div className={styles.mainChat}>
            <div className={styles.chatbox}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.sender === myUsername
                      ? styles.myMessage
                      : styles.otherMessage
                  }
                >
                  <span className={styles.senderName}>{msg.sender}</span>
                  {msg.type === "file_ref" ? (
                    <div className={styles.fileMessage}>
                      <p>📎 {msg.fileName}</p>
                      <button
                        onClick={() => handleDownload(msg.fileId, msg.fileName)}
                        disabled={downloadingId === msg.fileId}
                      >
                        {downloadingId === msg.fileId
                          ? "Downloading..."
                          : "Download"}
                      </button>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.messageInputArea}>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <button
                className={styles.attachButton}
                onClick={() => document.getElementById("fileInput").click()}
                disabled={isUploading}
              >
                {isUploading ? "⏳" : "📎"}
              </button>
              <input
                className={styles.Messageinput}
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className={styles.send} onClick={handleSend}>
                Send
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Room;