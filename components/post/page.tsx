"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "../../services/api/apiClient";
import { useApiError } from "../../hooks/useApiError";
import { useRouter } from "next/navigation";
type User = {
  id: number;
  gmail: string;
};

type Menu = {
  id: number;
  name: string;
  price: number;
};

export default function PostQueue() {
  const [form, setForm] = useState({
    details: "",
  });
  const router = useRouter();
  const { handleError } = useApiError();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null);
  const [pick, setPick] = useState<number[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await apiClient.get("/user");
        setUser(user.data);

        const menu = await apiClient.get("/menu");
        setMenus(menu.data);
      } catch (err) {
        handleError(err);
      }
    }
    fetchData();
  }, []);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selectedItems = menus
      .filter((menu) => pick.includes(menu.id))
      .map((menu) => ({
        menuId: Number(menu.id),
        quantity: Number(quantities[menu.id] || 1),
      }));
    if (selectedItems.length === 0) {
      setError("โปรดเลือกรายการอาหาร")
    }

    setSaving(true);
    try {
      await apiClient.post(`/post`, {
        details: form.details,
        item: selectedItems,
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
       {
        menus.map((e) =>(
          <div key={e.id}>
              <label>
                <input
                  type="checkbox"
                  checked={pick.includes(e.id)}
                  onChange={() =>
                    setPick((current) =>
                      current.includes(e.id)
                        ? current.filter((id) => id !== e.id)
                        : [...current, e.id],
                    )
                  }
                />
            {e.name} + {e.price}
            </label>
              {pick.includes(e.id) && (
                <input
                  type="number"
                  min={1}
                  value={quantities[e.id] ?? 1}
                  onChange={(event) =>
                    setQuantities({
                      ...quantities,
                      [e.id]: Number(event.target.value),
                    })
                  }
                />
              )}
          </div>
        ))
       }
        <textarea
          rows={5}
          name="details"
          onChange={onChange}
          placeholder="รายละเอียดเพิ่มเติม เช่น ไม่เอาผัก,เพิ่มหมู"
        />
        <input type="text" name="gmail" value={user?.gmail ?? ""} readOnly />

        <button type="submit" disabled={saving || pick.length === 0}>
          {saving ? "saving..." : "Save"}
        </button>
        {error && <div style={{color:"crimson"}}>{error}</div>}
      </form>
    </div>
  );
}
