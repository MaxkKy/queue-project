"use client";
import React, { useState } from "react";
import { useRegisterForm } from "../../../hooks/useRegisterForm";
import { apiClient } from "../../../services/api/apiClient";
import { useApiError } from "../../../hooks/useApiError";
import { useRouter } from "next/navigation";

export default function Register() {
  const [saving, setSaving] = useState(false);
  const { form, error, onChange, validateAuthForm, validateForm, validateRole } =
    useRegisterForm();
  const { handleError } = useApiError();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAuthForm()) return;
    if (!validateForm()) return;
    if (!validateRole()) return;
    setSaving(true);
    try {
      await apiClient.post(`/admin`, {
        username: form.username,
        password: form.password,
        gmail: form.gmail,
        role: form.role,
      });
      router.push(`/admin/login`);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          onChange={onChange}
          placeholder="Username"
        />
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
        <select name="role" value={form.role} onChange={onChange}>
          <option value="">เลือก Role</option>
          <option value="ผู้ดูแล">ผู้ดูแล</option>
          <option value="แม่ค้า">แม่ค้า</option>
        </select>
        <button disabled={saving}>
          {saving ? "register..." : "register"}
        </button>
        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
