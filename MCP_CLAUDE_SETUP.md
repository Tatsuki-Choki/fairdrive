# Claude Desktop MCP設定ガイド

## MCP（Model Context Protocol）とは

MCPは、AIアシスタント（Claude）が外部ツールやサービスと直接やり取りできるようにするプロトコルです。
Supabase MCPを設定することで、Claudeが直接Supabaseデータベースを操作できるようになります。

## Claude Desktopの設定

### 1. 設定ファイルの場所

**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. 設定ファイルの編集

1. Claude Desktopを終了
2. 上記の設定ファイルを開く（存在しない場合は作成）
3. 以下の内容を追加：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=YOUR_PROJECT_REF_HERE"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

### 3. 必要な情報の入力

以下を実際の値に置き換えてください：

- `YOUR_PROJECT_REF_HERE`: Supabaseプロジェクトの参照ID
- `YOUR_ACCESS_TOKEN_HERE`: Supabaseのアクセストークン

### 4. Claude Desktopの再起動

設定を保存後、Claude Desktopを再起動します。

## 動作確認

Claude Desktopで以下のようなコマンドを試してください：

```
「Supabaseのgroupsテーブルの内容を確認して」
「新しいグループをSupabaseに作成して」
「現在のデータベーススキーマを教えて」
```

## セキュリティモード

### 読み取り専用モード（推奨）
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=YOUR_PROJECT_REF_HERE"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

`--read-only`フラグを追加することで、データの読み取りのみ可能になります。

## トラブルシューティング

### MCPサーバーが起動しない
1. Node.jsがインストールされているか確認
2. インターネット接続を確認
3. Claude Desktopのログを確認

### 認証エラー
1. アクセストークンが正しいか確認
2. プロジェクトREFが正しいか確認
3. トークンの有効期限を確認

### 接続できない
1. Supabaseプロジェクトがアクティブか確認
2. ファイアウォール設定を確認

## 注意事項

- アクセストークンは安全に管理してください
- 読み取り専用モードの使用を推奨します
- 本番環境では別のトークンを使用してください