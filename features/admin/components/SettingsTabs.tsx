import '@/styles/settings.css';

interface SettingsTabsProps {
  activeTab: 'account' | 'notifications' | 'security';
  onTabChange: (tab: 'account' | 'notifications' | 'security') => void;
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    { id: 'account' as const, label: 'Account' },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'security' as const, label: 'Security' },
  ];

  return (
    <div className="settings-tabs">
      <nav className="settings-tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`settings-tab ${activeTab === tab.id ? 'active' : 'inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

