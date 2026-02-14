import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./Room.module.css";
import Gun from "gun";
import { uploadFileApi, downloadFileApi } from "../api";

const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
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

  useEffect(() => {
    if (!gunRef.current) {
      gunRef.current = Gun({
        peers: ["http://localhost:3000/gun"],
        localStorage: false,
      });
    }
    setIsConnected(true);

    const messagesRef = gunRef.current.get("rooms").get(roomId).get("messages");
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

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>Room: {roomId}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <p className={styles.subHeading}>Logged in as: {myUsername}</p>
          <span
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: isConnected ? "#00ff00" : "#ff0000",
              borderRadius: "50%",
            }}
          ></span>
        </div>
      </div>

      <div className={styles.chatbox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === myUsername ? styles.myMessage : styles.otherMessage
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
                  {downloadingId === msg.fileId ? "Downloading..." : "Download"}
                </button>
              </div>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
      </div>

      <div className={styles.message}>
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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className={styles.send} onClick={handleSend}>
          Send
        </button>
      </div>
      <div className={styles.backBox}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Room;
