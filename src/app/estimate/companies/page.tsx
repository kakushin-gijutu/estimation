"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { CompanyRow, CompanyInsert } from "@/lib/database.types";
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
};

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CompanyInsert & { id?: string }>(emptyCompany);
  const [saving, setSaving] = useState(false);

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
      alert("会社名を入力してください");
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
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この会社を削除しますか？")) return;
    await deleteCompany(id);
    load();
  };

  const handleCancel = () => {
    setEditing(emptyCompany);
  };

  const updateField = (field: keyof CompanyInsert, value: string) => {
    setEditing({ ...editing, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Form */}
        <Card className="mb-6">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">
              {editing.id ? "会社を編集" : "新規会社登録"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">会社名 *</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-8 text-sm"
                  placeholder="例: 合同会社RHY"
                />
              </div>
              <div>
                <Label className="text-xs">代表者名</Label>
                <Input
                  value={editing.representative_name}
                  onChange={(e) => updateField("representative_name", e.target.value)}
                  className="h-8 text-sm"
                  placeholder="例: 鯰江"
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
                />
              </div>
              <div>
                <Label className="text-xs">FAX</Label>
                <Input
                  value={editing.fax}
                  onChange={(e) => updateField("fax", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">メール</Label>
                <Input
                  value={editing.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">免許番号</Label>
                <Input
                  value={editing.license}
                  onChange={(e) => updateField("license", e.target.value)}
                  className="h-8 text-sm"
                  placeholder="例: 大阪府知事(1)第65124号"
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
                {saving ? "保存中..." : editing.id ? "更新" : "登録"}
              </Button>
              {editing.id && (
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  キャンセル
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">読み込み中...</div>
          ) : companies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              会社が登録されていません。上のフォームから登録してください。
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs">会社名</TableHead>
                  <TableHead className="text-xs">代表者</TableHead>
                  <TableHead className="text-xs">住所</TableHead>
                  <TableHead className="text-xs">電話番号</TableHead>
                  <TableHead className="text-xs">免許</TableHead>
                  <TableHead className="text-xs text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id} className="hover:bg-gray-50">
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
