import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JoinRoom.module.css";
import { joinRoomApi } from "../api";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function JoinRoom() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName.trim() || !roomCode.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await joinRoomApi(roomCode, userName);
      console.log("Joined Room Successfully:", data);
      navigate(`/room/${roomCode}`, { state: { username: userName } });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Join a Room</h1>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleJoinRoom} className={styles.formLayout}>
            <div className={styles.inputGroup}>
              <label htmlFor="userName" className={styles.userlabel}>
                Name
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className={styles.userinput}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="roomCode" className={styles.userlabel}>
                Room Code
              </label>
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className={styles.userinput}
                maxLength="6"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join Room"}
            </button>
          </form>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default JoinRoom;