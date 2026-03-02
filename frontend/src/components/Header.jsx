import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/create-room" className={styles.logo}>
        GoGo Share
      </Link>
      <nav className={styles.nav}>
        <Link to="/create-room" className={styles.navButton}>
          Create Room
        </Link>
        <Link to="/join-room" className={styles.navButtonOutline}>
          Join Room
        </Link>
      </nav>
    </header>
  );
}

export default Header;
