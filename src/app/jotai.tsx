import { atom } from "jotai";

const initialCosts = [
  "賃料",
  "日割り家賃",
  "敷金",
  "礼金（税込）",
  "保証金・解約引",
  "共益費（税込）",
  "駐車場利用料",
  "駐車場保証金",
  "駐車場礼金",
  "バイク置場利用料",
  "駐輪場利用料",
  "更新料・更新事務手数料",
  "鍵交換費用",
  "室内消毒費用",
  "24時間駆け付けサポート",
  "電子ロック初期費用",
  "CATV",
  "月額保証料/保険料",
  "カードキー発行手数料",
  "初回保証料 ",
  "月次保証料",
  "仲介手数料",
].map((item) => ({
  項目: item,
  金額: process.env.NEXT_PUBLIC_APP_ENV === "development" ? 1000 : 0,
  単位: "円",
  初期費用: false,
  月次費用: false,
  初期費用合計: process.env.NEXT_PUBLIC_APP_ENV === "development" ? 1000 : 0,
  月次費用合計: process.env.NEXT_PUBLIC_APP_ENV === "development" ? 1000 : 0,
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

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

export const contactFormAtom = atom<ContactFormState>({
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
    creationDate: "",
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
});
