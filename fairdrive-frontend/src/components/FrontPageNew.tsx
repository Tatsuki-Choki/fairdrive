import { useState } from "react";
import { Plus, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGasPriceMock } from "../services/gasPrice";
import GroupSharePopup from "./GroupSharePopup";
import { generateGroupId } from "../utils/generateGroupId";

interface FrontPageNewProps {
  onGroupCreate?: () => void;
}

export default function FrontPageNew({ onGroupCreate }: FrontPageNewProps) {
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const [gasType, setGasType] = useState<"regular" | "highOctane">("regular");
  const [gasPrice, setGasPrice] = useState("");
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [groupNameConfirmed, setGroupNameConfirmed] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState("");

  const addMember = () => {
    if (!memberName.trim()) return;
    setMembers([...members, memberName.trim()]);
    setMemberName("");
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const createGroup = () => {
    console.log({ groupName, members, fuelEfficiency, gasType, gasPrice });
    
    // グループIDを生成
    const groupId = generateGroupId();
    setCreatedGroupId(groupId);
    
    // グループデータをローカルストレージに保存
    const groupData = {
      id: groupId,
      name: groupName,
      members,
      fuelEfficiency,
      gasType,
      gasPrice,
      createdAt: new Date().toISOString()
    };
    
    // 既存のグループリストを取得
    const existingGroups = JSON.parse(localStorage.getItem('fairdriveGroups') || '[]');
    existingGroups.push(groupData);
    localStorage.setItem('fairdriveGroups', JSON.stringify(existingGroups));
    
    // 現在のグループIDを保存
    localStorage.setItem('currentGroupId', groupId);
    
    // 共有ポップアップを表示
    setShowSharePopup(true);
  };
  
  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
    // グループ作成後の処理を呼び出す
    if (onGroupCreate) {
      onGroupCreate();
    }
  };

  const fetchGasPrice = async () => {
    setIsLoadingPrice(true);
    try {
      // gogo.gs APIを使用してガソリン価格を取得（現在はモック版を使用）
      const price = await fetchGasPriceMock(gasType);
      setGasPrice(price.toString());
    } catch (error) {
      console.error("ガソリン価格の取得に失敗しました", error);
      // エラー時はデフォルト値を設定
      const defaultPrices = {
        regular: "168.5",
        highOctane: "179.3"
      };
      setGasPrice(defaultPrices[gasType]);
    } finally {
      setIsLoadingPrice(false);
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
        className="h-16 flex items-center justify-center bg-dark-base shadow-glass sticky top-0 z-50 backdrop-blur-glass"
      >
        <h1 className="text-2xl font-bold tracking-[0.2em] text-light-primary">FAIR DRIVE</h1>
      </motion.header>

      {/* Main */}
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-4 space-y-3"
        >
          {/* Group Info Bento Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap flex items-center gap-2 w-24">
                グループ名
                {groupNameConfirmed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-light-primary/60"
                  >
                    ✓
                  </motion.span>
                )}
              </label>
              <input
                type="text"
                placeholder="大阪グルメ旅行"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  setGroupNameConfirmed(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && groupName.trim()) {
                    e.preventDefault();
                    setGroupNameConfirmed(true);
                    e.currentTarget.blur();
                  }
                }}
                className={`flex-1 rounded-xl bg-white/5 border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all ${
                  groupNameConfirmed ? 'border-light-primary/50' : 'border-dark-border'
                }`}
              />
            </div>
          </motion.div>

          {/* Members Bento Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap w-24">メンバー</label>
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="タツキ"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      addMember();
                    }
                  }}
                  className="flex-1 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addMember}
                  className="rounded-xl bg-light-primary text-dark-base px-3 py-2.5 font-semibold transition-all hover:bg-white active:scale-95"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>
            
            <AnimatePresence>
              {members.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-2 mt-3"
                >
                  {members.map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-lg bg-white/10 px-2 py-1.5 text-sm text-light-primary backdrop-blur-sm flex items-center justify-between gap-2"
                    >
                      <span>{m}</span>
                      <button
                        onClick={() => removeMember(idx)}
                        className="text-light-primary/60 hover:text-light-primary transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Fuel Efficiency Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap w-24">燃費 (km/L)</label>
              <input
                type="number"
                placeholder="15.5"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                className="flex-1 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
              />
            </div>
          </motion.div>

          {/* Gas Type & Price - No Background */}
          <motion.div 
            variants={itemVariants}
            className="mt-2"
          >
            <div className="flex gap-2">
              <div className="flex flex-col gap-1" style={{ width: "100px" }}>
                <button
                  onClick={() => setGasType("regular")}
                  className={`rounded-xl px-2 py-2 text-xs font-medium transition-all flex items-center justify-center relative ${
                    gasType === "regular"
                      ? "bg-light-primary text-dark-base"
                      : "bg-transparent border border-dark-border text-light-primary/60 hover:text-light-primary"
                  }`}
                >
                  {gasType === "regular" && (
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute left-1"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                  レギュラー
                </button>
                <button
                  onClick={() => setGasType("highOctane")}
                  className={`rounded-xl px-2 py-2 text-xs font-medium transition-all flex items-center justify-center relative ${
                    gasType === "highOctane"
                      ? "bg-light-primary text-dark-base"
                      : "bg-transparent border border-dark-border text-light-primary/60 hover:text-light-primary"
                  }`}
                >
                  {gasType === "highOctane" && (
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute left-1"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                  ハイオク
                </button>
              </div>
              <input
                type="number"
                placeholder="168.5"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                className="flex-1 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchGasPrice}
                disabled={isLoadingPrice}
                className="rounded-xl bg-light-primary/10 border border-dark-border px-3 py-2.5 text-light-primary text-xs font-medium transition-all hover:bg-light-primary/20 disabled:opacity-50 flex flex-col items-center justify-center leading-tight"
              >
                {isLoadingPrice ? (
                  "取得中..."
                ) : (
                  <>
                    <span>ガソリン</span>
                    <span>価格取得</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Create Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={createGroup}
            className="w-full rounded-xl bg-light-primary text-dark-base px-4 py-3 font-bold text-base transition-all hover:bg-white shadow-glass active:scale-95"
          >
            グループを作成
          </motion.button>

          {/* Footer Text */}
          <motion.p 
            variants={itemVariants}
            className="text-xs text-center text-light-primary/40 pt-4"
          >
            ETC履歴連携・AI自動精算<br />
            目的地到着時にQRコード決済
          </motion.p>
        </motion.div>
      </main>

      {/* グループ共有ポップアップ */}
      <GroupSharePopup
        isOpen={showSharePopup}
        onClose={handleCloseSharePopup}
        groupName={groupName}
        groupId={createdGroupId}
      />
    </div>
  );
}