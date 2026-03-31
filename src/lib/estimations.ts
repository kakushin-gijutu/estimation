import { getSupabase } from "./supabase";
import type {
  EstimationRow,
  EstimationInsert,
  EstimationUpdate,
  EstimationStatus,
  CostItem,
} from "./database.types";

export async function getEstimations() {
  const { data, error } = await getSupabase()
    .from("estimations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as EstimationRow[];
}

export async function getEstimation(id: string) {
  const { data, error } = await getSupabase()
    .from("estimations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as EstimationRow;
}

export async function createEstimation(estimation: EstimationInsert) {
  const { data, error } = await getSupabase()
    .from("estimations")
    .insert(estimation)
    .select()
    .single();

  if (error) throw error;
  return data as EstimationRow;
}

export async function updateEstimation(id: string, estimation: EstimationUpdate) {
  const { data, error } = await getSupabase()
    .from("estimations")
    .update(estimation)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as EstimationRow;
}

export async function deleteEstimation(id: string) {
  const { error } = await getSupabase().from("estimations").delete().eq("id", id);

  if (error) throw error;
}

export function formToDbRow(form: {
  customer: { name: string };
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
  costs: CostItem[];
  remarks: string;
  status?: string;
}): EstimationInsert {
  const initialTotal = form.costs.reduce((acc, c) => acc + c.初期費用合計, 0);
  const monthlyTotal = form.costs.reduce((acc, c) => acc + c.月次費用合計, 0);

  return {
    customer_name: form.customer.name,
    broker_name: form.broker.name,
    broker_company_name: form.broker.company_name,
    broker_tel: form.broker.tel,
    broker_fax: form.broker.fax,
    broker_email: form.broker.email,
    broker_address: form.broker.address,
    broker_license: form.broker.license,
    property_name: form.property.name,
    property_type: form.property.type,
    creation_date: form.property.creationDate,
    expiration_date: form.property.expirationDate,
    move_in_date: form.property.moveInDate,
    contract_period: form.property.contractPeriod,
    contract_renewal_fee: form.property.contractRenewalFee,
    basic_rent: form.property.basicRent,
    management_fee: form.property.managementFee,
    parking_fee: form.property.parkingFee,
    initial_guarantee_fee: form.property.initialGuaranteeFee,
    monthly_guarantee_fee: form.property.monthlyGuaranteeFee,
    costs: form.costs,
    remarks: form.remarks,
    status: (form.status as EstimationStatus) || "draft",
    initial_total: initialTotal,
    monthly_total: monthlyTotal,
  };
}

export function dbRowToForm(row: EstimationRow) {
  return {
    customer: { name: row.customer_name },
    broker: {
      name: row.broker_name,
      company_name: row.broker_company_name,
      tel: row.broker_tel,
      fax: row.broker_fax,
      email: row.broker_email,
      address: row.broker_address,
      license: row.broker_license,
    },
    property: {
      name: row.property_name,
      type: row.property_type,
      creationDate: row.creation_date,
      expirationDate: row.expiration_date,
      moveInDate: row.move_in_date,
      contractPeriod: row.contract_period,
      contractRenewalFee: row.contract_renewal_fee,
      basicRent: row.basic_rent,
      managementFee: row.management_fee,
      parkingFee: row.parking_fee,
      initialGuaranteeFee: row.initial_guarantee_fee,
      monthlyGuaranteeFee: row.monthly_guarantee_fee,
    },
    costs: row.costs,
    remarks: row.remarks,
  };
}
