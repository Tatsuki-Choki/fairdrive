import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Share2, Loader2 } from 'lucide-react'
import { MonochromeHeader } from './organisms/MonochromeHeader'
import { MonochromeInput } from './atoms/MonochromeInput'
import { MonochromeButton } from './atoms/MonochromeButton'
import { MonochromeCard } from './atoms/MonochromeCard'
import { supabase } from '../lib/supabase'

const CreateGroup: React.FC = () => {
  const navigate = useNavigate()
  const [groupName, setGroupName] = useState('')
  const [fuelEfficiency, setFuelEfficiency] = useState('')
  const [yourName, setYourName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !yourName.trim()) {
      setError('グループ名とあなたの名前を入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Supabaseが正しく設定されているか確認
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
        setError('Supabaseが設定されていません。開発者にお問い合わせください。')
        return
      }

      // グループを作成
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          fuel_efficiency: fuelEfficiency ? parseFloat(fuelEfficiency) : null
        })
        .select()
        .single()

      if (groupError) {
        console.error('Group creation error:', groupError)
        throw groupError
      }

      // 作成者をメンバーとして追加
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          group_id: group.id,
          name: yourName
        })

      if (memberError) throw memberError

      // グループ詳細画面へ遷移
      navigate(`/group/${group.share_id}`)
    } catch (err) {
      console.error('Error creating group:', err)
      setError('グループの作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-dark-base text-light-primary">
      <MonochromeHeader
        title="グループを作成"
        showBackButton={true}
        onBackClick={() => navigate('/')}
      />

      <motion.div
        className="px-3 pt-20 pb-6 max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <MonochromeCard className="p-4 space-y-4">
            <div>
              <label className="text-xs text-light-primary/70 mb-2 block">
                グループ名
              </label>
              <MonochromeInput
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="例: 週末ドライブ"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-light-primary/70 mb-2 block">
                燃費（km/L）
              </label>
              <MonochromeInput
                type="number"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                placeholder="例: 15.5"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-light-primary/70 mb-2 block">
                あなたの名前
              </label>
              <MonochromeInput
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="例: 田中太郎"
                className="w-full"
              />
            </div>
          </MonochromeCard>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="space-y-3">
          <MonochromeButton
            onClick={handleCreateGroup}
            disabled={loading}
            className="w-full py-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Users size={20} />
                グループを作成
              </>
            )}
          </MonochromeButton>

          <div className="flex items-center gap-2 justify-center text-xs text-light-primary/50">
            <Share2 size={14} />
            <span>作成後、共有リンクが発行されます</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CreateGroup