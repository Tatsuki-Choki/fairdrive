import { useState } from "react";
import { Plus, Users, ChevronRight, Calendar, Car } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGroupStore } from "../store/groupStore";

interface Group {
  id: string;
  name: string;
  members: string[];
  lastActivity: string;
  totalExpense: number;
  isActive: boolean;
}

export default function Groups() {
  const navigate = useNavigate();
  const { groups, setCurrentGroup } = useGroupStore();
  
  // グループに仮の追加情報を付与
  const groupsWithDetails = groups.map((group, index) => ({
    ...group,
    lastActivity: new Date(group.createdAt).toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    totalExpense: 0, // デモ用の値
    isActive: index === 0 // 最新のグループをアクティブに
  }));

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

  return (
    <div className="min-h-screen flex flex-col bg-aurora-gradient text-light-primary">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-16 flex items-center justify-between px-4 bg-dark-base shadow-glass sticky top-0 z-50 backdrop-blur-glass"
      >
        <h1 className="text-lg font-bold">グループ</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/group/create')}
          className="text-light-primary/60 hover:text-light-primary transition-colors"
        >
          <Plus size={24} />
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
          {/* 現在のグループ */}
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-semibold text-light-primary/60 mb-2">現在のグループ</h2>
            {groupsWithDetails.filter(g => g.isActive).map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentGroup(group.id);
                  navigate('/dashboard');
                }}
                className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border mb-3 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold mb-1">{group.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-light-primary/60">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {group.members.length}人
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {group.lastActivity}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-light-primary/40" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-light-primary/20 border border-dark-base flex items-center justify-center text-xs font-medium"
                      >
                        {member[0]}
                      </div>
                    ))}
                    {group.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-light-primary/10 border border-dark-base flex items-center justify-center text-xs">
                        +{group.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-light-primary/60">総額</p>
                    <p className="text-sm font-semibold">¥{group.totalExpense.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 過去のグループ */}
          {groupsWithDetails.filter(g => !g.isActive).length > 0 && (
            <motion.div variants={itemVariants}>
              <h2 className="text-sm font-semibold text-light-primary/60 mb-2">過去のグループ</h2>
              {groupsWithDetails.filter(g => !g.isActive).map((group) => (
                <motion.div
                  key={group.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentGroup(group.id);
                    navigate('/dashboard');
                  }}
                  className="bg-white/[0.02] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border mb-3 opacity-60 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium mb-1">{group.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-light-primary/60">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {group.members.length}人
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {group.lastActivity}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-light-primary/20" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 新しいグループを作成 */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/group/create')}
            className="w-full rounded-xl bg-light-primary/10 border border-dashed border-light-primary/30 p-4 flex items-center justify-center gap-2 text-light-primary/60 hover:text-light-primary transition-colors cursor-pointer"
          >
            <Plus size={20} />
            <span>新しいグループを作成</span>
          </motion.button>

          {/* ヒント */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.02] backdrop-blur-glass rounded-xl p-3 text-xs text-light-primary/40 flex items-start gap-2"
          >
            <Car size={16} className="shrink-0 mt-0.5" />
            <p>
              グループは旅行やドライブごとに作成できます。過去のグループも履歴として残り、いつでも確認できます。
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}