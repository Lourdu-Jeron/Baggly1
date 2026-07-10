export const Toast = ({toasts}) => (
  <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
    {toasts.map(t=>(
      <div key={t.id} className="fade" style={{
        padding:"11px 18px",borderRadius:12,fontSize:13,fontWeight:500,minWidth:250,
        background:t.type==="error"?"#fef2f2":t.type==="warn"?"#fffbeb":t.type==="info"?"var(--plight)":"var(--card)",
        border:`1px solid ${t.type==="error"?"#fecaca":t.type==="warn"?"#fde68a":t.type==="info"?"var(--primary)":"var(--border)"}`,
        color:t.type==="error"?"#dc2626":t.type==="warn"?"#d97706":t.type==="info"?"var(--primary)":"var(--text)",
        boxShadow:"0 6px 20px rgba(0,0,0,.15)",pointerEvents:"all"
      }}>{t.msg}</div>
    ))}
  </div>
);
