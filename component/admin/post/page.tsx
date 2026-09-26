"use client"
import { useApiError } from "@/hooks/useApiError";
import { apiClient } from "@/services/api/apiClient";
import { useRouter } from "next/navigation";
import React, { useState } from "react"

export default function Post(){
    const [form,setForm] = useState({name:"",price:0});
    const [saving,setsaving] = useState(false);
    const {handleError} = useApiError();
    const router = useRouter();
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => setForm({...form,[e.target.name]:e.target.value})
    async function onSubmit(e:React.FormEvent) {
        e.preventDefault()
        setsaving(true);
        try{
            await apiClient.post("/menus",{
                name:form.name,price:form.price
            })
            router.push("/")
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
                <input type="text" onChange={onChange} name="name" placeholder="อาหาร/เครื่องดื่ม" />
                <input type="number" onChange={onChange} name="price" placeholder="ราคา" />
                <button disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </form>
        </div>
    )
}