# FAIR DRIVE

車での旅行・ドライブにおける費用を自動的に記録し、公平に割り勘計算を行うWebアプリケーション

## プロジェクト構成

```
fairdrive/
├── fairdrive-frontend/   # React + TypeScript フロントエンド
├── fairdrive-backend/    # FastAPI バックエンド（ガソリン価格API）
├── CLAUDE.md            # 開発ルール・デザインシステム
└── REQUIREMENTS.md      # 要件定義書
```

## 機能

- グループ作成（会員登録不要）
- メンバー管理
- ガソリン価格の自動取得
- 支払い記録と自動割り勘計算
- 清算機能
- レスポンシブ対応（スマートフォン専用）

## デザイン

**Japandi × Monotone × 2025 Trends**
- Bento Grid レイアウト
- Glassmorphism 2.0
- Aurora グラデーション
- マイクロモーション

## セットアップ

### フロントエンド

```bash
cd fairdrive-frontend
npm install
npm run dev
```

### バックエンド

```bash
cd fairdrive-backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

## 開発環境

- Node.js 18+
- Python 3.9+
- npm or yarn

## ライセンス

Private