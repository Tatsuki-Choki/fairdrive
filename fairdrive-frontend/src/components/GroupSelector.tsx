import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { useGroupStore } from '../store/groupStore'

const GroupSelector: React.FC = () => {
  const { groups, selectedGroupId, setSelectedGroupId } = useGroupStore()
  const [isOpen, setIsOpen] = useState(false)
  
  // 2つ以上のグループがない場合は何も表示しない
  if (groups.length < 2) {
    return null
  }
  
  const selectedGroup = groups.find(g => g.id === selectedGroupId)
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] backdrop-blur-glass rounded-xl border border-dark-border text-light-primary shadow-glass"
      >
        <span className="text-sm font-medium">{selectedGroup?.name || 'グループを選択'}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* オーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* ドロップダウンメニュー */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-dark-surface/95 backdrop-blur-glass rounded-xl border border-dark-border shadow-glass overflow-hidden z-50"
            >
              {groups.map((group) => (
                <motion.button
                  key={group.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedGroupId(group.id)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors"
                >
                  <span className="text-sm text-light-primary">{group.name}</span>
                  {group.id === selectedGroupId && (
                    <Check size={16} className="text-light-primary" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GroupSelector