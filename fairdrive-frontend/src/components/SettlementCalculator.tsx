import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Calculator,
  ChevronRight,
  Users,
  CreditCard,
  Smartphone
} from 'lucide-react'
import { MonochromeHeader } from './organisms/MonochromeHeader'
import { MonochromeButton } from './atoms/MonochromeButton'
import { MonochromeCard } from './atoms/MonochromeCard'
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

type Member = Database['public']['Tables']['members']['Row']
type Expense = Database['public']['Tables']['expenses']['Row']

interface Settlement {
  from: Member
  to: Member
  amount: number
}

const SettlementCalculator: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shareId) {
      fetchData()
    }
  }, [shareId])

  const fetchData = async () => {
    try {
      // グループ情報を取得
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('share_id', shareId)
        .single()

      if (groupError) throw groupError

      // メンバー情報を取得
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', groupData.id)

      if (membersError) throw membersError
      setMembers(membersData || [])

      // 支払い情報を取得
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('group_id', groupData.id)

      if (expensesError) throw expensesError
      setExpenses(expensesData || [])

      // 精算を計算
      calculateSettlements(membersData || [], expensesData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateSettlements = (membersList: Member[], expensesList: Expense[]) => {
    // 各メンバーの残高を計算（プラスは受け取るべき金額、マイナスは支払うべき金額）
    const balances: { [memberId: string]: number } = {}
    
    // 初期化
    membersList.forEach(member => {
      balances[member.id] = 0
    })

    // 各支払いについて計算
    expensesList.forEach(expense => {
      // target_member_idsが存在しない場合は、全メンバーで均等割り
      const targetMembers = expense.target_member_ids || membersList.map(m => m.id)
      const perPersonAmount = expense.amount / targetMembers.length
      
      // 支払った人に加算
      balances[expense.payer_member_id] += expense.amount
      
      // 対象者から減算（target_member_idsがない場合は全員から減算）
      if (expense.target_member_ids && expense.target_member_ids.length > 0) {
        expense.target_member_ids.forEach(targetId => {
          balances[targetId] -= perPersonAmount
        })
      } else {
        // target_member_idsがない場合は全員で割る
        membersList.forEach(member => {
          balances[member.id] -= perPersonAmount
        })
      }
    })

    // デバッグ用ログ
    console.log('=== 精算計算デバッグ ===')
    console.log('メンバー:', membersList.map(m => ({ id: m.id, name: m.name })))
    console.log('支払い情報:', expensesList.map(e => ({ 
      amount: e.amount, 
      payer: e.payer_member_id,
      targets: e.target_member_ids,
      hasTargets: e.target_member_ids && e.target_member_ids.length > 0
    })))
    console.log('残高計算結果:', Object.entries(balances).map(([id, balance]) => {
      const member = membersList.find(m => m.id === id)
      return {
        name: member?.name || 'Unknown',
        balance: balance,
        type: balance > 0 ? '受け取る' : balance < 0 ? '支払う' : '均等'
      }
    }))

    // 精算リストを作成（シンプルなアルゴリズム）
    const settlementList: Settlement[] = []
    const creditors: { member: Member; amount: number }[] = []
    const debtors: { member: Member; amount: number }[] = []

    membersList.forEach(member => {
      const balance = balances[member.id]
      if (balance > 0.01) { // 受け取るべき人
        creditors.push({ member, amount: Math.round(balance) })
      } else if (balance < -0.01) { // 支払うべき人
        debtors.push({ member, amount: Math.round(-balance) })
      }
    })

    // 債権者と債務者をマッチング
    creditors.forEach(creditor => {
      let remainingCredit = creditor.amount
      
      debtors.forEach(debtor => {
        if (remainingCredit > 0 && debtor.amount > 0) {
          const settlementAmount = Math.min(remainingCredit, debtor.amount)
          
          if (settlementAmount > 0) {
            settlementList.push({
              from: debtor.member,
              to: creditor.member,
              amount: settlementAmount
            })
            
            remainingCredit -= settlementAmount
            debtor.amount -= settlementAmount
          }
        }
      })
    })

    setSettlements(settlementList)
  }

  const openPayPay = () => {
    // PayPayアプリを開く
    window.location.href = 'paypay://'
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
        <div className="text-light-primary">計算中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-base text-light-primary pb-32">
      <MonochromeHeader
        title="精算"
        showBackButton={true}
        onBackClick={() => navigate(`/group/${shareId}`)}
      />

      <motion.div
        className="px-3 pt-20 pb-6 max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ヘッダーカード */}
        <motion.div variants={itemVariants} className="mb-6">
          <MonochromeCard className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-3">
              <Calculator size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">精算内容</h2>
            <p className="text-sm text-light-primary/70">
              以下の内容で精算を行ってください
            </p>
          </MonochromeCard>
        </motion.div>

        {/* 精算リスト */}
        {settlements.length === 0 ? (
          <motion.div variants={itemVariants}>
            <MonochromeCard className="p-6 text-center">
              <Users size={48} className="mx-auto mb-3 text-light-primary/30" />
              <p className="text-sm text-light-primary/70">
                精算の必要はありません
              </p>
              <p className="text-xs text-light-primary/50 mt-2">
                全員の支払いが均等です
              </p>
            </MonochromeCard>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-3 mb-6">
            {settlements.map((settlement, index) => (
              <MonochromeCard key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-1">
                        <Users size={20} />
                      </div>
                      <p className="text-xs font-medium">{settlement.from.name}</p>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <ChevronRight size={20} className="text-light-primary/40" />
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-1">
                        <Users size={20} />
                      </div>
                      <p className="text-xs font-medium">{settlement.to.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold">¥{settlement.amount.toLocaleString()}</p>
                  </div>
                </div>
              </MonochromeCard>
            ))}
          </motion.div>
        )}

        {/* PayPayボタン */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={openPayPay}
            className="w-full bg-white/[0.04] backdrop-blur-glass rounded-2xl p-4 flex items-center justify-center gap-2 font-medium shadow-glass border border-dark-border text-light-primary"
          >
            <Smartphone size={20} />
            <span className="text-sm">PayPayを開く</span>
          </motion.button>
          
          <p className="text-xs text-center text-light-primary/50 mt-3">
            PayPayアプリで送金して精算を完了してください
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SettlementCalculator