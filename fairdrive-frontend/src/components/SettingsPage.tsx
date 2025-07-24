import { useState } from "react";
import { Bell, CreditCard, Globe, HelpCircle, Info, LogOut, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SettingItem {
  id: string;
  label: string;
  icon: any;
  value?: string;
  action?: () => void;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  // 設定項目
  const generalSettings: SettingItem[] = [
    { id: "profile", label: "プロフィール", icon: Info, value: "タツキ" },
    { id: "payment", label: "支払い方法", icon: CreditCard, value: "未設定" },
    { id: "language", label: "言語", icon: Globe, value: "日本語" }
  ];

  const preferenceSettings: SettingItem[] = [
    { id: "notifications", label: "通知", icon: Bell }
  ];

  const supportSettings: SettingItem[] = [
    { id: "help", label: "ヘルプ", icon: HelpCircle },
    { id: "privacy", label: "プライバシーポリシー", icon: Shield }
  ];

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
        className="h-16 flex items-center justify-center bg-dark-base shadow-glass sticky top-0 z-50 backdrop-blur-glass"
      >
        <h1 className="text-lg font-bold">設定</h1>
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4 space-y-4"
        >
          {/* アカウント情報 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-light-primary/20 flex items-center justify-center text-2xl font-bold">
                タ
              </div>
              <div>
                <h2 className="text-lg font-semibold">タツキ</h2>
                <p className="text-sm text-light-primary/60">ゲストユーザー</p>
              </div>
            </div>
          </motion.div>

          {/* 一般設定 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-light-primary/60 mb-2">一般</h3>
            <div className="bg-white/[0.04] backdrop-blur-glass rounded-2xl shadow-glass border border-dark-border overflow-hidden">
              {generalSettings.map((setting, idx) => (
                <button
                  key={setting.id}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  style={{ borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <setting.icon size={20} className="text-light-primary/60" />
                    <span className="text-sm">{setting.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.value && (
                      <span className="text-sm text-light-primary/60">{setting.value}</span>
                    )}
                    <ChevronRight size={16} className="text-light-primary/40" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 環境設定 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-light-primary/60 mb-2">環境設定</h3>
            <div className="bg-white/[0.04] backdrop-blur-glass rounded-2xl shadow-glass border border-dark-border overflow-hidden">
              {preferenceSettings.map((setting, idx) => (
                <div
                  key={setting.id}
                  className="w-full p-4 flex items-center justify-between"
                  style={{ borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <setting.icon size={20} className="text-light-primary/60" />
                    <span className="text-sm">{setting.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-light-primary/50"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* サポート */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-light-primary/60 mb-2">サポート</h3>
            <div className="bg-white/[0.04] backdrop-blur-glass rounded-2xl shadow-glass border border-dark-border overflow-hidden">
              {supportSettings.map((setting, idx) => (
                <button
                  key={setting.id}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  style={{ borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <setting.icon size={20} className="text-light-primary/60" />
                    <span className="text-sm">{setting.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-light-primary/40" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* バージョン情報 */}
          <motion.div 
            variants={itemVariants}
            className="text-center py-4"
          >
            <p className="text-xs text-light-primary/40">FAIR DRIVE v1.0.0</p>
          </motion.div>

          {/* ログアウト */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full rounded-xl bg-white/[0.04] backdrop-blur-glass border border-red-500/30 p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span>ログアウト</span>
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}