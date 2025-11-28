 'use client';

import { useState } from 'react';
import '@/styles/settings.css';
import '@/styles/admin-SecurityTab.css';

interface SecurityToggleProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const SecurityToggle: React.FC<SecurityToggleProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
}) => {
  return (
    <div className="security-item toggle-container">
      <div className="flex-1">
        <h3 className="security-toggle-title">
          {title}
        </h3>
        <p className="security-toggle-description">
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

export default function SecurityTab() {
  const [formData, setFormData] = useState({
    email: 'email@email.com',
    password: '••••••••••••', 
  });
  const [is2FAGlobalEnabled, setIs2FAGlobalEnabled] = useState(true); 

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handle2FAToggle = () => {
    setIs2FAGlobalEnabled(!is2FAGlobalEnabled);
  };
  
  const handleChangeEmail = () => alert('Change Email clicked!');
  const handleChangePassword = () => alert('Change Password clicked!');

  return (
    <div className="settings-section">
      <section className="settings-card">
        <h2 className="security-main-title">
          Security settings
        </h2>
        
        <div className="security-item field-action-container">
          <div className="form-field security-input-wrapper">
            <label className="form-label security-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="form-input security-input" 
            />
          </div>
          <button 
            onClick={handleChangeEmail} 
            className="security-action-button"
          >
            Change email
          </button>
        </div>

        <div className="security-item field-action-container">
          <div className="form-field security-input-wrapper">
            <label className="form-label security-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="form-input security-input" 
              readOnly
            />
          </div>
          <button 
            onClick={handleChangePassword} 
            className="security-action-button"
          >
            Change password
          </button>
        </div>

        <hr className="security-separator" />

        <SecurityToggle
          title="2-step authentication"
          description="add an additional layer of security to you account during login"
          isEnabled={is2FAGlobalEnabled}
          onToggle={handle2FAToggle}
        />
      </section>
    </div>
  );
}
