"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "../../../services/api/apiClient";
import { useApiError } from "../../../hooks/useApiError";

type useTypeUser = {
  id: number;
  username: string;
  gmail: string;
  post: {
    id: number;
    details: string | null;
    createdAt: string;
    status: "WAITING" | "COMPLETE";
    item: {
      quantity: number;
      menu: {
        id: number;
        name: string;
        price: number;
      };
    }[];
    }[];
  };

export default function Admin() {
  const [users, setUsers] = useState<useTypeUser[]>([]);
  const [loading, setloading] = useState(true);
  const [savingPostId, setSavingPostId] = useState<number | null>(null);
  const [status, setStatus] = useState<{ [postId: number]: string }>({});
  const { handleError } = useApiError();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiClient.get(`/users`);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setloading(false);
      }
    }
    fetchUser();
  }, []);
  async function updateStatus(postId: number, currentStatus: "WAITING" | "COMPLETE") {
    setSavingPostId(postId);
    try {
      const res = await apiClient.put(`/post/${postId}`, {
        status: status[postId] ?? currentStatus,
      });
      const updatedPost = res.data.updatedPost;
      setUsers((prev) =>
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
      setSavingPostId(null);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return users.length === 0 ? (
    <div>
      <h1>ยังไม่มีรายการ</h1>
    </div>
  ) : (
    <div>
      <h1>Admin Manage</h1>
      <p>หน้าสำหรับแอดมิน</p>
      {users.map((item) => (
        <div key={item.id}>
          <h1>เมนูที่สั่ง / ชื่อคนสั่ง</h1>
          <h1>
            Username/Gmail : {item.username} / {item.gmail}
          </h1>
          {item.post.map((p) => (
            <div key={p.id}>
              {p.item.map((e)=>(
                <div>
                  <h1>อาหาร/เครื่องดื่ม : {e.menu.name}</h1>
                  <h1>ราคา : {e.menu.price}</h1>
                  <h1>จำนวน : {e.quantity}</h1>
                </div>
              ))}
              <h2>รายละเอียดเพิ่มเติม : {p.details}</h2>
              <h1>สั่งวันที่ : {new Date(p.createdAt).toLocaleDateString()}</h1>
              <select
                name="status"
                value={status[p.id] ?? p.status}
                onChange={(e) =>
                  setStatus({
                    ...status,
                    [p.id]: e.target.value as "WAITING" | "COMPLETE",
                  })
                }
              >
                <option value="WAITING">WAITING</option>
                <option value="COMPLETE">COMPLETE</option>
              </select>
              <button
                disabled={savingPostId === p.id}
                onClick={() => updateStatus(p.id, p.status)}
              >
                {savingPostId === p.id ? "Saving" : "Save"}
              </button>
              <h1>สถานะปัจจุบัน : {p.status}</h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
