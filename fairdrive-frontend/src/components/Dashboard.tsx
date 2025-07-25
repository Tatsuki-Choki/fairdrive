import { useState, useEffect } from "react";
import { Plus, Car, Fuel, CreditCard, Receipt, Users, ChevronRight, UserPlus, Loader2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGroupStore } from "../store/groupStore";

// 仮のデータ型
interface GroupData {
  name: string;
  members: string[];
  totalExpense: number;
  perPerson: number;
}

interface RecentPayment {
  id: string;
  payer: string;
  amount: number;
  category: string;
  description: string;
  time: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface DashboardProps {
  onAddPayment?: () => void;
  onSettle?: () => void;
  onViewHistory?: () => void;
}

export default function Dashboard({ onAddPayment, onSettle, onViewHistory }: DashboardProps) {
  const navigate = useNavigate();
  const { groups, currentGroupId, setCurrentGroup, isLoading, error } = useGroupStore();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // 現在のグループを取得
  const currentGroup = groups.find(g => g.id === currentGroupId);
  
  // グループデータの初期値
  const [groupData, setGroupData] = useState<GroupData>({
    name: currentGroup?.name || "グループ名",
    members: currentGroup?.members || [],
    totalExpense: 0,
    perPerson: 0
  });

  // 初期化完了をチェック
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // グループが変更されたときにデータを更新
  useEffect(() => {
    if (currentGroup) {
      setGroupData({
        name: currentGroup.name,
        members: currentGroup.members,
        totalExpense: 0, // 支払い機能実装後に計算
        perPerson: 0 // 支払い機能実装後に計算
      });
    }
  }, [currentGroup]);

  // 支払いデータ（初期は空）
  const [recentPayments] = useState<RecentPayment[]>([]);

  // 清算データ（初期は空）
  const [settlements] = useState<Settlement[]>([]);

  // カテゴリアイコンの取得
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "高速料金": return <Car size={16} />;
      case "ガソリン": return <Fuel size={16} />;
      case "駐車場": return <Car size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  // ローディング状態
  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aurora-gradient text-light-primary">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={40} className="text-light-primary/60" />
          </motion.div>
          <p className="text-sm text-light-primary/60">読み込み中...</p>
        </motion.div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aurora-gradient text-light-primary px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/[0.04] backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-dark-border text-center"
        >
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/groups')}
            className="bg-light-primary text-dark-base rounded-xl px-4 py-2 font-semibold text-sm"
          >
            グループ一覧へ
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // 空状態UIコンポーネント
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full px-6 py-12"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-white/[0.04] backdrop-blur-glass flex items-center justify-center mb-6 shadow-glass border border-dark-border"
      >
        <UserPlus size={40} className="text-light-primary/60" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl font-bold mb-3"
      >
        グループを作成しましょう
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-light-primary/60 text-center mb-8 max-w-xs"
      >
        ドライブ旅行の費用を簡単に管理。
        まずはグループを作成してメンバーを追加しましょう。
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/group/create')}
        className="bg-light-primary text-dark-base rounded-xl px-6 py-3 font-semibold text-sm flex items-center gap-2 shadow-glass"
      >
        <Plus size={18} />
        グループを作成
      </motion.button>
    </motion.div>
  );

  // グループがない場合は空状態UIを表示
  if (groups.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-aurora-gradient text-light-primary">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-16 flex items-center justify-center px-4 bg-dark-base shadow-glass sticky top-0 z-50 backdrop-blur-glass"
        >
          <h1 className="text-lg font-bold tracking-[0.2em]">FAIRDRIVE</h1>
        </motion.header>
        <main className="flex-1 flex items-center justify-center">
          <EmptyState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-aurora-gradient text-light-primary">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-16 flex items-center justify-between px-4 bg-dark-base shadow-glass sticky top-0 z-50 backdrop-blur-glass"
      >
        <h1 className="text-lg font-bold">{groupData.name}</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/group/create')}
          className="text-light-primary/60 hover:text-light-primary transition-colors"
        >
          <PlusCircle size={20} />
        </motion.button>
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4 space-y-3"
        >
          {/* Summary Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <h2 className="text-sm font-semibold text-light-primary/80 mb-3">現在の清算状況</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-light-primary/60">総支出</span>
                <span className="text-xl font-bold">¥{groupData.totalExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-light-primary/60">一人あたり</span>
                <span className="text-lg font-semibold text-light-primary/80">¥{groupData.perPerson.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onAddPayment}
              className="bg-light-primary text-dark-base rounded-xl p-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-glass"
            >
              <Plus size={18} />
              支払いを追加
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSettle}
              className="bg-white/[0.04] backdrop-blur-glass rounded-xl p-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-glass border border-dark-border"
            >
              <CreditCard size={18} />
              清算する
            </motion.button>
          </motion.div>

          {/* Recent Payments */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-light-primary/80">最近の支払い</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewHistory}
                className="text-xs text-light-primary/60 hover:text-light-primary transition-colors"
              >
                すべて見る
              </motion.button>
            </div>
            <div className="space-y-2">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment, idx) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 py-2 border-b border-dark-border last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      {getCategoryIcon(payment.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{payment.description}</p>
                          <p className="text-xs text-light-primary/60">{payment.payer} • {payment.time}</p>
                        </div>
                        <p className="text-sm font-semibold">¥{payment.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-light-primary/40 text-center py-4">
                  まだ支払いが記録されていません
                </p>
              )}
            </div>
          </motion.div>

          {/* Settlement Status */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <h2 className="text-sm font-semibold text-light-primary/80 mb-3">清算予定</h2>
            <div className="space-y-2">
              {settlements.length > 0 ? (
                settlements.map((settlement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-light-primary/80">{settlement.from}</span>
                      <ChevronRight size={14} className="text-light-primary/40" />
                      <span className="text-light-primary/80">{settlement.to}</span>
                    </div>
                    <span className="text-sm font-semibold">¥{settlement.amount.toLocaleString()}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-light-primary/40 text-center py-4">
                  清算予定はありません
                </p>
              )}
            </div>
          </motion.div>

          {/* Members */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <h2 className="text-sm font-semibold text-light-primary/80 mb-3">メンバー</h2>
            <div className="grid grid-cols-2 gap-2">
              {groupData.members.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm text-center"
                >
                  {member}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}