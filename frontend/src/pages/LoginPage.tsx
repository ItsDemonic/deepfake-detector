import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, AtSign, Key } from 'lucide-react';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await login(username, password);
      setToken(tokens.access_token);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Invalid credentials. Protocol breached.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className={styles.logoWrap}>
            <div className={styles.shieldWrap}>
              <Shield size={32} strokeWidth={2} color="#89f3ff" className={styles.shieldIcon}/>
              <Lock size={12} strokeWidth={3} color="#0b111a" className={styles.lockIcon} />
            </div>
          </div>
          <h1 className={styles.title}>SOVEREIGN ARCHITECT</h1>
          <p className={styles.subtitle}>AUTHORIZED ACCESS ONLY • SECURE VAULT PROTOCOL</p>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>ARCHITECT ALIAS (USERNAME)</label>
              <div className={styles.inputWrapper}>
                <AtSign size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="admin_alias"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>VAULT KEY</label>
                <Link to="#" className={styles.forgotLink}>FORGOT ACCESS?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <Key size={16} className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            New architect? <Link to="/signup" className={styles.switchLink}>Create Account</Link>
          </p>
        </motion.div>

        <motion.div 
          className={styles.miniFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span>PRIVACY INFRASTRUCTURE</span>
          <span>PROTOCOL TERMS</span>
          <span>SYSTEM STATUS</span>
        </motion.div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <strong>SOVEREIGN ARCHITECT</strong>
          <p>© 2024 SOVEREIGN ARCHITECT, THE DIGITAL VAULT. ALL RIGHTS RESERVED.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#">PRIVACY POLICY</a>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">SECURITY DISCLOSURE</a>
          <a href="#">API REFERENCE</a>
        </div>
      </footer>
    </div>
  );
}
