import React, { useEffect, useState } from "react";

export default function Users(){
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ username:"", password:"", role:"ADMIN" });
  const token = typeof window!=="undefined" ? localStorage.getItem("mc_token") : null;

  const load = async ()=>{
    const res = await fetch("/api/auth2/users", { 
      headers:{ Authorization: `Bearer ${token}` }
    });
    setRows(await res.json());
  };
  
  useEffect(()=>{ load(); }, []);

  const add = async ()=>{
    await fetch("/api/auth2/users", {
      method:"POST",
      headers:{ 
        "Content-Type":"application/json", 
        Authorization:`Bearer ${token}` 
      },
      body: JSON.stringify(form)
    });
    setForm({ username:"", password:"", role:"ADMIN" }); 
    load();
  };

  return (
    <section>
      <h2>إدارة المستخدمين</h2>
      <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
        <input 
          placeholder="اسم المستخدم" 
          value={form.username} 
          onChange={e=>setForm({...form, username:e.target.value})}
        />
        <input 
          placeholder="كلمة المرور" 
          value={form.password} 
          onChange={e=>setForm({...form, password:e.target.value})}
        />
        <select 
          value={form.role} 
          onChange={e=>setForm({...form, role:e.target.value})}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>
        <button onClick={add}>إضافة</button>
      </div>
      <table style={{marginTop:12, width:"100%"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.username}</td>
              <td>{r.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

