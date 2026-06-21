import React, { useEffect } from 'react'
import useNotificationStore from '../store/notificationStore'

const ToastContainer = () => {
  const { notifications, deleteNotification } = useNotificationStore()

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        deleteNotification(notification.id)
      }, 5000)

      return () => clearTimeout(timer)
    })
  }, [notifications, deleteNotification])

  if (notifications.length === 0) return null

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`toast toast-${notification.type || 'info'}`}
        >
          <span>{notification.message}</span>
          <button 
            onClick={() => deleteNotification(notification.id)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              marginLeft: 'auto',
              color: 'inherit',
              fontSize: '1.25rem',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
