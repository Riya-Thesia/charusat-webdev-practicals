import React, { useState } from 'react';

function About({ bioText }) {

  const [showMore, setShowMore] = useState(false);

  return (
    <section className="card-section about-card">
      <h2 className="section-title">👨‍💻 About Me</h2>
      <p className="bio-text">
        {bioText || "I am Riya Thesia, a 5th semester Computer Engineering student at CHARUSAT. I am passionate about full-stack web development, software engineering, and modern JavaScript frameworks."}
      </p>

      {}
      <button 
        className="btn btn-outline" 
        onClick={() => setShowMore(!showMore)}
        style={{ marginTop: '0.75rem' }}
      >
        {showMore ? 'Hide Academic Details ▲' : 'View Academic Details ▼'}
      </button>

      {showMore && (
        <div className="academic-details animate-fade">
          <ul className="details-list">
            <li><strong>Degree:</strong> B.Tech Computer Engineering (Semester 5)</li>
            <li><strong>University:</strong> CHARUSAT University</li>
            <li><strong>Course:</strong> Advanced Web Development Frameworks (ITUE301)</li>
            <li><strong>Focus Areas:</strong> React.js, Node.js, Express, MongoDB, RESTful APIs</li>
          </ul>
        </div>
      )}
    </section>
  );
}

export default About;
