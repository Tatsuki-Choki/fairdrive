import { useState } from "react";
import { ChevronLeft, Car, Fuel, CreditCard, Receipt, Utensils, ShoppingBag, Camera } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentRecordProps {
  onBack?: () => void;
  onSave?: (payment: PaymentData) => void;
}

interface PaymentData {
  amount: string;
  category: string;
  description: string;
  payer: string;
  participants: string[];
  date: string;
  time: string;
}

// カテゴリ定義
const categories = [
  { id: "gas", label: "ガソリン", icon: Fuel },
  { id: "highway", label: "高速料金", icon: Car },
  { id: "parking", label: "駐車場", icon: Car },
  { id: "food", label: "食事", icon: Utensils },
  { id: "shopping", label: "買い物", icon: ShoppingBag },
  { id: "other", label: "その他", icon: Receipt }
];

// サンプルメンバー（実際はグループデータから取得）
const groupMembers = ["タツキ", "ユウキ", "サトシ", "アイコ"];

export default function PaymentRecord({ onBack, onSave }: PaymentRecordProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("gas");
  const [description, setDescription] = useState("");
  const [payer, setPayer] = useState(groupMembers[0]);
  const [participants, setParticipants] = useState<string[]>(groupMembers);
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [time] = useState(new Date().toTimeString().slice(0, 5));

  const handleParticipantToggle = (member: string) => {
    if (participants.includes(member)) {
      setParticipants(participants.filter(p => p !== member));
    } else {
      setParticipants([...participants, member]);
    }
  };

  const handleSave = () => {
    const paymentData: PaymentData = {
      amount,
      category,
      description,
      payer,
      participants,
      date,
      time
    };
    
    console.log("支払い記録:", paymentData);
    
    if (onSave) {
      onSave(paymentData);
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
        <h1 className="text-lg font-bold">支払いを記録</h1>
        <div className="w-6" /> {/* スペーサー */}
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4 space-y-3"
        >
          {/* 金額入力 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <label className="text-sm font-semibold text-light-primary/80 block mb-2">金額</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-primary/60">¥</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-dark-border pl-8 pr-3 py-3 text-xl font-semibold text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
              />
            </div>
          </motion.div>

          {/* カテゴリ選択 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <label className="text-sm font-semibold text-light-primary/80 block mb-3">カテゴリ</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-xl p-3 text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                    category === cat.id
                      ? "bg-light-primary text-dark-base"
                      : "bg-white/5 border border-dark-border text-light-primary/60 hover:text-light-primary"
                  }`}
                >
                  <cat.icon size={20} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 詳細入力 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <label className="text-sm font-semibold text-light-primary/80 block mb-2">詳細</label>
            <input
              type="text"
              placeholder="例: 東京-横浜"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
            />
          </motion.div>

          {/* 支払者選択 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <label className="text-sm font-semibold text-light-primary/80 block mb-3">支払者</label>
            <div className="grid grid-cols-2 gap-2">
              {groupMembers.map((member) => (
                <button
                  key={member}
                  onClick={() => setPayer(member)}
                  className={`rounded-lg py-2 px-3 text-sm font-medium transition-all ${
                    payer === member
                      ? "bg-light-primary text-dark-base"
                      : "bg-white/10 text-light-primary/60 hover:text-light-primary"
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 参加者選択 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <label className="text-sm font-semibold text-light-primary/80 block mb-3">参加者</label>
            <div className="grid grid-cols-2 gap-2">
              {groupMembers.map((member) => (
                <button
                  key={member}
                  onClick={() => handleParticipantToggle(member)}
                  className={`rounded-lg py-2 px-3 text-sm font-medium transition-all ${
                    participants.includes(member)
                      ? "bg-light-primary/20 text-light-primary border border-light-primary/50"
                      : "bg-white/5 text-light-primary/40 border border-dark-border"
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </motion.div>

          {/* レシート添付 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <label className="text-sm font-semibold text-light-primary/80 block mb-3">レシート</label>
            <button className="w-full rounded-xl bg-white/5 border border-dashed border-dark-border py-8 flex flex-col items-center gap-2 text-light-primary/40 hover:text-light-primary/60 transition-colors">
              <Camera size={32} />
              <span className="text-sm">写真を撮影または選択</span>
            </button>
          </motion.div>

          {/* 日時 */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-light-primary/60">日時</span>
              <span className="text-sm text-light-primary">{date} {time}</span>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 p-4 bg-dark-base/70 backdrop-blur-glass border-t border-dark-border">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={!amount || participants.length === 0}
          className="w-full rounded-xl bg-light-primary text-dark-base px-4 py-3 font-bold text-base transition-all hover:bg-white shadow-glass active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          記録を保存
        </motion.button>
      </div>
    </div>
  );
}