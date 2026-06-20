import React from 'react';
import { XCircle } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <XCircle size={80} className="not-found-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/dashboard" className="back-home-link">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
