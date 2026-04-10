import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { signup, login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import styles from './AuthPage.module.css';

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
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(username, email, password);
      const tokens = await login(username, password);
      setToken(tokens.access_token);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
        <div className={styles.bgGrid} />
      </div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className={styles.logoWrap}>
          <div className={styles.logo}>
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <span className={styles.logoLabel}>DeepGuard</span>
        </div>

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start detecting deepfakes with AI</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Username"
            placeholder="choose_a_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User size={15} />}
            required
            autoComplete="username"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={15} />}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={15} />}
            required
            autoComplete="new-password"
          />

          {error && (
            <motion.div
              className={styles.errorBanner}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
            Create account <ArrowRight size={16} />
          </Button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
