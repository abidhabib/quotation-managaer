import React from 'react';
import { Check, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Check size={18} />,
    error: <X size={18} />,
    info: null,
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type] && <span className="toast-icon">{icons[type]}</span>}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
