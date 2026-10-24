import React from 'react';

function Spinner({ message }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring"></div>
      <p className="spinner-text">{message || 'Fetching data from REST API...'}</p>
    </div>
  );
}

export default Spinner;
