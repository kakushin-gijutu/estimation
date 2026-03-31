import { getSupabase } from "./supabase";
import type { CompanyRow, CompanyInsert, CompanyUpdate } from "./database.types";

export async function getCompanies() {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as CompanyRow[];
}

export async function getCompany(id: string) {
  const { data, error } = await getSupabase()
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as CompanyRow;
}

export async function createCompany(company: CompanyInsert) {
  const { data, error } = await getSupabase()
    .from("companies")
    .insert(company)
    .select()
    .single();

  if (error) throw error;
  return data as CompanyRow;
}

export async function updateCompany(id: string, company: CompanyUpdate) {
  const { data, error } = await getSupabase()
    .from("companies")
    .update(company)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CompanyRow;
}

export async function deleteCompany(id: string) {
  const { error } = await getSupabase().from("companies").delete().eq("id", id);
  if (error) throw error;
}
