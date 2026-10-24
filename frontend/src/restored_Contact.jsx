import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2 } from 'lucide-react';

function Contact() {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setName('');
      setEmail('');
    }, 4000);
  };

  return (
    <div className="page-container contact-page">
      <div className="page-header">
        <h1 className="page-title">✉️ Contact Form</h1>
        <p className="page-subtitle">
          Feel free to reach out with any questions, feedback, or collaboration inquiries.
        </p>
      </div>

      <div className="contact-grid">
        <div className="card-section form-card">
          <div className="card-header-row">
            <h2 className="section-title">Send a Message</h2>
            <button 
              type="button" 
              className="btn-icon" 
              onClick={() => setShowTooltip(!showTooltip)}
              title="Toggle Form Guidance"
            >
              <HelpCircle size={20} className={showTooltip ? 'text-primary' : ''} />
            </button>
          </div>

          {showTooltip && (
            <div className="tooltip-box animate-fade">
              💡 <strong>Form Guidance:</strong> As you type into the message field below, your input is captured in component state and reflected live in the preview panel!
            </div>
          )}

          {submitted ? (
            <div className="success-banner animate-pop">
              <CheckCircle2 size={32} className="success-icon" />
              <h3>Thank You, {name || 'Friend'}!</h3>
              <p>Your message has been captured and submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Name:</label>
                <input
                  id="contact-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Riya Thesia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address:</label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. riya@charusat.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Message / Feedback:
                </label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  rows={4}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                
                <div className="char-counter">
                  Character Count: <strong>{message.length}</strong> / 500
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Send size={16} /> Submit Message
              </button>
            </form>
          )}
        </div>

        <div className="card-section preview-card">
          <h2 className="section-title">🔍 Live Input Preview</h2>
          <p className="section-subtitle">Real-time reflection of form input data:</p>

          <div className="state-mirror-box">
            <div className="mirror-item">
              <span className="mirror-label">Name:</span>
              <span className="mirror-value">{name ? `"${name}"` : '"" (empty)'}</span>
            </div>

            <div className="mirror-item">
              <span className="mirror-label">Email:</span>
              <span className="mirror-value">{email ? `"${email}"` : '"" (empty)'}</span>
            </div>

            <div className="mirror-item">
              <span className="mirror-label">Message Preview:</span>
              <div className="mirror-text-display">
                {message ? message : <em className="placeholder-text">Start typing in the message box to see live state rendering...</em>}
              </div>
            </div>

            <div className="mirror-item">
              <span className="mirror-label">Help Tooltip:</span>
              <span className={`badge ${showTooltip ? 'badge-active' : 'badge-inactive'}`}>
                {showTooltip ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
