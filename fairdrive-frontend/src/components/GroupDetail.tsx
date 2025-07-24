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
  DollarSign,
  Car,
  Receipt,
  CreditCard,
  ChevronRight,
  Clock
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

  const calculatePerPerson = () => {
    if (members.length === 0) return 0
    return Math.floor(calculateTotalExpenses() / members.length)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "高速料金": return <Car size={16} />
      case "ガソリン": return <Fuel size={16} />
      case "駐車場": return <Car size={16} />
      default: return <Receipt size={16} />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
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
        className="px-3 pt-20 pb-6 max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* グループ概要カード */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-glass rounded-3xl p-6 shadow-glass border border-dark-border mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-light-primary mb-1">{group.name}</h2>
              <p className="text-sm text-light-primary/60">{members.length}人のメンバー</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyShareUrl}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              {copied ? <Check size={20} /> : <Share2 size={20} />}
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-base/50 rounded-2xl p-4">
              <p className="text-xs text-light-primary/60 mb-1">合計金額</p>
              <p className="text-2xl font-bold text-light-primary">
                ¥{calculateTotalExpenses().toLocaleString()}
              </p>
            </div>
            <div className="bg-dark-base/50 rounded-2xl p-4">
              <p className="text-xs text-light-primary/60 mb-1">1人あたり</p>
              <p className="text-2xl font-bold text-light-primary">
                ¥{calculatePerPerson().toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* クイックアクション */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/group/${shareId}/add-expense`)}
            className="bg-light-primary text-dark-base rounded-2xl p-4 flex flex-col items-center gap-2 font-semibold shadow-glass"
          >
            <Plus size={24} />
            <span className="text-sm">支払いを追加</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 flex flex-col items-center gap-2 font-semibold shadow-glass border border-dark-border"
          >
            <CreditCard size={24} />
            <span className="text-sm">精算する</span>
          </motion.button>
        </motion.div>

        {/* 最近の支払い */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock size={16} />
              最近の支払い
            </h3>
            <button className="text-xs text-light-primary/60 hover:text-light-primary transition-colors">
              すべて見る
            </button>
          </div>
          
          {expenses.length === 0 ? (
            <MonochromeCard className="p-6 text-center">
              <p className="text-sm text-light-primary/60">まだ支払いが記録されていません</p>
            </MonochromeCard>
          ) : (
            <div className="space-y-2">
              {expenses.slice(0, 3).map((expense) => {
                const payer = members.find(m => m.id === expense.payer_member_id)
                return (
                  <motion.div
                    key={expense.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 shadow-glass border border-dark-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{expense.description || expense.category}</p>
                          <p className="text-xs text-light-primary/60">{payer?.name || '不明'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">¥{expense.amount.toLocaleString()}</p>
                        <p className="text-xs text-light-primary/60">{formatDate(expense.paid_at)}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* メンバー一覧 */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Users size={16} />
            メンバー
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => (
              <MonochromeCard key={member.id} className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium">{member.name}</span>
                <ChevronRight size={16} className="text-light-primary/40" />
              </MonochromeCard>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GroupDetail