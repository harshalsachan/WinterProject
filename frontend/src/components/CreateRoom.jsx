import { useNavigate } from "react-router-dom";
import styles from "./CreateRoom.module.css";
import { useState } from "react";
import { createRoomApi } from "../api";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsLoading(true);

    try {
      const data = await createRoomApi(userName);

      console.log("Room Created Successfully:", data);

      navigate(`/room/${data.roomCode}`, { state: { username: userName } });
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.Create}>
        <form onSubmit={handleCreateRoom}>
          <div className={styles.username}>
            <label htmlFor="username" className={styles.userlabel}>
              Enter Username
            </label>
            <input
              type="text"
              className={styles.userinput}
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              className={styles.createButton}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create & Open Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
