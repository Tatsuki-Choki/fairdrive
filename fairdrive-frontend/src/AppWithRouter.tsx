import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import FrontPageNew from './components/FrontPageNew';
import Dashboard from './components/Dashboard';
import PaymentRecord from './components/PaymentRecord';
import Groups from './components/Groups';
import SettingsPage from './components/SettingsPage';
import Settlement from './components/Settlement';
import History from './components/History';
import CreateGroup from './components/CreateGroup';
import GroupDetail from './components/GroupDetail';
import JoinGroup from './components/JoinGroup';
import AddExpense from './components/AddExpense';
import { Home, LayoutDashboard, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'front' | 'dashboard' | 'groups' | 'settings' | 'payment' | 'settlement' | 'history'>('front');
  const [isGroupCreated, setIsGroupCreated] = useState(false);
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  // グループIDがURLにある場合、そのグループに参加
  useEffect(() => {
    if (groupId) {
      // LocalStorageからグループを取得
      const groups = JSON.parse(localStorage.getItem('fairdriveGroups') || '[]');
      const group = groups.find((g: any) => g.id === groupId);
      
      if (group) {
        // グループが存在する場合、currentGroupIdを設定してダッシュボードへ
        localStorage.setItem('currentGroupId', groupId);
        setIsGroupCreated(true);
        setCurrentPage('dashboard');
        navigate('/');
      } else {
        // グループが存在しない場合は、フロントページへ
        navigate('/');
      }
    }
  }, [groupId, navigate]);

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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/group/:groupId" element={<AppContent />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/group/:shareId" element={<GroupDetail />} />
        <Route path="/join/:shareId" element={<JoinGroup />} />
        <Route path="/group/:shareId/add-expense" element={<AddExpense />} />
      </Routes>
    </Router>
  );
};

export default App;