import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Brain, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import styles from './MissionPage.module.css';

export function MissionPage() {
  return (
    <div className={styles.page}>
      
      <div className={styles.heroSection}>
        <div className={styles.heroBg}></div>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>MISSION REPORT 01</div>
          <h1 className={styles.title}>
            Protecting <span>Digital<br/>Identity</span> in the Age of<br/>Synthetic Reality.
          </h1>
          <p className={styles.subtitle}>
            Sovereign Architect was founded on a singular premise: Truth is the bedrock of civilization. When the line between human and machine vanishes, we build the shield.
          </p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.threatSection}>
          <div className={styles.threatLeft}>
            <h2>The Threat of Facial Fraud</h2>
            
            <div className={styles.threatItem}>
              <div className={styles.threatIcon}><ShieldAlert size={16} color="#89f3ff" /></div>
              <div>
                <h3>Biometric Displacement</h3>
                <p>Identity is no longer tied to biology. High-fidelity deepfakes can bypass traditional visual verification systems, leaving enterprises vulnerable to systemic infiltration.</p>
              </div>
            </div>

            <div className={styles.threatItem}>
              <div className={styles.threatIconDanger}><AlertTriangle size={16} color="#f87171" /></div>
              <div>
                <h3>Erosion of Consensus</h3>
                <p>When seeing is no longer believing, public trust collapses. Synthetic misinformation destabilizes markets and democratic institutions through manufactured values.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.threatRight}>
             <div className={styles.threatImgBox}>
                <div className={styles.threatOverlay}>
                  <span>THREAT ANALYSIS</span>
                  <span>99.9% Probably</span>
                </div>
                <div className={styles.threatGradientLayer}></div>
             </div>
          </div>
        </div>

        <div className={styles.restoreSection}>
          <div className={styles.restoreHeader}>
            <div>
              <h2>Restoring Truth in Media</h2>
              <p>We architected a vault for the digital self. Our multi-layered approach doesn't just flag content; it certifies existence.</p>
            </div>
            <Link to="/architecture" className={styles.linkArrow}>Explore the Technology →</Link>
          </div>

          <div className={styles.restoreGrid}>
            <div className={styles.featureCardLarge}>
              <div>
                <h3>Neural Attestation</h3>
                <p>Our proprietary models analyze micro-pulsations in skin tone and inconsistencies in ocular movement that synthetic engines cannot yet replicate.</p>
              </div>
              <Brain size={120} color="rgba(255,255,255,0.05)" className={styles.bgIcon} />
            </div>

            <div className={styles.featureCardSecondary}>
              <div className={styles.iconWrapBlue}><ShieldCheck size={24}/></div>
              <h3>Zero Trust Media</h3>
              <p>A new standard for video integrity.</p>
            </div>

            <div className={styles.featureCardTertiary}>
              <div className={styles.iconWrapOutline}><LinkIcon size={20}/></div>
              <h3>Immutable Provenance</h3>
              <p>Blockchain-backed time-stamping for every frame verified by our system.</p>
            </div>

            <div className={styles.featureCardImage}>
              <div className={styles.fakeServerImg}></div>
              <div className={styles.overlayContent}>
                <h3>Real-Time Defense</h3>
                <p>Latency-free monitoring for high-stakes video calls, broadcast streams, and executive communications. Truth at the speed of light.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomCta}>
          <h2>The wall between real and fake<br/>starts here.</h2>
          <div className={styles.ctaBtns}>
            <Link to="/login" className={styles.btnPrimary}>Secure Your Platform</Link>
            <button className={styles.btnSecondary}>Read the Whitepaper</button>
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
