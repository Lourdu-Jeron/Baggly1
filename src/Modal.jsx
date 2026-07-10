import { useEffect } from 'react';

export const Modal = ({open,onClose,title,children,width=520}) => {
  useEffect(()=>{
    const fn=e=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[onClose]);
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div className="card scale" style={{width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 22px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"var(--card)",zIndex:1}}>
          <h3 style={{fontWeight:700,fontSize:16}}>{title}</h3>
          <button className="btn-ghost" onClick={onClose} style={{fontSize:18}}>✕</button>
        </div>
        <div style={{padding:"20px 22px"}}>{children}</div>
      </div>
    </div>
  );
};
