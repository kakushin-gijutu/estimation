"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEstimation } from "@/lib/estimations";
import type { EstimationRow } from "@/lib/database.types";

export default function PublicViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [value, setValue] = useState<EstimationRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEstimation(id)
      .then(setValue)
      .catch(() => setError("見積書が見つかりません"));
  }, [id]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {error}
      </div>
    );
  if (!value)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        読み込み中...
      </div>
    );

  const initialTotal = value.costs.reduce(
    (acc, cost) => acc + cost.初期費用合計,
    0
  );
  const monthlyTotal = value.costs.reduce(
    (acc, cost) => acc + cost.月次費用合計,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:py-0 print:px-0 print:min-h-0">
      {/* Print Button */}
      <div className="w-full max-w-[210mm] mx-auto mb-4 flex justify-end print:hidden">
        <Button
          size="sm"
          onClick={() => window.print()}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          PDF保存 / 印刷
        </Button>
      </div>

      {/* A4 Container */}
      <div className="w-full max-w-[210mm] mx-auto bg-white shadow-lg rounded-md overflow-hidden print:shadow-none print:rounded-none print:w-[210mm] print:min-h-[297mm] print:max-w-none">
        {/* Header */}
        <div className="bg-gray-800 text-white py-6 px-8 print:py-4 print:px-6">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1 uppercase">
            Estimation
          </p>
          <h1 className="text-2xl font-bold tracking-wider print:text-xl">
            御見積書
          </h1>
        </div>

        {/* Customer & Dates */}
        <div className="px-8 pt-6 pb-3 print:px-6 print:pt-4 print:pb-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-400 tracking-wider mb-1">
                宛名
              </p>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 pb-1 inline-block print:text-lg">
                {value.customer_name} 様
              </h2>
            </div>
            <div className="text-right text-xs text-gray-600 space-y-0.5">
              <p>作成日　{value.creation_date}</p>
              <p>有効期限　{value.expiration_date}</p>
            </div>
          </div>
        </div>

        {/* Property & Summary */}
        <div className="px-8 pb-4 print:px-6 print:pb-3">
          <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 print:mb-3">
            <p className="text-[10px] text-gray-400 tracking-wider mb-0.5">
              物件名
            </p>
            <p className="text-base font-semibold text-gray-800 print:text-sm">
              {value.property_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 print:mb-3">
            <div className="bg-gray-50 border border-gray-200 rounded p-4 print:p-3">
              <p className="text-[10px] text-gray-500 tracking-wider mb-1">
                初期費用（税込）
              </p>
              <p className="text-2xl font-bold text-gray-800 print:text-xl">
                ¥{initialTotal.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 print:p-3">
              <p className="text-[10px] text-gray-500 tracking-wider mb-1">
                月額費用（税込）
              </p>
              <p className="text-2xl font-bold text-gray-800 print:text-xl">
                ¥{monthlyTotal.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Contract Info & Broker Info */}
          <div className="grid grid-cols-2 gap-4 mb-4 print:mb-3">
            <div className="text-xs text-gray-600">
              <p className="text-[10px] text-gray-400 tracking-wider mb-1.5">
                契約情報
              </p>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-16 shrink-0">入居予定</span>
                  <span>{value.move_in_date}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-16 shrink-0">契約期間</span>
                  <span>{value.contract_period}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-16 shrink-0">更新料</span>
                  <span>
                    ¥{value.contract_renewal_fee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="text-[10px] text-gray-400 tracking-wider mb-1.5">
                取扱業者
              </p>
              <p className="text-sm font-bold text-gray-800 mb-0.5">
                {value.broker_company_name}
              </p>
              <div className="space-y-0 text-[10px] text-gray-500">
                <p>{value.broker_address}</p>
                <p>
                  TEL: {value.broker_tel}　FAX: {value.broker_fax}
                </p>
                <p>メール: {value.broker_email}</p>
                <p>免許: {value.broker_license}</p>
                <p>担当: {value.broker_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Table */}
        <div className="px-8 pb-4 print:px-6 print:pb-3">
          <div className="rounded border border-gray-200 overflow-hidden">
            <Table className="print:text-[11px]">
              <TableHeader>
                <TableRow className="bg-gray-700 hover:bg-gray-700">
                  <TableHead className="text-white font-medium text-[11px] py-2">項目</TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-right py-2">金額</TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-center py-2">単位</TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-center py-2">初期費用</TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-center py-2">月次費用</TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-right py-2">初期費用合計</TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-right py-2">月次費用合計</TableHead>
                  <TableHead className="text-white font-medium text-[11px] py-2">備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value.costs.map((item, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className="font-medium text-gray-700 py-1.5 text-xs">
                      {item.項目}
                    </TableCell>
                    <TableCell className="text-right tabular-nums py-1.5 text-xs">
                      {item.金額.toLocaleString()}円
                    </TableCell>
                    <TableCell className="text-center text-gray-500 py-1.5 text-xs">
                      {item.単位}
                    </TableCell>
                    <TableCell className="text-center py-1.5">
                      {item.初期費用 ? (
                        <span className="text-gray-700 font-bold text-xs">✓</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-1.5">
                      {item.月次費用 ? (
                        <span className="text-gray-700 font-bold text-xs">✓</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium py-1.5 text-xs">
                      {item.初期費用合計 > 0
                        ? `${item.初期費用合計.toLocaleString()}円`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium py-1.5 text-xs">
                      {item.月次費用合計 > 0
                        ? `${item.月次費用合計.toLocaleString()}円`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-[10px] py-1.5">
                      {item.備考}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Totals Row */}
            <div className="bg-gray-700 text-white px-4 py-2 flex justify-end gap-8 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">月額合計</span>
                <span className="text-base font-bold tabular-nums">
                  ¥{monthlyTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-medium">初期費用合計</span>
                <span className="text-lg font-bold tabular-nums">
                  ¥{initialTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="px-8 pb-4 print:px-6 print:pb-3">
          <div className="bg-gray-50 border border-gray-200 rounded p-4 print:p-3">
            <h3 className="text-[10px] tracking-wider text-gray-400 font-medium mb-1.5">
              備考・注意事項
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {value.remarks}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white py-3 px-8 text-center print:px-6">
          <p className="text-xs tracking-wider font-medium">
            {value.broker_company_name}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {value.broker_address}
          </p>
        </div>
      </div>
    </div>
  );
}
