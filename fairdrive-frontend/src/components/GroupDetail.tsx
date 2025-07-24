import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Plus,
  Fuel,
  Calendar,
  DollarSign
} from 'lucide-react'
import { MonochromeHeader } from './organisms/MonochromeHeader'
import { MonochromeButton } from './atoms/MonochromeButton'
import { MonochromeCard } from './atoms/MonochromeCard'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

type Group = Database['public']['Tables']['groups']['Row']
type Member = Database['public']['Tables']['members']['Row']
type Expense = Database['public']['Tables']['expenses']['Row']

const GroupDetail: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (shareId) {
      fetchGroupData()
      subscribeToUpdates()
    }
  }, [shareId])

  const fetchGroupData = async () => {
    try {
      // グループ情報を取得
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('share_id', shareId)
        .single()

      if (groupError) throw groupError
      setGroup(groupData)

      // メンバー情報を取得
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', groupData.id)
        .order('joined_at', { ascending: true })

      if (membersError) throw membersError
      setMembers(membersData || [])

      // 支払い情報を取得
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('group_id', groupData.id)
        .order('paid_at', { ascending: false })

      if (expensesError) throw expensesError
      setExpenses(expensesData || [])
    } catch (err) {
      console.error('Error fetching group data:', err)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToUpdates = () => {
    if (!shareId) return

    // グループの変更を監視
    const groupSubscription = supabase
      .channel(`group-${shareId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'groups',
          filter: `share_id=eq.${shareId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setGroup(payload.new as Group)
          }
        }
      )
      .subscribe()

    // メンバーの変更を監視
    const membersSubscription = supabase
      .channel(`members-${shareId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        () => {
          fetchGroupData()
        }
      )
      .subscribe()

    // 支払いの変更を監視
    const expensesSubscription = supabase
      .channel(`expenses-${shareId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        () => {
          fetchGroupData()
        }
      )
      .subscribe()

    return () => {
      groupSubscription.unsubscribe()
      membersSubscription.unsubscribe()
      expensesSubscription.unsubscribe()
    }
  }

  const handleCopyShareUrl = async () => {
    const shareUrl = `${window.location.origin}/join/${shareId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-light-primary">読み込み中...</div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-light-primary">グループが見つかりません</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-base text-light-primary pb-20">
      <MonochromeHeader
        title={group.name}
        showBackButton={true}
        onBackClick={() => navigate('/')}
      />

      <motion.div
        className="px-3 pt-20 max-w-md mx-auto space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 共有セクション */}
        <motion.div variants={itemVariants}>
          <MonochromeCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Share2 size={16} />
                <span className="text-sm font-semibold">共有リンク</span>
              </div>
              <span className="text-xs text-light-primary/50">
                {members.length}人が参加中
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-xs truncate">
                {window.location.origin}/join/{shareId}
              </div>
              <MonochromeButton
                onClick={handleCopyShareUrl}
                className="px-3 py-2.5 flex items-center gap-1.5"
                variant="secondary"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span className="text-xs">コピー済</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span className="text-xs">コピー</span>
                  </>
                )}
              </MonochromeButton>
            </div>
          </MonochromeCard>
        </motion.div>

        {/* グループ情報 */}
        <motion.div variants={itemVariants}>
          <MonochromeCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel size={14} className="text-light-primary/70" />
                <span className="text-xs text-light-primary/70">燃費</span>
              </div>
              <span className="text-sm font-semibold">
                {group.fuel_efficiency || '未設定'} km/L
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-light-primary/70" />
                <span className="text-xs text-light-primary/70">作成日</span>
              </div>
              <span className="text-sm">
                {new Date(group.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-light-primary/70" />
                <span className="text-xs text-light-primary/70">合計支出</span>
              </div>
              <span className="text-sm font-bold">
                ¥{calculateTotalExpenses().toLocaleString()}
              </span>
            </div>
          </MonochromeCard>
        </motion.div>

        {/* メンバーリスト */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} />
            <h3 className="text-sm font-semibold">メンバー</h3>
          </div>
          <div className="space-y-1">
            {members.map((member) => (
              <MonochromeCard key={member.id} className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{member.name}</span>
                  <span className="text-xs text-light-primary/50">
                    {new Date(member.joined_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </MonochromeCard>
            ))}
          </div>
        </motion.div>

        {/* 支払い追加ボタン */}
        <motion.div variants={itemVariants} className="pt-3">
          <MonochromeButton
            onClick={() => navigate(`/group/${shareId}/add-expense`)}
            className="w-full py-4 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            支払いを追加
          </MonochromeButton>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GroupDetail