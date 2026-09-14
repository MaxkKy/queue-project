"use client";

import React, { useState } from "react";
import { useApiError } from "../../../hooks/useApiError";
import { apiClient } from "../../../services/api/apiClient";
import { useRouter } from "next/navigation";

export default function Menu() {
  const [form, setform] = useState({ name: "", price: 0 });
  const [saving,setsaving] = useState(false)
  const {handleError} = useApiError();
  const router = useRouter();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setform({ ...form, [e.target.name]: e.target.value });
  async function onSubmit(e:React.FormEvent){
    setsaving(true);
    e.preventDefault();
    try{
        await apiClient.post(`/admin/menu`,{
            name:form.name,
            price:Number(form.price)
        })
        router.push(`/admin`)
    }   
    catch(err){
        handleError(err)
    }
    finally{
        setsaving(false)
    }
  }
  return(
    <div>
        <form onSubmit={onSubmit}>
            <input type="text"name="name" onChange={onChange} placeholder="อาหาร/เครื่องดื่ม" />
            <input type="number"name="price" onChange={onChange} placeholder="ราคา" />
            <button disabled={saving}>{saving ? "Saving...": "Save"}</button>
        </form>
    </div>
  )
}
