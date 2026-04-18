import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © 2026 <span>Bhaala Vishvanathan</span> — Built with passion &amp; purpose.
      </p>
      <div className="footer-links">
        <a href="https://www.instagram.com/_bhaala_/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://linkedin.com"                 target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com"                   target="_blank" rel="noreferrer">GitHub</a>
        <a href="mailto:bhaala@example.com"                                           >Email</a>
      </div>
    </footer>
  );
}
