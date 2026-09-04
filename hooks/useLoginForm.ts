import React, { useState } from "react";

export function useLoginForm() {
    const [form,setForm] = useState({ gmail: "", password: "" });
    const [error,setError] = useState("")
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>setForm({...form,[e.target.name]:e.target.value})
    function validateLogin(){
        if(!form.gmail && !form.password){
            setError("Worng Gmail and Password")
            return false;
        }
        else if(!form.gmail){
            setError("Worng Gmail")
            return false;
        }
        else if(!form.password){
            setError("Worng Password")
            return false;
        }
        setError("");
        return true;
    }
    function validateForm(){
        const checkGmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}$/
        const checkPassword = /^[a-zA-Z0-9@%$]+$/ 
        if(!checkGmail.test(form.gmail)){
            setError("โปรดกรอก Gmail ให้ถูกต้อง")
            return false;
        }
        if(form.password.length < 8 && !checkPassword.test(form.password)){
            setError("กรอก Password ตำ่กว่า 8 ตัวอักษร และ โปรดกรอกPasswordให้ถูกต้อง[A-Z,a-z,0-9,_@%$]")
            return false;
        }
        if(!checkPassword.test(form.password)){
            setError("กรอก Password ให้ถูกต้อง[A-Z,a-z,0-9,_@%$]")
            return false;
        }
        if(form.password.length < 8){
            setError("Password อย่างตำ่ 8 ตัวอักษร")
            return false;
        }
        setError("")
        return true;
    }   

    return {form,validateLogin,error,onChange,validateForm}
}