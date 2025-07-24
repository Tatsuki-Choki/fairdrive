import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import FrontPageNew from './components/FrontPageNew';
import Dashboard from './components/Dashboard';
import PaymentRecord from './components/PaymentRecord';
import Groups from './components/Groups';
import SettingsPage from './components/SettingsPage';
import Settlement from './components/Settlement';
import History from './components/History';
import GroupDetail from './components/GroupDetail';
import JoinGroup from './components/JoinGroup';
import AddExpense from './components/AddExpense';
import SettlementCalculator from './components/SettlementCalculator';
import { Home, LayoutDashboard, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'front' | 'dashboard' | 'groups' | 'settings' | 'payment' | 'settlement' | 'history'>('front');
  const [isGroupCreated, setIsGroupCreated] = useState(false);
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();


  // フロントページからダッシュボードへの遷移を処理
  const handleGroupCreate = () => {
    setIsGroupCreated(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'front':
        return <FrontPageNew onGroupCreate={handleGroupCreate} />;
      case 'dashboard':
        return <Dashboard 
          onAddPayment={() => setCurrentPage('payment')} 
          onSettle={() => setCurrentPage('settlement')}
          onViewHistory={() => setCurrentPage('history')}
        />;
      case 'payment':
        return <PaymentRecord onBack={() => setCurrentPage('dashboard')} />;
      case 'groups':
        return <Groups />;
      case 'settings':
        return <SettingsPage />;
      case 'settlement':
        return <Settlement onBack={() => setCurrentPage('dashboard')} />;
      case 'history':
        return <History onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <FrontPageNew onGroupCreate={handleGroupCreate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      
      {/* Bottom Navigation - グループ作成後のみ表示 */}
      {isGroupCreated && !['payment', 'settlement', 'history'].includes(currentPage) && (
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sticky bottom-0 bg-dark-base/70 backdrop-blur-glass border-t border-dark-border"
        >
          <ul className="flex justify-around py-3">
            {[
              { icon: Home, label: "ホーム", page: 'front' as const },
              { icon: LayoutDashboard, label: "ダッシュボード", page: 'dashboard' as const },
              { icon: Users, label: "グループ", page: 'groups' as const },
              { icon: Settings, label: "設定", page: 'settings' as const }
            ].map((item, idx) => (
              <motion.li 
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
                onClick={() => setCurrentPage(item.page)}
              >
                <item.icon 
                  size={20} 
                  className={currentPage === item.page ? "text-light-primary" : "text-light-primary/60"} 
                />
                <span 
                  className={`text-xs ${currentPage === item.page ? "text-light-primary" : "text-light-primary/60"}`}
                >
                  {item.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      )}
    </div>
  );
};

// ボトムナビゲーションコンポーネント
const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 現在のページを判定
  const getCurrentPage = () => {
    if (location.pathname === '/') return 'front';
    if (location.pathname.includes('/group/') && !location.pathname.includes('/add-expense')) return 'dashboard';
    if (location.pathname === '/groups') return 'groups';
    if (location.pathname === '/settings') return 'settings';
    return '';
  };
  
  const currentPage = getCurrentPage();
  
  // ボトムナビゲーションは常に表示
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-dark-base/90 backdrop-blur-glass border-t border-dark-border z-50"
    >
      <ul className="flex justify-around py-3">
        {[
          { icon: Home, label: "ホーム", path: '/' },
          { icon: LayoutDashboard, label: "ダッシュボード", path: location.pathname.includes('/group/') ? location.pathname : '/dashboard' },
          { icon: Users, label: "グループ", path: '/groups' },
          { icon: Settings, label: "設定", path: '/settings' }
        ].map((item, idx) => {
          const isActive = 
            (item.path === '/' && currentPage === 'front') ||
            (item.label === 'ダッシュボード' && currentPage === 'dashboard') ||
            (item.path === location.pathname);
          
          return (
            <motion.li 
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <item.icon 
                size={20} 
                className={isActive ? "text-light-primary" : "text-light-primary/60"} 
              />
              <span 
                className={`text-xs ${isActive ? "text-light-primary" : "text-light-primary/60"}`}
              >
                {item.label}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/group/:shareId" element={<GroupDetail />} />
        <Route path="/join/:shareId" element={<JoinGroup />} />
        <Route path="/group/:shareId/add-expense" element={<AddExpense />} />
        <Route path="/group/:shareId/settlement" element={<SettlementCalculator />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNavigation />
    </Router>
  );
};

export default App;