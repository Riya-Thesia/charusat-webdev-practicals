import React from 'react';

function Footer({ copyrightName }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="portfolio-footer">
      <div className="footer-content">
        <p className="copyright-text">
          © {currentYear} {copyrightName || 'Riya Thesia'}. Built with React, Node.js & Express.
        </p>
        <p className="university-tag">
          Department of Computer Engineering | CHARUSAT University
        </p>
      </div>
    </footer>
  );
}

export default Footer;
