import React from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import Footer from '../components/Footer';
import profileImg from '../assets/profile.jpg';

function Home() {
  const studentName = "Riya Thesia";
  const mySkills = [
    'React.js (Components & Hooks)',
    'JavaScript ES6+',
    'Node.js & Express REST APIs',
    'MongoDB & Mongoose ODM',
    'HTML5, CSS3 & Glassmorphism',
    'Git & GitHub Workflows'
  ];

  const sampleProjects = [
    { id: 1, title: 'Student Portfolio App', tech: 'Vite, React 18, React Router v6', desc: 'Single-page portfolio application with dynamic component composition and theme toggle.' },
    { id: 2, title: 'GitHub Repository Explorer', tech: 'React Hooks, Fetch API, REST API', desc: 'Asynchronous REST API consumer rendering repo stats with loading & error states.' },
    { id: 3, title: 'Task Manager Backend API', tech: 'Node.js, Express, MongoDB, JWT', desc: 'RESTful CRUD server with custom middleware logging, Mongoose validation, and JWT authentication.' }
  ];

  return (
    <div className="page-container home-page">
      <div className="profile-header-card">
        <div className="profile-avatar-frame">
          <img src={profileImg} alt="Riya Thesia" className="profile-avatar-img" />
        </div>
        <Header name={studentName} studentRole="5th Sem Computer Engineering | CHARUSAT" themeColor="#1e1b18" />
      </div>

      <main className="main-content-grid">
        <About bioText="Computer Engineering student at CHARUSAT specializing in full-stack web development. Passionate about building performant, modern frontend interfaces and scalable RESTful backends." />

        <Skills skillList={mySkills} />

        <section className="card-section projects-card">
          <h2 className="section-title">📂 Featured Projects</h2>
          <p className="section-subtitle">Highlights of recent web projects and applications:</p>
          
          <div className="projects-grid">
            {sampleProjects.map((proj) => (
              <div key={proj.id} className="project-box">
                <h3 className="project-title">{proj.title}</h3>
                <span className="project-tech-badge">{proj.tech}</span>
                <p className="project-desc">{proj.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer copyrightName={studentName} />
    </div>
  );
}

export default Home;