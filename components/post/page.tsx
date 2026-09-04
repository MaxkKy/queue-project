"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "../../services/api/apiClient";
import { useApiError } from "../../hooks/useApiError";
import { useRouter } from "next/navigation";
type useType = {
  id: number;
  gmail: string;
};
export default function PostQueue() {
  const [form, setForm] = useState({
    name: "",
    details: "",
    queueId: 0,
    userId: 0,
  });
  const router = useRouter();
  const { handleError } = useApiError();
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<useType | null>(null);
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(() => {
    async function jwtLogin() {
      try {
        const res = await apiClient.get("/user");
        setUser(res.data);
      } catch (err) {
        handleError(err);
      }
    }
    jwtLogin();
  }, []);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post(`/post`, {
        name: form.name,
        details: form.details,
        queueId: form.queueId,
      });
      router.push(`/`);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div>
      <h1>ร้านอาหารตามสั่ง</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          onChange={onChange}
          placeholder="อาหาร/เครื่องดื่ม"
        />
        <textarea
          rows={5}
          name="details"
          onChange={onChange}
          placeholder="รายละเอียดเพิ่มเติม เช่น ไม่เอาผัก,เพิ่มหมู"
        />
        <input type="text" name="gmail" value={user?.gmail ?? ""} readOnly />
        
        <button disabled={saving}>{saving ? "saving..." : "Save"}</button>
      </form>
    </div>
  );
}
