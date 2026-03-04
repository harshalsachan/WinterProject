import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/");
  };

  const handleJoinRoom = () => {
    navigate("/join-room");
  };



  return (
    <div className={styles.home}>
      <div className={styles.card}>
        <div className={styles.logoSection}>
          <span className={styles.logoIcon}>
            <img src={logo} alt="image"  />
          </span>
          <h1 className={styles.title}>ZapShare</h1>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.create} onClick={handleCreateRoom}>
            Create Room
          </button>
          <button className={styles.join} onClick={handleJoinRoom}>
            Join Room
          </button>
          <button className={styles.join}>
            <span className={styles.btnIcon}></span>
            Know More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
