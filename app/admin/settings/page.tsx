'use client';

import { useState } from 'react';
import SettingsTabs from '@/features/admin/components/SettingsTabs';
import AccountTab from '@/features/admin/components/settings/AccountTab';
import NotificationsTab from '@/features/admin/components/settings/NotificationsTab';
import SecurityTab from '@/features/admin/components/settings/SecurityTab';
import '@/styles/settings.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'security'>('account');

  return (
    <div className="settings-container">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="settings-content">
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}


