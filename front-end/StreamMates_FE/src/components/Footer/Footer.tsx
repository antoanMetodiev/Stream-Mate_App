import styles from "./Footer.module.css";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo}>Stream Mate</div>
                <div className={styles.sections}>
                    <div className={styles.section}>
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h3>Legal</h3>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">DMCA</a></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.socialIcons}>
                    <a href="#" className={styles.icon}>🐦</a>
                    <a href="#" className={styles.icon}>📘</a>
                    <a href="#" className={styles.icon}>📷</a>
                </div>
            </div>
            <div className={styles.bottomText}>
                © 2025 Nunflix. All Rights Reserved.
            </div>
        </footer>
    );
};