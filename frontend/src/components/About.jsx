import './About.css';

const TAGS = ['Artificial Intelligence','Machine Learning','Data Analytics','Python','HTML & CSS','JavaScript'];

const ACHIEVEMENTS = [
  'Developed multiple responsive web projects with modern UI/UX design.',
  'Built AI problem-solving models and automated tasks using Python.',
  'Demonstrated consistent academic excellence in B.Tech AI & Data Science.',
  'Successfully built and deployed full-stack, visually rich portfolio interfaces.',
];

export default function About() {
  return (
    <div className="about-page page-content">

      {/* Hero header */}
      <header className="about-hero animate-fade-up">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <p className="section-label">Personal Journey</p>
          <h1 className="about-title gradient-text-red">About Me</h1>
        </div>
      </header>

      <div className="about-body container">
        <div className="about-card glass-card animate-fade-up">

          {/* Introduction */}
          <section className="about-section">
            <h2 className="about-section-title">Introduction</h2>
            <p>
              I am a person driven by <strong>ambition</strong>, <strong>curiosity</strong>, and a deep desire to{' '}
              <strong>grow beyond my limitations</strong>. From an early stage in my life, I carried many dreams —
              some large enough to seem impossible. However, my <strong>determination</strong> and stubborn belief in{' '}
              <strong>continuous progress</strong> have always pushed me forward.
            </p>
            <p>
              My journey has never been linear or easy. Life has presented its share of ups and downs, serving as a{' '}
              <strong>roller coaster of experiences</strong>. Those became some of the{' '}
              <strong>most valuable learning experiences</strong> in my career journey.
            </p>
          </section>

          <hr className="about-divider" />

          {/* Skills */}
          <section className="about-section">
            <h2 className="about-section-title">Skills &amp; Technologies</h2>
            <div className="about-tags">
              {TAGS.map(t => (
                <span key={t} className="about-tag">{t}</span>
              ))}
            </div>
          </section>

          <hr className="about-divider" />

          {/* Goals */}
          <section className="about-section">
            <h2 className="about-section-title">Goals &amp; Vision</h2>
            <p>
              I strongly believe that <strong>personal growth comes from embracing challenges</strong>, learning from
              failures, and maintaining the courage to pursue dreams even when uncertain. My vision is to build{' '}
              <strong>meaningful technological solutions</strong> that make an impact, honing my expertise in AI and
              Data Science.
            </p>
          </section>

          <hr className="about-divider" />

          {/* Achievements */}
          <section className="about-section">
            <h2 className="about-section-title">Achievements &amp; Highlights</h2>
            <ul className="about-list">
              {ACHIEVEMENTS.map(a => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

        </div>
      </div>

    </div>
  );
}
