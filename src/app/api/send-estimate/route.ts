import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type TemplateType =
  | "estimate"
  | "reminder"
  | "thanks"
  | "update"
  | "expiring";

function buildEmailHtml({
  template,
  customerName,
  propertyName,
  brokerCompanyName,
  brokerName,
  brokerTel,
  brokerEmail,
  viewUrl,
  initialTotal,
  monthlyTotal,
  expirationDate,
  customMessage,
}: {
  template: TemplateType;
  customerName: string;
  propertyName: string;
  brokerCompanyName: string;
  brokerName: string;
  brokerTel: string;
  brokerEmail: string;
  viewUrl: string;
  initialTotal: number;
  monthlyTotal: number;
  expirationDate: string;
  customMessage?: string;
}) {
  const greeting = `${customerName || ""} 様`;

  const templateContent: Record<
    TemplateType,
    { subject: string; heading: string; body: string; buttonText: string }
  > = {
    estimate: {
      subject: `【御見積書】${propertyName || ""}${customerName ? ` - ${customerName}様` : ""}`,
      heading: "御見積書のご送付",
      body: `
        お世話になっております。${brokerCompanyName}の${brokerName}でございます。<br><br>
        この度はお問い合わせいただきありがとうございます。<br>
        下記物件の御見積書をお送りいたします。ご確認のほどよろしくお願いいたします。
      `,
      buttonText: "見積書を確認する",
    },
    reminder: {
      subject: `【リマインド】御見積書のご確認 - ${propertyName || ""}`,
      heading: "御見積書のご確認のお願い",
      body: `
        お世話になっております。${brokerCompanyName}の${brokerName}でございます。<br><br>
        先日お送りいたしました御見積書につきまして、ご確認いただけましたでしょうか。<br>
        ${expirationDate ? `見積書の有効期限は<strong>${expirationDate}</strong>までとなっております。<br>` : ""}
        ご不明点等ございましたら、お気軽にお問い合わせください。
      `,
      buttonText: "見積書を確認する",
    },
    thanks: {
      subject: `【お礼】ご成約ありがとうございます - ${propertyName || ""}`,
      heading: "ご成約のお礼",
      body: `
        お世話になっております。${brokerCompanyName}の${brokerName}でございます。<br><br>
        この度はご成約いただき、誠にありがとうございます。<br>
        今後のお手続きにつきましては、改めてご連絡させていただきます。<br>
        ご不明点がございましたら、いつでもお問い合わせください。
      `,
      buttonText: "見積書の内容を確認する",
    },
    update: {
      subject: `【更新】御見積書の内容を更新しました - ${propertyName || ""}`,
      heading: "御見積書の更新のお知らせ",
      body: `
        お世話になっております。${brokerCompanyName}の${brokerName}でございます。<br><br>
        御見積書の内容を更新いたしましたのでお知らせいたします。<br>
        最新の内容をご確認いただけますようお願いいたします。
      `,
      buttonText: "更新された見積書を確認する",
    },
    expiring: {
      subject: `【期限間近】御見積書の有効期限が近づいています - ${propertyName || ""}`,
      heading: "御見積書の有効期限のお知らせ",
      body: `
        お世話になっております。${brokerCompanyName}の${brokerName}でございます。<br><br>
        先日お送りいたしました御見積書の有効期限が近づいております。<br>
        ${expirationDate ? `<strong>有効期限: ${expirationDate}</strong><br><br>` : ""}
        ご検討中の場合は、期限内にご連絡いただけますと幸いです。<br>
        条件の変更等もご相談承りますので、お気軽にお声がけください。
      `,
      buttonText: "見積書を確認する",
    },
  };

  const t = templateContent[template];
  const fmtInitial = initialTotal?.toLocaleString() || "0";
  const fmtMonthly = monthlyTotal?.toLocaleString() || "0";

  return {
    subject: t.subject,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, 'Hiragino Sans', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px;">
        <div style="background: #1f2937; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <p style="font-size: 10px; letter-spacing: 0.3em; color: #9ca3af; margin: 0 0 4px 0; text-transform: uppercase;">Estimation</p>
          <h1 style="font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 0.05em;">${t.heading}</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #1f2937; margin: 0 0 20px 0;">
            <strong>${greeting}</strong>
          </p>
          <div style="font-size: 14px; color: #374151; line-height: 1.8; margin: 0 0 24px 0;">
            ${t.body}
          </div>

          ${customMessage ? `
            <div style="background: #f9fafb; border-left: 3px solid #6b7280; padding: 12px 16px; margin: 0 0 24px 0; font-size: 13px; color: #374151; line-height: 1.7;">
              ${customMessage.replace(/\n/g, "<br>")}
            </div>
          ` : ""}

          ${propertyName ? `
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 0 0 20px 0;">
              <p style="font-size: 10px; color: #9ca3af; margin: 0 0 4px 0; letter-spacing: 0.1em;">物件名</p>
              <p style="font-size: 14px; color: #1f2937; font-weight: 600; margin: 0;">${propertyName}</p>
            </div>
          ` : ""}

          ${template !== "thanks" ? `
            <div style="display: flex; gap: 12px; margin: 0 0 24px 0;">
              <div style="flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; text-align: center;">
                <p style="font-size: 10px; color: #9ca3af; margin: 0 0 4px 0;">初期費用（税込）</p>
                <p style="font-size: 20px; color: #1f2937; font-weight: bold; margin: 0;">¥${fmtInitial}</p>
              </div>
              <div style="flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; text-align: center;">
                <p style="font-size: 10px; color: #9ca3af; margin: 0 0 4px 0;">月額費用（税込）</p>
                <p style="font-size: 20px; color: #1f2937; font-weight: bold; margin: 0;">¥${fmtMonthly}</p>
              </div>
            </div>
          ` : ""}

          <div style="text-align: center; margin: 28px 0;">
            <a href="${viewUrl}" style="display: inline-block; background: #1f2937; color: white; padding: 14px 48px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 0.05em;">
              ${t.buttonText}
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #374151;">${brokerCompanyName}</p>
            <p style="margin: 0;">担当: ${brokerName}</p>
            ${brokerTel ? `<p style="margin: 0;">TEL: ${brokerTel}</p>` : ""}
            ${brokerEmail ? `<p style="margin: 0;">メール: ${brokerEmail}</p>` : ""}
          </div>
        </div>
        <div style="text-align: center; padding: 16px 0;">
          <p style="font-size: 10px; color: #9ca3af; margin: 0;">
            ※ このメールは${brokerCompanyName}より送信されています。
          </p>
        </div>
      </div>
    `,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      to,
      customerName,
      propertyName,
      estimationId,
      brokerCompanyName,
      brokerName,
      brokerTel,
      brokerEmail: brokerEmailAddr,
      template = "estimate",
      initialTotal = 0,
      monthlyTotal = 0,
      expirationDate = "",
      customMessage,
    } = body;

    if (!to || !estimationId) {
      return NextResponse.json(
        { error: "メールアドレスと見積書IDは必須です" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const viewUrl = `${baseUrl}/estimate/view/${estimationId}`;

    const { subject, html } = buildEmailHtml({
      template: template as TemplateType,
      customerName,
      propertyName,
      brokerCompanyName,
      brokerName: brokerName || "",
      brokerTel: brokerTel || "",
      brokerEmail: brokerEmailAddr || "",
      viewUrl,
      initialTotal,
      monthlyTotal,
      expirationDate,
      customMessage,
    });

    const { data, error } = await resend.emails.send({
      from: `${brokerCompanyName || "見積書管理"} <dev@r-h-y.jp>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e: any) {
    console.error("Send email error:", e);
    return NextResponse.json(
      { error: e.message || "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
