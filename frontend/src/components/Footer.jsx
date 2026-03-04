import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          <h3 className={styles.brandName}>ZapShare</h3>
          <p className={styles.brandTagline}>
            Seamless peer-to-peer file sharing and real-time rooms. Built for speed, designed for privacy.
          </p>
        </div>

        <div className={styles.linkGroup}>
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">Security</a>
          <a href="#">API Documentation</a>
          <a href="#">Pricing</a>
        </div>

        <div className={styles.linkGroup}>
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Contact Support</a>
        </div>

        <div className={styles.linkGroup}>
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Acceptable Use</a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} ZapShare. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
