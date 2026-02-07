import { useNavigate } from "react-router-dom";
import styles from "./CreateRoom.module.css";
import { useState } from "react";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    // Use the generated code if available, or generate one now
    if (userName) {
        // You might want to call generateRoomCode() here if it's not done yet
        alert(`Room "${userName}" created!`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };
   const handleRoom = () => {
    navigate('/room');
  };

  return (
    /* 1. Added Main Container Wrapper */
    <div className={styles.container}>
      
      <div className={styles.Create}>
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
         <div>
            <label htmlFor="roomcode">
              Room Code
            </label>
            <div className={styles.generateContainer}>
              <input
                type="text"
                value={roomCode}
                readOnly
                placeholder="Generate a code"
                className={styles.generateInput}
              />
              <button
                type="button"
                onClick={generateRoomCode}
                className={styles.generate}
              >
                Generate
              </button>
            </div>
          </div>
        
        
        <div>
         
          <button 
            className={styles.createButton} 
            onClick={handleRoom}
          >
            Open Room
          </button>
        </div>
      </div>

      <div>
        
        <button 
            className={styles.backButton} 
            onClick={handleBack}
        >
            Back
        </button>
      </div>

    </div>
  );
};

export default CreateRoom;