"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getEstimation } from "@/lib/estimations";
import type { EstimationRow } from "@/lib/database.types";

type TemplateType = "estimate" | "reminder" | "thanks" | "update" | "expiring";

const templates: { value: TemplateType; label: string; description: string }[] =
  [
    {
      value: "estimate",
      label: "見積書送付",
      description: "初回の見積書送付メール",
    },
    {
      value: "update",
      label: "見積書更新",
      description: "内容を更新した旨のお知らせ",
    },
    {
      value: "reminder",
      label: "リマインド",
      description: "ご確認のお願い",
    },
    {
      value: "expiring",
      label: "期限間近",
      description: "有効期限が近い旨のお知らせ",
    },
    {
      value: "thanks",
      label: "成約お礼",
      description: "ご成約のお礼メール",
    },
  ];

function generateEmailSubject(
  template: TemplateType,
  data: EstimationRow
): string {
  const p = data.property_name || "";
  const c = data.customer_name || "";
  const subjects: Record<TemplateType, string> = {
    estimate: `【御見積書】${p}${c ? ` - ${c}様` : ""}`,
    update: `【更新】御見積書の内容を更新しました - ${p}`,
    reminder: `【リマインド】御見積書のご確認 - ${p}`,
    expiring: `【期限間近】御見積書の有効期限が近づいています - ${p}`,
    thanks: `【お礼】ご成約ありがとうございます - ${p}`,
  };
  return subjects[template];
}

