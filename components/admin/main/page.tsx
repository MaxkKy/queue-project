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
    name: string;
    details: string;
    createdAt: string;
    queue: {
      id: number;
      status: string;
      updateAt: string;
    } | null;
    }[];
  };

export default function Admin() {
  const [users, setUsers] = useState<useTypeUser[]>([]);
  const [loading, setloading] = useState(true);
  const [saving, setsaving] = useState(false);
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
  // postId: number มันรับ id จากตอนยิง button put เช่น ตอนนี้เราต้องการ Update post 5 put จะรับ id:5 ส่งไปให้ postId 
  // currentStatus: string รับ status ที่มากับ p.queue!.status ใช่ไหม
  async function updateQueue(postId: number, currentStatus: string) {
    setsaving(true);
    try {
      const res = await apiClient.put(`/post/${postId}`, {
        status: status[postId] ?? currentStatus,
      });
      if (res.data.queue) {
        setUsers((prev) =>
          prev.map((u) => ({
            ...u,
            post: u.post.map((post) =>
              post.id !== postId ? post : { ...post, queue: res.data.queue },
            ),
          })),
        );
      }
    } catch (err) {
      handleError(err);
    } finally {
      setsaving(false);
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
              <h1>อาหาร/เครื่องดื่ม : {p.name}</h1>
              <h2>รายละเอียดเพิ่มเติม : {p.details}</h2>
              <h1>สั่งวันที่ : {new Date(p.createdAt).toLocaleDateString()}</h1>
              {p.queue && (
                <>
                  <select
                    name="status"
                    value={status[p.id] ?? p.queue.status}
                    onChange={(e) =>
                      setStatus({ ...status, [p.id]: e.target.value })
                    }
                  >
                    <option value="WAITING">WAITING</option>
                    <option value="COMPLETE">COMPLETE</option>
                  </select>
                  <button
                    disabled={saving}
                    onClick={() =>
                      updateQueue(p.id, p.queue!.status)
                    }
                  >
                    {saving ? "Saving" : "Save"}
                  </button>
                  <h1>Update Status : {new Date(p.queue.updateAt).toLocaleDateString()}</h1>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
