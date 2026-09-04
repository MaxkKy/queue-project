"use client"

import React, { useState } from "react"
export default function addQueue(){
    const [form,setForm] = useState({queue:""});
    const [saving,setSaving] = useState(false)
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => setForm({...form,[e.target.name]:e.target.value})
    return(
        <div>
            <input type="text" />           
        </div>
    )
}