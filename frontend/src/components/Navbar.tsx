import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LogOut, User, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <ShieldCheck size={18} strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>DeepGuard</span>
        </Link>

        {user && (
          <nav className={styles.nav}>
            <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
              Detect
            </Link>
            <Link to="/history" className={`${styles.navLink} ${isActive('/history') ? styles.active : ''}`}>
              <Clock size={14} />
              History
            </Link>
          </nav>
        )}

        <div className={styles.actions}>
          {user ? (
            <>
              <div className={styles.userChip}>
                <User size={14} />
                <span>{user.username}</span>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.navLink}>Sign in</Link>
              <Link to="/signup" className={styles.signupBtn}>Get started</Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
