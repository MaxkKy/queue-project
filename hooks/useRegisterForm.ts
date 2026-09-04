import React, { useState } from "react";

export const useRegisterForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    gmail: "",
    role:""
  });
  const [error, setError] = useState("");
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  function validateAuthForm() {
    if (!form.username && !form.password && !form.gmail) {
      setError("โปรดกรอกข้อมูล");
      return false;
    }
    else if (!form.username && !form.password) {
      setError("โปรดกรอก Username / Password");
      return false;
    }
    else if (!form.username && !form.gmail) {
      setError("โปรดกรอก Username / Gmail");
      return false;
    }
    else if (!form.password && !form.gmail) {
      setError("โปรดกรอก Gmail / Password");
      return false;
    }
    else if (!form.username) {
      setError("โปรดกรอก ชื่อ");
      return false;
    }
    else if (!form.password) {
      setError("โปรดกรอก Password");
      return false;
    }
    else if (!form.gmail) {
      setError("โปรดกรอก Gmail");
      return false;
    }
    setError("");
    return true; 
  }
  function validateForm() {
    const checkPassword = /[a-zA-Z0-9._%$]+$/
    const checkGmail = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/
    if (!checkGmail.test(form.gmail)) {
      setError("โปรดกรอก Gmail ให้ถูกต้อง");
      return false;
    }
    if(!checkPassword.test(form.password) && form.password.length < 8){
      setError("กรอก Password ตำ่กว่า 8 ตัวอักษร และ โปรดกรอกPasswordให้ถูกต้อง[A-Z,a-z,0-9,_@%$]")
      return false;
     }
    else if(form.password.length < 8){
      setError("Password อย่างตำ่ 8 ตัวอักษร")
      return false;
    }
    else if(!checkPassword.test(form.password)){
      setError("กรอก Password ให้ถูกต้อง[A-Z,a-z,0-9,_@%$] ")
      return false;
    }
    
    setError("");
    return true;
  }
  function validateRole() {
    if (!form.role) {
      setError("โปรดเลือก Role");
      return false;
    }
    setError("");
    return true;
  }
  return { form, error, onChange, validateAuthForm,validateForm,validateRole };
};
