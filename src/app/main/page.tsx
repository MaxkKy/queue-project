"use client";
import { useEffect, useState } from "react";
import { apiClient } from "../../../services/api/apiClient";
import { useApiError } from "../../../hooks/useApiError";
import { useParams } from "next/navigation";

type useTypePost = {
  id: number;
  details: string;
  createdAt: Date;
  status: string;
  item: {
    quantity: number;
    menu: {
      id: number;
      name: string;
      price: number;
    };
  }[];
};

export default function page() {
  const [post, setPost] = useState<useTypePost[]>([]);
  const [loading, setloading] = useState(true);
  const { handleError } = useApiError();
  const [deleting, setDeleting] = useState(false);
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
  async function onDelete(postId:number){
  if(!confirm("Delete this Post? This cannot be undone."))return;
  setDeleting(true);
  try{
    await apiClient.delete(`/post/${postId}`)
    setPost(post.filter(p => p.id !== postId));
  }
  catch(err){
    handleError(err)
  }
  finally{
    setDeleting(false)
  }
  }
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
            {item.item.map((e) => (
              <div key={e.menu.id}>
                <h1>Food/Drink :{e.menu.name}</h1>
                <h1>ราคา : {e.menu.price}</h1>
                <h1>จำนวน : {e.quantity}</h1>
              </div>
            ))}
            {item.details ? <p>รายละเอียดเพิ่มเติม : {item.details}</p> : ""}
            <p>สร้าง : {new Date(item.createdAt).toLocaleDateString()}</p>
            {item.status}
            <button onClick={()=>onDelete(item.id)}>Delete</button>
            <p>//////////////////////////////////////////////////////////</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
