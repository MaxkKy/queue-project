"use client";

import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type menuType = {
  id: number;
  name: string;
  price: number;
};
type userType = {
  gmail: string;
};
export default function Post() {
  const [form, setForm] = useState({ details: "" });
  const [menus, setmenus] = useState<menuType[]>([]);
  const [user, setUser] = useState<userType | null>(null);
  const [saving, setsaving] = useState(false);
  const [pick, setpick] = useState<number[]>([]);
  const [quantities, setquantities] = useState<{ [key: number]: number }>({});
  const router = useRouter();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const { handleError } = useApiError();
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await apiClient.get("/user");
        setUser(user.data);
        const menu = await apiClient.get("/menus");
        setmenus(menu.data);
      } catch (err) {
        handleError(err);
      }
    }
    fetchData();
  }, []);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setsaving(true);
    const menuSelect = menus
      .filter((menu) => pick.includes(menu.id))
      .map((menu) => ({
        menuId: Number(menu.id),
        quantity: Number(quantities[menu.id] || 1),
      }));
    try {
      await apiClient.post("/posts", {
        details: form.details,
        item: menuSelect,
      });
      router.push("/");
    } catch (err) {
      handleError(err);
    } finally {
      setsaving(false);
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        {menus.map((item) => (
          <div key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={pick.includes(item.id)}
                onChange={() =>
                  setpick((current) =>
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id],
                  )
                }
              />
              {item.name} + {item.price}
            </label>
            {pick.includes(item.id) && (
              <input
                type="number"
                placeholder="จำนวน"
                min={1}
                value={quantities[item.id] ?? 1}
                onChange={(e) =>
                  setquantities({
                    ...quantities,
                    [item.id]: Number(e.target.value),
                  })
                }
              />
            )}
          </div>
        ))}
        <input
          type="text"
          name="details"
          value={form.details}
          onChange={onChange}
          placeholder="detail"
        />
        <input type="text" value={user?.gmail ?? ""} readOnly />
        <button disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}
