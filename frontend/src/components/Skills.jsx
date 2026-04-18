import './Skills.css';

const SKILLS = [
  {
    icon: '🤖',
    title: 'Artificial Intelligence',
    desc: 'Exploring ML concepts, model building, and AI-driven problem solving with a deep enthusiasm for the field.',
    color: '#f25050',
  },
  {
    icon: '📊',
    title: 'Data Science',
    desc: 'Analysing data, finding patterns, and turning raw numbers into meaningful, actionable insights.',
    color: '#00c6ff',
  },
  {
    icon: '🌐',
    title: 'Web Development',
    desc: 'Building clean, modern web interfaces using HTML, CSS, and JavaScript with a focus on user experience.',
    color: '#a855f7',
  },
  {
    icon: '🐍',
    title: 'Python Programming',
    desc: 'Writing scripts, automating tasks, and working with data libraries like pandas and numpy.',
    color: '#ffd369',
  },
  {
    icon: '💡',
    title: 'Problem Solving',
    desc: 'Tackling challenges with logical thinking, persistence, and a solution-first mindset.',
    color: '#4ade80',
  },
  {
    icon: '📈',
    title: 'Continuous Learning',
    desc: 'Committed to growing every day — through courses, projects, reading, and real-world practice.',
    color: '#fb923c',
  },
];

export default function Skills() {
  return (
    <section className="skills-section section-pad" id="skills">
      <div className="container">
        <div className="text-center animate-fade-up">
          <p className="section-label">What I Do</p>
          <h2 className="section-title gradient-text-cyan">Skills &amp; Interests</h2>
          <p className="section-subtitle">Areas I'm passionate about and actively growing in</p>
          <div className="divider-bar" />
        </div>

        <div className="skills-grid">
          {SKILLS.map((s, i) => (
            <div
              key={s.title}
              className={`skill-card glass-card animate-fade-up delay-${i + 1}`}
              style={{ '--accent': s.color }}
            >
              <span className="skill-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
