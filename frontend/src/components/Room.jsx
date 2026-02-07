import styles from "./Room.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Room = () => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  let RoomId ="Sgftl";

  const fetchMessages = () => {
    setChatLog([...chatLog, newMessage]);
  };
  const handleSend = () => {
    if (!newMessage.trim()) return;
    fetchMessages();

    setNewMessage("");
  };
  const handleBack = () => {
    navigate("/");
  };

  return (
   <div className={styles.container}>
      <div className={styles.roomId}>
  {`Room Code : ${RoomId}`}
</div>

<div className={styles.backBox}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
      </div>
      
      <div className={styles.heading}>
        <h2>Chat Room</h2>
      </div>
      <div className={styles.chatbox}>
        {chatLog.map((msg, index) => (
          <div className={styles.messageItem} key={index}>
            {" "}
            {msg}
          </div>
        ))}
      </div>

      <div className={styles.message}>
        <input
          className={styles.Messageinput}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={"Type a message..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        ></input>
        <button className={styles.send} onClick={handleSend}>
          Send
        </button>
      </div>

      
    </div>
  );
};
export default Room;
