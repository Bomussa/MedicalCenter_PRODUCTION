import { useEffect, useState } from 'react';

export interface PromptItem {
  ar: string;
  en: string;
  audio_ar?: string;
  audio_en?: string;
}
export type Prompts = Record<string, PromptItem>;

export default function useVoicePrompts(){
  const [prompts, setPrompts] = useState<Prompts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();

  useEffect(()=>{
    let active = true;
    fetch('/api/voice-prompts')
      .then(r=>r.json())
      .then(d=>{ if(active){ setPrompts(d||{}); setLoading(false); } })
      .catch(e=>{ if(active){ setError(String(e)); setLoading(false); } });
    return ()=>{ active = false; };
  }, []);

  return { prompts, loading, error };
}
