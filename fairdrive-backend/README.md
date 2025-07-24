# FAIR DRIVE Backend API

ガソリン価格取得APIサーバー

## セットアップ

### 1. 仮想環境の作成

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# または
venv\Scripts\activate  # Windows
```

### 2. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 3. 環境変数の設定（オプション）

```bash
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

## 起動方法

### 開発環境

```bash
uvicorn main:app --reload --port 8000
```

### 本番環境

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## APIエンドポイント

- `GET /` - APIの情報
- `GET /api/gas-prices` - ガソリン価格の取得
  - クエリパラメータ: `prefecture` (オプション)
- `GET /api/prefectures` - 対応都道府県リスト
- `GET /health` - ヘルスチェック

## 開発

### APIドキュメント

起動後、以下のURLでAPIドキュメントを確認できます：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc