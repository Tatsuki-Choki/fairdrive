import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, AlertCircle } from 'lucide-react';
import { MonochromeButton } from './atoms/MonochromeButton';
import { MonochromeCard } from './atoms/MonochromeCard';

interface MemberExistsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  onJoinAsExisting: () => void;
  onJoinAsNew: () => void;
}

const MemberExistsPopup: React.FC<MemberExistsPopupProps> = ({
  isOpen,
  onClose,
  memberName,
  onJoinAsExisting,
  onJoinAsNew
}) => {
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
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle size={32} className="text-yellow-500" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center mb-2">
                既にメンバーが存在します
              </h3>

              {/* Message */}
              <p className="text-center text-light-primary/70 mb-6">
                「{memberName}」という名前のメンバーは<br />
                既にこのグループに参加しています
              </p>

              {/* Options */}
              <div className="space-y-3">
                <MonochromeButton
                  onClick={onJoinAsExisting}
                  className="w-full py-3"
                >
                  既存のメンバーとして参加
                </MonochromeButton>

                <MonochromeButton
                  onClick={onJoinAsNew}
                  className="w-full py-3"
                  variant="secondary"
                >
                  新規メンバーとして追加
                </MonochromeButton>
              </div>

              {/* Info Text */}
              <p className="text-xs text-center text-light-primary/50 mt-4">
                既存メンバーとして参加すると追加登録されません<br />
                新規メンバーとして追加すると同名の別人として登録されます
              </p>
            </MonochromeCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemberExistsPopup;