import React from 'react';

function Skills({ skillList }) {
  const defaultSkills = [
    'React.js & JSX',
    'JavaScript ES6+',
    'Node.js & Express',
    'MongoDB & Mongoose',
    'HTML5 & CSS3',
    'RESTful API Design',
    'C++ & Data Structures',
    'Git & GitHub'
  ];

  const list = skillList || defaultSkills;

  return (
    <section className="card-section skills-card">
      <h2 className="section-title">⚡ Technical Skills</h2>
      <p className="section-subtitle">Core technologies and technical proficiencies:</p>
      
      <div className="skills-grid">
        {list.map((skill, index) => (
          <div key={skill || index} className="skill-pill">
            <span className="skill-bullet">✦</span> {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;