import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JoinRoom.module.css";
import { joinRoomApi } from "../api";

function JoinRoom() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    setError("");

    if (!userName || !roomCode) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const data = await joinRoomApi(roomCode, userName);

      console.log("Joined Room Successfully:", data);

      navigate(`/room/${roomCode}`, { state: { username: userName } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.join}>
      <div className={styles.body}>
        <h1 className={styles.heading}>Join a Room</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleJoinRoom}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
              required
            />
          </div>

          <div>
            <label>Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className={styles.input}
              maxLength="6"
              required
            />
          </div>

          <button type="submit" className={styles.submit}>
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;