function generateEmailBody(
  template: TemplateType,
  data: EstimationRow
): string {
  const customer = data.customer_name || "";
  const company = data.broker_company_name || "";
  const broker = data.broker_name || "";
  const property = data.property_name || "";
  const expDate = data.expiration_date || "";
  const initialTotal = data.costs
    .reduce((a, c) => a + c.初期費用合計, 0)
    .toLocaleString();
  const monthlyTotal = data.costs
    .reduce((a, c) => a + c.月次費用合計, 0)
    .toLocaleString();

  const bodyParts: Record<TemplateType, string> = {
    estimate: [
      `お世話になっております。${company}の${broker}でございます。`,
      "",
      "この度はお問い合わせいただきありがとうございます。",
      "下記物件の御見積書をお送りいたします。ご確認のほどよろしくお願いいたします。",
      "※ 御見積書のPDFも添付しておりますので、併せてご確認ください。",
    ].join("\n"),
    update: [
      `お世話になっております。${company}の${broker}でございます。`,
      "",
      "御見積書の内容を更新いたしましたのでお知らせいたします。",
      "最新の内容をご確認いただけますようお願いいたします。",
      "※ 最新の御見積書PDFも添付しております。",
    ].join("\n"),
    reminder: [
      `お世話になっております。${company}の${broker}でございます。`,
      "",
      "先日お送りいたしました御見積書につきまして、ご確認いただけましたでしょうか。",
      ...(expDate
        ? [`見積書の有効期限は${expDate}までとなっております。`]
        : []),
      "ご不明点等ございましたら、お気軽にお問い合わせください。",
    ].join("\n"),
    expiring: [
      `お世話になっております。${company}の${broker}でございます。`,
      "",
      "先日お送りいたしました御見積書の有効期限が近づいております。",
      ...(expDate ? [`有効期限: ${expDate}`] : []),
      "",
      "ご検討中の場合は、期限内にご連絡いただけますと幸いです。",
      "条件の変更等もご相談承りますので、お気軽にお声がけください。",
    ].join("\n"),
    thanks: [
      `お世話になっております。${company}の${broker}でございます。`,
      "",
      "この度はご成約いただき、誠にありがとうございます。",
      "今後のお手続きにつきましては、改めてご連絡させていただきます。",
      "ご不明点がございましたら、いつでもお問い合わせください。",
    ].join("\n"),
  };

  const lines: string[] = [];
  lines.push(`${customer} 様`);
  lines.push("");
  lines.push(bodyParts[template]);
  lines.push("");

  if (property) {
    lines.push(`【物件名】${property}`);
    lines.push("");
  }

  if (template !== "thanks") {
    lines.push(`  初期費用（税込）: ¥${initialTotal}`);
    lines.push(`  月額費用（税込）: ¥${monthlyTotal}`);
    lines.push("");
  }
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(company);
  if (data.broker_address)
    lines.push(`〒 ${data.broker_address}`);
  lines.push(`担当: ${broker}`);
  if (data.broker_tel)
    lines.push(
      `TEL: ${data.broker_tel}${data.broker_fax ? `  FAX: ${data.broker_fax}` : ""}`
    );
  if (data.broker_email) lines.push(`メール: ${data.broker_email}`);
  if (data.broker_license) lines.push(`免許: ${data.broker_license}`);
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");
  lines.push(`※ このメールは${company}より送信されています。`);

  return lines.join("\n");
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [value, setValue] = useState<EstimationRow | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // メール送信ステート
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [template, setTemplate] = useState<TemplateType>("estimate");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStep, setSendStep] = useState<"compose" | "confirm" | "done">(
    "compose"
  );
  const [sendResult, setSendResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    getEstimation(id)
      .then(setValue)
      .catch((e) => setError(e.message));
  }, [id]);

  const handleSendEmail = async () => {
    if (!emailTo || !value) return;
    setSending(true);
    setSendResult(null);
    try {
      const allRecipients = [
        emailTo,
        ...emailCc
          .split(/[,\s]+/)
          .map((s) => s.trim())
          .filter(Boolean),
      ];
      const initialTotal = value.costs.reduce(
        (a, c) => a + c.初期費用合計,
        0
      );
      const monthlyTotal = value.costs.reduce(
        (a, c) => a + c.月次費用合計,
        0
      );
      const res = await fetch("/api/send-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: allRecipients,
          estimationId: id,
          brokerCompanyName: value.broker_company_name,
          subject: emailSubject,
          emailBody,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult({ ok: true, message: "メールを送信しました" });
        setSendStep("done");
      } else {
        setSendResult({
          ok: false,
          message: data.error || "送信に失敗しました",
        });
      }
    } catch {
      setSendResult({ ok: false, message: "送信に失敗しました" });
    } finally {
      setSending(false);
    }
  };

  const resetEmail = () => {
    setShowEmailPanel(false);
    setSendStep("compose");
    setEmailTo("");
    setEmailCc("");
    setTemplate("estimate");
    setEmailSubject("");
    setEmailBody("");
    setSendResult(null);
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        エラー: {error}
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
      {/* Action Buttons */}
      <div className="w-full max-w-[210mm] mx-auto mb-4 flex justify-end gap-2 print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white px-4">
              操作メニュー ▾
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push(`/estimate/${id}/edit`)}>
              ✏️ 編集する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? "🔓 編集モード OFF" : "🔑 編集モード ON"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setShowEmailPanel(true);
                setSendStep("compose");
                if (!emailBody && value) {
                  setEmailSubject(generateEmailSubject("estimate", value));
                  setEmailBody(generateEmailBody("estimate", value));
                }
              }}
            >
              ✉️ メールで送信
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const originalTitle = document.title;
                document.title = `${value.customer_name}さま_見積書`;
                window.print();
                document.title = originalTitle;
              }}
            >
              🖨️ PDF出力 / 印刷
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/estimate")}>
              ← 一覧に戻る
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Email Panel */}
      {showEmailPanel && value && (
        <div className="w-full max-w-[210mm] mx-auto mb-4 print:hidden">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center">
              <h3 className="text-sm font-bold">見積書をメールで送信</h3>
              <button
                onClick={resetEmail}
                className="text-blue-200 hover:text-white text-xs"
              >
                ✕ 閉じる
              </button>
            </div>

            {sendStep === "compose" && (
              <div className="p-5 space-y-4">
                {/* 送信先 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">
                      送信先メールアドレス *
                    </Label>
                    <Input
                      type="email"
                      placeholder="customer@example.com"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">
                      CC（カンマ区切りで複数可）
                    </Label>
                    <Input
                      type="text"
                      placeholder="cc1@example.com, cc2@example.com"
                      value={emailCc}
                      onChange={(e) => setEmailCc(e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* テンプレート選択 */}
                <div>
                  <Label className="text-xs text-gray-500">
                    テンプレートを選択（本文が自動生成されます）
                  </Label>
                  <div className="grid grid-cols-5 gap-2 mt-1">
                    {templates.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          setTemplate(t.value);
                          setEmailSubject(
                            generateEmailSubject(t.value, value)
                          );
                          setEmailBody(generateEmailBody(t.value, value));
                        }}
                        className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                          template === t.value
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-medium text-gray-800">{t.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {t.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 件名 */}
                <div>
                  <Label className="text-xs text-gray-500">件名</Label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="メールの件名"
                    className="h-8 text-sm mt-1"
                  />
                </div>

                {/* メール本文エディタ */}
                <div>
                  <Label className="text-xs text-gray-500">
                    メール本文（自由に編集できます）
                  </Label>
                  <Textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="テンプレートを選択すると本文が自動生成されます"
                    className="text-sm mt-1 font-mono leading-relaxed resize-none"
                    style={{ minHeight: "320px" }}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetEmail}
                  >
                    キャンセル
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={() => setSendStep("confirm")}
                    disabled={!emailTo || !emailBody || !emailSubject}
                  >
                    確認画面へ →
                  </Button>
                </div>
              </div>
            )}

            {sendStep === "confirm" && (
              <div className="p-5 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800 mb-3">
                    以下の内容でメールを送信します。よろしいですか？
                  </p>
                  <div className="space-y-2 text-xs text-yellow-900">
                    <div className="flex gap-2">
                      <span className="text-yellow-600 w-24 shrink-0">
                        送信先:
                      </span>
                      <span className="font-medium">{emailTo}</span>
                    </div>
                    {emailCc && (
                      <div className="flex gap-2">
                        <span className="text-yellow-600 w-24 shrink-0">
                          CC:
                        </span>
                        <span>{emailCc}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="text-yellow-600 w-24 shrink-0">
                        件名:
                      </span>
                      <span className="font-medium">{emailSubject}</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-white/60 border border-yellow-200 rounded p-3">
                    <p className="text-[10px] text-yellow-600 mb-1">メール本文</p>
                    <pre className="text-xs text-yellow-900 whitespace-pre-wrap font-sans leading-relaxed">
                      {emailBody}
                    </pre>
                  </div>
                </div>

                {sendResult && !sendResult.ok && (
                  <p className="text-xs text-red-600">{sendResult.message}</p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSendStep("compose")}
                    disabled={sending}
                  >
                    ← 戻る
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    onClick={handleSendEmail}
                    disabled={sending}
                  >
                    {sending ? "送信中..." : "送信する"}
                  </Button>
                </div>
              </div>
            )}

            {sendStep === "done" && (
              <div className="p-8 text-center space-y-3">
                <div className="text-3xl">✓</div>
                <p className="text-sm font-medium text-green-700">
                  メールを送信しました
                </p>
                <p className="text-xs text-gray-500">
                  {emailTo} 宛に見積書を送信しました。
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={resetEmail}>
                    閉じる
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSendStep("compose");
                      setEmailTo("");
                      setEmailCc("");
                      setSendResult(null);
                    }}
                  >
                    別の宛先に送信
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                  <TableHead className="text-white font-medium text-[11px] py-2">
                    項目
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-right py-2">
                    金額
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-center py-2">
                    単位
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-center py-2">
                    初期費用
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-center py-2">
                    月次費用
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-right py-2">
                    初期費用合計
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] text-right py-2">
                    月次費用合計
                  </TableHead>
                  <TableHead className="text-white font-medium text-[11px] py-2">
                    備考
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value.costs.map((item, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className="font-medium text-gray-700 py-1.5 text-xs">
                      {isEditMode ? (
                        <Input
                          value={item.項目}
                          onChange={(e) => {
                            const newCosts = [...value.costs];
                            newCosts[index] = {
                              ...newCosts[index],
                              項目: e.target.value,
                            };
                            setValue({ ...value, costs: newCosts });
                          }}
                          className="min-w-[150px]"
                        />
                      ) : (
                        item.項目
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums py-1.5 text-xs">
                      {item.金額.toLocaleString()}円
                    </TableCell>
                    <TableCell className="text-center text-gray-500 py-1.5 text-xs">
                      {item.単位}
                    </TableCell>
                    <TableCell className="text-center py-1.5">
                      {item.初期費用 ? (
                        <span className="text-gray-700 font-bold text-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-1.5">
                      {item.月次費用 ? (
                        <span className="text-gray-700 font-bold text-xs">
                          ✓
                        </span>
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
