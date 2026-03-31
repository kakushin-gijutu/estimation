"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarInput } from "@/components/CalendarInput";
import { SelectInput } from "@/components/SelectInput";
import { additionalCostPresets } from "@/app/jotai";
import type { ContactFormState } from "@/app/jotai";
import { formToDbRow } from "@/lib/estimations";
import { createEstimation, updateEstimation } from "@/lib/estimations";
import { getCompanies } from "@/lib/companies";
import type { CompanyRow } from "@/lib/database.types";

type Props = {
  initialData: ContactFormState;
  estimationId?: string; // undefined = new, string = edit
};

export function EstimateForm({ initialData, estimationId }: Props) {
  const router = useRouter();
  const [formValue, setFormValue] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);

  useEffect(() => {
    getCompanies().then(setCompanies).catch(console.error);
  }, []);

  const handleCompanySelect = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (!company) return;
    setFormValue({
      ...formValue,
      broker: {
        ...formValue.broker,
        company_name: company.name,
        name: company.representative_name,
        tel: company.tel,
        fax: company.fax,
        email: company.email,
        address: company.address,
        license: company.license,
      },
    });
  };

  const handleSave = async (andPreview?: boolean) => {
    setSaving(true);
    try {
      const dbRow = formToDbRow(formValue);
      let id = estimationId;
      if (estimationId) {
        await updateEstimation(estimationId, dbRow);
      } else {
        const created = await createEstimation(dbRow);
        id = created.id;
      }
      if (andPreview) {
        router.push(`/estimate/${id}/preview`);
      } else {
        router.push("/estimate");
      }
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="w-full max-w-4xl mx-auto mb-4 flex justify-end items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? "保存中..." : "保存して一覧へ"}
          </Button>
          <Button
            size="sm"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? "保存中..." : "保存してプレビュー"}
          </Button>
        </div>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-gray-800 text-white text-center py-4">
          <CardTitle className="text-2xl font-bold">
            {estimationId ? "見積書を編集" : "新規見積書"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {companies.length > 0 && (
              <div className="col-span-4 mb-2">
                <Label className="text-xs">会社選択</Label>
                <Select
                  value={
                    companies.find((c) => c.name === formValue.broker.company_name)?.id || ""
                  }
                  onValueChange={handleCompanySelect}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="登録済み会社から選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2">
              <Label htmlFor="clientName" className="text-xs">
                お客様名
              </Label>
              <Input
                id="clientName"
                value={formValue.customer.name}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    customer: { ...formValue.customer, name: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="brokerName" className="text-xs">
                ブローカー名
              </Label>
              <Input
                id="brokerName"
                value={formValue.broker.name}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: { ...formValue.broker, name: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="brokerTel" className="text-xs">
                ブローカー電話番号
              </Label>
              <Input
                id="brokerTel"
                value={formValue.broker.tel}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: { ...formValue.broker, tel: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="brokerFax" className="text-xs">
                ブローカーファックス
              </Label>
              <Input
                id="brokerFax"
                value={formValue.broker.fax}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: { ...formValue.broker, fax: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="brokerEmail" className="text-xs">
                ブローカーメール
              </Label>
              <Input
                id="brokerEmail"
                value={formValue.broker.email}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: { ...formValue.broker, email: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="brokerAddress" className="text-xs">
                ブローカー住所
              </Label>
              <Input
                id="brokerAddress"
                value={formValue.broker.address}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: { ...formValue.broker, address: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="company_name" className="text-xs">
                仲介業者
              </Label>
              <Input
                id="company_name"
                value={formValue.broker.company_name}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: {
                      ...formValue.broker,
                      company_name: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="license" className="text-xs">
                免許
              </Label>
              <Input
                id="license"
                value={formValue.broker.license}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    broker: { ...formValue.broker, license: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="propertyType" className="text-xs">
                物件タイプ
              </Label>
              <SelectInput
                formValue={formValue}
                setFormValue={setFormValue}
                category="property"
                name="type"
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <Label htmlFor="creationDate" className="text-xs">
                作成日
              </Label>
              <CalendarInput
                formValue={formValue}
                setFormValue={setFormValue}
                category="property"
                name="creationDate"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="expirationDate" className="text-xs">
                有効期限
              </Label>
              <CalendarInput
                formValue={formValue}
                setFormValue={setFormValue}
                category="property"
                name="expirationDate"
              />
            </div>
            <div className="col-span-4">
              <Label htmlFor="propertyName" className="text-xs">
                物件名
              </Label>
              <Input
                id="propertyName"
                value={formValue.property.name}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    property: { ...formValue.property, name: e.target.value },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="moveInDate" className="text-xs">
                入居予定日
              </Label>
              <CalendarInput
                formValue={formValue}
                setFormValue={setFormValue}
                category="property"
                name="moveInDate"
              />
            </div>
            <div>
              <Label htmlFor="contractPeriod" className="text-xs">
                契約期間
              </Label>
              <Input
                id="contractPeriod"
                value={formValue.property.contractPeriod}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    property: {
                      ...formValue.property,
                      contractPeriod: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="basicRent" className="text-xs">
                基本賃料 (円)
              </Label>
              <Input
                id="basicRent"
                type="text"
                value={formValue.property.basicRent}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    property: {
                      ...formValue.property,
                      basicRent: Number(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="managementFee" className="text-xs">
                共益管理費 (円)
              </Label>
              <Input
                id="managementFee"
                type="text"
                value={formValue.property.managementFee}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    property: {
                      ...formValue.property,
                      managementFee: Number(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="parkingFee" className="text-xs">
                駐車場料金 (円)
              </Label>
              <Input
                id="parkingFee"
                type="text"
                value={formValue.property.parkingFee}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    property: {
                      ...formValue.property,
                      parkingFee: Number(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="contractRenewalFee" className="text-xs">
                契約更新料 (円)
              </Label>
              <Input
                id="contractRenewalFee"
                type="text"
                value={formValue.property.contractRenewalFee}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    property: {
                      ...formValue.property,
                      contractRenewalFee: Number(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Cost Items */}
          <div className="space-y-4 mt-8">
            <div className="grid grid-cols-8 gap-4 items-center font-bold mb-2">
              <div>項目</div>
              <div>金額</div>
              <div>単位</div>
              <div className="col-span-2">費用タイプ</div>
              <div>初期費用合計</div>
              <div>月次費用合計</div>
              <div>備考</div>
            </div>

            {formValue.costs.map((cost, index) => (
              <div
                key={`${cost.項目}-${index}`}
                className="grid grid-cols-8 gap-4 items-center"
              >
                <Label className="text-sm font-medium">{cost.項目}</Label>
                <Input
                  type="text"
                  value={cost.金額}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      costs: formValue.costs.map((c, i) =>
                        i === index
                          ? { ...c, 金額: Number(e.target.value) }
                          : c
                      ),
                    })
                  }
                  className="col-span-1"
                />
                <div className="flex items-center space-x-2">
                  <Select
                    value={cost.単位}
                    onValueChange={(val) =>
                      setFormValue({
                        ...formValue,
                        costs: formValue.costs.map((c, i) =>
                          i === index ? { ...c, 単位: val } : c
                        ),
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="円">円</SelectItem>
                      <SelectItem value="月">月</SelectItem>
                      <SelectItem value="ヶ月">ヶ月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`initialCost-${index}`}
                    checked={cost.初期費用}
                    onCheckedChange={(checked) => {
                      const newCosts = formValue.costs
                        .map((c, i) =>
                          i === index ? { ...c, 初期費用: !!checked } : c
                        )
                        .map((c) => ({
                          ...c,
                          初期費用合計: c.初期費用 ? c.金額 : 0,
                        }));
                      setFormValue({ ...formValue, costs: newCosts });
                    }}
                  />
                  <Label htmlFor={`initialCost-${index}`} className="text-sm">
                    初期費用
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`monthlyCost-${index}`}
                    checked={cost.月次費用}
                    onCheckedChange={(checked) => {
                      const newCosts = formValue.costs
                        .map((c, i) =>
                          i === index ? { ...c, 月次費用: !!checked } : c
                        )
                        .map((c) => ({
                          ...c,
                          月次費用合計: c.月次費用 ? c.金額 : 0,
                        }));
                      setFormValue({ ...formValue, costs: newCosts });
                    }}
                  />
                  <Label htmlFor={`monthlyCost-${index}`} className="text-sm">
                    月次費用
                  </Label>
                </div>
                <Input
                  type="text"
                  value={cost.初期費用合計}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      costs: formValue.costs.map((c, i) =>
                        i === index
                          ? { ...c, 初期費用合計: Number(e.target.value) }
                          : c
                      ),
                    })
                  }
                  className="col-span-1"
                />
                <Input
                  type="text"
                  value={cost.月次費用合計}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      costs: formValue.costs.map((c, i) =>
                        i === index
                          ? { ...c, 月次費用合計: Number(e.target.value) }
                          : c
                      ),
                    })
                  }
                  className="col-span-1"
                />
                <Input
                  type="text"
                  value={cost.備考}
                  onChange={(e) =>
                    setFormValue({
                      ...formValue,
                      costs: formValue.costs.map((c, i) =>
                        i === index ? { ...c, 備考: e.target.value } : c
                      ),
                    })
                  }
                  className="col-span-1"
                />
              </div>
            ))}

            {/* Add Item */}
            <div className="flex items-center gap-2 mt-4">
              <Popover
                open={isAddOpen}
                onOpenChange={(open) => {
                  setIsAddOpen(open);
                  if (!open) setSearchQuery("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[300px] justify-start text-muted-foreground"
                  >
                    ＋ 項目を追加...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="項目名で検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {additionalCostPresets
                      .filter(
                        ([name]) =>
                          !formValue.costs.some((c) => c.項目 === name) &&
                          name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map(([name, 初期, 月次]) => (
                        <button
                          key={name}
                          type="button"
                          className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setFormValue({
                              ...formValue,
                              costs: [
                                ...formValue.costs,
                                {
                                  項目: name,
                                  金額: 0,
                                  単位: "円",
                                  初期費用: 初期,
                                  月次費用: 月次,
                                  初期費用合計: 0,
                                  月次費用合計: 0,
                                  備考: "",
                                },
                              ],
                            });
                            setIsAddOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    {searchQuery &&
                      !additionalCostPresets.some(
                        ([name]) => name === searchQuery
                      ) && (
                        <button
                          type="button"
                          className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent cursor-pointer text-blue-600 font-medium"
                          onClick={() => {
                            setFormValue({
                              ...formValue,
                              costs: [
                                ...formValue.costs,
                                {
                                  項目: searchQuery,
                                  金額: 0,
                                  単位: "円",
                                  初期費用: false,
                                  月次費用: false,
                                  初期費用合計: 0,
                                  月次費用合計: 0,
                                  備考: "",
                                },
                              ],
                            });
                            setIsAddOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          ＋「{searchQuery}」を追加
                        </button>
                      )}
                  </div>
                </PopoverContent>
              </Popover>
              {formValue.costs.length > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setFormValue({
                      ...formValue,
                      costs: formValue.costs.slice(0, -1),
                    });
                  }}
                >
                  最後の項目を削除
                </Button>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="mt-4">
            <Label htmlFor="remarks" className="text-xs">
              備考・注意事項
            </Label>
            <Textarea
              id="remarks"
              value={formValue.remarks}
              onChange={(e) =>
                setFormValue({ ...formValue, remarks: e.target.value })
              }
              className="h-24 text-sm"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-800 py-3 px-4 flex gap-2 justify-center">
          <Button
            className="bg-transparent text-white border border-gray-500 hover:bg-gray-700 shadow-sm"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            保存して一覧へ
          </Button>
          <Button
            className="bg-white text-gray-800 hover:bg-gray-100 font-bold"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            保存してプレビュー →
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
