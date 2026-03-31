export type EstimationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type CostItem = {
  項目: string;
  金額: number;
  単位: string;
  初期費用: boolean;
  月次費用: boolean;
  初期費用合計: number;
  月次費用合計: number;
  備考: string;
};

export type EstimationRow = {
  id: string;
  customer_name: string;
  broker_name: string;
  broker_company_name: string;
  broker_tel: string;
  broker_fax: string;
  broker_email: string;
  broker_address: string;
  broker_license: string;
  property_name: string;
  property_type: string;
  creation_date: string;
  expiration_date: string;
  move_in_date: string;
  contract_period: string;
  contract_renewal_fee: number;
  basic_rent: number;
  management_fee: number;
  parking_fee: number;
  initial_guarantee_fee: number;
  monthly_guarantee_fee: number;
  costs: CostItem[];
  remarks: string;
  status: EstimationStatus;
  initial_total: number;
  monthly_total: number;
  created_at: string;
  updated_at: string;
};

export type EstimationInsert = Omit<EstimationRow, "id" | "created_at" | "updated_at">;
export type EstimationUpdate = Partial<EstimationInsert>;

export type CompanyType = "company" | "individual";

export type CompanyRow = {
  id: string;
  name: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  license: string;
  representative_name: string;
  type: CompanyType;
  created_at: string;
  updated_at: string;
};

export type CompanyInsert = Omit<CompanyRow, "id" | "created_at" | "updated_at">;
export type CompanyUpdate = Partial<CompanyInsert>;

export type Database = {
  public: {
    Tables: {
      estimations: {
        Row: EstimationRow;
        Insert: EstimationInsert;
        Update: EstimationUpdate;
      };
      companies: {
        Row: CompanyRow;
        Insert: CompanyInsert;
        Update: CompanyUpdate;
      };
    };
  };
};
