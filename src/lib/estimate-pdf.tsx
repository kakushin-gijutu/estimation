import React from "react";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { EstimationRow, CostItem } from "./database.types";

// Noto Sans JP (ローカルTTF)
const fontsDir = path.join(process.cwd(), "public", "fonts");
Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: path.join(fontsDir, "NotoSansJP-Regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(fontsDir, "NotoSansJP-Bold.ttf"),
      fontWeight: 700,
    },
  ],
});

const s = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 9,
    color: "#1f2937",
    padding: 0,
  },
  header: {
    backgroundColor: "#1f2937",
    color: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  headerLabel: {
    fontSize: 7,
    letterSpacing: 3,
    color: "#9ca3af",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 2,
  },
  body: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  customerName: {
    fontSize: 16,
    fontWeight: 700,
    borderBottomWidth: 2,
    borderBottomColor: "#1f2937",
    paddingBottom: 2,
  },
  dateText: {
    fontSize: 8,
    color: "#6b7280",
  },
  sectionLabel: {
    fontSize: 7,
    color: "#9ca3af",
    letterSpacing: 1,
    marginBottom: 3,
  },
  propertyBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 3,
    padding: 10,
    marginTop: 14,
    marginBottom: 10,
  },
  propertyName: {
    fontSize: 11,
    fontWeight: 700,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 3,
    padding: 10,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 700,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },
  infoCol: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 2,
  },
  infoLabel: {
    color: "#9ca3af",
    width: 48,
    fontSize: 8,
  },
  infoValue: {
    fontSize: 8,
  },
  brokerCompany: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 3,
  },
  brokerDetail: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 1,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#374151",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: "#fff",
    fontSize: 7,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 8,
  },
  tableCellRight: {
    fontSize: 8,
    textAlign: "right",
  },
  tableCellCenter: {
    fontSize: 8,
    textAlign: "center",
  },
  totalsBar: {
    flexDirection: "row",
    backgroundColor: "#374151",
    justifyContent: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 20,
  },
  totalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalLabel: {
    color: "#9ca3af",
    fontSize: 8,
  },
  totalValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
  },
  remarksBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 3,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  remarksText: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.6,
  },
  footer: {
    backgroundColor: "#1f2937",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 28,
    textAlign: "center",
    marginTop: "auto",
  },
  footerCompany: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1,
  },
  footerAddress: {
    fontSize: 7,
    color: "#9ca3af",
    marginTop: 2,
  },
});

// Column widths for cost table
const colW = {
  item: "22%",
  amount: "12%",
  unit: "8%",
  initial: "8%",
  monthly: "8%",
  initialTotal: "14%",
  monthlyTotal: "14%",
  note: "14%",
};

function fmt(n: number) {
  return `\u00a5${n.toLocaleString()}`;
}

