import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'; // Икони от Font Awesome
import styles from "./Footer.module.css"; // Импортираме CSS модулите
import { useLocation } from 'react-router-dom';

export const Footer = () => {
    const location = useLocation();

    // Проверка дали location.pathname е празен или равен на "/"
    const footerClass = location.pathname === "" || location.pathname === "/" ? `${styles.main} ${styles.blackMain}` : styles.main;
    return (
        <main className={footerClass}>
            <footer className={styles.footer}>
                <header className={styles.footerHeader}>
                    <h2 className={styles.footerTitle}>Stream Mate</h2>
                    <p className={styles.footerDescription}>"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis, accusantium?"</p>
                    <ul className={styles.icons}>
                        {/* Добавяме анимирани икони с React Icons */}
                        <FaFacebook className={`${styles.icon} animated`} />
                        <FaInstagram className={`${styles.icon} animated`} />
                        <FaTwitter className={`${styles.icon} animated`} />
                        <FaYoutube className={`${styles.icon} animated`} />
                    </ul>
                </header>

                <aside className={styles.aside}>
                    <ul className={styles.category}>
                        <li>
                            <h3 className={styles.categoryTitle}>Project</h3>
                        </li>
                        <li className={styles.categoryItem}>Houses</li>
                        <li className={styles.categoryItem}>Rooms</li>
                        <li className={styles.categoryItem}>Flats</li>
                        <li className={styles.categoryItem}>Apartments</li>
                    </ul>

                    <ul className={styles.category}>
                        <li>
                            <h3 className={styles.categoryTitle}>Company</h3>
                        </li>
                        <li className={styles.categoryItem}>Objective</li>
                        <li className={styles.categoryItem}>Capital</li>
                        <li className={styles.categoryItem}>Security</li>
                        <li className={styles.categoryItem}>Selling</li>
                    </ul>

                    <ul className={styles.category}>
                        <li>
                            <h3 className={styles.categoryTitle}>Movement</h3>
                        </li>
                        <li className={styles.categoryItem}>Movement</li>
                        <li className={styles.categoryItem}>Support us</li>
                        <li className={styles.categoryItem}>Pricing</li>
                        <li className={styles.categoryItem}>Renting</li>
                    </ul>

                    <ul className={styles.category}>
                        <li>
                            <h3 className={styles.categoryTitle}>Help</h3>
                        </li>
                        <li className={styles.categoryItem}>Privacy</li>
                        <li className={styles.categoryItem}>Contact</li>
                        <li className={styles.categoryItem}>FAQs</li>
                        <li className={styles.categoryItem}>Blog</li>
                    </ul>
                </aside>
            </footer>
        </main>
    );
};
