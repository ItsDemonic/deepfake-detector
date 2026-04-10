import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Trash2, ImageOff } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { Button } from '../components/ui/Button';
import styles from './HistoryPage.module.css';

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function HistoryPage() {
  const { history, clearHistory } = useHistory();

  const realCount = history.filter((h) => h.prediction === 'Real').length;
  const fakeCount = history.filter((h) => h.prediction === 'Fake').length;

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className={styles.title}>Detection History</h1>
          <p className={styles.subtitle}>Your recent image analysis results</p>
        </div>

        {history.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearHistory}>
            <Trash2 size={14} />
            Clear all
          </Button>
        )}
      </motion.div>

      {history.length > 0 && (
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.statCard}>
            <span className={styles.statNum}>{history.length}</span>
            <span className={styles.statLabel}>Total analyzed</span>
          </div>
          <div className={`${styles.statCard} ${styles.realStat}`}>
            <span className={styles.statNum}>{realCount}</span>
            <span className={styles.statLabel}>Authentic</span>
          </div>
          <div className={`${styles.statCard} ${styles.fakeStat}`}>
            <span className={styles.statNum}>{fakeCount}</span>
            <span className={styles.statLabel}>Deepfakes</span>
          </div>
          {history.length > 0 && (
            <div className={styles.statCard}>
              <span className={styles.statNum}>
                {Math.round((fakeCount / history.length) * 100)}%
              </span>
              <span className={styles.statLabel}>Fake rate</span>
            </div>
          )}
        </motion.div>
      )}

      <div className={styles.list}>
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div
              className={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.emptyIcon}>
                <Clock size={32} strokeWidth={1.5} />
              </div>
              <h2 className={styles.emptyTitle}>No history yet</h2>
              <p className={styles.emptyText}>
                Upload an image on the main page to start detecting deepfakes.
              </p>
            </motion.div>
          ) : (
            history.map((entry, i) => (
              <motion.div
                key={entry.id}
                className={styles.entry}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <div className={styles.entryThumb}>
                  {entry.imageUrl ? (
                    <img src={entry.imageUrl} alt={entry.filename} className={styles.thumbImg} />
                  ) : (
                    <div className={styles.thumbPlaceholder}>
                      <ImageOff size={20} />
                    </div>
                  )}
                </div>

                <div className={styles.entryContent}>
                  <p className={styles.entryFilename}>{entry.filename}</p>
                  <p className={styles.entryTime}>{formatDate(entry.timestamp)}</p>
                </div>

                <div className={`${styles.entryBadge} ${entry.prediction === 'Real' ? styles.realBadge : styles.fakeBadge}`}>
                  {entry.prediction === 'Real' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {entry.prediction}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
