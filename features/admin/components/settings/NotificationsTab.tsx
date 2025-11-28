 'use client';

import { useState } from 'react';
import '@/styles/settings.css'; 
import '@/styles/admin-Notifications-Tab.css';

interface NotificationToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
}) => {
  return (
    <div className="notification-item">
      <div className="flex-1">
        <h3 className="notification-title">
          {title}
        </h3>
        <p className="notification-description">
          {description}
        </p>
      </div>
      
      <label className="toggle-switch-label">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={onToggle}
          className="sr-only"
        />
        <span className={`toggle-track ${isEnabled ? 'toggle-track-on' : 'toggle-track-off'}`}>
          <span className={`toggle-thumb ${isEnabled ? 'toggle-thumb-on' : 'toggle-thumb-off'}`}>
          </span>
        </span>
      </label>
    </div>
  );
};

export default function NotificationsTab() {
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    alerts: true,
    disableSound: false,
  });

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  return (
    <div className="settings-section">
      <section className="settings-card">
        <h2 className="notification-main-title">
          Notification settings
        </h2>
        
        <NotificationToggle
          title="Order notifications"
          description="Receive notifications about new orders."
          isEnabled={notificationSettings.orderNotifications}
          onToggle={() => handleToggle('orderNotifications')}
        />

        <hr className="notification-separator" /> 
        
        <NotificationToggle
          title="Alerts"
          description="Receive notifications about alerts."
          isEnabled={notificationSettings.alerts}
          onToggle={() => handleToggle('alerts')}
        />

        <hr className="notification-separator" /> 

        <NotificationToggle
          title="Disable notification sound"
          description="Receive notifications without sound"
          isEnabled={notificationSettings.disableSound}
          onToggle={() => handleToggle('disableSound')}
        />
      </section>
    </div>
  );
}