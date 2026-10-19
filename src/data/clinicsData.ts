/**
 * 銀座TAクリニック 配送・受注管理データ
 * 出典: 楽々販売 顧客管理(クリニックID 000705700)・受注管理・出荷管理（2026/10/20時点）
 *
 * - 楽々販売の 出荷管理（出荷ID: DO-xxxxxxxxx）1件 = OrderRecord 1件。BatchInfo は受注月の表示区分
 * - ステータス: 出荷待ち → 発送準備中 / 出荷済み+配達完了日 → 配達完了
 *   出荷済みで配達完了日が未登録のものは出荷日から推定して配達完了（タイムラインに明記）
 * - 配送業者「その他」は国内在庫からの佐川急便発送（追跡はメンテナンス中表示）
 * - 肋軟骨は対象外。見積済み・送料・手数料は除外
 * - 納品先は楽々販売の登録住所（銀座）。ロット番号・使用期限はモック
 */

export type OrderStatus =
  | 'ORDERED'
  | 'PREPARING'
  | 'FEDEX_DISPATCHED'
  | 'IN_TRANSIT_INTL'
  | 'CUSTOMS_CLEARANCE'
  | 'SAGAWA_HANDOVER'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface Clinic {
  id: string;
  name: string;
  nameEn: string;
  doctor: string;
  doctorEn: string;
  tel: string;
  zip: string;
  address: string;
  addressEn: string;
  email: string;
  region: string;
  hub: 'NRT' | 'KIX';
}

export interface OrderItem {
  name: string;
  qty: number;
  unit: string;
  lotNo: string;
  expDate: string;
}

export interface TimelineEvent {
  step: OrderStatus;
  time: string;
  location: string;
  title: string;
  desc: string;
  operator: string;
}

export interface OrderRecord {
  id: string;
  invoiceNo: string;
  batchId: string;
  batchName: string;
  orderDate: string;
  clinicId: string;
  clinicName: string;
  clinicNameEn: string;
  doctor: string;
  doctorEn: string;
  tel: string;
  zip: string;
  address: string;
  addressEn: string;
  email: string;
  region: string;
  hub: 'NRT' | 'KIX';
  hubName: string;
  status: OrderStatus;
  /** 国際便の業者（DHL / FedEx）。国内在庫からの発送は「国内発送」 */
  intlCarrier: string;
  fedexTracking: string;
  sagawaTracking: string;
  estimatedDelivery: string;
  actualDelivery?: string | null;
  recipientName?: string | null;
  items: OrderItem[];
  totalQty: number;
  timeline: TimelineEvent[];
}

export interface BatchInfo {
  id: string;
  name: string;
  orderDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  totalOrders: number;
  totalUnits: number;
  isCurrent: boolean;
  description: string;
}

export const STATUS_STEPS: {
  key: OrderStatus;
  step: number;
  label: string;
  shortLabel: string;
  desc: string;
  color: string;
  bgLight: string;
  borderLight: string;
  textColor: string;
}[] = [
  {
    "key": "ORDERED",
    "step": 0,
    "label": "注文済み",
    "shortLabel": "注文受付",
    "desc": "楽々販売にて受注確定・仕入先へ発注",
    "color": "bg-slate-400",
    "bgLight": "bg-slate-50",
    "borderLight": "border-slate-200",
    "textColor": "text-slate-600"
  },
  {
    "key": "PREPARING",
    "step": 1,
    "label": "出荷待ち",
    "shortLabel": "出荷待ち",
    "desc": "楽々販売 出荷管理で出荷待ち（未出荷）",
    "color": "bg-amber-400",
    "bgLight": "bg-amber-50/60",
    "borderLight": "border-amber-200",
    "textColor": "text-amber-700"
  },
  {
    "key": "FEDEX_DISPATCHED",
    "step": 2,
    "label": "国際便 集荷済",
    "shortLabel": "国際便集荷済",
    "desc": "DHL / FedEx にて集荷・国際輸送受付完了",
    "color": "bg-purple-400",
    "bgLight": "bg-purple-50/60",
    "borderLight": "border-purple-200",
    "textColor": "text-purple-700"
  },
  {
    "key": "IN_TRANSIT_INTL",
    "step": 3,
    "label": "国際航空輸送中",
    "shortLabel": "国際空輸中",
    "desc": "DHL / FedEx 国際便にて成田 (NRT) へ輸送中",
    "color": "bg-indigo-400",
    "bgLight": "bg-indigo-50/60",
    "borderLight": "border-indigo-200",
    "textColor": "text-indigo-700"
  },
  {
    "key": "CUSTOMS_CLEARANCE",
    "step": 4,
    "label": "成田到着・通関中",
    "shortLabel": "税関審査中",
    "desc": "成田国際空港到着。輸入確認（薬監）・輸入通関中",
    "color": "bg-blue-400",
    "bgLight": "bg-blue-50/60",
    "borderLight": "border-blue-200",
    "textColor": "text-blue-700"
  },
  {
    "key": "SAGAWA_HANDOVER",
    "step": 5,
    "label": "国内配送引継済",
    "shortLabel": "国内引継済",
    "desc": "輸入通関許可完了。国内配送へ引渡完了",
    "color": "bg-cyan-400",
    "bgLight": "bg-cyan-50/60",
    "borderLight": "border-cyan-200",
    "textColor": "text-cyan-700"
  },
  {
    "key": "OUT_FOR_DELIVERY",
    "step": 6,
    "label": "国内配達中",
    "shortLabel": "配達中",
    "desc": "クリニックへ配達中",
    "color": "bg-teal-400",
    "bgLight": "bg-teal-50/60",
    "borderLight": "border-teal-200",
    "textColor": "text-teal-700"
  },
  {
    "key": "DELIVERED",
    "step": 7,
    "label": "配達完了",
    "shortLabel": "受領済",
    "desc": "クリニック受付にて受領完了",
    "color": "bg-emerald-500",
    "bgLight": "bg-emerald-50/60",
    "borderLight": "border-emerald-200",
    "textColor": "text-emerald-700"
  }
];