export function EstimatePdfDocument({ data }: { data: EstimationRow }) {
  const initialTotal = data.costs.reduce((a, c) => a + c.初期費用合計, 0);
  const monthlyTotal = data.costs.reduce((a, c) => a + c.月次費用合計, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerLabel}>Estimation</Text>
          <Text style={s.headerTitle}>御見積書</Text>
        </View>

        <View style={s.body}>
          {/* Customer & Dates */}
          <View style={s.row}>
            <View>
              <Text style={s.sectionLabel}>宛名</Text>
              <Text style={s.customerName}>{data.customer_name} 様</Text>
            </View>
            <View>
              <Text style={s.dateText}>作成日　{data.creation_date}</Text>
              <Text style={s.dateText}>有効期限　{data.expiration_date}</Text>
            </View>
          </View>

          {/* Property */}
          <View style={s.propertyBox}>
            <Text style={s.sectionLabel}>物件名</Text>
            <Text style={s.propertyName}>{data.property_name}</Text>
          </View>

          {/* Summary */}
          <View style={s.summaryRow}>
            <View style={s.summaryBox}>
              <Text style={s.sectionLabel}>初期費用（税込）</Text>
              <Text style={s.summaryValue}>{fmt(initialTotal)}</Text>
            </View>
            <View style={s.summaryBox}>
              <Text style={s.sectionLabel}>月額費用（税込）</Text>
              <Text style={s.summaryValue}>{fmt(monthlyTotal)}</Text>
            </View>
          </View>

          {/* Contract & Broker */}
          <View style={s.infoGrid}>
            <View style={s.infoCol}>
              <Text style={s.sectionLabel}>契約情報</Text>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>入居予定</Text>
                <Text style={s.infoValue}>{data.move_in_date}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>契約期間</Text>
                <Text style={s.infoValue}>{data.contract_period}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>更新料</Text>
                <Text style={s.infoValue}>{fmt(data.contract_renewal_fee)}</Text>
              </View>
            </View>
            <View style={s.infoCol}>
              <Text style={s.sectionLabel}>取扱業者</Text>
              <Text style={s.brokerCompany}>{data.broker_company_name}</Text>
              <Text style={s.brokerDetail}>{data.broker_address}</Text>
              <Text style={s.brokerDetail}>
                TEL: {data.broker_tel}　FAX: {data.broker_fax}
              </Text>
              <Text style={s.brokerDetail}>メール: {data.broker_email}</Text>
              <Text style={s.brokerDetail}>免許: {data.broker_license}</Text>
              <Text style={s.brokerDetail}>担当: {data.broker_name}</Text>
            </View>
          </View>

          {/* Cost Table */}
          <View>
            {/* Table Header */}
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, { width: colW.item }]}>項目</Text>
              <Text style={[s.tableHeaderCell, { width: colW.amount, textAlign: "right" }]}>金額</Text>
              <Text style={[s.tableHeaderCell, { width: colW.unit, textAlign: "center" }]}>単位</Text>
              <Text style={[s.tableHeaderCell, { width: colW.initial, textAlign: "center" }]}>初期</Text>
              <Text style={[s.tableHeaderCell, { width: colW.monthly, textAlign: "center" }]}>月次</Text>
              <Text style={[s.tableHeaderCell, { width: colW.initialTotal, textAlign: "right" }]}>初期費用合計</Text>
              <Text style={[s.tableHeaderCell, { width: colW.monthlyTotal, textAlign: "right" }]}>月次費用合計</Text>
              <Text style={[s.tableHeaderCell, { width: colW.note }]}>備考</Text>
            </View>
            {/* Table Body */}
            {data.costs.map((item: CostItem, i: number) => (
              <View
                key={i}
                style={[s.tableRow, i % 2 !== 0 && s.tableRowAlt]}
              >
                <Text style={[s.tableCell, { width: colW.item, fontWeight: 700 }]}>{item.項目}</Text>
                <Text style={[s.tableCellRight, { width: colW.amount }]}>{item.金額.toLocaleString()}円</Text>
                <Text style={[s.tableCellCenter, { width: colW.unit, color: "#6b7280" }]}>{item.単位}</Text>
                <Text style={[s.tableCellCenter, { width: colW.initial }]}>{item.初期費用 ? "✓" : "—"}</Text>
                <Text style={[s.tableCellCenter, { width: colW.monthly }]}>{item.月次費用 ? "✓" : "—"}</Text>
                <Text style={[s.tableCellRight, { width: colW.initialTotal }]}>
                  {item.初期費用合計 > 0 ? `${item.初期費用合計.toLocaleString()}円` : "—"}
                </Text>
                <Text style={[s.tableCellRight, { width: colW.monthlyTotal }]}>
                  {item.月次費用合計 > 0 ? `${item.月次費用合計.toLocaleString()}円` : "—"}
                </Text>
                <Text style={[s.tableCell, { width: colW.note, color: "#6b7280", fontSize: 7 }]}>{item.備考}</Text>
              </View>
            ))}
            {/* Totals */}
            <View style={s.totalsBar}>
              <View style={s.totalItem}>
                <Text style={s.totalLabel}>月額合計</Text>
                <Text style={[s.totalValue, { fontSize: 11 }]}>{fmt(monthlyTotal)}</Text>
              </View>
              <View style={s.totalItem}>
                <Text style={[s.totalLabel, { color: "#d1d5db" }]}>初期費用合計</Text>
                <Text style={s.totalValue}>{fmt(initialTotal)}</Text>
              </View>
            </View>
          </View>

          {/* Remarks */}
          {data.remarks && (
            <View style={s.remarksBox}>
              <Text style={s.sectionLabel}>備考・注意事項</Text>
              <Text style={s.remarksText}>{data.remarks}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerCompany}>{data.broker_company_name}</Text>
          <Text style={s.footerAddress}>{data.broker_address}</Text>
        </View>
      </Page>
    </Document>
  );
}
