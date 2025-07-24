import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone, ExternalLink, AlertCircle } from 'lucide-react'
import { MonochromeHeader } from './organisms/MonochromeHeader'
import { MonochromeButton } from './atoms/MonochromeButton'
import { MonochromeCard } from './atoms/MonochromeCard'

const AddExpense: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const [showAppNotInstalledAlert, setShowAppNotInstalledAlert] = useState(false)

  // PayPayアプリを開く関数
  const openPayPayApp = () => {
    // PayPayのカスタムURLスキーム
    const payPayUrl = 'paypay://'
    
    // iOS/Androidで共通のURLスキームを使用
    window.location.href = payPayUrl
    
    // アプリがインストールされていない場合の処理
    setTimeout(() => {
      // 3秒後にまだ同じページにいる場合は、アプリがインストールされていない可能性
      setShowAppNotInstalledAlert(true)
    }, 3000)
  }

  // App Store/Google Playストアを開く
  const openStore = () => {
    const userAgent = navigator.userAgent || navigator.vendor
    
    if (/android/i.test(userAgent)) {
      // Android - Google Play Store
      window.open('https://play.google.com/store/apps/details?id=jp.ne.paypay.android.app', '_blank')
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      // iOS - App Store
      window.open('https://apps.apple.com/jp/app/paypay-ペイペイ/id1435783608', '_blank')
    } else {
      // その他のデバイス - PayPayウェブサイト
      window.open('https://paypay.ne.jp/', '_blank')
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
        <motion.div variants={itemVariants} className="mb-6">
          <MonochromeCard className="p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-2">
              <Smartphone size={32} className="text-light-primary" />
            </div>
            
            <h2 className="text-lg font-semibold">
              PayPayで支払いを記録
            </h2>
            
            <p className="text-sm text-light-primary/70">
              PayPayアプリを開いて支払いを行ってください。
              支払い後、グループメンバーと共有できます。
            </p>
          </MonochromeCard>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <MonochromeButton
            onClick={openPayPayApp}
            className="w-full py-4 flex items-center justify-center gap-2"
          >
            <ExternalLink size={20} />
            PayPayアプリを開く
          </MonochromeButton>

          <div className="text-center">
            <p className="text-xs text-light-primary/50 mb-2">
              PayPayアプリがインストールされていない場合
            </p>
            <button
              onClick={openStore}
              className="text-sm text-light-primary underline"
            >
              アプリをダウンロード
            </button>
          </div>
        </motion.div>

        {showAppNotInstalledAlert && (
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <MonochromeCard className="p-4 border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-yellow-500">
                    PayPayアプリが開きませんか？
                  </p>
                  <p className="text-xs text-light-primary/70">
                    PayPayアプリがインストールされていない可能性があります。
                    下記のボタンからダウンロードしてください。
                  </p>
                  <MonochromeButton
                    onClick={openStore}
                    className="w-full py-2 text-sm"
                    variant="secondary"
                  >
                    アプリストアを開く
                  </MonochromeButton>
                </div>
              </div>
            </MonochromeCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default AddExpense