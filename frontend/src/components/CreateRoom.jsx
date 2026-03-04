import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./CreateRoom.module.css";
import { createRoomApi } from "../api";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

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

      if (!data || !data.roomCode) {
        throw new Error("Server response is missing the roomCode property.");
      }

      console.log("Room Created Successfully:", data);
      navigate(`/room/${data.roomCode}`, { state: { username: userName } });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert("Failed to create room: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <form onSubmit={handleCreateRoom} className={styles.formLayout}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.userlabel}>
                Enter Username
              </label>
              <input
                type="text"
                className={styles.userinput}
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g., Tony Stark"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={styles.createButton}
              disabled={isLoading}
            >
              {isLoading ? "Initiating..." : "Create & Open Room"}
            </button>
            <p className={styles.note}> 100% secure and login free</p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateRoom;
