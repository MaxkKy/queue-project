"use client";
import React, { useState } from "react";
import { apiClient } from "../../services/api/apiClient";
import { useRouter } from "next/navigation";
import { useApiError } from "../../hooks/useApiError";
import { useLoginForm } from "../../hooks/useLoginForm";
import Link from "next/link";

export default function Login() {
  const { form, validateLogin, error, onChange, validateForm } = useLoginForm();
  const router = useRouter();
  const { handleError } = useApiError();
  const [saving, setsaving] = useState(false);
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validateLogin()) return;
    if (!validateForm()) return;
    setsaving(true);
    try {
      await apiClient.post("/login", {
        gmail: form.gmail,
        password: form.password,
      });
      router.push(`/`);
    } catch (err) {
      handleError(err)
    } finally {
      setsaving(false);
    }
  }
  return (
    <div>
      <form onSubmit={onLogin}>
        <input
          type="text"
          name="gmail"
          onChange={onChange}
          placeholder="Gmail"
        />
        <input
          type="password"
          name="password"
          onChange={onChange}
          placeholder="Password"
        />
        <button disabled={saving}>{saving ? "WAITING" : "Login"}</button>
        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        <Link href={`/register`}>สมัครสมาชิก</Link>
      </form>
    </div>
  );
}
