"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EstimateForm } from "@/components/EstimateForm";
import { getEstimation, dbRowToForm } from "@/lib/estimations";
import type { ContactFormState } from "@/app/jotai";

export default function EditEstimatePage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ContactFormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEstimation(id)
      .then((row) => setData(dbRowToForm(row)))
      .catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        エラー: {error}
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        読み込み中...
      </div>
    );

  return <EstimateForm initialData={data} estimationId={id} />;
}
