"use client";
import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import { useEffect, useState } from "react";

type userType = {
  id: number;
  gmail: string;
  username: string;
  post: {
    id: number;
    status: "WAITING" | "COMPLETE";
    details: string;
    createdAt: Date;
    updateAt: Date;
    item: {
      quantity: number;
      menu: {
        id: number;
        name: string;
        price: string;
      };
    }[];
  }[];
};
export default function Main() {
  const [user, setuser] = useState<userType[]>([]);
  const { handleError } = useApiError();
  const [loading, setloading] = useState(true);
  const [saving, setsaving] = useState<number | null>(null);
  const [status, setStatus] = useState<{ [postId: number]: string }>({});
  useEffect(() => {
    async function fetchData() {
      try {
        const users = await apiClient.get("/users");
        if (Array.isArray(users.data)) {
          setuser(users.data);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setloading(false);
      }
    }
    fetchData();
  }, []);
  async function onUpdate(
    postId: number,
    currentStatus: "WAITING" | "COMPLETE",
  ) {
    setsaving(postId);
    try {
      const res = await apiClient.put(`/posts/${postId}`, {
        status: status[postId] ?? currentStatus,
      });
      const updatedPost = res.data.updatePost;
      setuser((prev) =>
        prev.map((u) => ({
          ...u,
          post: u.post.map((post) =>
            post.id !== postId ? post : { ...post, status: updatedPost.status },
          ),  
        })),
      );
    } catch (err) {
      handleError(err);
    } finally {
      setsaving(null);
    }
  }
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {user.map((item) => (
        <div key={item.id}>
          <h1>
            ชื่อผู้ใช้ : {item.username} gmail : {item.gmail}
          </h1>
          {item.post.map((p) => (
            <div key={p.id}>
              {p.item.map((m) => (
                <div key={m.menu.id}>
                  <h1>
                    อาหาร/เครื่องดื่ม : {m.menu.name} จำนวน : {m.quantity} เมนู
                  </h1>
                  <h1>ราคา : {m.menu.price} บาท</h1>
                </div>
              ))}
              <h1>{p.details}</h1>
              <select
                name="status"
                value={status[p.id] ?? p.status}
                onChange={(e) =>
                  setStatus({ ...status, [p.id]: e.target.value })
                }
              >
                <option value="WAITING">Waiting</option>
                <option value="COMPLETE">Complete</option>
              </select>
              <button
                disabled={saving === p.id}
                onClick={() => onUpdate(p.id, p.status)}
              >
                {saving === p.id ? "Saving" : "Save"}
              </button>
              <h1>สถานะปัจจุบัน : {p.status}</h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
