import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, LogIn, Loader2, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'
import MemberExistsPopup from './MemberExistsPopup'

type Group = Database['public']['Tables']['groups']['Row']
type Member = Database['public']['Tables']['members']['Row']

const JoinGroup: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [yourName, setYourName] = useState('')
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false)
  const [proceedWithDuplicate, setProceedWithDuplicate] = useState(false)

  useEffect(() => {
    if (shareId) {
      fetchGroup()
    }
  }, [shareId])

  const fetchGroup = async () => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('share_id', shareId)
        .single()

      if (groupError) throw groupError
      setGroup(groupData)

      // メンバー一覧も取得
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', groupData.id)

      if (membersError) throw membersError
      setMembers(membersData || [])
    } catch (err) {
      console.error('Error fetching group:', err)
      setError('グループが見つかりません')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (forceAdd: boolean = false) => {
    if (!yourName.trim() || !group) {
      setError('名前を入力してください')
      return
    }

    // 重複チェック
    const isDuplicate = members.some(member => member.name === yourName.trim())
    console.log('重複チェック:', {
      yourName: yourName.trim(),
      members: members.map(m => m.name),
      isDuplicate,
      forceAdd,
      proceedWithDuplicate
    })
    
    if (isDuplicate && !forceAdd && !proceedWithDuplicate) {
      setShowDuplicatePopup(true)
      return
    }

    setJoining(true)
    setError('')

    try {
      // forceAddがtrueの場合のみメンバーとして追加
      if (forceAdd || !isDuplicate) {
        const { error: memberError } = await supabase
          .from('members')
          .insert({
            group_id: group.id,
            name: yourName
          })

        if (memberError) throw memberError
      }

      // グループ詳細画面へ遷移（既存メンバーでも新規メンバーでも）
      navigate(`/group/${shareId}`)
    } catch (err) {
      console.error('Error joining group:', err)
      setError('グループへの参加に失敗しました')
    } finally {
      setJoining(false)
      setProceedWithDuplicate(false)
    }
  }

  const handleJoinAsExisting = () => {
    setShowDuplicatePopup(false)
    // 既存メンバーとして参加（新規追加しない）
    navigate(`/group/${shareId}`)
  }

  const handleJoinAsNew = () => {
    setShowDuplicatePopup(false)
    setProceedWithDuplicate(true)
    // 新規メンバーとして追加
    setTimeout(() => {
      handleJoinGroup(true)
    }, 100)
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
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-aurora-gradient flex items-center justify-center">
        <div className="text-light-primary flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>読み込み中...</span>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-aurora-gradient flex items-center justify-center px-3">
        <div className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-dark-border text-center max-w-sm w-full">
          <div className="text-red-400 mb-2">エラー</div>
          <div className="text-light-primary/70">{error || 'グループが見つかりません'}</div>
        </div>
      </div>
    )
  }

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
          {/* Welcome Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-dark-border text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Users size={32} className="text-light-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">グループに参加</h2>
            <p className="text-sm text-light-primary/70">
              「{group.name}」に招待されています
            </p>
          </motion.div>

          {/* Name Input Card - Same style as FrontPageNew */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
          >
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-light-primary/80 whitespace-nowrap flex-shrink-0" style={{ width: "96px" }}>
                あなたの名前
              </label>
              <input
                type="text"
                placeholder="タツキ"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && yourName.trim()) {
                    e.preventDefault()
                    handleJoinGroup()
                  }
                }}
                className="flex-1 min-w-0 rounded-xl bg-white/5 border border-dark-border px-3 py-2.5 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30 transition-all"
              />
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              variants={itemVariants}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Join Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleJoinGroup}
            disabled={joining || !yourName.trim()}
            className="w-full rounded-xl bg-light-primary text-dark-base px-4 py-3 font-bold text-base transition-all hover:bg-white shadow-glass active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joining ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <LogIn size={20} />
            )}
            {joining ? '参加中...' : 'グループに参加'}
          </motion.button>

        </motion.div>
      </main>

      {/* 重複メンバー警告ポップアップ */}
      <MemberExistsPopup
        isOpen={showDuplicatePopup}
        onClose={() => setShowDuplicatePopup(false)}
        memberName={yourName}
        onJoinAsExisting={handleJoinAsExisting}
        onJoinAsNew={handleJoinAsNew}
      />
    </div>
  )
}

export default JoinGroup