'use client';

import { useState } from 'react';
import '@/styles/settings.css';

export default function AccountTab() {
  const [formData, setFormData] = useState({
    firstName: 'Flenn',
    lastName: 'fleni',
    phone: '+213 555 555 555',
    address: 'Algeria, algiers, *******',
  });

  const [language, setLanguage] = useState('English');
  const [appearance, setAppearance] = useState('Light');

  return (
    <div className="settings-section">
      {/* Profile Information */}
      <section className="settings-card">
        <h2 className="settings-card-title">Profile information</h2>
        
        <div className="profile-header">
          {/* Avatar */}
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              K
            </div>
            <button className="profile-avatar-edit-button">
              <svg
                className="profile-avatar-edit-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="profile-info">
            <h3 className="profile-name">User Name</h3>
            <p className="profile-email">email@email.com</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">
              First name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Last name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Phone number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex justify-end">
          <button className="edit-profile-button">
            <svg
              className="edit-profile-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit profile
          </button>
        </div>
      </section>

      {/* Change Language */}
      <section className="settings-card">
        <h2 className="settings-card-title-small">Change language</h2>
        <p className="settings-card-description">
          changing the language will take few seconds
        </p>
        <div className="form-select-wrapper">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select"
          >
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
            <option>Arabic</option>
          </select>
          <div className="form-select-icon">
            <svg
              className="form-select-arrow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Change Appearance */}
      <section className="settings-card">
        <h2 className="settings-card-title-small">Change appearance</h2>
        <p className="settings-card-description">
          you have the choice between light and dark mode
        </p>
        <div className="form-select-wrapper">
          <select
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            className="form-select"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
          <div className="form-select-icon">
            <svg
              className="form-select-arrow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}


