import { useCallback } from 'react';

export default function useClinicRedirect(){
  const resolve = useCallback(async (slug: string): Promise<{ from:string; to:string|null; effective:string }|null> => {
    try{
      const q = new URLSearchParams({ slug }).toString();
      const r = await fetch(`/api/clinic-redirects/resolve?${q}`);
      if(!r.ok) return null;
      const j = await r.json();
      return j;
    }catch{
      return null;
    }
  }, []);
  return { resolve };
}
