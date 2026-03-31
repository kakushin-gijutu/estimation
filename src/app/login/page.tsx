"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";

function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/estimate";

  const [email, setEmail] = useState(isProd ? "" : "info@r-h-y.jp");
  const [password, setPassword] = useState(isProd ? "" : "fklirngrho08C&(d");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowser();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-gray-800 text-white text-center py-6 rounded-t-lg">
          <h1 className="text-lg font-bold tracking-widest">
            <span>R</span>
            <span className="text-gray-500">-</span>
            <span>H</span>
            <span className="text-gray-500">-</span>
            <span>Y</span>
          </h1>
          <p className="text-[9px] tracking-[0.25em] text-gray-500 uppercase mt-1">
            Estimate
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-b-lg p-6 space-y-4"
        >
          <h2 className="text-sm font-bold text-gray-700 text-center">
            ログイン
          </h2>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </p>
          )}

          <div>
            <Label className="text-xs text-gray-500">メールアドレス</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 text-sm mt-1"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500">パスワード</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-9 text-sm mt-1"
              placeholder="6文字以上"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
          >
            {loading ? "処理中..." : "ログイン"}
          </Button>
        </form>
      </div>
    </div>
  );
}
