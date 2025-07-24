// ガソリン価格取得サービス
// FAIR DRIVE Backend APIを使用

interface GasPriceData {
  regular: number;
  high_octane: number;  // APIのレスポンスに合わせて変更
  diesel: number;
  kerosene: number;
  prefecture: string;
  update_date: string;  // APIのレスポンスに合わせて変更
  cached?: boolean;
}

interface GasPriceResponse {
  success: boolean;
  data?: GasPriceData;
  error?: string;
}

// Backend APIの設定
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 現在位置または指定地域のガソリン価格を取得
export async function fetchGasPrice(prefecture?: string): Promise<GasPriceResponse> {
  // モックモードの場合はモックデータを返す
  if (USE_MOCK) {
    return fetchGasPriceMockData(prefecture);
  }

  try {
    const url = new URL(`${API_BASE_URL}/api/gas-prices`);
    if (prefecture) {
      url.searchParams.append('prefecture', prefecture);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GasPriceData = await response.json();
    
    return {
      success: true,
      data: {
        ...data,
        highOctane: data.high_octane,  // APIレスポンスを既存のインターフェースに変換
        updateDate: data.update_date
      }
    };
  } catch (error) {
    console.error('ガソリン価格の取得に失敗しました:', error);
    
    // エラー時はモックデータを返す
    return fetchGasPriceMockData(prefecture);
  }
}

// モックデータを返す関数
function fetchGasPriceMockData(prefecture?: string): GasPriceResponse {
  // 地域別の基準価格（実際の相場に近い値）
  const regionalPrices: { [key: string]: { regular: number; highOctane: number } } = {
    '東京都': { regular: 172.5, highOctane: 183.3 },
    '大阪府': { regular: 169.8, highOctane: 180.6 },
    '愛知県': { regular: 168.2, highOctane: 179.0 },
    '北海道': { regular: 170.5, highOctane: 181.3 },
    '福岡県': { regular: 167.9, highOctane: 178.7 },
    '全国平均': { regular: 168.5, highOctane: 179.3 }
  };
  
  const basePrices = regionalPrices[prefecture || ''] || regionalPrices['全国平均'];
  
  // ランダムな価格変動をシミュレート（±3円）
  const variation = (Math.random() - 0.5) * 6;
  
  return {
    success: true,
    data: {
      regular: Number((basePrices.regular + variation).toFixed(1)),
      high_octane: Number((basePrices.highOctane + variation).toFixed(1)),
      diesel: Number((148.2 + variation).toFixed(1)),
      kerosene: Number((110.5 + variation).toFixed(1)),
      prefecture: prefecture || '全国平均',
      update_date: new Date().toISOString()
    }
  };
}

// 都道府県リストを取得
export async function fetchPrefectures(): Promise<string[]> {
  if (USE_MOCK) {
    return fetchPrefecturesMockData();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/prefectures`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.prefectures || [];
  } catch (error) {
    console.error('都道府県リストの取得に失敗しました:', error);
    return fetchPrefecturesMockData();
  }
}

// 都道府県のモックデータ
function fetchPrefecturesMockData(): string[] {
  return [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];
}

// デモ用のモック関数（開発時に使用）
export async function fetchGasPriceMock(gasType: 'regular' | 'highOctane'): Promise<number> {
  const response = await fetchGasPrice();
  if (response.success && response.data) {
    return gasType === 'regular' ? response.data.regular : response.data.high_octane;
  }
  // フォールバック値
  return gasType === 'regular' ? 168.5 : 179.3;
}