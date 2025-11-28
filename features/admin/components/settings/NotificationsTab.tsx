 'use client';

import { useState } from 'react';
// We'll rely on global Tailwind availability and the imported settings.css/new admin-Notifications-Tab.css
import '@/styles/settings.css'; 
import '@/styles/admin-Notifications-Tab.css'; // New import for specific notification styles

// --- Reusable Toggle Component ---
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
        {/* Uses custom classes for color and size hierarchy */}
        <h3 className="notification-title">
          {title}
        </h3>
        <p className="notification-description">
          {description}
        </p>
      </div>
      
      {/* Toggle Switch implementation - relies entirely on custom CSS classes */}
      <label className="toggle-switch-label">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={onToggle}
          className="sr-only" // Hidden checkbox
        />
        <span className={`toggle-track ${isEnabled ? 'toggle-track-on' : 'toggle-track-off'}`}>
          <span className={`toggle-thumb ${isEnabled ? 'toggle-thumb-on' : 'toggle-thumb-off'}`}>
          </span>
        </span>
      </label>
    </div>
  );
};

// --- Main Component ---
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
        {/* Main Title: Uses custom class for bold, black, and proper size */}
        <h2 className="notification-main-title">
          Notification settings
        </h2>
        
        {/* Order Notifications */}
        <NotificationToggle
          title="Order notifications"
          description="Receive notifications about new orders."
          isEnabled={notificationSettings.orderNotifications}
          onToggle={() => handleToggle('orderNotifications')}
        />

        <hr className="notification-separator" /> 
        
        {/* Alerts */}
        <NotificationToggle
          title="Alerts"
          description="Receive notifications about alerts."
          isEnabled={notificationSettings.alerts}
          onToggle={() => handleToggle('alerts')}
        />

        <hr className="notification-separator" /> 

        {/* Disable Notification Sound (starts OFF) */}
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