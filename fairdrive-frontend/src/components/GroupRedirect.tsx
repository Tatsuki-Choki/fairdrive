import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupStore } from '../store/groupStore'
import { supabase } from '../lib/supabase'

const GroupRedirect: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>()
  const navigate = useNavigate()
  const { setSelectedGroupId } = useGroupStore()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchGroupId = async () => {
      if (!shareId) return
      
      try {
        // shareIdから実際のgroupIdを取得
        const { data: group, error } = await supabase
          .from('groups')
          .select('id')
          .eq('share_id', shareId)
          .single()
          
        if (error) throw error
        
        if (group) {
          // groupIdをselectedGroupIdにセット
          setSelectedGroupId(group.id)
          // ダッシュボードへリダイレクト
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Error fetching group:', err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    
    fetchGroupId()
  }, [shareId, setSelectedGroupId, navigate])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-light-primary">読み込み中...</div>
      </div>
    )
  }
  
  return null
}

export default GroupRedirect