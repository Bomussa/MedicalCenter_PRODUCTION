import React, { useEffect, useState } from 'react';
import type { Prompts, PromptItem } from '../hooks/useVoicePrompts';

export default function AdminVoicePrompts(){
  const [data, setData] = useState<Prompts>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{id:string; ar:string; en:string; audio_ar?:string; audio_en?:string}>({id:'', ar:'', en:''});
  const [editing, setEditing] = useState<string|null>(null);
  const [error, setError] = useState<string|undefined>();

  const reload = ()=>{
    setLoading(true);
    fetch('/api/voice-prompts').then(r=>r.json()).then(d=>{ setData(d||{}); setLoading(false); }).catch(e=>{ setError(String(e)); setLoading(false); });
  };

  useEffect(()=>{ reload(); }, []);

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();
    try{
      const url = editing? `/api/voice-prompts/${editing}` : '/api/voice-prompts';
      const method = editing? 'PUT' : 'POST';
      const body:any = { ar: form.ar, en: form.en, audio_ar: form.audio_ar, audio_en: form.audio_en };
      if(!editing) body.id = form.id;
      const r = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const j = await r.json();
      if(!r.ok) throw new Error(j?.message || 'Request failed');
      setForm({id:'', ar:'', en:''});
      setEditing(null);
      reload();
    }catch(err:any){
      setError(err.message);
    }
  };

  const del = async (id:string)=>{
    if(!confirm('Delete this prompt?')) return;
    await fetch('/api/voice-prompts/'+id, { method:'DELETE' });
    reload();
  };

  if(loading) return <div>Loading prompts…</div>;
  return (
    <div style={{padding:16}}>
      <h2>Voice Prompts Management</h2>
      {error && <div style={{color:'red'}}>{error}</div>}

      <form onSubmit={submit} style={{marginBottom:16, border:'1px solid #ccc', padding:12, borderRadius:8}}>
        {!editing && (
          <div style={{marginBottom:8}}>
            <label>ID&nbsp;</label>
            <input value={form.id} onChange={e=>setForm({...form, id:e.target.value})} required placeholder="welcome / enter_id_gender / ..." />
          </div>
        )}
        <div style={{marginBottom:8}}>
          <label>Arabic Text&nbsp;</label>
          <input value={form.ar} onChange={e=>setForm({...form, ar:e.target.value})} required />
        </div>
        <div style={{marginBottom:8}}>
          <label>English Text&nbsp;</label>
          <input value={form.en} onChange={e=>setForm({...form, en:e.target.value})} required />
        </div>
        <div style={{marginBottom:8}}>
          <label>Arabic Audio filename&nbsp;</label>
          <input value={form.audio_ar||''} onChange={e=>setForm({...form, audio_ar:e.target.value||undefined})} placeholder="welcome_ar.mp3" />
        </div>
        <div style={{marginBottom:8}}>
          <label>English Audio filename&nbsp;</label>
          <input value={form.audio_en||''} onChange={e=>setForm({...form, audio_en:e.target.value||undefined})} placeholder="welcome_en.mp3" />
        </div>
        <button type="submit">{editing? 'Save' : 'Add'}</button>
        {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({id:'', ar:'', en:''}); }} style={{marginInlineStart:8}}>Cancel</button>}
      </form>

      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{borderBottom:'1px solid #ccc', textAlign:'left'}}>ID</th>
            <th style={{borderBottom:'1px solid #ccc', textAlign:'left'}}>AR</th>
            <th style={{borderBottom:'1px solid #ccc', textAlign:'left'}}>EN</th>
            <th style={{borderBottom:'1px solid #ccc', textAlign:'left'}}>Audio AR</th>
            <th style={{borderBottom:'1px solid #ccc', textAlign:'left'}}>Audio EN</th>
            <th style={{borderBottom:'1px solid #ccc'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([id, item])=> (
            <tr key={id}>
              <td style={{borderBottom:'1px solid #eee'}}>{id}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{item.ar}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{item.en}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{item.audio_ar||'-'}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{item.audio_en||'-'}</td>
              <td style={{borderBottom:'1px solid #eee'}}>
                <button onClick={()=>{ setEditing(id); setForm({id, ar:item.ar, en:item.en, audio_ar:item.audio_ar, audio_en:item.audio_en}); }}>Edit</button>
                <button onClick={()=>del(id)} style={{marginInlineStart:8}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
