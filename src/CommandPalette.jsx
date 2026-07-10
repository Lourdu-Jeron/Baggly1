import { useEffect, useRef, useState } from 'react';

export const CommandPalette = ({open,onClose,setPage,pages}) => {
  const [q,setQ] = useState("");
  const ref = useRef();
  useEffect(()=>{ if(open && ref.current) ref.current.focus(); setQ(""); },[open]);
  const results = pages.filter(p=>
    p.label.toLowerCase().includes(q.toLowerCase()) ||
    (p.keywords||[]).some(k=>k.includes(q.toLowerCase()))
  );
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"10vh",backdropFilter:"blur(6px)"}}
      onClick={onClose}>
      <div className="card scale" style={{width:480,overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderBottom:"1px solid var(--border)"}}>
          <span style={{fontSize:18,color:"var(--text3)"}}>⌘</span>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search pages and actions…"
            style={{border:"none!important",background:"transparent!important",fontSize:15,fontWeight:500,flex:1,outline:"none!important",color:"var(--text)!important"}}
            onKeyDown={e=>{
              if(e.key==="Escape") onClose();
              if(e.key==="Enter"&&results[0]){ setPage(results[0].id); onClose(); }
            }}/>
          <kbd style={{fontSize:10,background:"var(--card2)",border:"1px solid var(--border)",padding:"2px 7px",borderRadius:4,color:"var(--text3)"}}>ESC</kbd>
        </div>
        <div style={{maxHeight:320,overflowY:"auto"}}>
          {results.length===0
            ?<p style={{padding:"28px",textAlign:"center",color:"var(--text3)",fontSize:13}}>No results for "{q}"</p>
            :results.map(p=>(
              <button key={p.id} onClick={()=>{setPage(p.id);onClose();}}
                style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 16px",border:"none",background:"transparent",color:"var(--text)",textAlign:"left",borderBottom:"1px solid var(--border)"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--plight)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:22,flexShrink:0}}>{p.icon}</span>
                <div style={{flex:1}}>
                  <p style={{fontWeight:600,fontSize:13,margin:0}}>{p.label}</p>
                  <p style={{fontSize:11,color:"var(--text3)",margin:"2px 0 0"}}>{p.desc}</p>
                </div>
                <kbd style={{fontSize:10,background:"var(--card2)",border:"1px solid var(--border)",padding:"2px 6px",borderRadius:4,color:"var(--text3)"}}>↵</kbd>
              </button>
            ))
          }
        </div>
        <div style={{padding:"8px 16px",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:10,color:"var(--text3)"}}>↵ Select · ESC Close</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  PAGES — DASHBOARD
// ═══════════════════════════════════════════════
