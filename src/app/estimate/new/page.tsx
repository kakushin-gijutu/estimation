"use client";

import { EstimateForm } from "@/components/EstimateForm";
import { getDefaultFormState } from "@/app/jotai";

export default function NewEstimatePage() {
  return <EstimateForm initialData={getDefaultFormState()} />;
}
