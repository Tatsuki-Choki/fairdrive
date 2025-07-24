import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// 開発環境での警告
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase環境変数が設定されていません。.envファイルを確認してください。')
  console.warn('現在、プレースホルダー値を使用しています。')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)