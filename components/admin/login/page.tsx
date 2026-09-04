"use client";
import React, { useState } from "react";
import { useApiError } from "../../../hooks/useApiError";
import { apiClient } from "../../../services/api/apiClient";
import { useRouter } from "next/navigation";
import { useLoginForm } from "../../../hooks/useLoginForm";

export default function Login() {
  const { handleError } = useApiError();
  const [saving, setSaving] = useState(false);
  const { form, validateLogin, error, onChange, validateForm } = useLoginForm();
  const router = useRouter();
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validateLogin()) return;
    if (!validateForm()) return;

    setSaving(true);
    try {
      await apiClient.post(`/admin/login`, {
        gmail: form.gmail,
        password: form.password,
      });
      router.push(`/admin`);
    } catch (err) {
    handleError(err);

    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={onLogin}>
        <input
          type="text"
          placeholder="Gmail"
          name="gmail"
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={onChange}
        />
        <button disabled={saving}>{saving ? "WAITING" : "Login"}</button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </div>
  );
}
