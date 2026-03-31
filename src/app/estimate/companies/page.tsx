"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyRow, CompanyInsert, CompanyType } from "@/lib/database.types";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/lib/companies";

const emptyCompany: CompanyInsert = {
  name: "",
  address: "",
  tel: "",
  fax: "",
  email: "",
  license: "",
  representative_name: "",
  type: "company",
};

const defaultCompany: CompanyInsert = {
  name: "合同会社RHY",
  address: "大阪府大阪市東成区深江北1-3-5三好ビル306",
  tel: "",
  fax: "",
  email: "",
  license: "大阪府知事(1)第65124号",
  representative_name: "鯰江",
  type: "company",
};

const typeLabels: Record<CompanyType, string> = {
  company: "法人",
  individual: "個人",
};

const typeBadgeColors: Record<CompanyType, string> = {
  company: "bg-blue-100 text-blue-700",
  individual: "bg-green-100 text-green-700",
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CompanyInsert & { id?: string }>(emptyCompany);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing.name.trim()) {
      alert("名前を入力してください");
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        const { id, ...data } = editing;
        await updateCompany(id, data);
      } else {
        await createCompany(editing);
      }
      setEditing(emptyCompany);
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (company: CompanyRow) => {
    setEditing({
      id: company.id,
      name: company.name,
      address: company.address,
      tel: company.tel,
      fax: company.fax,
      email: company.email,
      license: company.license,
      representative_name: company.representative_name,
      type: company.type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await deleteCompany(id);
    load();
  };

  const handleCancel = () => {
    setEditing(emptyCompany);
    setShowForm(false);
  };

  const handleNewCompany = () => {
    setEditing({ ...emptyCompany, type: "company" });
    setShowForm(true);
  };

  const handleNewIndividual = () => {
    setEditing({ ...emptyCompany, type: "individual" });
    setShowForm(true);
  };

  const handleLoadDefault = () => {
    setEditing({ ...defaultCompany });
    setShowForm(true);
  };

  const updateField = (field: keyof CompanyInsert, value: string) => {
    setEditing({ ...editing, [field]: value });
  };

  const filtered = companies.filter((c) => {
    const matchType = filterType === "all" || c.type === filterType;
    const matchSearch =
      !search ||
      c.name.includes(search) ||
      c.representative_name.includes(search) ||
      c.address.includes(search) ||
      c.tel.includes(search);
    return matchType && matchSearch;
  });

  const isIndividual = editing.type === "individual";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              会社・個人管理
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {companies.length}件登録済み（法人: {companies.filter((c) => c.type === "company").length} / 個人: {companies.filter((c) => c.type === "individual").length}）
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadDefault}
            >
              デフォルト値で登録
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewIndividual}
            >
              ＋ 個人を追加
            </Button>
            <Button
              size="sm"
              className="bg-gray-800 text-white hover:bg-gray-700"
              onClick={handleNewCompany}
            >
              ＋ 法人を追加
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {editing.id
                  ? `${isIndividual ? "個人" : "法人"}を編集`
                  : `新規${isIndividual ? "個人" : "法人"}登録`}
              </CardTitle>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateField("type", "company")}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    !isIndividual
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  法人
                </button>
                <button
                  type="button"
                  onClick={() => updateField("type", "individual")}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    isIndividual
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  個人
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">
                    {isIndividual ? "氏名" : "会社名"} *
                  </Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="h-8 text-sm"
                    placeholder={
                      isIndividual ? "例: 山田 太郎" : "例: 合同会社RHY"
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">
                    {isIndividual ? "担当者名" : "代表者名"}
                  </Label>
                  <Input
                    value={editing.representative_name}
                    onChange={(e) =>
                      updateField("representative_name", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder={isIndividual ? "" : "例: 鯰江"}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">住所</Label>
                  <Input
                    value={editing.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="h-8 text-sm"
                    placeholder="例: 大阪府大阪市東成区深江北1-3-5三好ビル306"
                  />
                </div>
                <div>
                  <Label className="text-xs">電話番号</Label>
                  <Input
                    value={editing.tel}
                    onChange={(e) => updateField("tel", e.target.value)}
                    className="h-8 text-sm"
                    placeholder="例: 06-1234-5678"
                  />
                </div>
                <div>
                  <Label className="text-xs">FAX</Label>
                  <Input
                    value={editing.fax}
                    onChange={(e) => updateField("fax", e.target.value)}
                    className="h-8 text-sm"
                    placeholder="例: 06-1234-5679"
                  />
                </div>
                <div>
                  <Label className="text-xs">メール</Label>
                  <Input
                    value={editing.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="h-8 text-sm"
                    placeholder="例: info@example.com"
                  />
                </div>
                <div>
                  <Label className="text-xs">
                    {isIndividual ? "資格・免許番号" : "免許番号"}
                  </Label>
                  <Input
                    value={editing.license}
                    onChange={(e) => updateField("license", e.target.value)}
                    className="h-8 text-sm"
                    placeholder={
                      isIndividual ? "" : "例: 大阪府知事(1)第65124号"
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="bg-gray-800 text-white hover:bg-gray-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? "保存中..."
                    : editing.id
                      ? "更新"
                      : "登録"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  キャンセル
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="名前・住所・電話番号で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-white h-8 text-sm"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px] h-8 text-sm bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="company">法人</SelectItem>
              <SelectItem value="individual">個人</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">読み込み中...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {companies.length === 0
                ? "登録がありません。上のボタンから追加してください。"
                : "条件に一致するデータがありません。"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs w-[70px]">種別</TableHead>
                  <TableHead className="text-xs">名前</TableHead>
                  <TableHead className="text-xs">代表者/担当者</TableHead>
                  <TableHead className="text-xs">住所</TableHead>
                  <TableHead className="text-xs">電話番号</TableHead>
                  <TableHead className="text-xs">メール</TableHead>
                  <TableHead className="text-xs">免許</TableHead>
                  <TableHead className="text-xs text-center w-[120px]">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <TableRow key={company.id} className="hover:bg-gray-50">
                    <TableCell>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${typeBadgeColors[company.type]}`}
                      >
                        {typeLabels[company.type]}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {company.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {company.representative_name || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                      {company.address || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {company.tel || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {company.email || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[150px] truncate">
                      {company.license || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleEdit(company)}
                        >
                          編集
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(company.id)}
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
