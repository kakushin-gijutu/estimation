"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EstimationRow, EstimationStatus } from "@/lib/database.types";
import { getEstimations, deleteEstimation, updateEstimation } from "@/lib/estimations";

const statusLabels: Record<EstimationStatus, string> = {
  draft: "下書き",
  sent: "送付済",
  accepted: "成約",
  rejected: "不成約",
  expired: "期限切れ",
};

const statusColors: Record<EstimationStatus, string> = {
  draft: "bg-gray-200 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-yellow-100 text-yellow-700",
};

export default function Dashboard() {
  const router = useRouter();
  const [estimations, setEstimations] = useState<EstimationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [configError, setConfigError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getEstimations();
      setEstimations(data);
      setConfigError(null);
    } catch (e: any) {
      if (e?.message?.includes("Supabaseが未設定")) {
        setConfigError(e.message);
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("この見積書を削除しますか？")) return;
    await deleteEstimation(id);
    load();
  };

  const handleStatusChange = async (id: string, status: EstimationStatus) => {
    await updateEstimation(id, { status });
    load();
  };

  const filtered = estimations.filter((e) => {
    const matchSearch =
      !search ||
      e.customer_name.includes(search) ||
      e.property_name.includes(search) ||
      e.broker_company_name.includes(search);
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalInitial = filtered.reduce((acc, e) => acc + e.initial_total, 0);
  const totalMonthly = filtered.reduce((acc, e) => acc + e.monthly_total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {configError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">Supabase 未設定</h2>
            <p className="text-sm text-yellow-700 mb-3">{configError}</p>
            <div className="bg-white rounded p-4 text-xs font-mono text-gray-700">
              <p className="mb-1"># .env.local に以下を追加:</p>
              <p>NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...</p>
              <p className="mt-2 mb-1"># その後、Supabase SQL Editor で以下を実行:</p>
              <p>supabase/migration.sql</p>
            </div>
          </div>
        )}
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">総件数</p>
            <p className="text-2xl font-bold">{filtered.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">下書き</p>
            <p className="text-2xl font-bold">
              {filtered.filter((e) => e.status === "draft").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">初期費用合計</p>
            <p className="text-2xl font-bold">
              ¥{totalInitial.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500">月額費用合計</p>
            <p className="text-2xl font-bold">
              ¥{totalMonthly.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="顧客名・物件名・会社名で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-white"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="draft">下書き</SelectItem>
              <SelectItem value="sent">送付済</SelectItem>
              <SelectItem value="accepted">成約</SelectItem>
              <SelectItem value="rejected">不成約</SelectItem>
              <SelectItem value="expired">期限切れ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">読み込み中...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {estimations.length === 0
                ? "見積書がまだありません。「新規作成」から作成してください。"
                : "条件に一致する見積書がありません。"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs">ステータス</TableHead>
                  <TableHead className="text-xs">顧客名</TableHead>
                  <TableHead className="text-xs">物件名</TableHead>
                  <TableHead className="text-xs text-right">初期費用</TableHead>
                  <TableHead className="text-xs text-right">月額費用</TableHead>
                  <TableHead className="text-xs">作成日</TableHead>
                  <TableHead className="text-xs">更新日</TableHead>
                  <TableHead className="text-xs text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((est) => (
                  <TableRow key={est.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Select
                        value={est.status}
                        onValueChange={(val) =>
                          handleStatusChange(est.id, val as EstimationStatus)
                        }
                      >
                        <SelectTrigger className="h-7 w-[110px] border-0 p-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${statusColors[est.status]}`}
                          >
                            {statusLabels[est.status]}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(statusLabels) as EstimationStatus[]).map(
                            (s) => (
                              <SelectItem key={s} value={s}>
                                {statusLabels[s]}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {est.customer_name || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {est.property_name || "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      ¥{est.initial_total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      ¥{est.monthly_total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(est.created_at).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(est.updated_at).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() =>
                            router.push(`/estimate/${est.id}/preview`)
                          }
                        >
                          表示
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() =>
                            router.push(`/estimate/${est.id}/edit`)
                          }
                        >
                          編集
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(est.id)}
                        >
                          削除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

// Remove unused import warnings - router.push for companies/new moved to sidebar
