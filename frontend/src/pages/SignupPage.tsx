import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, AtSign, Key, User } from 'lucide-react';
import { signup } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
      await signup(username, email, password);
      navigate('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Registration failed. Protocol error.');
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
          <p className={styles.subtitle}>ESTABLISH NEW ACCESS CLEARANCE</p>
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
                <User size={16} className={styles.inputIcon} />
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
              <label>SECURE TRANSMISSION EMAIL</label>
              <div className={styles.inputWrapper}>
                <AtSign size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>VAULT KEY</label>
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
              {loading ? 'Registering...' : 'Establish Clearance'}
            </button>
          </form>

          <p className={styles.switchText}>
            Existing architect? <Link to="/login" className={styles.switchLink}>Verify Identity</Link>
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

    </div>
  );
}
