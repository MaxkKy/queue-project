"use client";

import { AppError } from "@/lib/errors/AppError";
import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import e from "express";
import { includes } from "zod";
type postType = {
  id: number;
  details: string;
  updateAt: Date;
  createdAt: string;
  status: string;
  item: {
    quantity:true
    menu: {
      id: number;
      name: string;
      price: string;
    };
  }[];
};
export default function page() {
  const [post, setPost] = useState<postType[]>([]);
  const [search, setSearch] = useState("");
  const [load, setload] = useState(true);
  const [deleting, setdeleting] = useState(false);
  const [sort, setsort] = useState("desc");
  const { handleError } = useApiError();

  async function fetchPost() {
    try {
      const query = new URLSearchParams({ search, sort }).toString();
      const res = await apiClient.get(`/posts?${query}`);
      if (Array.isArray(res.data)) {
        setPost(res.data);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setload(false);
    }
  }
  useEffect(() => {
    fetchPost();
  }, []);
  async function onDelete(postId: number) {
    if (!confirm("Delete this Post? This cannot be undone.")) return;
    setdeleting(true);
    try {
      await apiClient.delete(`posts/${postId}`);
      setPost(post.filter((p) => p.id !== postId));
    } catch (err) {
      handleError(err);
    }
  }
  function handlefilterChange(e:React.FormEvent){
    e.preventDefault()
    fetchPost();
  }
  if (load) return <div>Loading...</div>;
  return (
    <div>
      <form onSubmit={handlefilterChange}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหารายละเอียด..."
        />
        <select name="sort" value={sort} onChange={(e) => setsort(e.target.value)}>
          <option value="desc">ล่าสุด</option>
          <option value="asc">เก่าสุด</option>
        </select>
        <button>Search</button>
        <h1>รายการอาหาร</h1>
        {post.filter((p) => p.item.some((i)=>i.menu.name.includes(search))).map((p) => (
          <div key={p.id}>
            {p.item.filter((i)=>i.menu.name.includes(search)).map((i)=>(
              <div key={i.menu.id}>
                <h1>อาหาร : {i.menu.name} เครื่องดื่ม : {i.menu.price}</h1>
                <h1>จำนวน : {i.quantity} menu</h1>
              </div>
            ))}
            <h1>วันที่ : {new Date(p.createdAt).toLocaleString()}</h1>
            <button onClick={() => onDelete(p.id)}>
              {deleting ? "deleting..." : "Delete"}
            </button>
            <h1>////////////////////////////////////////////////</h1>
          </div>
        ))}
      </form>
    </div>
  );
}
