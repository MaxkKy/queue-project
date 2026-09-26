"use client"
import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import { useRouter } from "next/navigation";
import React, { useState } from "react"

export default function Register(){
    const [form,setForm] = useState({username:"",password:"",gmail:"",role:""});
    const [saving,setsaving] = useState(false)
    const router = useRouter();
    const {handleError} = useApiError();
    const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({...form,[e.target.name]:e.target.value})
    async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setsaving(true)
    try{
        await apiClient.post("/admin",{
            username:form.username,
            password:form.password,
            gmail:form.gmail,
            role:form.role
        })
        router.push("/admin/login")
    }
    catch(err){
        handleError(err);
    }
    finally{
        setsaving(false)
    }
    }
    return(
        <div>
            <form onSubmit={onSubmit} autoComplete="off">
                <input type="text" name="username" value={form.username} onChange={onChange} placeholder="Username" />
                <input type="email" name="gmail" onChange={onChange} placeholder="Gmail" />
                <input type="password" name="password" onChange={onChange} placeholder="Password" autoComplete="new-password"/>
              <select name="role" value={form.role} onChange={onChange}>
                    <option value="">โปรดเลือก Role</option>
                    <option value="ผู้ดูแล">ผู้ดูแล</option>
                    <option value="แม่ค้า">แม่ค้า</option>
              </select>
                <button disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </form>
        </div>
    )
}