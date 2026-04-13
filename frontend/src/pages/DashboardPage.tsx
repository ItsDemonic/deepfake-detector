import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Shield, Activity, FileText, Code, FileJson, Info } from 'lucide-react';
import { detectImage } from '../api/images';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      const imageUrl = URL.createObjectURL(acceptedFiles[0]);
      const result = await detectImage(acceptedFiles[0]);
      // Assuming result contains prediction and filename
      navigate(`/report/recent`, { state: { result, imageUrl } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Analysis failed. Please try again or log in.');
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  return (
    <div className={styles.page}>
      
      <main className={styles.main}>
        <div className={styles.topSection}>
          
          <div className={styles.leftColumn}>
            <div className={styles.eyebrow}>LABORATORY 01</div>
            <h1 className={styles.title}>Analysis<br/>Workbench.</h1>
            <p className={styles.description}>
              Deploy files into the vault for deep-packet structural inspection. Our sovereign engine deconstructs every layer with crystalline precision.
            </p>
            
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <Shield size={16} className={styles.featureIcon} />
                <span>END-TO-END ENCRYPTED TUNNEL</span>
              </div>
              <div className={styles.featureItem}>
                <Activity size={16} className={styles.featureIcon} />
                <span>HEURISTIC ANOMALY MAPPING</span>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.uploadContainer}>
              <div 
                {...getRootProps()} 
                className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${uploading ? styles.uploading : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className={styles.uploadIconWrap}>
                  <Upload size={24} className={styles.uploadIcon} />
                </div>
                
                <h3 className={styles.uploadTitle}>
                  {uploading ? 'INSPECTING ASSET...' : 'Initialize Asset Scan'}
                </h3>
                <p className={styles.uploadSub}>
                  Drag and drop your encrypted archives or<br/>
                  <span className={styles.browseLink}>browse local filesystem</span>
                </p>

                <div className={styles.fileTypes}>
                  <span className={styles.fileTypeBtn}>.JPG</span>
                  <span className={styles.fileTypeBtn}>.PNG</span>
                  <span className={styles.fileTypeBtn}>.WEBP</span>
                  <span className={styles.fileTypeBtn}>.RAW</span>
                </div>
              </div>

              {error && (
                <div className={styles.errorBox}>
                  <Info size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <div>
              <h2>Recently Analyzed</h2>
              <p>Historical registry of the last 48 hours.</p>
            </div>
            <button className={styles.registryBtn}>FULL REGISTRY →</button>
          </div>

          <div className={styles.historyCards}>
            {/* Card 1 */}
            <div className={styles.historyCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrap}>
                  <Code size={16} />
                </div>
                <div className={styles.cardMeta}>
                  <h4>production_log_v2.log</h4>
                  <p>ANALYSED 2M AGO</p>
                </div>
                <span className={`${styles.statusBadge} ${styles.secure}`}>SECURE</span>
              </div>
              <div className={styles.threatBar}>
                <div className={styles.threatFillSecure} style={{width: '70%'}}></div>
              </div>
              <div className={styles.cardFooter}>
                <span>THREAT SCORE: 0.02</span>
                <span>COMPLEXITY: HIGH</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className={styles.historyCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrap}>
                  <FileJson size={16} />
                </div>
                <div className={styles.cardMeta}>
                  <h4>internal_api_struct.json</h4>
                  <p>ANALYSED 1H AGO</p>
                </div>
                <span className={`${styles.statusBadge} ${styles.warning}`}>WARNING</span>
              </div>
              <div className={styles.threatBar}>
                <div className={styles.threatFillWarning} style={{width: '40%'}}></div>
              </div>
              <div className={styles.cardFooter}>
                <span>THREAT SCORE: 4.81</span>
                <span>COMPLEXITY: MEDIUM</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className={styles.historyCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrap}>
                  <FileText size={16} />
                </div>
                <div className={styles.cardMeta}>
                  <h4>user_permissions.yaml</h4>
                  <p>ANALYSED 4H AGO</p>
                </div>
                <span className={`${styles.statusBadge} ${styles.secure}`}>SECURE</span>
              </div>
              <div className={styles.threatBar}>
                <div className={styles.threatFillSecure} style={{width: '90%'}}></div>
              </div>
              <div className={styles.cardFooter}>
                <span>THREAT SCORE: 0.00</span>
                <span>COMPLEXITY: LOW</span>
              </div>
            </div>

          </div>
        </div>

      </main>

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
