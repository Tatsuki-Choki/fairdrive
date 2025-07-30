import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { useGroupStore } from '../store/groupStore'
import GroupDetail from './GroupDetail'
import GroupSelector from './GroupSelector'
import { MonochromeHeader } from './organisms/MonochromeHeader'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { groups, selectedGroupId, setSelectedGroupId } = useGroupStore()
  
  // 初回表示時に最初のグループを選択
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id)
    }
  }, [groups, selectedGroupId, setSelectedGroupId])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }
  
  // グループがない場合
  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-dark-base text-light-primary">
        <MonochromeHeader title="FAIRDRIVE" />
        
        <motion.div
          className="px-3 pt-20 pb-6 max-w-md mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center h-[70vh]"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.04] backdrop-blur-glass flex items-center justify-center mb-6 shadow-glass border border-dark-border">
              <Users size={40} className="text-light-primary/60" />
            </div>
            
            <h2 className="text-xl font-bold mb-3">ようこそ！</h2>
            
            <p className="text-sm text-light-primary/60 text-center mb-8 max-w-xs">
              ドライブ旅行の費用を簡単に管理。
              まずはグループを作成してメンバーを追加しましょう。
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/group/create')}
              className="bg-light-primary text-dark-base rounded-xl px-6 py-3 font-semibold text-sm flex items-center gap-2 shadow-glass"
            >
              <Plus size={18} />
              グループを作成
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    )
  }
  
  // グループがある場合
  return (
    <div className="min-h-screen bg-dark-base text-light-primary">
      <MonochromeHeader 
        title="ダッシュボード"
        rightComponent={<GroupSelector />}
      />
      
      <div className="pt-20 pb-32">
        {selectedGroupId && (
          <GroupDetail groupId={selectedGroupId} />
        )}
      </div>
    </div>
  )
}

export default Dashboard