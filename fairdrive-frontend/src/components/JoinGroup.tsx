import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, LogIn, Loader2 } from 'lucide-react'
import { MonochromeButton } from './atoms/MonochromeButton'
import { MonochromeCard } from './atoms/MonochromeCard'
import { MonochromeInput } from './atoms/MonochromeInput'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

type Group = Database['public']['Tables']['groups']['Row']

const JoinGroup: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [group, setGroup] = useState<Group | null>(null)
  const [yourName, setYourName] = useState('')
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (shareId) {
      fetchGroup()
    }
  }, [shareId])

  const fetchGroup = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('share_id', shareId)
        .single()

      if (error) throw error
      setGroup(data)
    } catch (err) {
      console.error('Error fetching group:', err)
      setError('グループが見つかりません')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    if (!yourName.trim() || !group) {
      setError('名前を入力してください')
      return
    }

    setJoining(true)
    setError('')

    try {
      // メンバーとして追加
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          group_id: group.id,
          name: yourName
        })

      if (memberError) throw memberError

      // グループ詳細画面へ遷移
      navigate(`/group/${shareId}`)
    } catch (err) {
      console.error('Error joining group:', err)
      setError('グループへの参加に失敗しました')
    } finally {
      setJoining(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-light-primary flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>読み込み中...</span>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-3">
        <MonochromeCard className="p-6 text-center max-w-sm w-full">
          <div className="text-red-400 mb-2">エラー</div>
          <div className="text-light-primary/70">{error || 'グループが見つかりません'}</div>
        </MonochromeCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-base text-light-primary flex items-center justify-center px-3">
      <motion.div
        className="max-w-sm w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Users size={32} className="text-light-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">グループに参加</h1>
          <p className="text-light-primary/70 text-sm">
            「{group.name}」に招待されています
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MonochromeCard className="p-6 space-y-4">
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

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            <MonochromeButton
              onClick={handleJoinGroup}
              disabled={joining}
              className="w-full py-3 flex items-center justify-center gap-2"
            >
              {joining ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} />
                  参加する
                </>
              )}
            </MonochromeButton>
          </MonochromeCard>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default JoinGroup