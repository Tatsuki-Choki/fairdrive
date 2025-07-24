import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Smartphone, 
  Car, 
  Fuel, 
  ParkingMeter,
  Receipt,
  ChevronDown,
  Users,
  Check,
  DollarSign
} from 'lucide-react'
import { MonochromeHeader } from './organisms/MonochromeHeader'
import { MonochromeButton } from './atoms/MonochromeButton'
import { MonochromeCard } from './atoms/MonochromeCard'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

type Member = Database['public']['Tables']['members']['Row']
type Group = Database['public']['Tables']['groups']['Row']

const AddExpense: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  
  // フォームの状態
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>('高速料金')
  const [description, setDescription] = useState('')
  const [payerMemberId, setPayerMemberId] = useState<string>('')
  const [targetMemberIds, setTargetMemberIds] = useState<string[]>([])
  const [selectAllMembers, setSelectAllMembers] = useState(true)
  
  // データの状態
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (shareId) {
      fetchGroupData()
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
      
      // デフォルト値を設定
      if (membersData && membersData.length > 0) {
        setPayerMemberId(membersData[0].id)
        setTargetMemberIds(membersData.map(m => m.id))
      }
    } catch (err) {
      console.error('Error fetching group data:', err)
      setError('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!amount || !payerMemberId || targetMemberIds.length === 0) {
      setError('必須項目を入力してください')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('expenses')
        .insert({
          group_id: group!.id,
          amount: parseFloat(amount),
          category,
          description: description || null,
          payer_member_id: payerMemberId,
          target_member_ids: targetMemberIds,
          paid_at: new Date().toISOString()
        })

      if (insertError) throw insertError

      // 成功したらグループ詳細画面に戻る
      navigate(`/group/${shareId}`)
    } catch (err: any) {
      console.error('Error creating expense:', err)
      setError('支払いの記録に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMemberSelection = (memberId: string) => {
    if (targetMemberIds.includes(memberId)) {
      setTargetMemberIds(targetMemberIds.filter(id => id !== memberId))
      setSelectAllMembers(false)
    } else {
      const newTargetIds = [...targetMemberIds, memberId]
      setTargetMemberIds(newTargetIds)
      setSelectAllMembers(newTargetIds.length === members.length)
    }
  }

  const toggleSelectAll = () => {
    if (selectAllMembers) {
      setTargetMemberIds([])
      setSelectAllMembers(false)
    } else {
      setTargetMemberIds(members.map(m => m.id))
      setSelectAllMembers(true)
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      // 移動関連
      case '高速料金': return <Car size={20} />
      case 'ガソリン': return <Fuel size={20} />
      case '駐車場': return <ParkingMeter size={20} />
      // その他
      case '飲食': return <Receipt size={20} />
      case '宿泊・観光': return <Receipt size={20} />
      case 'ショッピング': return <Receipt size={20} />
      default: return <Receipt size={20} />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-light-primary">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-base text-light-primary pb-32">
      <MonochromeHeader
        title="支払いを追加"
        showBackButton={true}
        onBackClick={() => navigate(`/group/${shareId}`)}
      />

      <motion.div
        className="px-3 pt-20 pb-6 max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 金額入力 */}
        <motion.div variants={itemVariants} className="mb-6">
          <MonochromeCard className="p-6">
            <label className="text-sm font-semibold text-light-primary/80 block mb-3">
              支払い金額
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-light-primary">¥</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-dark-border focus:border-light-primary/60 outline-none pb-2 text-light-primary placeholder-light-primary/30"
              />
            </div>
          </MonochromeCard>
        </motion.div>

        {/* カテゴリ選択 */}
        <motion.div variants={itemVariants} className="mb-4">
          <label className="text-sm font-semibold text-light-primary/80 block mb-3 px-1">
            カテゴリ
          </label>
          <div className="space-y-3">
            {/* 移動関連 */}
            <div>
              <h4 className="text-xs text-light-primary/50 mb-1.5 px-1">移動関連</h4>
              <div className="grid grid-cols-3 gap-2">
                {['高速料金', 'ガソリン', '駐車場'].map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategory(cat)}
                    className={`rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 transition-all ${
                      category === cat
                        ? 'bg-light-primary text-dark-base'
                        : 'bg-white/[0.04] border border-dark-border text-light-primary/60'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span className="text-xs font-medium">{cat}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* その他のカテゴリ */}
            <div className="grid grid-cols-2 gap-2">
              {['飲食', '宿泊・観光', 'ショッピング', 'その他'].map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                    category === cat
                      ? 'bg-light-primary text-dark-base'
                      : 'bg-white/[0.04] border border-dark-border text-light-primary/60'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <span className="text-sm font-medium">{cat}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 説明（オプション） */}
        <motion.div variants={itemVariants} className="mb-4">
          <label className="text-sm font-semibold text-light-primary/80 block mb-2 px-1">
            説明（任意）
          </label>
          <input
            type="text"
            placeholder="例: 東名高速 東京-大阪"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-dark-border px-4 py-3 text-light-primary placeholder-light-primary/40 focus:outline-none focus:ring-2 focus:ring-light-primary/30"
          />
        </motion.div>

        {/* 支払った人 */}
        <motion.div variants={itemVariants} className="mb-4">
          <label className="text-sm font-semibold text-light-primary/80 block mb-2 px-1">
            支払った人
          </label>
          <select
            value={payerMemberId}
            onChange={(e) => setPayerMemberId(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-dark-border px-4 py-3 text-light-primary focus:outline-none focus:ring-2 focus:ring-light-primary/30 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            {members.map((member) => (
              <option key={member.id} value={member.id} className="bg-dark-base">
                {member.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* 支払い対象者 */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-sm font-semibold text-light-primary/80">
              支払い対象者
            </label>
            <button
              onClick={toggleSelectAll}
              className="text-xs text-light-primary/60 hover:text-light-primary transition-colors"
            >
              {selectAllMembers ? '全員解除' : '全員選択'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => (
              <motion.button
                key={member.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleMemberSelection(member.id)}
                className={`rounded-xl p-3 flex items-center justify-between transition-all ${
                  targetMemberIds.includes(member.id)
                    ? 'bg-white/[0.08] border border-light-primary/30'
                    : 'bg-white/[0.04] border border-dark-border'
                }`}
              >
                <span className="text-sm font-medium">{member.name}</span>
                {targetMemberIds.includes(member.id) && (
                  <Check size={16} className="text-light-primary" />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* エラーメッセージ */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* 送信ボタン */}
        <motion.div variants={itemVariants}>
          <MonochromeButton
            onClick={handleSubmit}
            disabled={submitting || !amount || !payerMemberId || targetMemberIds.length === 0}
            className="w-full py-4 flex items-center justify-center gap-2"
          >
            {submitting ? '記録中...' : '支払いを記録'}
          </MonochromeButton>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AddExpense