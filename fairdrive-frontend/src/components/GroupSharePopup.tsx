import { useState, useEffect } from "react";
import { X, Copy, Share2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GroupSharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
}

export default function GroupSharePopup({ isOpen, onClose, groupName, groupId }: GroupSharePopupProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/group/${groupId}`;

  // コピー成功後、3秒後に状態をリセット
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FAIR DRIVE - ${groupName}`,
          text: `「${groupName}」の費用を一緒に管理しましょう！`,
          url: shareUrl
        });
      } catch (err) {
        console.error("共有に失敗しました:", err);
      }
    } else {
      // Web Share APIが使えない場合はコピー機能にフォールバック
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* ポップアップ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="bg-dark-base/90 backdrop-blur-glass rounded-3xl p-6 shadow-glass border border-dark-border">
              {/* クローズボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-light-primary/60 hover:text-light-primary transition-colors"
              >
                <X size={20} />
              </button>

              {/* コンテンツ */}
              <div className="text-center space-y-4">
                {/* 成功アイコン */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="w-16 h-16 mx-auto bg-light-primary/20 rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={32} className="text-light-primary" />
                </motion.div>

                {/* メッセージ */}
                <div>
                  <h3 className="text-xl font-bold mb-2">グループを作成しました！</h3>
                  <p className="text-light-primary/60 text-sm">
                    メンバーに共有リンクを送って<br />
                    一緒に費用を管理しましょう
                  </p>
                </div>

                {/* グループ名 */}
                <div className="bg-white/[0.04] rounded-xl px-4 py-2">
                  <p className="text-lg font-semibold">{groupName}</p>
                </div>

                {/* 共有リンク */}
                <div>
                  <p className="text-xs text-light-primary/60 mb-2">共有リンク</p>
                  <div className="bg-white/[0.04] rounded-xl px-4 py-3 text-sm font-mono break-all">
                    {shareUrl}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopy}
                    className={`rounded-xl px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      copied
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/[0.04] text-light-primary border border-dark-border hover:bg-white/[0.08]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={18} />
                        コピー完了
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        コピー
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="rounded-xl bg-light-primary text-dark-base px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors"
                  >
                    <Share2 size={18} />
                    共有
                  </motion.button>
                </div>

                {/* ダッシュボードへボタン */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full rounded-xl bg-transparent border border-light-primary/30 text-light-primary px-4 py-3 font-semibold text-sm hover:bg-light-primary/10 transition-colors"
                >
                  ダッシュボードへ
                </motion.button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}