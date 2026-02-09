/*Here we are giving user routes to create room and join room*/ 
import {useNavigate} from 'react-router-dom'; 
import styles from "./Home.module.css";

function Home(){
  const navigate =useNavigate();

  const handleCreateRoom=() => {
    navigate('/create-room');
  }
  const handleJoinRoom =() => {
    navigate('/join-room');
  };

  return(
    <div className={styles.home}>
      <div className={styles.welcome}><h1> Welcome to GoGo Share</h1></div>
      <div className={styles.buttonGroup}>
        <button className={styles.create}
        onClick={handleCreateRoom}>
          Create Room
        </button>
        <button 
        className={styles.join}
        onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>

    </div>
  )
}
export default Home;
