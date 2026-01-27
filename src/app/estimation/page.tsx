"use client";
import { contactFormAtom } from "@/app/jotai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtom } from "jotai";
import { useState } from "react";

export default function Page() {
  const [value, setValue] = useAtom(contactFormAtom);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="bg-white text-black text-center py-6">
        <CardTitle className="text-4xl font-bold">御見積書</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{value.customer.name} 様</h2>
            <p className="text-lg">{value.property.name}</p>
          </div>
          <div className="text-right">
            <p>作成日 {value.property.creationDate}</p>
            <p>有効期限 {value.property.expirationDate}</p>
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className="mt-2 print:hidden"
            >
              {isEditMode ? "編集モード: ON" : "編集モード: OFF"}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold">物件名：{value.property.name}</h3>
          </div>
        </div>
        <div className="flex justify-between">
          <div className=" py-4 pr-24 mb-4 flex flex-col items-start gap-4">
            <p className="text-3xl font-bold">
              初期費用（税込） ¥
              {value.costs
                .reduce((acc, cost) => acc + cost.初期費用合計, 0)
                .toLocaleString()}
            </p>
            <p className="text-3xl">
              月額費（税込） ¥
              {value.costs
                .reduce((acc, cost) => acc + cost.月次費用合計, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <div className="space-y-2 text-sm text-right">
              <p className="text-3xl font-bold">
                仲介業者: {value.broker.company_name}
              </p>
              <p>住所: {value.broker.address}</p>
              <p>TEL: {value.broker.tel}</p>
              <p>FAX: {value.broker.fax}</p>
              <p>メールアドレス: {value.broker.email}</p>
              <p>免許: {value.broker.license}</p>
              <p>担当: {value.broker.name}</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p>入居予定日：{value.property.moveInDate}</p>
          <p>契約期間：{value.property.contractPeriod}</p>
          <p>
            契約更新料：¥{value.property.contractRenewalFee.toLocaleString()}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>項目</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>単位</TableHead>
              <TableHead>初期費用</TableHead>
              <TableHead>月次費用</TableHead>
              <TableHead>初期費用合計</TableHead>
              <TableHead>月次費用合計</TableHead>
              <TableHead>備考</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.costs.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
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
                <TableCell>{item.金額.toLocaleString()}円</TableCell>
                <TableCell>{item.単位}</TableCell>
                <TableCell>{item.初期費用 ? "✓" : ""}</TableCell>
                <TableCell>{item.月次費用 ? "✓" : ""}</TableCell>
                <TableCell>{item.初期費用合計.toLocaleString()}円</TableCell>
                <TableCell>{item.月次費用合計.toLocaleString()}円</TableCell>
                <TableCell>{item.備考}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end gap-4 text-xl border-y-2 py-2">
          <p>
            月額合計：¥
            {value.costs
              .reduce((acc, cost) => acc + cost.月次費用合計, 0)
              .toLocaleString()}
          </p>
          <p className="font-bold">
            初期費用合計：¥
            {value.costs
              .reduce((acc, cost) => acc + cost.初期費用合計, 0)
              .toLocaleString()}
          </p>
        </div>
      </CardContent>
      <CardHeader className="bg-black text-white  py-2 px-4 ">
        <h2 className="text-lg font-semibold flex justify-center">
          備考・注意事項
        </h2>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <p className="text-sm">{value.remarks}</p>
      </CardContent>
      <CardFooter className="bg-black  text-white  py-2 px-4 text-md flex justify-center">
        合同会社RHY
      </CardFooter>
    </Card>
  );
}
