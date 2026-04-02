import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { EstimatePdfDocument } from "@/lib/estimate-pdf";
import { getSupabase } from "@/lib/supabase";
import type { EstimationRow } from "@/lib/database.types";

const resend = new Resend(process.env.RESEND_API_KEY);

async function getEstimationById(id: string): Promise<EstimationRow | null> {
  const { data, error } = await getSupabase()
    .from("estimations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as EstimationRow;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      to,
      estimationId,
      brokerCompanyName,
      subject: emailSubject,
      emailBody,
    } = body;

    if (!to || !estimationId) {
      return NextResponse.json(
        { error: "メールアドレスと見積書IDは必須です" },
        { status: 400 }
      );
    }

    if (!emailBody || !emailSubject) {
      return NextResponse.json(
        { error: "件名と本文は必須です" },
        { status: 400 }
      );
    }

    // 見積書データを取得してPDF生成
    const estimation = await getEstimationById(estimationId);

    const subject = emailSubject;
    const escaped = emailBody
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const html = `<div style="font-family: 'Helvetica Neue', Arial, 'Hiragino Sans', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif; max-width: 600px; margin: 0 auto;"><pre style="font-family: inherit; font-size: 14px; line-height: 1.8; color: #1f2937; white-space: pre-wrap; word-wrap: break-word; margin: 0;">${escaped}</pre></div>`;

    // PDF生成
    let attachments: { filename: string; content: Buffer }[] = [];
    let pdfWarning: string | undefined;
    if (estimation) {
      try {
        const pdfBuffer = await renderToBuffer(
          React.createElement(EstimatePdfDocument, { data: estimation }) as any
        );
        const filename = `御見積書_${estimation.property_name || "見積書"}_${estimation.customer_name || ""}様.pdf`;
        attachments = [{ filename, content: Buffer.from(pdfBuffer) }];
      } catch (pdfError: any) {
        console.error("PDF generation error:", pdfError);
        pdfWarning = pdfError?.message || "PDF生成に失敗しました";
      }
    } else {
      pdfWarning = "見積書データが見つかりません（ID: " + estimationId + "）";
    }

    const { data, error } = await resend.emails.send({
      from: `${brokerCompanyName || "見積書管理"} <dev@r-h-y.jp>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      pdfAttached: attachments.length > 0,
      ...(pdfWarning ? { pdfWarning } : {}),
    });
  } catch (e: any) {
    console.error("Send email error:", e);
    return NextResponse.json(
      { error: e.message || "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
