import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./JoinRoom.module.css";

function JoinRoom() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (userName && roomCode) {
      // Add your room joining logic here
      alert(`${userName} is joining room: ${roomCode}`);
    }
  };
  const handleRoom =() =>{
   navigate('/room');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.join}>
      <div className={styles.body}>
        <h1 className={styles.heading}>
          Join a Room
        </h1>
        
        <form onSubmit={handleJoinRoom} >
          <div>
            <label >
               Name
            </label>
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
            <label >
              Room Code
            </label>
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

          <button
            type="submit"
            className={styles.submit}
            onClick={handleRoom}
          >
            Join Room
          </button>
        </form>

        <button
          onClick={handleBack}
          className={styles.back}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;
