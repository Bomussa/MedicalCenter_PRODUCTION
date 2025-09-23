import React, { useEffect, useState } from 'react';

type MapT = Record<string,string>;

export default function AdminClinicRedirects(){
  const [map, setMap] = useState<MapT>({});
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = ()=> fetch('/api/clinic-redirects').then(r=>r.json()).then(setMap);
  useEffect(()=>{ load(); }, []);

  const save = async (e:React.FormEvent)=>{
    e.preventDefault();
    await fetch('/api/clinic-redirects/'+encodeURIComponent(from), {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ to })
    });
    setFrom(''); setTo('');
    load();
  };

  const del = async (k:string)=>{
    await fetch('/api/clinic-redirects/'+encodeURIComponent(k), { method:'DELETE' });
    load();
  };

  return (
    <div style={{padding:16}}>
      <h2>Clinic Redirects</h2>
      <form onSubmit={save} style={{marginBottom:12}}>
        <input placeholder="from (e.g., surgery)" value={from} onChange={e=>setFrom(e.target.value)} required />
        <span style={{margin:'0 8px'}}>→</span>
        <input placeholder="to (e.g., internal_medicine)" value={to} onChange={e=>setTo(e.target.value)} required />
        <button type="submit" style={{marginInlineStart:8}}>Save Redirect</button>
      </form>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th style={{textAlign:'left'}}>From</th><th style={{textAlign:'left'}}>To</th><th>Actions</th></tr></thead>
        <tbody>
          {Object.entries(map).map(([k,v])=>(
            <tr key={k}>
              <td style={{borderBottom:'1px solid #eee'}}>{k}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{v}</td>
              <td style={{borderBottom:'1px solid #eee'}}><button onClick={()=>del(k)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{marginTop:10, color:'#555'}}>Use slugs/names that your PIN system recognizes (e.g., 'surgery', 'radiology', 'internal_medicine').</p>
    </div>
  );
}
