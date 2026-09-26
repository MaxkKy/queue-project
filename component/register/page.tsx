"use client"
import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import { useRouter } from "next/navigation";
import React, { useState } from "react"

export default function Register(){
    const [form,setForm] = useState({username:"",password:"",gmail:""});
    const [saving,setsaving] = useState(false)
    const router = useRouter();
    const {handleError} = useApiError();
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => setForm({...form,[e.target.name]:e.target.value})
    async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setsaving(true)
    try{
        await apiClient.post("/user",{
            username:form.username,
            password:form.password,
            gmail:form.gmail
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
            <form onSubmit={onSubmit}>
                <input type="text" name="username" onChange={onChange} placeholder="Username" />
                <input type="email" name="gmail" onChange={onChange} placeholder="Gmail" />
                <input type="password" name="password" onChange={onChange} placeholder="Password" />
                <button disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </form>
        </div>
    )
}