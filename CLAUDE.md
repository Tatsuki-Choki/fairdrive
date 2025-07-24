# 重要な開発ルール

## スマートフォン専用UI
**このWebアプリケーションは、スマートフォンからのアクセスのみを想定しています。**

### 必須事項
- ✅ スマートフォン向けのUIのみを実装する
- ✅ モバイルファーストで設計する
- ✅ タッチ操作を前提としたUI設計にする

### 禁止事項
- ❌ デスクトップ用のレスポンシブデザインは実装しない
- ❌ タブレット向けの調整は行わない
- ❌ lg:, xl:などの大画面向けのブレークポイントは使用しない

### 推奨される実装
- モバイルのビューポート幅（max-w-md以下）に収める
- タッチターゲットは最低44x44pxを確保
- スクロールはモバイルに最適化（慣性スクロール対応）
- ボトムナビゲーションやモバイル特有のUIパターンを活用

**コード作成時は必ずこのファイルを確認し、スマートフォン専用UIであることを忘れないこと。**

## TODOリスト作成ルール
**TODOリストは必ず日本語で作成すること。**

### 必須事項
- ✅ すべてのTODOアイテムは日本語で記述する
- ✅ タスクの内容を明確に日本語で表現する
- ✅ 技術用語も可能な限り日本語化する（例: "Install" → "インストール"）

### 例
- ⭕ 良い例: "lucide-reactアイコンライブラリをインストール"
- ❌ 悪い例: "Install lucide-react for icons"

## デザインシステム（2025 Japandi × Monotone）
**すべてのページで統一されたデザイントンマナを維持すること。**

### カラーパレット
```
// ダークカラー
dark-base: #111111       // ベース背景
dark-surface: #1A1A1A    // サーフェス
dark-border: #2A2A2A     // ボーダー

// ライトカラー  
light-primary: #F5F5F5   // プライマリテキスト・アイコン
light-secondary: #FFFFFF // ホバー時の白

// 背景
aurora-gradient: radial-gradient(circle at center, #1A1A1A 0%, #111111 100%)
```

### コンポーネントスタイル

#### カード
- 背景: `bg-white/[0.04]` (4%の白透過)
- ブラー: `backdrop-blur-glass` (12px)
- 角丸: `rounded-2xl`
- パディング: `p-4`
- 影: `shadow-glass`
- ボーダー: `border border-dark-border`

#### 入力欄
- 背景: `bg-white/5`
- ボーダー: `border border-dark-border`
- パディング: `px-3 py-2.5`
- 角丸: `rounded-xl`
- フォーカス: `focus:ring-2 focus:ring-light-primary/30`

#### ボタン
**プライマリボタン**
- 背景: `bg-light-primary`
- テキスト: `text-dark-base`
- ホバー: `hover:bg-white`
- アクティブ: `active:scale-95`

**セカンダリボタン**
- 背景: `bg-transparent` または `bg-light-primary/10`
- ボーダー: `border border-dark-border`
- テキスト: `text-light-primary`

### レイアウト
- コンテナ最大幅: `max-w-md`
- メインパディング: `px-3`
- セクション間隔: `space-y-3`
- ヘッダー高さ: `h-16`
- ボトムナビ高さ: `py-3`

### タイポグラフィ
- 見出し(大): `text-xl font-bold`
- 見出し(中): `text-sm font-semibold`
- 本文: `text-sm`
- 補助テキスト: `text-xs`
- 文字間隔（ロゴ等）: `tracking-[0.2em]`

### アニメーション（Framer Motion）
```javascript
// コンテナ
containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 }}
}

// アイテム
itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 }}
}

// ホバー・タップ
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### 特殊なUI要素
- ラベルと入力欄を1行に配置する場合: `flex items-center gap-3`
- ボタングループ（縦）: `flex flex-col gap-1`
- 背景なしセクション: クラスを最小限にし、mt-2程度の余白のみ

**これらのルールを厳守し、全ページで一貫性のあるUIを実装すること。**