/**
 * TAクリニック（新宿・銀座）配送・受注管理データ
 * 出典: 楽々販売 顧客管理(クリニックID 000705700)・受注管理・出荷管理 の実績を元に作成（2026/10/19時点）
 *
 * - 受注管理: 見積済みを除く受注32件（2026/02〜2026/10）。送料・輸入代行手数料行は除外
 * - 出荷管理: DHL / FedEx の実追跡番号・出荷日・通関日・配達完了日を反映
 * - TAは一括発注ではなく個別受注。楽々販売の受注1件 = OrderRecord 1件。BatchInfo は「受注月」の表示区分
 * - 楽々販売の顧客マスタは1件のため、各受注の院（新宿/銀座）は受注日ごとに交互に割り当てたモック
 * - 新宿TAクリニックの住所は楽々販売に未登録のためモック
 * - ロット番号・使用期限はモック
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
    "label": "発送準備中",
    "shortLabel": "梱包準備中",
    "desc": "SG倉庫／韓国仕入先にて検品・梱包中",
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
    "name": "銀座TAクリニック",
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
  },
  {
    "id": "TA-SHINJUKU",
    "name": "新宿TAクリニック",
    "nameEn": "SHINJUKU TA CLINIC",
    "doctor": "嶽崎 元彦",
    "doctorEn": "MOTOHIKO TAKESAKI",
    "tel": "0120-229-239",
    "zip": "160-0023",
    "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
    "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
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
    "totalOrders": 3,
    "totalUnits": 471,
    "isCurrent": true,
    "description": "10月の個別受注 3件（楽々販売実績）。一部配送中。"
  },
  {
    "id": "2026-09",
    "name": "2026年9月 受注分",
    "orderDate": "2026/09/04",
    "status": "COMPLETED",
    "totalOrders": 3,
    "totalUnits": 205,
    "isCurrent": false,
    "description": "9月の個別受注 3件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-08",
    "name": "2026年8月 受注分",
    "orderDate": "2026/08/10",
    "status": "COMPLETED",
    "totalOrders": 2,
    "totalUnits": 210,
    "isCurrent": false,
    "description": "8月の個別受注 2件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-07",
    "name": "2026年7月 受注分",
    "orderDate": "2026/07/09",
    "status": "COMPLETED",
    "totalOrders": 4,
    "totalUnits": 403,
    "isCurrent": false,
    "description": "7月の個別受注 4件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-06",
    "name": "2026年6月 受注分",
    "orderDate": "2026/06/09",
    "status": "COMPLETED",
    "totalOrders": 5,
    "totalUnits": 2720,
    "isCurrent": false,
    "description": "6月の個別受注 5件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-05",
    "name": "2026年5月 受注分",
    "orderDate": "2026/05/19",
    "status": "COMPLETED",
    "totalOrders": 2,
    "totalUnits": 1519,
    "isCurrent": false,
    "description": "5月の個別受注 2件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-04",
    "name": "2026年4月 受注分",
    "orderDate": "2026/04/06",
    "status": "COMPLETED",
    "totalOrders": 5,
    "totalUnits": 2073,
    "isCurrent": false,
    "description": "4月の個別受注 5件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-03",
    "name": "2026年3月 受注分",
    "orderDate": "2026/03/02",
    "status": "COMPLETED",
    "totalOrders": 6,
    "totalUnits": 2517,
    "isCurrent": false,
    "description": "3月の個別受注 6件（楽々販売実績）。全件納品済み。"
  },
  {
    "id": "2026-02",
    "name": "2026年2月 受注分",
    "orderDate": "2026/02/12",
    "status": "COMPLETED",
    "totalOrders": 3,
    "totalUnits": 933,
    "isCurrent": false,
    "description": "2月の個別受注 3件（楽々販売実績）。全件納品済み。"
  }
];

export const ALL_ORDERS: Record<string, OrderRecord[]> = {
  "2026-10": [
    {
      "id": "TA-000004058",
      "invoiceNo": "000004058",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/16 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "FEDEX_DISPATCHED",
      "fedexTracking": "4293868655",
      "sagawaTracking": "4293868655",
      "estimatedDelivery": "2026/10/23",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2610-87",
          "expDate": "2028-10-28"
        },
        {
          "name": "Kabelline(デオキシコール酸0.5%)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-KABE2610-33",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 105,
      "timeline": [
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/10/19 16:30",
          "location": "韓国（QH BIO）直送",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 4293868655)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/10/18 11:00",
          "location": "韓国（QH BIO）直送",
          "title": "仕入先発注・検品梱包",
          "desc": "韓国（QH BIO）直送にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/16 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000004058（備考: 000004058: Kabelline5箱→直送に変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000004057",
      "invoiceNo": "000004057",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/16 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "FEDEX_DISPATCHED",
      "fedexTracking": "4293712220",
      "sagawaTracking": "105994850568",
      "estimatedDelivery": "2026/10/23",
      "actualDelivery": null,
      "recipientName": null,
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2610-11",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 300,
      "timeline": [
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/10/19 16:30",
          "location": "SEOUL - KOREA",
          "title": "DHL 集荷（韓国より直送）",
          "desc": "DHL：輸送中（荷物が集荷されました） 最終スキャン: SEOUL - KOREA",
          "operator": "DHL Express Korea"
        },
        {
          "step": "PREPARING",
          "time": "2026/10/18 11:00",
          "location": "韓国（Jonepharme）直送",
          "title": "仕入先発注・検品梱包",
          "desc": "韓国（Jonepharme）直送にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/16 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000004057（備考: 000004057: 納期厳守・平日配送 200本直送／100本は韓国倉庫に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000003934",
      "invoiceNo": "000003934",
      "batchId": "2026-10",
      "batchName": "10月受注分",
      "orderDate": "2026/10/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "7785365593",
      "sagawaTracking": "329748831678",
      "estimatedDelivery": "2026/10/19",
      "actualDelivery": "2026/10/19 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 60,
          "unit": "本",
          "lotNo": "LOT-JALU2610-14",
          "expDate": "2028-10-28"
        },
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
          "lotNo": "LOT-MIRR2610-56",
          "expDate": "2028-10-28"
        },
        {
          "name": "Mirror Cannula MC-30025C",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-MIRR2610-04",
          "expDate": "2028-10-28"
        }
      ],
      "totalQty": 66,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/19 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了（※Mirror Cannula MC-25070C・Mirror Cannula MC-27040C・Mirror Cannula MC-30025C は別送予定）",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/19 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/16 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 329748831678)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/16 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/10/13 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/10/12 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 7785365593)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/10/11 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/10/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003934（備考: 000003934: 特別納期 納期厳守）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-09": [
    {
      "id": "TA-000003645",
      "invoiceNo": "000003645",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "1251881046",
      "sagawaTracking": "294875039428",
      "estimatedDelivery": "2026/10/05",
      "actualDelivery": "2026/10/05 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PROF2609-06",
          "expDate": "2028-09-28"
        },
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-PRXT2609-95",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 55,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/05 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/05 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/04 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 294875039428)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/04 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/30 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/29 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 1251881046)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/28 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/23 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003645（備考: 000003645: 【特別納期】2週間で納品 ※10/6まで）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000003525",
      "invoiceNo": "000003525",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/10 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "6795458950",
      "sagawaTracking": "512789239779",
      "estimatedDelivery": "2026/10/05",
      "actualDelivery": "2026/10/05 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2609-18",
          "expDate": "2028-09-28"
        },
        {
          "name": "PLURYAL DENSIFY",
          "qty": 60,
          "unit": "本",
          "lotNo": "LOT-PLUR2609-89",
          "expDate": "2028-09-28"
        },
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 60,
          "unit": "本",
          "lotNo": "LOT-JALU2609-39",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 125,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/05 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/05 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/09/28 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 512789239779)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/09/28 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/27 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/26 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 6795458950)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/25 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003525（備考: 000003525: 韓国製剤：1週間 ヨーロッパ製剤：2週間で納品）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000003440",
      "invoiceNo": "000003440",
      "batchId": "2026-09",
      "batchName": "9月受注分",
      "orderDate": "2026/09/04 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "1161140676",
      "sagawaTracking": "294875039428",
      "estimatedDelivery": "2026/10/02",
      "actualDelivery": "2026/10/02 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2609-22",
          "expDate": "2028-09-28"
        },
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2609-62",
          "expDate": "2028-09-28"
        },
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 5,
          "unit": "箱",
          "lotNo": "LOT-PRXT2609-95",
          "expDate": "2028-09-28"
        }
      ],
      "totalQty": 25,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/10/02 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/10/02 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/10/01 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 294875039428)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/10/01 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/09/30 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/09/29 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 1161140676)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/09/28 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/09/04 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003440（備考: 000003440: カニューレ直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-08": [
    {
      "id": "TA-000003190",
      "invoiceNo": "000003190",
      "batchId": "2026-08",
      "batchName": "8月受注分",
      "orderDate": "2026/08/19 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "1318559782",
      "sagawaTracking": "919743446577",
      "estimatedDelivery": "2026/09/01",
      "actualDelivery": "2026/09/01 11:20",
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
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/01 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/31 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 919743446577)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/31 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/29 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/28 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 1318559782)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/27 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000003048",
      "invoiceNo": "000003048",
      "batchId": "2026-08",
      "batchName": "8月受注分",
      "orderDate": "2026/08/10 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "875910661840",
      "sagawaTracking": "150242314572",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis light (Lido)",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-NEUR2608-97",
          "expDate": "2028-08-28"
        },
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JALU2608-93",
          "expDate": "2028-08-28"
        },
        {
          "name": "PLURYAL DENSIFY",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PLUR2608-70",
          "expDate": "2028-08-28"
        }
      ],
      "totalQty": 170,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "FedEx 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "FedEx 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "FedEx 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 150242314572)",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "FedEx 国際航空輸送中 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送中",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷完了 (追跡番号: 875910661840)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/08/10 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000003048（備考: 000003048: 8/20までに納品 直送）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-07": [
    {
      "id": "TA-000002896",
      "invoiceNo": "000002896",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/28 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "2855854940",
      "sagawaTracking": "559339646212",
      "estimatedDelivery": "2026/08/09",
      "actualDelivery": "2026/08/09 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "FatX Core(デオキシコール酸1.0%)",
          "qty": 10,
          "unit": "箱",
          "lotNo": "LOT-FATX2607-03",
          "expDate": "2028-07-28"
        },
        {
          "name": "PROFHILO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PROF2607-72",
          "expDate": "2028-07-28"
        },
        {
          "name": "JUVELOOK",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JUVE2607-55",
          "expDate": "2028-07-28"
        },
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-JALU2607-57",
          "expDate": "2028-07-28"
        },
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-HYAC2607-97",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 210,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/09 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/09 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/08 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 559339646212)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/08 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/06 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/05 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 2855854940)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/04 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/07/28 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002896（備考: 000002896: 入金より7日以内（FatX Core・JUVELOOK）／14日以内（PROFHILO・JALUPRO））",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000002741",
      "invoiceNo": "000002741",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/22 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "3066915963",
      "sagawaTracking": "608233622469",
      "estimatedDelivery": "2026/08/31",
      "actualDelivery": "2026/08/31 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "FatX Core(デオキシコール酸1.0%)",
          "qty": 15,
          "unit": "箱",
          "lotNo": "LOT-FATX2607-03",
          "expDate": "2028-07-28"
        },
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-JALU2607-57",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 45,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/31 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/31 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/30 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 608233622469)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/30 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/28 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/27 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3066915963)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/26 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000002667",
      "invoiceNo": "000002667",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/15 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "2855854940",
      "sagawaTracking": "559339646212",
      "estimatedDelivery": "2026/09/03",
      "actualDelivery": "2026/09/03 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "寄贈肋軟骨 2.0cm",
          "qty": 3,
          "unit": "片",
          "lotNo": "LOT-寄贈肋軟2607-92",
          "expDate": "2028-07-28"
        },
        {
          "name": "寄贈肋軟骨 2.5cm",
          "qty": 17,
          "unit": "片",
          "lotNo": "LOT-寄贈肋軟2607-04",
          "expDate": "2028-07-28"
        },
        {
          "name": "寄贈肋軟骨 3.0cm",
          "qty": 16,
          "unit": "片",
          "lotNo": "LOT-寄贈肋軟2607-02",
          "expDate": "2028-07-28"
        },
        {
          "name": "寄贈肋軟骨 3.5cm",
          "qty": 6,
          "unit": "片",
          "lotNo": "LOT-寄贈肋軟2607-90",
          "expDate": "2028-07-28"
        },
        {
          "name": "Pure cain plus cream",
          "qty": 20,
          "unit": "個",
          "lotNo": "LOT-PURE2607-01",
          "expDate": "2028-07-28"
        },
        {
          "name": "PROFHILO STRUCTURA（サンプル）",
          "qty": 3,
          "unit": "本",
          "lotNo": "LOT-PROF2607-05",
          "expDate": "2028-07-28"
        },
        {
          "name": "JALU PRO YOUNG EYE（サンプル）",
          "qty": 3,
          "unit": "本",
          "lotNo": "LOT-JALU2607-16",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 68,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/09/03 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/09/03 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/09/02 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 559339646212)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/09/02 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/31 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/30 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 2855854940)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/29 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000002591",
      "invoiceNo": "000002591",
      "batchId": "2026-07",
      "batchName": "7月受注分",
      "orderDate": "2026/07/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "875223127326",
      "sagawaTracking": "450502233355",
      "estimatedDelivery": "2026/08/21",
      "actualDelivery": "2026/08/21 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-JUVE2607-55",
          "expDate": "2028-07-28"
        },
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 10,
          "unit": "箱",
          "lotNo": "LOT-PRXT2607-02",
          "expDate": "2028-07-28"
        }
      ],
      "totalQty": 80,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/21 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/21 08:30",
          "location": "FedEx 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "FedEx 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/20 15:00",
          "location": "FedEx 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 450502233355)",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/20 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/18 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "FedEx 国際航空輸送中 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送中",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/17 16:30",
          "location": "SG倉庫",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷完了 (追跡番号: 875223127326)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/16 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000002395",
      "invoiceNo": "000002395",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/29 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "1643311132",
      "sagawaTracking": "032840995635",
      "estimatedDelivery": "2026/08/26",
      "actualDelivery": "2026/08/26 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-JUVE2606-83",
          "expDate": "2028-06-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-75",
          "expDate": "2028-06-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-57",
          "expDate": "2028-06-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-20",
          "expDate": "2028-06-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 20,
          "unit": "個",
          "lotNo": "LOT-STAR2606-80",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 750,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/26 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/26 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/25 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 032840995635)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/25 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/23 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/22 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 1643311132)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/21 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/29 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002395（備考: 000002395: StarCain Plus Cream 10個入荷不可→Pure Cain Plusに変更）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000002337",
      "invoiceNo": "000002337",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/23 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "875910661840",
      "sagawaTracking": "144251560627",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 400,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-80",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-18070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-91",
          "expDate": "2028-06-28"
        },
        {
          "name": "cellREDM（サンプル）",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-CELL2606-84",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 407,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "FedEx 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "FedEx 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "FedEx 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 144251560627)",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "FedEx 国際航空輸送中 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送中",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷完了 (追跡番号: 875910661840)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000002284",
      "invoiceNo": "000002284",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/18 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "8804543091",
      "sagawaTracking": "032840995635",
      "estimatedDelivery": "2026/08/26",
      "actualDelivery": "2026/08/26 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PROFHILO",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-PROF2606-16",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-93",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-66",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 50,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/26 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/26 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/25 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 032840995635)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/25 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/23 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/22 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 8804543091)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/21 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000002115",
      "invoiceNo": "000002115",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/11 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "9412718100",
      "sagawaTracking": "144251560627",
      "estimatedDelivery": "2026/06/28",
      "actualDelivery": "2026/06/28 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "JUVELOOK",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-JUVE2606-83",
          "expDate": "2028-06-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2606-80",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-27040C",
          "qty": 4,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-66",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 15,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-93",
          "expDate": "2028-06-28"
        },
        {
          "name": "Mirror Cannula MC-18070",
          "qty": 4,
          "unit": "本",
          "lotNo": "LOT-MIRR2606-91",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 103,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/28 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/28 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/27 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 144251560627)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/27 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/25 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/24 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 9412718100)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/23 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000002036",
      "invoiceNo": "000002036",
      "batchId": "2026-06",
      "batchName": "6月受注分",
      "orderDate": "2026/06/09 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "875707467060",
      "sagawaTracking": "032840995635",
      "estimatedDelivery": "2026/08/17",
      "actualDelivery": "2026/08/17 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 500,
          "unit": "本",
          "lotNo": "LOT-BOTU2606-89",
          "expDate": "2028-06-28"
        },
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 400,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-80",
          "expDate": "2028-06-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-NEUR2606-57",
          "expDate": "2028-06-28"
        },
        {
          "name": "PLURYAL DENSIFY",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-PLUR2606-23",
          "expDate": "2028-06-28"
        },
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-HYAC2606-57",
          "expDate": "2028-06-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2606-80",
          "expDate": "2028-06-28"
        }
      ],
      "totalQty": 1410,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/17 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/17 08:30",
          "location": "FedEx 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "FedEx 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/16 15:00",
          "location": "FedEx 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 032840995635)",
          "operator": "FedEx 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/16 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/14 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "FedEx 国際航空輸送中 (→ NRT)",
          "desc": "FedEx 国際便にて成田国際空港へ輸送中",
          "operator": "FedEx Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/13 16:30",
          "location": "SG倉庫",
          "title": "FedEx 集荷・国際輸送受付",
          "desc": "FedExにて集荷完了 (追跡番号: 875707467060)",
          "operator": "FedEx Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/12 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/06/09 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000002036（備考: 000002036: Botulax 200u 韓国に在庫保管）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-05": [
    {
      "id": "TA-000001800",
      "invoiceNo": "000001800",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/21 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "4758862207",
      "sagawaTracking": "350953756174",
      "estimatedDelivery": "2026/08/22",
      "actualDelivery": "2026/08/22 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-PLUR2605-10",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-28",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-37",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-57",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-47",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 780,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/08/22 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/08/22 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/08/21 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 350953756174)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/08/21 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/08/19 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/08/18 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 4758862207)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/08/17 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000001607",
      "invoiceNo": "000001607",
      "batchId": "2026-05",
      "batchName": "5月受注分",
      "orderDate": "2026/05/19 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "8438167975",
      "sagawaTracking": "794963919946",
      "estimatedDelivery": "2026/07/20",
      "actualDelivery": "2026/07/20 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 80,
          "unit": "本",
          "lotNo": "LOT-PLUR2605-10",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-28",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 80,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-37",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-57",
          "expDate": "2028-05-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2605-47",
          "expDate": "2028-05-28"
        },
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2605-41",
          "expDate": "2028-05-28"
        },
        {
          "name": "Mirror Cannula MC-25050C",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2605-18",
          "expDate": "2028-05-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2605-01",
          "expDate": "2028-05-28"
        },
        {
          "name": "JUVELOOK（サンプル）",
          "qty": 9,
          "unit": "本",
          "lotNo": "LOT-JUVE2605-58",
          "expDate": "2028-05-28"
        }
      ],
      "totalQty": 739,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/07/20 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/07/20 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/07/19 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 794963919946)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/07/19 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/07/17 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/07/16 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 8438167975)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/07/15 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/05/19 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001607（備考: 000001607: JUVELOOK 9本 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    }
  ],
  "2026-04": [
    {
      "id": "TA-000001421",
      "invoiceNo": "000001421",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/30 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "3596531948",
      "sagawaTracking": "846248181370",
      "estimatedDelivery": "2026/06/29",
      "actualDelivery": "2026/06/29 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-03",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-14",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-84",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-44",
          "expDate": "2028-04-28"
        },
        {
          "name": "PLURYAL DENSIFY",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-PLUR2604-13",
          "expDate": "2028-04-28"
        },
        {
          "name": "Botulax 200u",
          "qty": 500,
          "unit": "本",
          "lotNo": "LOT-BOTU2604-07",
          "expDate": "2028-04-28"
        },
        {
          "name": "PROFHILO",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-PROF2604-13",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 1080,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/29 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/29 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/28 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 846248181370)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/28 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/26 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/25 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3596531948)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/24 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000001347",
      "invoiceNo": "000001347",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/27 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "7685330147",
      "sagawaTracking": "692137351915",
      "estimatedDelivery": "2026/05/12",
      "actualDelivery": "2026/05/12 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-25050C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-78",
          "expDate": "2028-04-28"
        },
        {
          "name": "LHALA PEEL",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-LHAL2604-19",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 13,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/12 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/12 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/11 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 692137351915)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/11 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/09 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/08 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 7685330147)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/07 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000001318",
      "invoiceNo": "000001318",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/23 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "3596531948",
      "sagawaTracking": "846248181370",
      "estimatedDelivery": "2026/06/24",
      "actualDelivery": "2026/06/24 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-03",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 30,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-14",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-84",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-44",
          "expDate": "2028-04-28"
        },
        {
          "name": "PLURYAL DENSIFY",
          "qty": 70,
          "unit": "本",
          "lotNo": "LOT-PLUR2604-13",
          "expDate": "2028-04-28"
        },
        {
          "name": "Rejuran HB(Plus)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-REJU2604-31",
          "expDate": "2028-04-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2604-98",
          "expDate": "2028-04-28"
        },
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 8,
          "unit": "箱",
          "lotNo": "LOT-PRXT2604-47",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 768,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/24 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/24 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/23 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 846248181370)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/23 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/21 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/20 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3596531948)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/19 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000001127",
      "invoiceNo": "000001127",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/14 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "7685330147",
      "sagawaTracking": "692137351915",
      "estimatedDelivery": "2026/05/15",
      "actualDelivery": "2026/05/15 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "HYAcorp Body Contouring MLF2(1×10ml)",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-HYAC2604-75",
          "expDate": "2028-04-28"
        },
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 20,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-08",
          "expDate": "2028-04-28"
        },
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-67",
          "expDate": "2028-04-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2604-98",
          "expDate": "2028-04-28"
        },
        {
          "name": "HYAcorp Body Contouring MLF2（サンプル）",
          "qty": 2,
          "unit": "本",
          "lotNo": "LOT-HYAC2604-83",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 47,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/15 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/15 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/14 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 692137351915)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/14 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/12 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/11 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 7685330147)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/10 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
          "operator": "Number1 出荷担当"
        },
        {
          "step": "ORDERED",
          "time": "2026/04/14 10:00",
          "location": "楽々販売 受注管理",
          "title": "ご注文確定（楽々販売 受注）",
          "desc": "受注ID: 000001127（備考: 000001127: HYAcorp MLF2 ×2 サンプル）",
          "operator": "株式会社Number1 受注担当"
        }
      ]
    },
    {
      "id": "TA-000001008",
      "invoiceNo": "000001008",
      "batchId": "2026-04",
      "batchName": "4月受注分",
      "orderDate": "2026/04/06 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "3596531948",
      "sagawaTracking": "846248181370",
      "estimatedDelivery": "2026/05/30",
      "actualDelivery": "2026/05/30 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-23070",
          "qty": 5,
          "unit": "本",
          "lotNo": "LOT-MIRR2604-67",
          "expDate": "2028-04-28"
        },
        {
          "name": "StarCain Plus Cream",
          "qty": 10,
          "unit": "個",
          "lotNo": "LOT-STAR2604-98",
          "expDate": "2028-04-28"
        },
        {
          "name": "PLURYAL DENSIFY",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PLUR2604-13",
          "expDate": "2028-04-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2604-44",
          "expDate": "2028-04-28"
        }
      ],
      "totalQty": 165,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/30 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/30 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/29 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 846248181370)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/29 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/27 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/26 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3596531948)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000948",
      "invoiceNo": "000000948",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/31 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "9930027370",
      "sagawaTracking": "185067316357",
      "estimatedDelivery": "2026/05/26",
      "actualDelivery": "2026/05/26 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "PLURYAL DENSIFY",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-PLUR2603-14",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-95",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-51",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-75",
          "expDate": "2028-03-28"
        },
        {
          "name": "Botulax 200u",
          "qty": 500,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-23",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 900,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/26 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/26 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/25 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 185067316357)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/25 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/23 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/22 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 9930027370)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/21 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000845",
      "invoiceNo": "000000845",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/24 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "5342217136",
      "sagawaTracking": "619612398371",
      "estimatedDelivery": "2026/05/15",
      "actualDelivery": "2026/05/15 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-95",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-51",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-75",
          "expDate": "2028-03-28"
        },
        {
          "name": "PRX-T33(マッサージピール)",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-PRXT2603-85",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 303,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/15 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/15 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/14 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 619612398371)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/14 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/12 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/11 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 5342217136)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/10 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000723",
      "invoiceNo": "000000723",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/17 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "9930027370",
      "sagawaTracking": "185067316357",
      "estimatedDelivery": "2026/05/30",
      "actualDelivery": "2026/05/30 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-23",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-51",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Classic(Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-95",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-75",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 450,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/30 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/30 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/29 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 185067316357)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/29 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/27 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/26 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 9930027370)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000650",
      "invoiceNo": "000000650",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "5342217136",
      "sagawaTracking": "619612398371",
      "estimatedDelivery": "2026/06/29",
      "actualDelivery": "2026/06/29 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-27",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis light (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-95",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-51",
          "expDate": "2028-03-28"
        },
        {
          "name": "Mirror Cannula MC-25040C",
          "qty": 10,
          "unit": "本",
          "lotNo": "LOT-MIRR2603-33",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 210,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/06/29 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/06/29 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/06/28 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 619612398371)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/06/28 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/06/26 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/06/25 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 5342217136)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/06/24 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000574",
      "invoiceNo": "000000574",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/05 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "9930027370",
      "sagawaTracking": "185067316357",
      "estimatedDelivery": "2026/05/30",
      "actualDelivery": "2026/05/30 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2603-23",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-27",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-51",
          "expDate": "2028-03-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 150,
          "unit": "本",
          "lotNo": "LOT-NEUR2603-75",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 650,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/05/30 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/05/30 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/05/29 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 185067316357)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/05/29 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/05/27 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/05/26 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 9930027370)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/05/25 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000509",
      "invoiceNo": "000000509",
      "batchId": "2026-03",
      "batchName": "3月受注分",
      "orderDate": "2026/03/02 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "5342217136",
      "sagawaTracking": "619612398371",
      "estimatedDelivery": "2026/03/15",
      "actualDelivery": "2026/03/15 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Mirror Cannula MC-18050",
          "qty": 4,
          "unit": "本",
          "lotNo": "LOT-MIRR2603-81",
          "expDate": "2028-03-28"
        }
      ],
      "totalQty": 4,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/15 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/15 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/03/14 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 619612398371)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/03/14 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/03/12 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/03/11 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 5342217136)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/03/10 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000443",
      "invoiceNo": "000000443",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/26 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "3042228590",
      "sagawaTracking": "448690750143",
      "estimatedDelivery": "2026/04/21",
      "actualDelivery": "2026/04/21 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-53",
          "expDate": "2028-02-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-06",
          "expDate": "2028-02-28"
        },
        {
          "name": "PINK GLOW",
          "qty": 30,
          "unit": "箱",
          "lotNo": "LOT-PINK2602-61",
          "expDate": "2028-02-28"
        },
        {
          "name": "JALUPRO SUPER HYDRO",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-JALU2602-76",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 230,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/21 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/21 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/20 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 448690750143)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/20 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/18 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/17 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3042228590)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/16 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000332",
      "invoiceNo": "000000332",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/19 10:00",
      "clinicId": "TA-SHINJUKU",
      "clinicName": "新宿TAクリニック",
      "clinicNameEn": "SHINJUKU TA CLINIC",
      "doctor": "嶽崎 元彦",
      "doctorEn": "MOTOHIKO TAKESAKI",
      "tel": "0120-229-239",
      "zip": "160-0023",
      "address": "東京都新宿区西新宿（※モック住所・楽々販売に未登録）",
      "addressEn": "Nishi-Shinjuku, Shinjuku-ku, Tokyo (MOCK ADDRESS)",
      "email": "o@9clinic.net",
      "region": "関東",
      "hub": "NRT",
      "hubName": "成田国際空港 (NRT)",
      "status": "DELIVERED",
      "fedexTracking": "3954768288",
      "sagawaTracking": "179961275419",
      "estimatedDelivery": "2026/04/14",
      "actualDelivery": "2026/04/14 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Botulax 200u",
          "qty": 300,
          "unit": "本",
          "lotNo": "LOT-BOTU2602-99",
          "expDate": "2028-02-28"
        },
        {
          "name": "Neuramis Deep (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-06",
          "expDate": "2028-02-28"
        },
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 100,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-26",
          "expDate": "2028-02-28"
        },
        {
          "name": "PINK GLOW（サンプル）",
          "qty": 3,
          "unit": "箱",
          "lotNo": "LOT-PINK2602-86",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 453,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/04/14 11:20",
          "location": "新宿TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "新宿TAクリニック 受付にて受領完了（※PINK GLOW（サンプル） は別送予定）",
          "operator": "新宿TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/04/14 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが新宿TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/04/13 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 179961275419)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/04/13 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/04/11 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/04/10 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3954768288)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/04/09 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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
      "id": "TA-000000124",
      "invoiceNo": "000000124",
      "batchId": "2026-02",
      "batchName": "2月受注分",
      "orderDate": "2026/02/12 10:00",
      "clinicId": "TA-GINZA",
      "clinicName": "銀座TAクリニック",
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
      "fedexTracking": "3042228590",
      "sagawaTracking": "448690750143",
      "estimatedDelivery": "2026/03/01",
      "actualDelivery": "2026/03/01 11:20",
      "recipientName": "嶽崎 元彦",
      "items": [
        {
          "name": "Neuramis Volume (Lido)",
          "qty": 50,
          "unit": "本",
          "lotNo": "LOT-NEUR2602-26",
          "expDate": "2028-02-28"
        },
        {
          "name": "Botulax 200u",
          "qty": 200,
          "unit": "本",
          "lotNo": "LOT-BOTU2602-99",
          "expDate": "2028-02-28"
        }
      ],
      "totalQty": 250,
      "timeline": [
        {
          "step": "DELIVERED",
          "time": "2026/03/01 11:20",
          "location": "銀座TAクリニック",
          "title": "クリニック到着・受領完了",
          "desc": "銀座TAクリニック 受付にて受領完了",
          "operator": "銀座TAクリニック 受付"
        },
        {
          "step": "OUT_FOR_DELIVERY",
          "time": "2026/03/01 08:30",
          "location": "DHL 東京サービスセンター",
          "title": "国内配達中",
          "desc": "担当ドライバーが銀座TAクリニックへ配達中",
          "operator": "DHL 配達員"
        },
        {
          "step": "SAGAWA_HANDOVER",
          "time": "2026/02/28 15:00",
          "location": "DHL 成田ゲートウェイ",
          "title": "通関完了・国内配送引継",
          "desc": "輸入通関許可。国内配送へ引継 (国内追跡番号: 448690750143)",
          "operator": "DHL 国内配送"
        },
        {
          "step": "CUSTOMS_CLEARANCE",
          "time": "2026/02/28 09:40",
          "location": "成田国際空港 (NRT) 貨物地区",
          "title": "成田到着・輸入通関",
          "desc": "成田国際空港 (NRT) 到着。薬監証明（輸入確認）に基づき通関手続き",
          "operator": "成田税関"
        },
        {
          "step": "IN_TRANSIT_INTL",
          "time": "2026/02/26 01:40",
          "location": "SG倉庫 ➔ NRT 国際フライト",
          "title": "DHL 国際航空輸送中 (→ NRT)",
          "desc": "DHL 国際便にて成田国際空港へ輸送中",
          "operator": "DHL Aviation"
        },
        {
          "step": "FEDEX_DISPATCHED",
          "time": "2026/02/25 16:30",
          "location": "SG倉庫",
          "title": "DHL 集荷・国際輸送受付",
          "desc": "DHLにて集荷完了 (追跡番号: 3042228590)",
          "operator": "DHL Express"
        },
        {
          "step": "PREPARING",
          "time": "2026/02/24 11:00",
          "location": "SG倉庫",
          "title": "仕入先発注・検品梱包",
          "desc": "SG倉庫にて検品・梱包完了",
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

export function getFedexTrackingUrl(tracking: string): string {
  if (!tracking) return '#';
  const clean = tracking.replace(/[^0-9]/g, '');
  // 10桁はDHL、12桁はFedEx
  if (clean.length === 10) return `https://www.dhl.com/jp-ja/home/tracking.html?tracking-id=${clean}`;
  return `https://www.fedex.com/fedextrack/?trknbr=${clean}`;
}

export function getSagawaTrackingUrl(tracking: string): string {
  if (!tracking) return '#';
  const clean = tracking.replace(/[^0-9]/g, '');
  if (clean.length === 10) return `https://www.dhl.com/jp-ja/home/tracking.html?tracking-id=${clean}`;
  return `https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${clean}`;
}