export const CLINICS_MASTER: Clinic[] = [
  {
    "id": "TA-GINZA",
    "name": "銀座TAクリニック様",
    "nameEn": "GINZA TA CLINIC",
    "doctor": "嶽崎 元彦",
    "doctorEn": "MOTOHIKO TAKESAKI",
    "tel": "0120-229-239",
    "zip": "104-0061",
    "address": "東京都中央区銀座2丁目3-6 4階",
    "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
    "email": "o@9clinic.net",
    "region": "関東",
    "hub": "NRT"
  }
];

export const BATCHES_LIST: BatchInfo[] = [
  {
    "id": "2026-10",
    "name": "2026年10月 受注分",
    "orderDate": "2026/10/09",
    "status": "IN_PROGRESS",
    "totalOrders": 6,
    "totalUnits": 471,
    "isCurrent": true,
    "description": "10月の受注 3件／出荷 6件（楽々販売 出荷管理）。出荷待ちあり。"
  },
  {
    "id": "2026-09",
    "name": "2026年9月 受注分",
    "orderDate": "2026/09/04",
    "status": "COMPLETED",
    "totalOrders": 7,
    "totalUnits": 205,
    "isCurrent": false,
    "description": "9月の受注 3件／出荷 7件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-08",
    "name": "2026年8月 受注分",
    "orderDate": "2026/08/10",
    "status": "COMPLETED",
    "totalOrders": 4,
    "totalUnits": 210,
    "isCurrent": false,
    "description": "8月の受注 2件／出荷 4件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-07",
    "name": "2026年7月 受注分",
    "orderDate": "2026/07/09",
    "status": "COMPLETED",
    "totalOrders": 14,
    "totalUnits": 361,
    "isCurrent": false,
    "description": "7月の受注 4件／出荷 14件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-06",
    "name": "2026年6月 受注分",
    "orderDate": "2026/06/09",
    "status": "COMPLETED",
    "totalOrders": 22,
    "totalUnits": 2720,
    "isCurrent": false,
    "description": "6月の受注 5件／出荷 22件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-05",
    "name": "2026年5月 受注分",
    "orderDate": "2026/05/19",
    "status": "COMPLETED",
    "totalOrders": 13,
    "totalUnits": 1519,
    "isCurrent": false,
    "description": "5月の受注 2件／出荷 13件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-04",
    "name": "2026年4月 受注分",
    "orderDate": "2026/04/06",
    "status": "COMPLETED",
    "totalOrders": 18,
    "totalUnits": 2076,
    "isCurrent": false,
    "description": "4月の受注 5件／出荷 18件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-03",
    "name": "2026年3月 受注分",
    "orderDate": "2026/03/02",
    "status": "COMPLETED",
    "totalOrders": 22,
    "totalUnits": 2517,
    "isCurrent": false,
    "description": "3月の受注 6件／出荷 22件（楽々販売 出荷管理）。全出荷完了。"
  },
  {
    "id": "2026-02",
    "name": "2026年2月 受注分",
    "orderDate": "2026/02/12",
    "status": "COMPLETED",
    "totalOrders": 6,
    "totalUnits": 930,
    "isCurrent": false,
    "description": "2月の受注 3件／出荷 6件（楽々販売 出荷管理）。全出荷完了。"
  }
];

