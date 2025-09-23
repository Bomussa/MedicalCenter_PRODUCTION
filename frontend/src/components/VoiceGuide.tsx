import React, { useState } from 'react';
import type { PromptItem } from '../hooks/useVoicePrompts';

interface Props {
  id: string;
  prompt?: PromptItem;
  language?: 'ar'|'en';
}

export default function VoiceGuide({ id, prompt, language='ar' }: Props){
  if(!prompt) return null;
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  const text = language==='ar' ? prompt.ar : prompt.en;
  const audio = language==='ar' ? prompt.audio_ar : prompt.audio_en;

  return (
    <span style={{ display:'inline-block', marginInlineStart: 8 }}>
      <span role="button" aria-label={`hint-${id}`} onClick={()=>setOpen(!open)} style={{cursor:'pointer', color:'#c00'}}>❗</span>
      {open && (
        <div style={{ background:'#f9f9f9', border:'1px solid #ddd', borderRadius:6, padding:8, marginTop:4, minWidth:260 }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <p style={{margin:0}}>{text}</p>
            {audio && (
              <button onClick={()=>setMuted(!muted)} aria-label="toggle voice" style={{marginInlineStart:8}}>{muted?'🔇':'🔊'}</button>
            )}
          </div>
          {audio && <audio src={`/audio/${audio}`} autoPlay={!muted} muted={muted} controls style={{display:'none'}}/>}
        </div>
      )}
    </span>
  );
}
