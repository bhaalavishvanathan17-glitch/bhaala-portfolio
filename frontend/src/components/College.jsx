import './College.css';

const INFO = [
  { label: 'Institution',   value: 'DSEC(A)'     },
  { label: 'Degree',        value: 'B.Tech'       },
  { label: 'Specialization',value: 'AI & DS'      },
  { label: 'Year',          value: '2nd Year'     },
  { label: 'Location',      value: 'Perambalur'   },
  { label: 'Batch',         value: '2024–2028'    },
];

export default function College() {
  return (
    <div className="college-page page-content">

      <section className="college-hero">
        <div className="college-overlay" />
        <div className="college-hero-content animate-fade-up">
          <div className="page-badge">🎓 Education</div>
          <h1>My College Journey</h1>
        </div>
      </section>

      <div className="container college-body">
        <div className="college-card glass-card animate-fade-up">
          <img
            src="/images/DSEC 2.jpeg"
            alt="Dhanalakshmi Srinivasan Engineering College"
            className="college-img"
          />
          <div className="college-card-body">
            <h2>Dhanalakshmi Srinivasan Engineering College</h2>
            <p className="college-course">🖥️ B.Tech — Artificial Intelligence & Data Science</p>

            <p>
              I am currently pursuing my undergraduate degree in{' '}
              <strong>Artificial Intelligence and Data Science</strong> at Dhanalakshmi Srinivasan Engineering College, Perambalur.
              This journey has been an incredible blend of academic rigour and personal growth, fuelling my passion for emerging
              technologies and their real-world impact.
            </p>
            <p>
              The curriculum exposes me to core areas like <strong>Machine Learning</strong>,{' '}
              <strong>Deep Learning</strong>, <strong>Data Analytics</strong>, and{' '}
              <strong>Python Programming</strong> — all applied through hands-on projects and lab work.
            </p>

            <div className="college-info-grid">
              {INFO.map(i => (
                <div key={i.label} className="info-chip">
                  <div className="chip-label">{i.label}</div>
                  <div className="chip-value">{i.value}</div>
                </div>
              ))}
            </div>

            <a
              href="https://dsengg.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              🌐 Visit Official Website
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
