"use client";
import React, { useState } from "react";
import { apiClient } from "../../services/api/apiClient";
import { useApiError } from "../../hooks/useApiError";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { useRouter } from "next/navigation";
export default function Register() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { handleError } = useApiError();
  const { form,error,onChange,validateAuthForm,validateForm } = useRegisterForm()
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(!validateAuthForm())return;
    if(!validateForm())return;
    setSaving(true);
    try {      
      await apiClient.post("/user", {
          username: form.username,
          password: form.password,
        gmail: form.gmail,
      });
      router.push('/login')
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Login</h1>
        <input type="text"placeholder="Username" name="username" onChange={onChange} />
        <input type="text"placeholder="Gmail" name="gmail" onChange={onChange} />
        <input type="password"placeholder="Password" name="password" onChange={onChange} />
        <button disabled={saving}>{saving ? "saving..." : "save"}</button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </div>
  );
}
