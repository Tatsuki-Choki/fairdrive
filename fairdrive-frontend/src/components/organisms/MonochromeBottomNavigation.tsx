import React from 'react';
import { Home, Users, Car, Settings } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface MonochromeBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MonochromeBottomNavigation: React.FC<MonochromeBottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <Home size={24} /> },
    { id: 'groups', label: 'グループ', icon: <Users size={24} /> },
    { id: 'settings', label: '設定', icon: <Settings size={24} /> },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb"
      role="tablist"
      aria-label="メインナビゲーション"
    >
      <div className="flex">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[60px]
                transition-colors duration-150
                ${isActive 
                  ? 'text-black bg-gray-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${item.id}-panel`}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="mb-1">{item.icon}</span>
              <span className="text-xs font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};