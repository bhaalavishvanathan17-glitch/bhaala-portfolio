import './School.css';

const SCHOOLS = [
  {
    name: 'Nesan Kala Salai',
    img:  '/images/Nesan kala salai.webp',
    href: 'https://schools.org.in/theni/33250400802/nesan-kala-pry-scl-n-tpatty.html',
    num:  '01',
  },
  {
    name: 'RR International School',
    img:  '/images/RR International School.avif',
    href: 'https://rrinternationalschool.com/',
    num:  '02',
  },
  {
    name: 'Mary Matha CMI Public School',
    img:  '/images/Mary matha CMI public School.png',
    href: 'https://www.marymathacmipublicschool.org/',
    num:  '03',
  },
  {
    name: 'Jay Tech International School',
    img:  '/images/Jay Tech international school.jpeg',
    href: 'https://www.jaytechcbseschool.com/',
    num:  '04',
  },
];

export default function School() {
  return (
    <div className="school-page page-content">

      <section className="school-hero animate-fade-up">
        <div className="school-hero-overlay" />
        <div className="school-hero-content">
          <div className="page-badge">🏫 Education</div>
          <h1 className="school-title gradient-text-cyan">My School</h1>
          <p className="school-subtitle">
            A look back at the institutions that built my foundational knowledge and values.
          </p>
        </div>
      </section>

      <div className="school-grid container">
        {SCHOOLS.map((s, i) => (
          <a
            key={s.num}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className={`school-card glass-card animate-fade-up delay-${i + 1}`}
          >
            <div className="school-img-wrap">
              <img src={s.img} alt={s.name} />
              <span className="school-num">{s.num}</span>
            </div>
            <div className="school-card-body">
              <h3>{s.name}</h3>
              <span className="school-visit">Visit Website →</span>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}
