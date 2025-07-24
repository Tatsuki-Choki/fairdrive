import { useState } from "react";
import { ChevronLeft, CreditCard, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SettlementProps {
  onBack?: () => void;
}

interface SettlementItem {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed';
  completedAt?: string;
}

// 仮の清算データ
const mockSettlements: SettlementItem[] = [
  { id: "1", from: "ユウキ", to: "タツキ", amount: 2800, status: 'pending' },
  { id: "2", from: "サトシ", to: "タツキ", amount: 1200, status: 'pending' },
  { id: "3", from: "アイコ", to: "ユウキ", amount: 3500, status: 'pending' }
];

export default function Settlement({ onBack }: SettlementProps) {
  const [settlements, setSettlements] = useState<SettlementItem[]>(mockSettlements);
  const [selectedSettlement, setSelectedSettlement] = useState<string | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // 合計清算額
  const totalAmount = settlements
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  // 清算を完了にする
  const completeSettlement = (id: string) => {
    setSettlements(settlements.map(s => 
      s.id === id 
        ? { ...s, status: 'completed' as const, completedAt: new Date().toISOString() }
        : s
    ));
    setSelectedSettlement(null);
    setShowPaymentMethods(false);
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

  // 支払い方法
  const paymentMethods = [
    { id: "cash", label: "現金", icon: "💴" },
    { id: "paypay", label: "PayPay", icon: "📱" },
    { id: "line", label: "LINE Pay", icon: "💚" },
    { id: "bank", label: "銀行振込", icon: "🏦" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-aurora-gradient text-light-primary">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-16 flex items-center justify-between px-4 bg-dark-base shadow-glass sticky top-0 z-50 backdrop-blur-glass"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="text-light-primary/60 hover:text-light-primary transition-colors"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="text-lg font-bold">清算</h1>
        <div className="w-6" />
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4 space-y-3"
        >
          {/* サマリーカード */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <h2 className="text-sm font-semibold text-light-primary/80 mb-3">清算サマリー</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-light-primary/60">未清算額</span>
                <span className="text-xl font-bold">¥{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-light-primary/60">清算件数</span>
                <span className="text-sm">{settlements.filter(s => s.status === 'pending').length}件</span>
              </div>
            </div>
          </motion.div>

          {/* 清算リスト */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-light-primary/60 mb-2">清算一覧</h3>
            <div className="space-y-2">
              {settlements.map((settlement) => (
                <motion.div
                  key={settlement.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (settlement.status === 'pending') {
                      setSelectedSettlement(settlement.id);
                      setShowPaymentMethods(true);
                    }
                  }}
                  className={`bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border transition-all ${
                    settlement.status === 'completed' 
                      ? 'border-green-500/30 opacity-60' 
                      : 'border-dark-border cursor-pointer hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-light-primary/20 flex items-center justify-center text-xs font-medium">
                        {settlement.from[0]}
                      </div>
                      <ArrowRight size={16} className="text-light-primary/40" />
                      <div className="w-8 h-8 rounded-full bg-light-primary/20 flex items-center justify-center text-xs font-medium">
                        {settlement.to[0]}
                      </div>
                    </div>
                    {settlement.status === 'completed' ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : (
                      <Clock size={20} className="text-light-primary/40" />
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm">
                        {settlement.from} → {settlement.to}
                      </p>
                      {settlement.completedAt && (
                        <p className="text-xs text-light-primary/40 mt-1">
                          清算済み: {new Date(settlement.completedAt).toLocaleString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <p className="text-lg font-semibold">¥{settlement.amount.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 注意事項 */}
          <motion.div 
            variants={itemVariants}
            className="bg-yellow-500/10 backdrop-blur-glass rounded-xl p-3 border border-yellow-500/30"
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-400 font-medium mb-1">清算時の注意</p>
                <p className="text-xs text-light-primary/60">
                  清算完了後は取り消しできません。金額を確認してから清算してください。
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* 支払い方法選択モーダル */}
      {showPaymentMethods && selectedSettlement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowPaymentMethods(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full bg-dark-base rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">支払い方法を選択</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => completeSettlement(selectedSettlement)}
                  className="bg-white/[0.04] backdrop-blur-glass rounded-xl p-4 border border-dark-border hover:bg-white/[0.08] transition-all"
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <p className="text-sm font-medium">{method.label}</p>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setShowPaymentMethods(false)}
              className="w-full py-3 text-sm text-light-primary/60"
            >
              キャンセル
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}