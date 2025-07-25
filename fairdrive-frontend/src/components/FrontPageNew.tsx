import { useState } from "react";
import { Plus, X, ChevronRight, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchGasPriceMock } from "../services/gasPrice";
import { supabase } from "../lib/supabase";
import GroupSharePopup from "./GroupSharePopup";
import { useGroupStore } from "../store/groupStore";
import packageJson from "../../package.json";

interface FrontPageNewProps {
  onGroupCreate?: () => void;
}

export default function FrontPageNew({ onGroupCreate }: FrontPageNewProps) {
  const navigate = useNavigate();
  const { addGroup } = useGroupStore();
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const [gasType, setGasType] = useState<"regular" | "highOctane">("regular");
  const [gasPrice, setGasPrice] = useState("");
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [groupNameConfirmed, setGroupNameConfirmed] = useState(false);
  const [isCreatingSupabaseGroup, setIsCreatingSupabaseGroup] = useState(false);
  const [supabaseError, setSupabaseError] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<{ shareId: string; shareUrl: string } | null>(null);

  const addMember = () => {
    if (!memberName.trim()) return;
    setMembers([...members, memberName.trim()]);
    setMemberName("");
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };


  // Supabaseにグループを作成
  const createSupabaseGroup = async () => {
    // 入力チェック
    if (!groupName.trim()) {
      setSupabaseError("グループ名を入力してください");
      return;
    }
    if (members.length === 0) {
      setSupabaseError("メンバーを追加してください");
      return;
    }

    setIsCreatingSupabaseGroup(true);
    setSupabaseError("");

    try {
      // 1. グループを作成
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          fuel_efficiency: fuelEfficiency ? parseFloat(fuelEfficiency) : null
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // 2. メンバーを追加
      const memberInserts = members.map(memberName => ({
        group_id: group.id,
        name: memberName
      }));

      const { error: membersError } = await supabase
        .from('members')
        .insert(memberInserts);

      if (membersError) throw membersError;

      // 3. グローバルストアに追加
      addGroup({
        id: group.share_id,
        name: groupName,
        members: members,
        createdAt: new Date()
      });
      
      // 4. 共有ポップアップを表示
      const shareUrl = `${window.location.origin}/join/${group.share_id}`;
      setCreatedGroup({ shareId: group.share_id, shareUrl });
      setShowSharePopup(true);
    } catch (error: any) {
      console.error('Error creating Supabase group:', error);
      setSupabaseError("グループの作成に失敗しました: " + error.message);
    } finally {
      setIsCreatingSupabaseGroup(false);
    }
  };

  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
    // ダッシュボードへ遷移
    navigate('/dashboard');
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
      <main className="flex-1 flex justify-center px-3 overflow-y-auto pb-24">
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
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap flex items-center gap-2 flex-shrink-0" style={{ width: "96px" }}>
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
                className={`flex-1 min-w-0 rounded-xl bg-white/5 border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all ${
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
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap flex-shrink-0" style={{ width: "96px" }}>メンバー</label>
              <div className="flex gap-2 flex-1 min-w-0">
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
                  className="flex-1 min-w-0 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addMember}
                  className="rounded-xl bg-light-primary text-dark-base px-3 py-2.5 font-semibold transition-all hover:bg-white active:scale-95 flex-shrink-0"
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
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap flex-shrink-0" style={{ width: "96px" }}>燃費 (km/L)</label>
              <input
                type="number"
                placeholder="15.5"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                className="flex-1 min-w-0 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
              />
            </div>
          </motion.div>

          {/* Gas Type & Price - No Background */}
          <motion.div 
            variants={itemVariants}
            className="mt-2"
          >
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-shrink-0" style={{ width: "100px" }}>
                <button
                  onClick={() => setGasType("regular")}
                  className={`rounded-xl px-2 py-2 text-xs font-medium transition-all flex items-center justify-center relative whitespace-nowrap ${
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
                  className={`rounded-xl px-2 py-2 text-xs font-medium transition-all flex items-center justify-center relative whitespace-nowrap ${
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
                className="flex-1 min-w-0 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchGasPrice}
                disabled={isLoadingPrice}
                className="rounded-xl bg-light-primary/10 border border-dark-border px-3 py-2.5 text-light-primary text-xs font-medium transition-all hover:bg-light-primary/20 disabled:opacity-50 flex flex-col items-center justify-center leading-tight flex-shrink-0 whitespace-nowrap"
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


          {/* Create Button - Supabase */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={createSupabaseGroup}
            disabled={isCreatingSupabaseGroup}
            className="w-full rounded-xl bg-light-primary text-dark-base px-4 py-3 font-bold text-base transition-all hover:bg-white shadow-glass active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingSupabaseGroup ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Users size={20} />
            )}
            {isCreatingSupabaseGroup ? "作成中..." : "共有グループを作成"}
          </motion.button>

          {/* Error Message */}
          {supabaseError && (
            <motion.div
              variants={itemVariants}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
            >
              {supabaseError}
            </motion.div>
          )}


        </motion.div>
      </main>

      {/* バージョン情報 */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-[10px] text-light-primary/30">Version {packageJson.version}</p>
      </div>

      {/* グループ共有ポップアップ */}
      {createdGroup && (
        <GroupSharePopup
          isOpen={showSharePopup}
          onClose={handleCloseSharePopup}
          groupName={groupName}
          shareId={createdGroup.shareId}
          shareUrl={createdGroup.shareUrl}
        />
      )}
    </div>
  );
}