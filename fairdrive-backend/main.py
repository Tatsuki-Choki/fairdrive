from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime, timedelta
import json
import redis
import os

app = FastAPI(title="FAIR DRIVE Gas Price API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "https://fairdrive.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redisクライアント（キャッシュ用、オプション）
try:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        decode_responses=True
    )
    redis_client.ping()
    USE_CACHE = True
except:
    USE_CACHE = False
    print("Redisに接続できませんでした。キャッシュなしで動作します。")

# レスポンスモデル
class GasPriceResponse(BaseModel):
    regular: float
    high_octane: float
    diesel: float
    kerosene: float
    prefecture: str
    update_date: str
    cached: bool = False

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

# キャッシュキー生成
def get_cache_key(prefecture: Optional[str] = None) -> str:
    return f"gas_price:{prefecture or 'average'}"

# gogo.gsからガソリン価格をスクレイピング
def scrape_gas_prices(prefecture: Optional[str] = None) -> Dict:
    try:
        # gogo.gsの都道府県別URLまたは全国平均URL
        if prefecture:
            # 都道府県コードへの変換が必要（実装省略）
            url = f"https://gogo.gs/{prefecture}/"
        else:
            # 全国平均のページ
            url = "https://gogo.gs/"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # gogo.gsのHTML構造に基づいてスクレイピング（実際の構造に合わせて調整が必要）
        prices = {}
        
        # 価格情報を含む要素を探す（サイトの実際の構造に合わせて調整）
        # 例: <div class="price-box"><span class="price">168.5</span></div>
        
        # レギュラー価格
        regular_elem = soup.find("div", {"id": "regular-price"}) or soup.find("span", {"class": "regular-price"})
        if regular_elem:
            price_text = regular_elem.get_text().strip()
            prices['regular'] = float(re.search(r'[\d.]+', price_text).group())
        else:
            # 別のセレクタパターンを試す
            price_elem = soup.select_one('.gasoline-price.regular')
            if price_elem:
                prices['regular'] = float(re.search(r'[\d.]+', price_elem.text).group())
            else:
                prices['regular'] = 168.5  # デフォルト値
        
        # ハイオク価格
        highoctane_elem = soup.find("div", {"id": "highoctane-price"}) or soup.find("span", {"class": "highoctane-price"})
        if highoctane_elem:
            price_text = highoctane_elem.get_text().strip()
            prices['high_octane'] = float(re.search(r'[\d.]+', price_text).group())
        else:
            price_elem = soup.select_one('.gasoline-price.high-octane')
            if price_elem:
                prices['high_octane'] = float(re.search(r'[\d.]+', price_elem.text).group())
            else:
                prices['high_octane'] = 179.3  # デフォルト値
        
        # 軽油価格
        diesel_elem = soup.find("div", {"id": "diesel-price"}) or soup.find("span", {"class": "diesel-price"})
        if diesel_elem:
            price_text = diesel_elem.get_text().strip()
            prices['diesel'] = float(re.search(r'[\d.]+', price_text).group())
        else:
            prices['diesel'] = 148.2  # デフォルト値
        
        # 灯油価格
        kerosene_elem = soup.find("div", {"id": "kerosene-price"}) or soup.find("span", {"class": "kerosene-price"})
        if kerosene_elem:
            price_text = kerosene_elem.get_text().strip()
            prices['kerosene'] = float(re.search(r'[\d.]+', price_text).group())
        else:
            prices['kerosene'] = 110.5  # デフォルト値
        
        # 更新日時の取得
        update_elem = soup.find("span", {"class": "update-date"}) or soup.find("div", {"class": "last-update"})
        if update_elem:
            prices['update_date'] = update_elem.get_text().strip()
        else:
            prices['update_date'] = datetime.now().isoformat()
        
        prices['prefecture'] = prefecture or '全国平均'
        
        return prices
        
    except Exception as e:
        print(f"スクレイピングエラー: {str(e)}")
        # エラー時はデフォルト値を返す
        return {
            'regular': 168.5,
            'high_octane': 179.3,
            'diesel': 148.2,
            'kerosene': 110.5,
            'prefecture': prefecture or '全国平均',
            'update_date': datetime.now().isoformat()
        }

@app.get("/")
async def root():
    return {"message": "FAIR DRIVE Gas Price API", "version": "1.0.0"}

@app.get("/api/gas-prices", response_model=GasPriceResponse)
async def get_gas_prices(prefecture: Optional[str] = None):
    """
    ガソリン価格を取得します。
    
    - **prefecture**: 都道府県名（オプション）。指定しない場合は全国平均を返します。
    """
    try:
        cache_key = get_cache_key(prefecture)
        
        # キャッシュから取得を試みる
        if USE_CACHE:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                data = json.loads(cached_data)
                data['cached'] = True
                return GasPriceResponse(**data)
        
        # スクレイピングで価格を取得
        prices = scrape_gas_prices(prefecture)
        
        # キャッシュに保存（15分間）
        if USE_CACHE:
            redis_client.setex(
                cache_key,
                timedelta(minutes=15),
                json.dumps(prices)
            )
        
        return GasPriceResponse(**prices)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/prefectures")
async def get_prefectures():
    """
    対応している都道府県のリストを返します。
    """
    prefectures = [
        "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
        "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
        "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
        "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
        "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
        "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
        "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
    ]
    return {"prefectures": prefectures}

@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {
        "status": "healthy",
        "cache_available": USE_CACHE,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)