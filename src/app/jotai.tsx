import { atom } from "jotai";

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

// 項目名, 初期費用フラグ, 月次費用フラグ
const costItems: [string, boolean, boolean][] = [
  ["賃料", true, true],
  ["日割り家賃", true, false],
  ["敷金", true, false],
  ["礼金（税込）", true, false],
  ["初回賃貸保証料", true, false],
  ["ホームクリーニング代", true, false],
  ["鍵交換費用(税込)", true, false],
  ["月額保証料", false, true],
  ["仲介手数料", true, false],
];

// GUIから追加可能な項目のプリセット
// [項目名, 初期費用フラグ, 月次費用フラグ]
export const additionalCostPresets: [string, boolean, boolean][] = [
  // 賃料・家賃関連
  ["共益費（税込）", true, true],
  ["管理費", false, true],
  ["日割り共益費", true, false],
  ["日割り管理費", true, false],
  ["前家賃", true, false],
  ["前共益費", true, false],

  // 敷金・保証金・礼金関連
  ["保証金", true, false],
  ["保証金・解約引", true, false],
  ["償却費", true, false],
  ["敷引き", true, false],

  // 駐車場関連
  ["駐車場利用料", true, true],
  ["駐車場保証金", true, false],
  ["駐車場礼金", true, false],
  ["駐車場仲介手数料", true, false],
  ["日割り駐車場代", true, false],
  ["前駐車場代", true, false],

  // 駐輪・バイク関連
  ["バイク置場利用料", false, true],
  ["駐輪場利用料", false, true],
  ["バイク置場保証金", true, false],

  // 保証会社関連
  ["月額保証料/保険料", false, true],
  ["月次保証料", false, true],
  ["保証会社更新料", false, false],

  // 保険関連
  ["火災保険料", true, false],
  ["家財保険料", true, false],
  ["賃貸保険料", true, false],
  ["地震保険料", true, false],

  // 鍵・セキュリティ関連
  ["電子ロック初期費用", true, false],
  ["カードキー発行手数料", true, false],
  ["スマートロック設置費", true, false],
  ["セキュリティ設備費", true, false],
  ["防犯カメラ利用料", false, true],

  // クリーニング・消毒関連
  ["室内消毒費用", true, false],
  ["エアコン洗浄費", true, false],
  ["害虫駆除費", true, false],
  ["美装費", true, false],

  // サポート・サービス関連
  ["24時間駆け付けサポート", true, true],
  ["安心サポート費", true, false],
  ["コンシェルジュサービス", false, true],
  ["インターネット利用料", false, true],
  ["Wi-Fi利用料", false, true],
  ["CATV", false, true],
  ["町会費", false, true],
  ["自治会費", false, true],
  ["水道料", false, true],
  ["浄化槽維持管理費", false, true],
  ["トランクルーム利用料", false, true],

  // 契約・事務関連
  ["更新料", false, false],
  ["更新事務手数料", false, false],
  ["更新料・更新事務手数料", false, false],
  ["契約事務手数料", true, false],
  ["書類作成費", true, false],
  ["IT重説対応費", true, false],
  ["簡易消火器費", true, false],

  // 退去・原状回復関連
  ["退去時クリーニング費（前払い）", true, false],
  ["原状回復費（前払い）", true, false],
  ["短期解約違約金", false, false],

  // その他
  ["入居サポート費", true, false],
  ["引越し紹介手数料", true, false],
  ["ライフライン手配費", true, false],
  ["抗菌コーティング費", true, false],
  ["フロアコーティング費", true, false],
  ["除菌・消臭施工費", true, false],
  ["家具家電レンタル", false, true],
  ["ペット飼育費（敷金加算）", true, false],
  ["ペット月額管理費", false, true],
  ["楽器使用料", false, true],
  ["事務所使用料", false, true],
  ["看板設置費", true, false],
];

const initialCosts = costItems.map(([項目, 初期費用Default, 月次費用Default]) => ({
  項目,
  金額: isDev ? 1000 : 0,
  単位: "円",
  初期費用: isDev ? 初期費用Default : false,
  月次費用: isDev ? 月次費用Default : false,
  初期費用合計: isDev ? 1000 : 0,
  月次費用合計: isDev ? 1000 : 0,
  備考: "",
}));

export type ContactFormState = {
  customer: {
    name: string;
  };
  broker: {
    name: string;
    company_name: string;
    tel: string;
    fax: string;
    email: string;
    address: string;
    license: string;
  };
  property: {
    name: string;
    type: string;
    creationDate: string;
    expirationDate: string;
    moveInDate: string;
    contractPeriod: string;
    contractRenewalFee: number;
    basicRent: number;
    managementFee: number;
    parkingFee: number;
    initialGuaranteeFee: number;
    monthlyGuaranteeFee: number;
  };
  costs: Array<{
    項目: string;
    金額: number;
    単位: string;
    初期費用: boolean;
    月次費用: boolean;
    初期費用合計: number;
    月次費用合計: number;
    備考: string;
  }>;
  remarks: string;
};

const defaultFormState: ContactFormState = {
  customer: {
    name: isDev ? "ダミー顧客" : "",
  },
  broker: {
    name: "鯰江",
    company_name: "合同会社RHY",
    tel: isDev ? "000-0000-0000" : "",
    fax: isDev ? "000-0000-0000" : "",
    email: isDev ? "dummy@example.com" : "",
    address: "大阪府大阪市東成区深江北1-3-5三好ビル306",
    license: "大阪府知事(1)第65124号",
  },
  property: {
    name: isDev ? "Test物件" : "",
    type: isDev ? "マンション" : "",
    creationDate: isDev
      ? `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`
      : "",
    expirationDate: isDev ? "2024年7月10日" : "",
    moveInDate: isDev ? "2024年7月15日" : "",
    contractPeriod: isDev ? "2年" : "",
    contractRenewalFee: isDev ? 129000 : 0,
    basicRent: isDev ? 129000 : 0,
    managementFee: isDev ? 16000 : 0,
    parkingFee: isDev ? 14300 : 0,
    initialGuaranteeFee: isDev ? 35000 : 0,
    monthlyGuaranteeFee: isDev ? 1593 : 0,
  },
  costs: initialCosts,
  remarks: isDev
    ? "契約年数及び更新費用：当物件の契約年数は2年間とし、契約更新料は129000円となります。\n保証会社契約関連：保証会社契約金として初回契約時に35000円が必要となります。"
    : "",
};

export function getDefaultFormState(): ContactFormState {
  return JSON.parse(JSON.stringify(defaultFormState));
}

export const contactFormAtom = atom<ContactFormState>(defaultFormState);
