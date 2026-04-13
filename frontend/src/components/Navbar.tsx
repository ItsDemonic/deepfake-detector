import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  function handleLogout() {
    setToken('');
    navigate('/login');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <Link to="/" className={styles.logoText}>
            SOVEREIGN ARCHITECT
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
            Product
          </Link>
          <Link to="/architecture" className={`${styles.navLink} ${isActive('/architecture') ? styles.active : ''}`}>
            Developers
          </Link>
          <Link to="/mission" className={`${styles.navLink} ${isActive('/mission') ? styles.active : ''}`}>
            Company
          </Link>
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <button className={styles.authLink} onClick={handleLogout}>Sign Out</button>
              <Link to="/" className={styles.getStartedBtn}>Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>Sign In</Link>
              <Link to="/login" className={styles.getStartedBtn}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
