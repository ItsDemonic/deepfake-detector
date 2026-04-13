import { useLocation } from 'react-router-dom';
import { ShieldAlert, Cpu, Hash, Fingerprint, Search, Eye } from 'lucide-react';
import styles from './ReportPage.module.css';

export function ReportPage() {
  const location = useLocation();
  const { result, imageUrl } = location.state || {};
  
  // If no result is passed, we can show a placeholder or mock data
  const predictionStr = result?.prediction ? String(result.prediction).toLowerCase() : 'fake';
  const isFake = predictionStr.includes('fake') || predictionStr.includes('1') || predictionStr.includes('true');
  const confScore = result?.confidence != null ? Number(result.confidence).toFixed(2) : (isFake ? "98.40" : "99.20");

  return (
    <div className={styles.page}>
      
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <div>
            <div className={`${styles.statusPill} ${isFake ? styles.danger : styles.safe}`}>
              <ShieldAlert size={14} /> 
              {isFake ? 'DEEPFAKE DETECTED' : 'ASSET VERIFIED'}
            </div>
            <h1 className={styles.title}>Analysis Report</h1>
            <p className={styles.subtitle}>
              {isFake 
                ? 'Synthetic generation detected via multi-spectral forensic analysis. High probability of generative adversarial network (GAN) involvement.' 
                : 'Asset cleared multi-spectral forensic analysis. No generative patterns detected.'}
            </p>
          </div>
          
          <div className={styles.scoreBlock}>
            <span className={styles.scoreLabel}>CONFIDENCE SCORE</span>
            <div className={styles.scoreValue}>
              {confScore}<span className={styles.percent}>%</span> <span className={styles.divider}>|</span>
            </div>
          </div>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.imageViewer}>
            
            <div className={styles.imagePlaceholder}>
               {imageUrl ? (
                 <img src={imageUrl} alt="Analysis Target" className={styles.actualImage} />
               ) : (
                 <div className={styles.imageBox}></div>
               )}
            </div>

            <div className={styles.viewerToolbar}>
              <div className={styles.toolbarLeft}>
                <button><Search size={14}/> INSPECT PIXELS</button>
                <button><Eye size={14}/> TOGGLE ORIGINAL</button>
              </div>
              <div className={styles.toolbarRight}>
                BUFFER: 4096PX | LATENCY: 12MS
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.metaCard}>
              <h3>Metadata Integrity</h3>
              
              <div className={styles.metaRow}>
                <div className={styles.metaRowContent}>
                  <p className={styles.metaLabel}>SOURCE MODEL</p>
                  <p className={styles.metaValue}>StyleGAN3-R v2.0</p>
                </div>
                <Cpu size={16} className={styles.metaIcon} />
              </div>
              
              <div className={styles.metaRow}>
                <div className={styles.metaRowContent}>
                  <p className={styles.metaLabel}>COMPRESSION</p>
                  <p className={styles.metaValue}>Lossy (Resampled 3x)</p>
                </div>
                <Hash size={16} className={styles.metaIcon} />
              </div>

              <div className={styles.metaRow}>
                <div className={styles.metaRowContent}>
                  <p className={styles.metaLabel}>FINGERPRINT ID</p>
                  <p className={styles.metaValue}>SHA-256: 4f92...a821</p>
                </div>
                <Fingerprint size={16} className={styles.metaIcon} />
              </div>

              <div className={styles.threatAssessment}>
                <span className={styles.metaLabel}>THREAT ASSESSMENT</span>
                <div className={styles.threatBarWrapper}>
                   <div className={styles.threatBarFull} style={{width: isFake ? '98%' : '5%'}}></div>
                </div>
                <p className={styles.threatNote}>
                  The image contains high-frequency noise patterns typically associated with diffusion-based upscalers.
                </p>
              </div>
            </div>

            <div className={styles.vaultCard}>
              <div className={styles.vaultIconWrapper}>
                <ShieldAlert size={20} />
              </div>
              <h4>Immortalize Result</h4>
              <p>Seal this analysis into the blockchain-verified Sovereign Vault for legal provenance.</p>
              <button className={styles.vaultBtn}>VAULT THIS ANALYSIS</button>
            </div>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {/* Metric 1 */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>SPECTRAL CONSISTENCY</span>
              <span className={styles.failStatus}>FAIL</span>
            </div>
            <div className={styles.chartMockup}>
               {/* Bar chart mockup */}
               <div className={styles.barWrap}><div className={styles.bar} style={{height: '20px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.bar} style={{height: '30px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.barHighlight1} style={{height: '50px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.barHighlight1} style={{height: '50px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.bar} style={{height: '15px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.bar} style={{height: '15px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.barHighlight2} style={{height: '40px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.barHighlight2} style={{height: '45px'}}></div></div>
               <div className={styles.barWrap}><div className={styles.bar} style={{height: '10px'}}></div></div>
            </div>
            <p className={styles.metricDesc}>Irregular luminance peaks in the 400nm-500nm range suggest synthetic color correction.</p>
          </div>

          {/* Metric 2 */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>OCULAR ALIGNMENT</span>
              <span className={styles.nominalStatus}>NOMINAL</span>
            </div>
            <div className={styles.ocularMockup}>
               <div className={styles.ocLeft}>
                 <span className={styles.ocLabel}>LEFT PUPIL</span>
                 <div className={styles.ocBar}><div className={styles.ocFill} style={{width:'90%'}}></div></div>
               </div>
               <div className={styles.ocRight}>
                 <span className={styles.ocLabel}>RIGHT PUPIL</span>
                 <div className={styles.ocBar}><div className={styles.ocFill} style={{width:'95%'}}></div></div>
               </div>
            </div>
            <p className={styles.metricDesc}>Pupillary reflection geometry matches provided lighting context variables.</p>
          </div>

          {/* Metric 3 */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span>TEXTURE ANOMALIES</span>
              <span className={styles.highStatus}>HIGH</span>
            </div>
            <div className={styles.tagGroup}>
               <span className={styles.dangerTag}>SKIN BLUR</span>
               <span className={styles.dangerTag}>EDGE HALO</span>
               <span className={styles.neutralTag}>GRAIN MATCH</span>
            </div>
            <p className={styles.metricDesc}>Excessive smoothing detected in sub-dermal scattering simulation on the cheekbones.</p>
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
