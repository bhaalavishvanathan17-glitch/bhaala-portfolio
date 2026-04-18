import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-text animate-fade-up">
        <p className="hero-greeting">👋 Hello, I'm</p>
        <h1 className="hero-name">Bhaalavishvanathan</h1>
        <h3 className="hero-role">AI &amp; Data Science Enthusiast</h3>
        <p className="hero-bio">
          Passionate about technology, continuous growth, and building solutions
          that matter. Currently pursuing B.Tech in AI &amp; Data Science, driven by
          curiosity and a never-give-up mindset.
        </p>
        <div className="hero-buttons">
          <a href="#contact" className="btn-primary">Contact Me</a>
          <a href="#skills"  className="btn-outline">Skills &amp; Interests</a>
          <a
            href="/resume.pdf"
            download
            className="btn-outline resume-btn"
            title="Download Resume"
          >
            📄 Resume
          </a>
        </div>
      </div>

      <div className="hero-img-wrap animate-float delay-2">
        <img
          src="/images/Bhaala.jpeg"
          alt="Bhaala Vishvanathan"
          className="hero-photo"
        />
        <div className="hero-badge">
          <span className="badge-name">Bhaala</span>
          <span className="badge-sub">2nd Year · B.Tech</span>
        </div>
        <div className="hero-glow" />
      </div>
    </section>
  );
}
