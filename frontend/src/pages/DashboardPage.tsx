import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, CircleCheck as CheckCircle, Circle as XCircle, RefreshCw, Zap } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { detectImage } from '../api/images';
import { useHistory } from '../hooks/useHistory';
import { Button } from '../components/ui/Button';
import type { DetectionResult } from '../types';
import styles from './DashboardPage.module.css';

type PageState = 'idle' | 'loading' | 'result';

export function DashboardPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState('');
  const { addEntry } = useHistory();

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum size is 20MB.');
      return;
    }
    setError('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    setPageState('loading');
    try {
      const res = await detectImage(file);
      setResult(res);
      setPageState('result');
      addEntry({ filename: res.filename, prediction: res.prediction, imageUrl: url });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Detection failed. Make sure the backend is running.');
      setPageState('idle');
    }
  }, [addEntry]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && processFile(files[0]),
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 20 * 1024 * 1024,
  });

  function reset() {
    setPageState('idle');
    setPreview(null);
    setResult(null);
    setError('');
  }

  const isReal = result?.prediction === 'Real';

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <motion.div
          className={styles.heroBadge}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Zap size={13} />
          AI-Powered Detection
        </motion.div>
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Detect deepfakes
          <br />
          <span className={styles.heroAccent}>instantly</span>
        </motion.h1>
        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Upload any image and our MobileNetV3 model will analyze it for signs of AI manipulation.
        </motion.p>
      </div>

      <div className={styles.main}>
        <AnimatePresence mode="wait">
          {pageState === 'idle' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
              >
                <input {...getInputProps()} />
                <div className={styles.dropzoneInner}>
                  <motion.div
                    className={styles.uploadIcon}
                    animate={{ y: isDragActive ? -8 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Upload size={28} strokeWidth={1.5} />
                  </motion.div>
                  <h2 className={styles.dropTitle}>
                    {isDragActive ? 'Drop image here' : 'Drop an image or click to browse'}
                  </h2>
                  <p className={styles.dropSub}>
                    Supports JPEG, PNG, WebP, HEIC — up to 20MB
                  </p>
                  <Button variant="secondary" size="md" className={styles.browseBtn}>
                    <ImageIcon size={15} />
                    Browse files
                  </Button>
                </div>
              </div>

              {error && (
                <motion.div
                  className={styles.errorBanner}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {pageState === 'loading' && (
            <motion.div
              key="loading"
              className={styles.loadingState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {preview && (
                <div className={styles.previewWrap}>
                  <img src={preview} alt="Uploaded" className={styles.previewImg} />
                  <div className={styles.scanOverlay}>
                    <motion.div
                      className={styles.scanLine}
                      animate={{ y: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}
              <div className={styles.loadingInfo}>
                <div className={styles.loadingSpinner} />
                <p className={styles.loadingText}>Analyzing image with AI...</p>
                <p className={styles.loadingSubtext}>This may take a few seconds</p>
              </div>
            </motion.div>
          )}

          {pageState === 'result' && result && (
            <motion.div
              key="result"
              className={styles.resultState}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className={styles.resultLayout}>
                {preview && (
                  <div className={styles.resultImageWrap}>
                    <img src={preview} alt="Analyzed" className={styles.resultImg} />
                    <div className={`${styles.resultBadgeImg} ${isReal ? styles.realBadge : styles.fakeBadge}`}>
                      {isReal ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {result.prediction}
                    </div>
                  </div>
                )}

                <div className={styles.resultInfo}>
                  <motion.div
                    className={`${styles.resultIcon} ${isReal ? styles.realIcon : styles.fakeIcon}`}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  >
                    {isReal ? <CheckCircle size={36} strokeWidth={1.5} /> : <XCircle size={36} strokeWidth={1.5} />}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className={styles.resultLabel}>Detection result</p>
                    <h2 className={`${styles.resultVerdict} ${isReal ? styles.realText : styles.fakeText}`}>
                      {isReal ? 'Authentic Image' : 'Deepfake Detected'}
                    </h2>
                    <p className={styles.resultDesc}>
                      {isReal
                        ? 'Our AI model has determined this image shows no signs of synthetic manipulation.'
                        : 'Our AI model has identified patterns consistent with AI-generated or manipulated content.'}
                    </p>
                  </motion.div>

                  <motion.div
                    className={styles.resultMeta}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>File name</span>
                      <span className={styles.metaValue}>{result.filename}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Model</span>
                      <span className={styles.metaValue}>MobileNetV3</span>
                    </div>
                  </motion.div>

                  <Button onClick={reset} variant="secondary" size="md">
                    <RefreshCw size={15} />
                    Analyze another image
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className={styles.features}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { icon: '⚡', title: 'Fast Analysis', desc: 'Results in seconds using optimized inference' },
          { icon: '🧠', title: 'Deep Learning', desc: 'MobileNetV3 fine-tuned on real vs. fake datasets' },
          { icon: '🔒', title: 'Secure', desc: 'Your images are processed privately' },
        ].map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <span className={styles.featureEmoji}>{f.icon}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