export const ALL_ORDERS: Record<string, OrderRecord[]> = {
  "2026-10": [
    {
      "id": "TA-000004058-未出荷",
      "invoiceNo": "000004058 / 未出荷",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/16 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "PREPARING",
      "intlCarrier": "国際便",
      "fedexTracking": "出荷待ち",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/23",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2610-12",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "PREPARING",
          "time": "2026/10/17 11:00",
          "location": "Number1 出荷管理",
          "title": "出荷待ち（出荷準備中）",
          "desc": "楽々販売 出荷管理に出荷記録なし（未出荷）",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/16 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000004058（備考: Kabelline5箱→直送に変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000005245",
      "invoiceNo": "000004057 / DO-000005245",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/16 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "PREPARING",
      "intlCarrier": "DHL",
      "fedexTracking": "出荷待ち",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "未定（受注備考により韓国倉庫に在庫保管）",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-BOTU2610-83",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "PREPARING",
          "time": "2026/10/17 11:00",
          "location": "Number1 出荷管理",
          "title": "出荷待ち（出荷準備中）",
          "desc": "楽々販売 出荷ID DO-000005245：出荷待ち／受注備考により韓国倉庫に在庫保管",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/16 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000004057（備考: 納期厳守・平日配送 200本直送／100本は韓国倉庫に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000005184",
      "invoiceNo": "000004058 / DO-000005184",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/16 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "FEDEX_DISPATCHED",
      "intlCarrier": "DHL",
      "fedexTracking": "4293868655",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/23",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Kabelline(デオキシコール酸0.5%)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-KABE2610-50",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 5,
      "timeline": [
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/10/19 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 4293868655)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/10/18 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/16 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000004058（備考: Kabelline5箱→直送に変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000005183",
      "invoiceNo": "000004057 / DO-000005183",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/16 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "FEDEX_DISPATCHED",
      "intlCarrier": "DHL",
      "fedexTracking": "4293712220",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/23",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-BOTU2610-80",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/10/19 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 4293712220)／日本向け出荷済",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/10/18 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/16 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000004057（備考: 納期厳守・平日配送 200本直送／100本は韓国倉庫に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004909",
      "invoiceNo": "000003934 / DO-000004909",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "7785365593",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/19",
      "actualDelivery": "2026/10/19 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 60,
          "unit": "本",
          "lotNo": "LOT-JALU2610-99",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 60,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/19 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/19 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/16 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/16 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/10/13 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/10/12 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 7785365593)／配達完了",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/10/11 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003934（備考: 特別納期 納期厳守）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004901",
      "invoiceNo": "000003934 / DO-000004901",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "PREPARING",
      "intlCarrier": "国際便",
      "fedexTracking": "出荷待ち",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/15",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Mirror Cannula MC-25070C",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-MIRR2610-37",
          "expDate": "2028-10-28"
        },
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-MIRR2610-70",
          "expDate": "2028-10-28"
        },
        {
          "name": "Mirror Cannula MC-30025C",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-MIRR2610-13",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 6,
      "timeline": [
        {
          "step": "PREPARING",
          "time": "2026/10/10 11:00",
          "location": "Number1 出荷管理",
          "title": "出荷待ち（出荷準備中）",
          "desc": "楽々販売 出荷ID DO-000004901：出荷待ち",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003934（備考: 特別納期 納期厳守）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-09": [
    {
      "id": "DO-000004601",
      "invoiceNo": "000003645 / DO-000004601",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1161140676",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/02",
      "actualDelivery": "2026/10/02 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-PRXT2609-75",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 5,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/02 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/02 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/01 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/01 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/30 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/29 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1161140676)／配達完了",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/28 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003645（備考: 【特別納期】2週間で納品 ※10/6まで）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004531",
      "invoiceNo": "000003645 / DO-000004531",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1251881046",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/05",
      "actualDelivery": "2026/10/05 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PROF2609-23",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/05 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/05 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/04 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/04 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/27 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/26 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1251881046)／配達完了",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003645（備考: 【特別納期】2週間で納品 ※10/6まで）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004488",
      "invoiceNo": "000003525 / DO-000004488",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1251881046",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/05",
      "actualDelivery": "2026/10/05 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 60,
          "unit": "本",
          "lotNo": "LOT-PLUR2609-92",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 60,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/05 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/05 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/04 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/04 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/27 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/26 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1251881046)／配達完了",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003525（備考: 韓国製剤：1週間 ヨーロッパ製剤：2週間で納品）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004328",
      "invoiceNo": "000003525 / DO-000004328",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "6795458950",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/09/29",
      "actualDelivery": "2026/09/29 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 60,
          "unit": "本",
          "lotNo": "LOT-JALU2609-88",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 60,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/09/29 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/29 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/09/28 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/09/28 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/22 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/21 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 6795458950)／配達完了",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/20 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003525（備考: 韓国製剤：1週間 ヨーロッパ製剤：2週間で納品）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004322",
      "invoiceNo": "000003525 / DO-000004322",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/09/19",
      "actualDelivery": "2026/09/19（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2609-55",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 5,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/09/19 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/19 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/09/18 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003525（備考: 韓国製剤：1週間 ヨーロッパ製剤：2週間で納品）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004213",
      "invoiceNo": "000003440 / DO-000004213",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/04 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/09/19",
      "actualDelivery": "2026/09/19（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2609-79",
          "expDate": "2028-09-28"
        },
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2609-56",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 20,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/09/19 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/19 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/09/18 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/04 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003440（備考: カニューレ直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000004187",
      "invoiceNo": "000003440 / DO-000004187",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/04 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1161140676",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/10/02",
      "actualDelivery": "2026/10/02 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-PRXT2609-94",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 5,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/02 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/02 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/01 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/01 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/30 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/29 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1161140676)／配達完了",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/28 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/04 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003440（備考: カニューレ直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-08": [
    {
      "id": "DO-000003816",
      "invoiceNo": "000003190 / DO-000003816",
      "batchId": "2026-08",
      "batchName": "8月受注分",
      "orderDate": "2026/08/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "13",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/09/01",
      "actualDelivery": "2026/09/01（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 40,
          "unit": "本",
          "lotNo": "LOT-PROF2608-59",
          "expDate": "2028-08-28"
        }
      ],
      "totalQty": 40,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/09/01 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/01 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/31 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/31 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/29 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/28 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 13)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/27 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/08/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003190",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003763",
      "invoiceNo": "000003048 / DO-000003763",
      "batchId": "2026-08",
      "batchName": "8月受注分",
      "orderDate": "2026/08/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "楽々販売に未登録",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JALU2608-85",
          "expDate": "2028-08-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 楽々販売に未登録)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/08/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003048（備考: 8/20までに納品 直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003619",
      "invoiceNo": "000003048 / DO-000003619",
      "batchId": "2026-08",
      "batchName": "8月受注分",
      "orderDate": "2026/08/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "47",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PLUR2608-74",
          "expDate": "2028-08-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 47)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/08/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003048（備考: 8/20までに納品 直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003585",
      "invoiceNo": "000003048 / DO-000003585",
      "batchId": "2026-08",
      "batchName": "8月受注分",
      "orderDate": "2026/08/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8759",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis light (Lido)",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-NEUR2608-10",
          "expDate": "2028-08-28"
        }
      ],
      "totalQty": 70,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8759)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/08/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003048（備考: 8/20までに納品 直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-07": [
    {
      "id": "DO-000003325",
      "invoiceNo": "000002896 / DO-000003325",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/28 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "楽々販売に未登録",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/09",
      "actualDelivery": "2026/08/09（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-HYAC2607-32",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/09 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/09 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/08 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/08 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/06 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/05 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 楽々販売に未登録)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/04 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/28 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002896（備考: 入金より7日以内（FatX Core・JUVELOOK）／14日以内（PROFHILO・JALUPRO））",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003324",
      "invoiceNo": "000002896 / DO-000003324",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/28 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "楽々販売に未登録",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/09",
      "actualDelivery": "2026/08/09（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PROF2607-42",
          "expDate": "2028-07-28"
        },
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JALU2607-80",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/09 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/09 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/08 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/08 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/06 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/05 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 楽々販売に未登録)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/04 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/28 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002896（備考: 入金より7日以内（FatX Core・JUVELOOK）／14日以内（PROFHILO・JALUPRO））",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003301",
      "invoiceNo": "000002896 / DO-000003301",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/28 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/05",
      "actualDelivery": "2026/08/05（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "FatX Core(デオキシコール酸1.0%)",
          "qty": 10,
          "unit": "箱",
          "lotNo": "LOT-FATX2607-10",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/05 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/05 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/04 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/03 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/28 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002896（備考: 入金より7日以内（FatX Core・JUVELOOK）／14日以内（PROFHILO・JALUPRO））",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003297",
      "invoiceNo": "000002896 / DO-000003297",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/28 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8752",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/08",
      "actualDelivery": "2026/08/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JUVE2607-84",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/07 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/07 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/05 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/04 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8752)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/03 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/28 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002896（備考: 入金より7日以内（FatX Core・JUVELOOK）／14日以内（PROFHILO・JALUPRO））",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003212",
      "invoiceNo": "000002741 / DO-000003212",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/22 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/28",
      "actualDelivery": "2026/08/28（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "FatX Core(デオキシコール酸1.0%)",
          "qty": 15,
          "unit": "箱",
          "lotNo": "LOT-FATX2607-08",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 15,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/28 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/28 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/27 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/26 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/22 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002741",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003202",
      "invoiceNo": "000002741 / DO-000003202",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/22 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "8641933252",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/14",
      "actualDelivery": "2026/08/14（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-JALU2607-64",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/14 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/14 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/13 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/13 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/11 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/10 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 8641933252)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/22 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002741",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003098",
      "invoiceNo": "000002667 / DO-000003098",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/15 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "1324231565",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALU PRO YOUNG EYE",
          "qty": 3,
          "unit": "本",
          "lotNo": "LOT-JALU2607-79",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 3,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 1324231565)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/15 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002667",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003097",
      "invoiceNo": "000002667 / DO-000003097",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/15 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "9451002831",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/09/03",
      "actualDelivery": "2026/09/03（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO STRUCTURA",
          "qty": 3,
          "unit": "本",
          "lotNo": "LOT-PROF2607-75",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 3,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/09/03 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/03 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/09/02 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/09/02 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/31 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/30 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 9451002831)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/29 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/15 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002667",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003075",
      "invoiceNo": "000002667 / DO-000003075",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/15 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8749-0828-5346",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/01",
      "actualDelivery": "2026/08/01（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Pure cain plus cream",
          "qty": 20,
          "unit": "個",
          "lotNo": "LOT-PURE2607-40",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 20,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/01 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/01 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/31 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/31 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/29 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/28 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8749-0828-5346)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/27 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/15 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002667",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003551",
      "invoiceNo": "000002591 / DO-000003551",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/18",
      "actualDelivery": "2026/08/18（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-PRXT2607-10",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 5,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/18 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/18 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/17 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/16 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002591",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003336",
      "invoiceNo": "000002591 / DO-000003336",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8752",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/08",
      "actualDelivery": "2026/08/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 20,
          "unit": "本",
          "lotNo": "LOT-JUVE2607-47",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 20,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/07 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/07 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/05 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/04 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8752)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/03 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002591",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003193",
      "invoiceNo": "000002591 / DO-000003193",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/08",
      "actualDelivery": "2026/08/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-PRXT2607-52",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 3,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/07 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/06 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002591",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002910",
      "invoiceNo": "000002591 / DO-000002910",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/23",
      "actualDelivery": "2026/07/23（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 2,
          "unit": "箱",
          "lotNo": "LOT-PRXT2607-73",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 2,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/23 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/23 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/22 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/21 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002591",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002885",
      "invoiceNo": "000002591 / DO-000002885",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8750",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/02",
      "actualDelivery": "2026/08/02（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JUVE2607-71",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/02 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/02 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/01 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/01 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/30 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/29 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8750)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/28 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002591",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-06": [
    {
      "id": "DO-000003773",
      "invoiceNo": "000002395 / DO-000003773",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1643311132",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/26",
      "actualDelivery": "2026/08/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-04",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/25 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/25 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/23 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/22 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1643311132)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/21 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002975",
      "invoiceNo": "000002395 / DO-000002975",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1643311132",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/26",
      "actualDelivery": "2026/08/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2606-10",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/25 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/25 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/23 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/22 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1643311132)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/21 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002812",
      "invoiceNo": "000002395 / DO-000002812",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8759",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-68",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8759)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002614",
      "invoiceNo": "000002395 / DO-000002614",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "楽々販売に未登録",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/17",
      "actualDelivery": "2026/07/17（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2606-14",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/17 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/17 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/16 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/16 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/14 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/13 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 楽々販売に未登録)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/12 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002613",
      "invoiceNo": "000002395 / DO-000002613",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/07",
      "actualDelivery": "2026/07/07（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis light (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-67",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/07 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/07 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/06 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/05 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002612",
      "invoiceNo": "000002395 / DO-000002612",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8740-2747-8329",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/12",
      "actualDelivery": "2026/07/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-JUVE2606-26",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8740-2747-8329)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003489",
      "invoiceNo": "000002337 / DO-000003489",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8759",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-25",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8759)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002337",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002534",
      "invoiceNo": "000002337 / DO-000002534",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8752",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/08",
      "actualDelivery": "2026/08/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-76",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/07 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/07 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/05 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/04 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8752)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/03 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002337",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002520",
      "invoiceNo": "000002337 / DO-000002520",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8740-8861-4645",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/12",
      "actualDelivery": "2026/07/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-18070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-19",
          "expDate": "2028-06-28"
        },
        {
          "name": "cellREDM（サンプル）",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-CELL2606-11",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 7,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8740-8861-4645)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002337",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002853",
      "invoiceNo": "000002284 / DO-000002853",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/18 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "1643311132",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/26",
      "actualDelivery": "2026/08/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-87",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/25 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/25 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/23 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/22 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 1643311132)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/21 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/18 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002284",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002439",
      "invoiceNo": "000002284 / DO-000002439",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/18 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "8641933252",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/14",
      "actualDelivery": "2026/08/14（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-PROF2606-78",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/14 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/14 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/13 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/13 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/11 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/10 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 8641933252)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/18 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002284",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002412",
      "invoiceNo": "000002284 / DO-000002412",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/18 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8740-2747-8329",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/12",
      "actualDelivery": "2026/07/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-15",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8740-2747-8329)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/18 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002284",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002305",
      "invoiceNo": "000002115 / DO-000002305",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/11 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8734-2584-6418",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/28",
      "actualDelivery": "2026/06/28（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2606-01",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 4,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-48",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 15,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-11",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-18070",
          "qty": 4,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-88",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 33,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/28 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/28 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/27 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/27 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/25 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/24 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8734-2584-6418)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/23 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/11 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002115",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002294",
      "invoiceNo": "000002115 / DO-000002294",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/11 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8730-6013-5342",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/19",
      "actualDelivery": "2026/06/19（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-JUVE2606-19",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 70,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/19 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/19 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/18 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/18 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/16 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/15 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8730-6013-5342)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/14 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/11 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002115",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000003488",
      "invoiceNo": "000002036 / DO-000003488",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8757",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/17",
      "actualDelivery": "2026/08/17（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-53",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/17 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/17 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/16 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/16 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/14 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/13 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8757)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/12 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002766",
      "invoiceNo": "000002036 / DO-000002766",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/17",
      "actualDelivery": "2026/07/17（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 20,
          "unit": "本",
          "lotNo": "LOT-PLUR2606-49",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 20,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/17 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/17 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/16 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/15 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002286",
      "invoiceNo": "000002036 / DO-000002286",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8732-8741-3646",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/24",
      "actualDelivery": "2026/06/24（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2606-88",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/24 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/24 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/23 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/23 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/21 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/20 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8732-8741-3646)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/19 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002263",
      "invoiceNo": "000002036 / DO-000002263",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "DHL",
      "fedexTracking": "楽々販売に未登録",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/09",
      "actualDelivery": "2026/08/09（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-HYAC2606-97",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/09 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/09 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/08 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/08 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/06 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "DHL 国際航空輸送 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/05 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷 (追跡番号: 楽々販売に未登録)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/04 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002262",
      "invoiceNo": "000002036 / DO-000002262",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/04",
      "actualDelivery": "2026/07/04（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 80,
          "unit": "本",
          "lotNo": "LOT-PLUR2606-70",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 80,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/04 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/04 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/03 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/02 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002250",
      "invoiceNo": "000002036 / DO-000002250",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8752",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/08",
      "actualDelivery": "2026/08/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 400,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-48",
          "expDate": "2028-06-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 250,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-90",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 650,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/07 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/07 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/05 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/04 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8752)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/03 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002239",
      "invoiceNo": "000002036 / DO-000002239",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8729-3058-2734",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/15",
      "actualDelivery": "2026/06/15（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-BOTU2606-99",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/15 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/15 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/14 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/14 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/12 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/11 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8729-3058-2734)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/10 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002227",
      "invoiceNo": "000002036 / DO-000002227",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8740-2747-8329",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/12",
      "actualDelivery": "2026/07/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2606-01",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8740-2747-8329)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-05": [
    {
      "id": "DO-000002813",
      "invoiceNo": "000001800 / DO-000002813",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8759",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-99",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 150,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8759)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/21 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001800",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002680",
      "invoiceNo": "000001800 / DO-000002680",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/07",
      "actualDelivery": "2026/07/07（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-41",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/07 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/07 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/06 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/05 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/21 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001800",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002266",
      "invoiceNo": "000001800 / DO-000002266",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/01",
      "actualDelivery": "2026/07/01（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-48",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/01 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/01 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/30 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/29 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/21 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001800",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002026",
      "invoiceNo": "000001800 / DO-000002026",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8728-2020-2985",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/13",
      "actualDelivery": "2026/06/13（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-81",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/13 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/13 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/12 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/12 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/10 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/09 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8728-2020-2985)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/08 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/21 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001800",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001833",
      "invoiceNo": "000001800 / DO-000001833",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/30",
      "actualDelivery": "2026/05/30（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-12",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/30 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/30 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/29 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/28 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/21 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001800",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001828",
      "invoiceNo": "000001800 / DO-000001828",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/22",
      "actualDelivery": "2026/07/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-PLUR2605-70",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/21 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/20 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/21 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001800",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002564",
      "invoiceNo": "000001607 / DO-000002564",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/01",
      "actualDelivery": "2026/07/01（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 120,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-99",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 120,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/01 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/01 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/30 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/29 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002235",
      "invoiceNo": "000001607 / DO-000002235",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8729-9216-6746",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/19",
      "actualDelivery": "2026/06/19（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2605-33",
          "expDate": "2028-05-28"
        },
        {
          "name": "JUVELOOK",
          "qty": 9,
          "unit": "本",
          "lotNo": "LOT-JUVE2605-22",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 14,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/19 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/19 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/18 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/18 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/16 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/15 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8729-9216-6746)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/14 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002159",
      "invoiceNo": "000001607 / DO-000002159",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/10",
      "actualDelivery": "2026/06/10（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25050C",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2605-31",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 5,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/10 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/10 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/09 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/08 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001944",
      "invoiceNo": "000001607 / DO-000001944",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/26",
      "actualDelivery": "2026/06/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 80,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-87",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 80,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-32",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 51,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-35",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-86",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 411,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001785",
      "invoiceNo": "000001607 / DO-000001785",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 99,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-08",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 99,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001778",
      "invoiceNo": "000001607 / DO-000001778",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/07/17",
      "actualDelivery": "2026/07/17（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 80,
          "unit": "本",
          "lotNo": "LOT-PLUR2605-39",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 80,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/17 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/17 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/16 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/15 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001764",
      "invoiceNo": "000001607 / DO-000001764",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8726-8137-6460",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/10",
      "actualDelivery": "2026/06/10（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2605-82",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/10 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/10 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/09 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/09 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/07 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/06 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8726-8137-6460)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/05 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-04": [
    {
      "id": "DO-000002158",
      "invoiceNo": "000001421 / DO-000002158",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/26",
      "actualDelivery": "2026/06/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-94",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-95",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-75",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 138,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-63",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 418,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/30 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001421",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000002156",
      "invoiceNo": "000001421 / DO-000002156",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8726-8137-6460",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/10",
      "actualDelivery": "2026/06/10（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 62,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-20",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 62,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/10 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/10 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/09 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/09 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/07 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/06 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8726-8137-6460)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/05 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/30 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001421",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001861",
      "invoiceNo": "000001421 / DO-000001861",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8726-8181-0184",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/10",
      "actualDelivery": "2026/06/10（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2604-00",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/10 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/10 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/09 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/09 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/07 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/06 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8726-8181-0184)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/05 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/30 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001421",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001677",
      "invoiceNo": "000001421 / DO-000001677",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/28",
      "actualDelivery": "2026/05/28（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-PLUR2604-10",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 70,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/28 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/28 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/27 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/26 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/30 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001421",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001357",
      "invoiceNo": "000001421 / DO-000001357",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8720-6215-0636",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-BOTU2604-34",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/26 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/24 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/23 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8720-6215-0636)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/22 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/30 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001421",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001348",
      "invoiceNo": "000001421 / DO-000001348",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/16",
      "actualDelivery": "2026/05/16（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-PROF2604-69",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/16 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/16 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/15 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/14 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/30 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001421",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001325",
      "invoiceNo": "000001347 / DO-000001325",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/27 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8715-5158-6708",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25050C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-20",
          "expDate": "2028-04-28"
        },
        {
          "name": "LHALA PEEL",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-LHAL2604-01",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 13,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8715-5158-6708)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/27 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001347",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001319",
      "invoiceNo": "000001347 / DO-000001319",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/27 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8715-5158-6708",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "LHALA PEEL",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-LHAL2604-70",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 3,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8715-5158-6708)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/27 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001347",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001942",
      "invoiceNo": "000001318 / DO-000001942",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8731-8771-5520",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/24",
      "actualDelivery": "2026/06/24（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2604-95",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/24 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/24 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/23 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/23 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/21 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/20 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8731-8771-5520)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/19 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001318",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001714",
      "invoiceNo": "000001318 / DO-000001714",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/09",
      "actualDelivery": "2026/06/09（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-PLUR2604-63",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 70,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/09 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/09 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/08 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001318",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001275",
      "invoiceNo": "000001318 / DO-000001275",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/19",
      "actualDelivery": "2026/05/19（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 8,
          "unit": "箱",
          "lotNo": "LOT-PRXT2604-38",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 8,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/19 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/19 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/18 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/17 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001318",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001269",
      "invoiceNo": "000001318 / DO-000001269",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/14",
      "actualDelivery": "2026/05/14（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Rejuran HB(Plus)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-REJU2604-43",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 150,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/14 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/14 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/13 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/12 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001318",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001260",
      "invoiceNo": "000001318 / DO-000001260",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-18",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-36",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-76",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-25",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 530,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001318",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001123",
      "invoiceNo": "000001127 / DO-000001123",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/14 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-HYAC2604-01",
          "expDate": "2028-04-28"
        },
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-HYAC2604-01",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 12,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/10 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/14 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001127（備考: HYAcorp MLF2 ×2 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001093",
      "invoiceNo": "000001127 / DO-000001093",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/14 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8715-0816-9667",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 20,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-01",
          "expDate": "2028-04-28"
        },
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-11",
          "expDate": "2028-04-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2604-54",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 35,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8715-0816-9667)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/14 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001127（備考: HYAcorp MLF2 ×2 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001505",
      "invoiceNo": "000001008 / DO-000001505",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/06 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-08",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/06 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001008",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000947",
      "invoiceNo": "000001008 / DO-000000947",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/06 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/22",
      "actualDelivery": "2026/05/22（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PLUR2604-67",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/22 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/22 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/21 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/20 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/06 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001008",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000912",
      "invoiceNo": "000001008 / DO-000000912",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/06 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8715-5158-6708",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-48",
          "expDate": "2028-04-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2604-39",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-44",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 65,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8715-5158-6708)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/06 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001008",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-03": [
    {
      "id": "DO-000001768",
      "invoiceNo": "000000948 / DO-000001768",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/23",
      "actualDelivery": "2026/05/23（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-PLUR2603-83",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 2,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/23 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/23 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/22 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/21 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/31 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000948",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001247",
      "invoiceNo": "000000948 / DO-000001247",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8709",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/27",
      "actualDelivery": "2026/04/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-24",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/26 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/26 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/24 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/23 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8709)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/22 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/31 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000948",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001017",
      "invoiceNo": "000000948 / DO-000001017",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8708-8746-7275",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/25",
      "actualDelivery": "2026/04/25（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-89",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-28",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/25 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/25 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/24 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/24 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/22 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/21 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8708-8746-7275)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/20 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/31 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000948",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000873",
      "invoiceNo": "000000948 / DO-000000873",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/08",
      "actualDelivery": "2026/05/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 48,
          "unit": "本",
          "lotNo": "LOT-PLUR2603-70",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 48,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/07 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/06 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/31 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000948",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000829",
      "invoiceNo": "000000948 / DO-000000829",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8709-7857-5208",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/27",
      "actualDelivery": "2026/04/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-35",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 200,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/26 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/26 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/24 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/23 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8709-7857-5208)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/22 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/31 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000948",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000828",
      "invoiceNo": "000000948 / DO-000000828",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/11",
      "actualDelivery": "2026/04/11（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-55",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-44",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 150,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/11 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/11 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/10 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/31 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000948",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000685",
      "invoiceNo": "000000845 / DO-000000685",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/24 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-PRXT2603-80",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 3,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/10 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/24 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000845",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000663",
      "invoiceNo": "000000845 / DO-000000663",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/24 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/11",
      "actualDelivery": "2026/04/11（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-82",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-78",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-53",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/11 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/11 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/10 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/24 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000845",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001504",
      "invoiceNo": "000000723 / DO-000001504",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/17 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 31,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-61",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-02",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 81,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/17 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000723",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001006",
      "invoiceNo": "000000723 / DO-000001006",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/17 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8715-5158-6708",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 19,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-44",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 19,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/09 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/08 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8715-5158-6708)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/07 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/17 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000723",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000716",
      "invoiceNo": "000000723 / DO-000000716",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/17 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8704-6614-3260",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/14",
      "actualDelivery": "2026/04/14（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-94",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/14 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/14 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/13 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/13 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/11 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/10 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8704-6614-3260)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/17 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000723",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000552",
      "invoiceNo": "000000723 / DO-000000552",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/17 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/26",
      "actualDelivery": "2026/03/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-25",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/17 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000723",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001943",
      "invoiceNo": "000000650 / DO-000001943",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/06/26",
      "actualDelivery": "2026/06/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-91",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/12 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000650",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001189",
      "invoiceNo": "000000650 / DO-000001189",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis light (Lido)",
          "qty": 20,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-10",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 20,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/12 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000650",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001016",
      "invoiceNo": "000000650 / DO-000001016",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8708-8746-7275",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/25",
      "actualDelivery": "2026/04/25（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2603-05",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 10,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/25 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/25 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/24 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/24 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/22 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/21 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8708-8746-7275)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/20 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/12 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000650",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000715",
      "invoiceNo": "000000650 / DO-000000715",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/11",
      "actualDelivery": "2026/04/11（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-40",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/11 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/11 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/10 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/12 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000650",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000320",
      "invoiceNo": "000000650 / DO-000000320",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/26",
      "actualDelivery": "2026/03/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-20",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/12 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000650",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000001648",
      "invoiceNo": "000000574 / DO-000001648",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/05 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/27",
      "actualDelivery": "2026/05/27（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-87",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/27 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/27 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/26 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/05 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000574",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000892",
      "invoiceNo": "000000574 / DO-000000892",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/05 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/05/14",
      "actualDelivery": "2026/05/14（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-12",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/14 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/14 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/13 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/12 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/05 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000574",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000714",
      "invoiceNo": "000000574 / DO-000000714",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/05 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "870281884470",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/08",
      "actualDelivery": "2026/04/08（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-39",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/08 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/08 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/07 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/07 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/05 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/04 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 870281884470)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/03 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/05 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000574",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000235",
      "invoiceNo": "000000574 / DO-000000235",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/05 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/26",
      "actualDelivery": "2026/03/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-11",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-21",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-12",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 250,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/05 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000574",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000200",
      "invoiceNo": "000000509 / DO-000000200",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/02 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "889454337849",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/15",
      "actualDelivery": "2026/03/15（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-18050",
          "qty": 4,
          "unit": "本",
          "lotNo": "LOT-MIRR2603-41",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 4,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/15 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/15 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/14 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/03/14 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/03/12 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/03/11 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 889454337849)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/10 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/03/02 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000509",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-02": [
    {
      "id": "DO-000000540",
      "invoiceNo": "000000443 / DO-000000540",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/26 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/18",
      "actualDelivery": "2026/04/18（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PINK GLOW",
          "qty": 30,
          "unit": "箱",
          "lotNo": "LOT-PINK2602-62",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 30,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/18 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/18 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/17 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/16 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/02/26 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000443",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000482",
      "invoiceNo": "000000443 / DO-000000482",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/26 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/14",
      "actualDelivery": "2026/04/14（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-JALU2602-92",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/14 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/14 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/13 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/12 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/02/26 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000443",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000172",
      "invoiceNo": "000000443 / DO-000000172",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/26 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/26",
      "actualDelivery": "2026/03/26（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-95",
          "expDate": "2028-02-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-03",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 100,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/26 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/26 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/25 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/02/26 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000443",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000576",
      "invoiceNo": "000000332 / DO-000000576",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "国内在庫（佐川急便）",
      "status": "DELIVERED",
      "intlCarrier": "国内発送",
      "fedexTracking": "メンテナンス中",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/04/11",
      "actualDelivery": "2026/04/11（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-28",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/11 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/11 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/10 15:00",
          "location": "国内倉庫",
          "title": "国内在庫より佐川急便で出荷",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "佐川急便"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/09 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "国内在庫より出荷準備",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/02/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000332",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000113",
      "invoiceNo": "000000332 / DO-000000113",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "889682704008",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/21",
      "actualDelivery": "2026/03/21（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2602-92",
          "expDate": "2028-02-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-42",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 400,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/21 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/21 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/20 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/03/20 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/03/18 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/03/17 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 889682704008)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/16 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/02/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000332",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "DO-000000057",
      "invoiceNo": "000000124 / DO-000000057",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック様",
      "clinicNameEn": "GINZA TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "104-0061",
      "address": "東京都中央区銀座2丁目3-6 4階",
      "addressEn": "4F, 2-3-6 Ginza Namiki-dori Building, Chuo-ku, Tokyo 104-0061, Japan",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "intlCarrier": "FedEx",
      "fedexTracking": "8890-5395-2150",
      "sagawaTracking": "メンテナンス中",
      "estimatedDelivery": "2026/03/01",
      "actualDelivery": "2026/03/01（推定）",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-97",
          "expDate": "2028-02-28"
        },
        {
          "name": "Botulax 200u",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-BOTU2602-79",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 250,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/01 11:20",
          "location": "銀座TAクリニック様",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック様 受付にて受領（配達完了日は楽々販売未登録のため出荷日から推定）",
          "operator": "銀座TAクリニック様 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/01 08:30",
          "location": "東京都中央区",
          "title": "国内配達中",
          "desc": "銀座TAクリニック様へ配達中",
          "operator": "配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/02/28 15:00",
          "location": "成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "佐川急便 追跡: メンテナンス中",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/02/28 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "輸入確認（薬監）に基づき通関（通関日は楽々販売未登録のため推定）",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/02/26 01:40",
          "location": "国際フライト ➔ NRT",
          "title": "FedEx 国際航空輸送 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/02/25 16:30",
          "location": "SG倉庫 / 韓国仕入先",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷 (追跡番号: 8890-5395-2150)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/02/24 11:00",
          "location": "Number1 出荷管理",
          "title": "検品・梱包",
          "desc": "SG倉庫・仕入先にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/02/12 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000000124",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ]
};

const trackingUrl = (tracking: string): string => {
  const clean = (tracking || '').replace(/[^0-9]/g, '');
  if (!clean) return '#';
  // 10桁はDHL、12桁はFedEx
  if (clean.length === 10) return `https://www.dhl.com/jp-ja/home/tracking.html?tracking-id=${clean}`;
  return `https://www.fedex.com/fedextrack/?trknbr=${clean}`;
};

export function getFedexTrackingUrl(tracking: string): string {
  return trackingUrl(tracking);
}

export function getSagawaTrackingUrl(tracking: string): string {
  return trackingUrl(tracking);
}
