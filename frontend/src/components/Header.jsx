import React from 'react';

function Header({ name, studentRole, themeColor }) {
  return (
    <header 
      className="portfolio-header" 
      style={{ borderBottom: `3px solid ${themeColor || '#1e1b18'}` }}
    >
      <div className="header-badge">Computer Engineering Portfolio</div>
      <h1 className="header-title">Welcome to {name}'s Portfolio</h1>
      <p className="header-subtitle">{studentRole || 'Computer Engineering Student | CHARUSAT'}</p>
    </header>
  );
}

export default Header;
