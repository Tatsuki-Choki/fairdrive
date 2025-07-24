import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Users, Share2 } from 'lucide-react';
import { MonochromeButton } from './atoms/MonochromeButton';
import { MonochromeCard } from './atoms/MonochromeCard';

interface GroupSharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  shareId: string;
  shareUrl: string;
}

const GroupSharePopup: React.FC<GroupSharePopupProps> = ({
  isOpen,
  onClose,
  groupName,
  shareId,
  shareUrl
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareText = `「${groupName}」グループに参加しませんか？`;
    
    // Web Share APIが使用可能かチェック
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FairDrive - ${groupName}`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Web Share APIが使えない場合は、URLをコピー
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            onClick={onClose}
          >
            <MonochromeCard 
              className="w-full max-w-sm p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-light-primary/60" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-light-primary" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center mb-2">
                グループを作成しました！
              </h3>

              {/* Group Name */}
              <p className="text-center text-light-primary/70 mb-6">
                「{groupName}」
              </p>

              {/* Share Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 size={16} />
                  <span className="text-sm font-semibold">共有リンク</span>
                </div>

                {/* URL Display */}
                <div className="bg-white/5 rounded-xl p-3 text-xs font-mono break-all">
                  {shareUrl}
                </div>

                {/* Button Group */}
                <div className="flex gap-2">
                  {/* Copy Button */}
                  <MonochromeButton
                    onClick={handleCopyLink}
                    className="flex-1 py-3 flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        コピー済
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        コピー
                      </>
                    )}
                  </MonochromeButton>

                  {/* Share Button */}
                  <MonochromeButton
                    onClick={handleShare}
                    className="flex-1 py-3 flex items-center justify-center gap-2"
                    variant="secondary"
                  >
                    <Share2 size={18} />
                    共有
                  </MonochromeButton>
                </div>

                {/* Info Text */}
                <p className="text-xs text-center text-light-primary/50 mt-4">
                  このリンクを共有して、メンバーを招待しましょう
                </p>
              </div>
            </MonochromeCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GroupSharePopup;