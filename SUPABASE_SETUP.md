# Supabase セットアップガイド

## 1. Supabaseアカウントの作成

1. [Supabase](https://supabase.com/)にアクセス
2. "Start your project"をクリック
3. GitHubアカウントでサインアップ（推奨）

## 2. 新しいプロジェクトの作成

1. ダッシュボードで"New project"をクリック
2. 以下の情報を入力：
   - **Project name**: `fairdrive`
   - **Database Password**: 安全なパスワードを生成
   - **Region**: `Northeast Asia (Tokyo)`を選択

## 3. プロジェクト情報の取得

プロジェクトが作成されたら、以下の情報を取得します：

### A. Project Reference ID
- ダッシュボードのURLから取得
- 例: `https://supabase.com/dashboard/project/[ここがproject-ref]`

### B. API Keys
1. 左メニューの"Settings" → "API"
2. 以下をコピー：
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **anon public**: 公開用の匿名キー

### C. Access Token（MCP用）
1. [アカウント設定](https://supabase.com/dashboard/account/tokens)にアクセス
2. "Generate new token"をクリック
3. トークン名を入力（例: `fairdrive-mcp`）
4. 生成されたトークンをコピー

## 4. データベーススキーマの適用

1. Supabaseダッシュボードの"SQL Editor"を開く
2. 新しいクエリを作成
3. `supabase/migrations/001_initial_schema.sql`の内容をコピー＆ペースト
4. "Run"をクリックして実行

## 5. Realtimeの設定

1. 左メニューの"Database" → "Replication"
2. 以下のテーブルでRealtimeを有効化：
   - `groups`
   - `members`
   - `expenses`

## 6. 環境変数の設定

### A. フロントエンド用（.env）
```bash
cd fairdrive-frontend
cp .env.example .env
```

`.env`ファイルを編集：
```
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### B. MCP用（.claude/mcp-config.json）
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=[your-project-ref]"
      ],
      "env": {
        "SUPABASE_PROJECT_REF": "[your-project-ref]",
        "SUPABASE_ACCESS_TOKEN": "[your-access-token]"
      }
    }
  }
}
```

## 7. 動作確認

1. 開発サーバーを再起動：
```bash
npm run dev
```

2. ブラウザのコンソールで警告が消えていることを確認
3. "共有グループを作成"機能をテスト

## トラブルシューティング

### "Missing Supabase environment variables"エラー
- `.env`ファイルが正しく設定されているか確認
- 開発サーバーを再起動

### "relation "groups" does not exist"エラー
- SQLスキーマが適用されているか確認
- SQL Editorで再度スキーマを実行

### Realtimeが動作しない
- Replicationの設定を確認
- ブラウザのネットワークタブでWebSocket接続を確認

## セキュリティに関する注意

- **anon key**は公開しても安全（Row Level Securityで保護）
- **service_role key**は絶対に公開しない
- **Access Token**は安全に管理する