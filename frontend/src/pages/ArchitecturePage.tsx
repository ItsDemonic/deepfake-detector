import { Activity, Shield, Hash, Book, MessageSquare } from 'lucide-react';
import styles from './ArchitecturePage.module.css';

export function ArchitecturePage() {
  return (
    <div className={styles.page}>
      
      <main className={styles.main}>
        <div className={styles.eyebrow}>ENGINEERING DOCUMENTATION</div>
        <h1 className={styles.title}>
          Architecting the <span>Neural Firewall</span>
        </h1>
        <p className={styles.subtitle}>
          Deep-dive into the Sovereign Architect ecosystem. Our detector leverages multi-stage GAN analysis and synthetic fingerprinting to secure the digital perimeter against generative threats.
        </p>

        <h2 className={styles.sectionTitle}>Technical Architecture</h2>

        <div className={styles.gridTop}>
          <div className={styles.cardLarge}>
             <div className={styles.cardHeader}>
               <Activity size={16} color="#38e8ff"/> Processing Pipeline
             </div>
             <div className={styles.pipelineMock}>
                <div className={styles.pipeStep}>
                  <div className={styles.pipeIcon}><Shield size={20}/></div>
                  <span>INGESTION</span>
                </div>
                <div className={styles.pipeArrow}>→</div>
                <div className={styles.pipeStep}>
                  <div className={styles.pipeIconActive}><Activity size={20} color="#0b111a"/></div>
                  <span>NEURAL FILTER</span>
                </div>
                <div className={styles.pipeArrow}>→</div>
                <div className={styles.pipeStep}>
                  <div className={styles.pipeIcon}><Hash size={20}/></div>
                  <span>FINGERPRINTING</span>
                </div>
             </div>
          </div>
          
          <div className={styles.card}>
             <div className={styles.cardHeader}>
               <Activity size={16} color="#38e8ff"/> Performance Metrics
             </div>
             <p className={styles.cardDesc}>Optimized for high-throughput enterprise environments.</p>
             <div className={styles.metricRow}>
                <span>AVG LATENCY</span>
                <strong>142ms</strong>
             </div>
             <div className={styles.metricRow}>
                <span>THROUGHPUT</span>
                <strong>10k/sec</strong>
             </div>
             <div className={styles.metricRow}>
                <span>UPTIME</span>
                <strong>99.99%</strong>
             </div>
          </div>
        </div>

        <div className={styles.gridBottom}>
          <div className={styles.card}>
             <h3 className={styles.cardHighlightTitle}>Neural Ensemble Strategy</h3>
             <div className={styles.strategyItem}>
               <div className={styles.strategyIcon}><Shield size={16}/></div>
               <div>
                 <h4>Cross-Domain Generalization</h4>
                 <p>Our models are trained on diverse datasets including StyleGAN, ProGAN, and proprietary Diffusion models...</p>
               </div>
             </div>
             <div className={styles.strategyItem}>
               <div className={styles.strategyIcon}><Activity size={16}/></div>
               <div>
                 <h4>Spectral Analysis</h4>
                 <p>Analyzing artifacts in the frequency domain reveals systematic upsampling errors characteristic of GANs...</p>
               </div>
             </div>
          </div>

          <div className={styles.cardLarge}>
             <div className={styles.cardHeaderRow}>
               <div className={styles.cardHeader}>Direct API Access</div>
               <div className={styles.dots}><span className={styles.dotR}></span><span className={styles.dotY}></span><span className={styles.dotG}></span></div>
             </div>
             <div className={styles.codeBlock}>
                <code>
                  <span className={styles.keyword}>const</span> sovereign = <span className={styles.func}>require</span>(<span className={styles.string}>'@sov-arch/sdk'</span>);<br/><br/>
                  <span className={styles.comment}>// Initialize client</span><br/>
                  <span className={styles.keyword}>const</span> client = <span className={styles.keyword}>new</span> sovereign.Client(API_KEY);<br/><br/>
                  <span className={styles.comment}>// Analyze media payload</span><br/>
                  <span className={styles.keyword}>const</span> result = <span className={styles.keyword}>await</span> client.analyze({`{`}<br/>
                  &nbsp;&nbsp;uri: <span className={styles.string}>'https://media.source/asset.png'</span>,<br/>
                  &nbsp;&nbsp;sensitivity: <span className={styles.number}>0.98</span>,<br/>
                  &nbsp;&nbsp;engines: [<span className={styles.string}>'gan-v2'</span>, <span className={styles.string}>'diffusion-v1'</span>]<br/>
                  {`}`});<br/><br/>
                  console.log(result.probability_score);
                </code>
             </div>
          </div>
        </div>

        <div className={styles.ctaCard}>
           <div>
             <h3>Build the future of digital trust.</h3>
             <p>Access our comprehensive documentation, community-maintained wrappers for Python, Go, and Node.js, and a suite of testing datasets to benchmark your implementation.</p>
             <div className={styles.ctaBtns}>
               <button className={styles.btnPrimary}><Book size={16} /> View API Docs</button>
               <button className={styles.btnSecondary}><MessageSquare size={16} /> Join Discord</button>
             </div>
           </div>
           <div className={styles.ctaDecoration}></div>
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
