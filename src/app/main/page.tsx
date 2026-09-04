"use client";
import { useEffect, useState } from "react";
import { apiClient } from "../../../services/api/apiClient";
import { useApiError } from "../../../hooks/useApiError";
import { useRouter } from "next/navigation";
import { AppError } from "../../../lib/errors/AppError";

type useTypeUser = {
  username: string;
};
type useTypePost = {
  id: number;
  name: string;
  details: string;
  createdAt: Date;
  queue: { status: string } | null;
  userId: number;
};

export default function page() {
  const [post, setPost] = useState<useTypePost[]>([]);
  const [loading, setloading] = useState(true);
  const [user, setUser] = useState<useTypeUser | null>(null);
  const router = useRouter();
  const { handleError } = useApiError();
  useEffect(() => {
    async function loadPost() {
      try {
        const res = await apiClient.get(`/post`);
        if (Array.isArray(res.data)) {
          setPost(res.data);
        } else {
          setPost([]);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setloading(false);
      }
    }
    loadPost();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return post.length === 0 ? (
    <div>
      <h2>ไม่มีรายการ</h2>
    </div>
  ) : (
    <div>
      <h1>รายการที่สั่ง</h1>
      <ul>
        {post.map((item) => (
          <li key={item.id}>
            <h1>Food/Drink : {item.name}</h1>
            {item.details ? <p>รายละเอียดเพิ่มเติม : {item.details}</p> : ""}
            <p>สร้าง : {new Date(item.createdAt).toLocaleDateString()}</p>
            {item.queue?.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
