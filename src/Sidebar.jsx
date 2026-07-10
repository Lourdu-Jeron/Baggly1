export const Sidebar = ({ sidebar, page, pages, setPage, setCmdOpen, dark, setDark, addToast, setSidebar }) => (
  <aside style={{width:sidebar?228:66,background:"var(--card)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",flexShrink:0,transition:"width .25s ease",overflow:"hidden"}}>
    <div style={{padding:"18px 14px",borderBottom:"1px solid var(--border)",minHeight:66,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#6366f1,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 4px 14px rgba(99,102,241,.3)"}}>👜</div>
      {sidebar&&<div>
        <p style={{fontWeight:900,fontSize:17,margin:0,background:"linear-gradient(135deg,#6366f1,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-.3px"}}>Baggly</p>
        <p style={{fontSize:9,color:"var(--text3)",margin:0,letterSpacing:".06em"}}>MANUFACTURING PLATFORM</p>
      </div>}
    </div>
    <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:3}}>
      {pages.map(p=>(
        <button key={p.id} className={`nav-item${page===p.id?" on":""}`} onClick={()=>setPage(p.id)} title={p.label}>
          <span style={{fontSize:18,flexShrink:0}}>{p.icon}</span>
          {sidebar&&<span style={{flex:1}}>{p.label}</span>}
          {page===p.id&&sidebar&&<span style={{width:6,height:6,borderRadius:"50%",background:"var(--primary)",flexShrink:0}}/>}
        </button>
      ))}
    </nav>
    <div style={{padding:"10px 8px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:3}}>
      <button className="nav-item" onClick={()=>setCmdOpen(true)} title="Command Palette (⌘K)">
        <span style={{fontSize:18,flexShrink:0}}>⌘</span>
        {sidebar&&<div style={{display:"flex",flex:1,justifyContent:"space-between",alignItems:"center"}}>
          <span>Command</span>
          <kbd className="mono" style={{fontSize:9,background:"var(--card2)",border:"1px solid var(--border)",padding:"1px 5px",borderRadius:4,color:"var(--text3)"}}>⌘K</kbd>
        </div>}
      </button>
      <button className="nav-item" onClick={()=>{setDark(!dark);addToast(`${!dark?"Dark":"Light"} mode`,"info");}} title="Toggle Theme">
        <span style={{fontSize:18,flexShrink:0}}>{dark?"☀️":"🌙"}</span>
        {sidebar&&<span>{dark?"Light Mode":"Dark Mode"}</span>}
      </button>
      <button className="nav-item" onClick={()=>setSidebar(!sidebar)} title="Toggle Sidebar">
        <span style={{fontSize:18,flexShrink:0}}>{sidebar?"◀":"▶"}</span>
        {sidebar&&<span>Collapse</span>}
      </button>
    </div>
  </aside>
);