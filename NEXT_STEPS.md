# 次のステップ

## 1. Supabase Anon Keyの取得

1. [Supabaseダッシュボード](https://supabase.com/dashboard/project/gfwbwftsvxtqnveyfedw)にアクセス
2. 左メニューの **Settings** → **API** をクリック
3. **Project API keys** セクションから以下をコピー：
   - **anon public**: これが`VITE_SUPABASE_ANON_KEY`に入れる値です

## 2. .envファイルの更新

```bash
cd fairdrive-frontend
```

`.env`ファイルを編集して、`your_anon_key_here_please_replace`を実際のanon keyに置き換えてください。

## 3. データベーススキーマの適用

1. [SQL Editor](https://supabase.com/dashboard/project/gfwbwftsvxtqnveyfedw/sql/new)を開く
2. `/supabase/migrations/001_initial_schema.sql`の内容をコピー
3. SQL Editorにペーストして実行

## 4. Realtimeの有効化

1. [Database Replication](https://supabase.com/dashboard/project/gfwbwftsvxtqnveyfedw/database/replication)を開く
2. 以下のテーブルで"0 replicated"をクリックしてRealtimeを有効化：
   - groups
   - members 
   - expenses

## 5. 動作確認

```bash
npm run dev
```

アプリケーションが正常に起動し、「共有グループを作成」機能が動作することを確認してください。

## 6. MCP設定（オプション）

Claude DesktopでSupabaseを直接操作したい場合：

1. [Access Tokens](https://supabase.com/dashboard/account/tokens)でトークンを生成
2. `.claude/mcp-config.json`の`your-access-token-here`を置き換え
3. Claude Desktopの設定にMCPサーバーを追加（詳細は`MCP_CLAUDE_SETUP.md`参照）

## プロジェクト情報

- **Project URL**: https://gfwbwftsvxtqnveyfedw.supabase.co
- **Project ID**: gfwbwftsvxtqnveyfedw
- **Region**: 自動的に設定されています