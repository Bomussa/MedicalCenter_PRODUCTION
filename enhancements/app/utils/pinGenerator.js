function dailyPin(id){ const d=new Date(); const base=d.getFullYear()*1000+(d.getMonth()+1)*50+d.getDate(); let s=base; for(const c of id) s+=c.charCodeAt(0); return (s%99)+1; }

export { dailyPin };


