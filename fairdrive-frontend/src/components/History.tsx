import { useState } from "react";
import { ChevronLeft, Filter, Calendar, Car, Fuel, Receipt, Utensils, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryProps {
  onBack?: () => void;
}

interface PaymentHistory {
  id: string;
  date: string;
  time: string;
  payer: string;
  amount: number;
  category: string;
  description: string;
  participants: string[];
}

// カテゴリアイコンマップ
const categoryIcons: { [key: string]: any } = {
  "ガソリン": Fuel,
  "高速料金": Car,
  "駐車場": Car,
  "食事": Utensils,
  "買い物": ShoppingBag,
  "その他": Receipt
};

// 仮の履歴データ
const mockHistory: PaymentHistory[] = [
  {
    id: "1",
    date: "2024-01-20",
    time: "14:00",
    payer: "アイコ",
    amount: 1500,
    category: "駐車場",
    description: "観光地駐車場",
    participants: ["タツキ", "ユウキ", "サトシ", "アイコ"]
  },
  {
    id: "2",
    date: "2024-01-20",
    time: "13:20",
    payer: "サトシ",
    amount: 12000,
    category: "食事",
    description: "海鮮丼 4人分",
    participants: ["タツキ", "ユウキ", "サトシ", "アイコ"]
  },
  {
    id: "3",
    date: "2024-01-20",
    time: "11:45",
    payer: "ユウキ",
    amount: 5800,
    category: "ガソリン",
    description: "レギュラー 35L",
    participants: ["タツキ", "ユウキ", "サトシ", "アイコ"]
  },
  {
    id: "4",
    date: "2024-01-20",
    time: "10:30",
    payer: "タツキ",
    amount: 3200,
    category: "高速料金",
    description: "東京-横浜",
    participants: ["タツキ", "ユウキ", "サトシ", "アイコ"]
  },
  {
    id: "5",
    date: "2024-01-19",
    time: "20:00",
    payer: "アイコ",
    amount: 4500,
    category: "買い物",
    description: "お土産",
    participants: ["タツキ", "ユウキ", "サトシ", "アイコ"]
  }
];

export default function History({ onBack }: HistoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // フィルタリング
  const filteredHistory = mockHistory.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedPayer && item.payer !== selectedPayer) return false;
    return true;
  });

  // カテゴリ別集計
  const categoryTotals = mockHistory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as { [key: string]: number });

  // メンバー別集計
  const payerTotals = mockHistory.reduce((acc, item) => {
    acc[item.payer] = (acc[item.payer] || 0) + item.amount;
    return acc;
  }, {} as { [key: string]: number });

  // 日付でグループ化
  const groupedByDate = filteredHistory.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as { [date: string]: PaymentHistory[] });

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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="text-light-primary/60 hover:text-light-primary transition-colors"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="text-lg font-bold">履歴</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`text-light-primary/60 hover:text-light-primary transition-colors ${
            (selectedCategory || selectedPayer) ? 'text-light-primary' : ''
          }`}
        >
          <Filter size={24} />
        </motion.button>
      </motion.header>

      {/* フィルター */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-dark-base/90 backdrop-blur-glass border-b border-dark-border px-4 py-3"
        >
          <div className="space-y-3">
            {/* カテゴリフィルター */}
            <div>
              <p className="text-xs text-light-primary/60 mb-2">カテゴリ</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-light-primary text-dark-base'
                      : 'bg-white/10 text-light-primary/60 hover:text-light-primary'
                  }`}
                >
                  すべて
                </button>
                {Object.keys(categoryTotals).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-light-primary text-dark-base'
                        : 'bg-white/10 text-light-primary/60 hover:text-light-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 支払者フィルター */}
            <div>
              <p className="text-xs text-light-primary/60 mb-2">支払者</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPayer(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    !selectedPayer
                      ? 'bg-light-primary text-dark-base'
                      : 'bg-white/10 text-light-primary/60 hover:text-light-primary'
                  }`}
                >
                  すべて
                </button>
                {Object.keys(payerTotals).map(payer => (
                  <button
                    key={payer}
                    onClick={() => setSelectedPayer(payer)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedPayer === payer
                        ? 'bg-light-primary text-dark-base'
                        : 'bg-white/10 text-light-primary/60 hover:text-light-primary'
                    }`}
                  >
                    {payer}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main */}
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4 space-y-3"
        >
          {/* 集計サマリー */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <h2 className="text-sm font-semibold text-light-primary/80 mb-3">集計サマリー</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-light-primary/60 mb-1">総支出</p>
                <p className="text-lg font-bold">
                  ¥{filteredHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-light-primary/60 mb-1">支払い回数</p>
                <p className="text-lg font-bold">{filteredHistory.length}回</p>
              </div>
            </div>
          </motion.div>

          {/* 履歴リスト */}
          {Object.entries(groupedByDate).map(([date, items]) => (
            <motion.div key={date} variants={itemVariants}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-light-primary/60" />
                <h3 className="text-sm font-semibold text-light-primary/60">
                  {new Date(date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = categoryIcons[item.category] || Receipt;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Icon size={20} className="text-light-primary/60" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="text-sm font-medium">{item.description}</p>
                              <p className="text-xs text-light-primary/60">
                                {item.payer} • {item.time}
                              </p>
                            </div>
                            <p className="text-base font-semibold">¥{item.amount.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-light-primary/40">参加者:</span>
                            <div className="flex -space-x-2">
                              {item.participants.slice(0, 3).map((participant, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full bg-light-primary/20 border border-dark-base flex items-center justify-center text-xs"
                                >
                                  {participant[0]}
                                </div>
                              ))}
                              {item.participants.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-light-primary/10 border border-dark-base flex items-center justify-center text-xs">
                                  +{item.participants.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {filteredHistory.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="text-center py-8"
            >
              <p className="text-light-primary/40">履歴がありません</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}