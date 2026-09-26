"use client"

import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react"

export default function Login(){
    const [form,setForm] = useState({gmail:"",password:""});
    const [saving,setsaving] = useState(false);
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => setForm({...form,[e.target.name]:e.target.value})
    const {handleError} = useApiError();
    const router = useRouter();
    async function onLogin(e:React.FormEvent){
        e.preventDefault();
        setsaving(true);
        try{
            await apiClient.post("/login",{
                gmail:form.gmail,password:form.password
            })
            router.push("/")
        }
        catch(err){
            handleError(err);
        }
        finally{
            setsaving(false);
        }
    }
    return(
        <div>
            <form onSubmit={onLogin}>
                <input type="email" name="gmail" onChange={onChange} placeholder="Gmail" />
                <input type="password" name="password" onChange={onChange} placeholder="Password" />
                <button disabled={saving}>{saving ? "saving..." : "Save"}</button>
            </form>
        </div>
    )
}