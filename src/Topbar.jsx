import { Tag } from './Tag';

export const Topbar = ({ cur, setCmdOpen, addToast, notifOpen, setNotif, unread, notifs, dark, setDark, profile, clock, setPage }) => (
  <header style={{height:62,background:"var(--card)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 20px",gap:12,flexShrink:0,zIndex:10,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
      <span style={{fontSize:20}}>{cur?.icon}</span>
      <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--text3)"}}>
        <span style={{fontWeight:700,color:"var(--primary)"}}>Baggly</span>
        <span style={{color:"var(--border)"}}>›</span>
        <span style={{color:"var(--text)",fontWeight:600}}>{cur?.label}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:"var(--card2)",borderRadius:20,border:"1px solid var(--border)",marginLeft:8}}>
        <span className="live-dot"/>
        <span style={{fontSize:10,fontWeight:600,color:"var(--text2)"}}>Demo data</span>
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <button onClick={()=>setCmdOpen(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",background:"var(--card2)",border:"1px solid var(--border)",borderRadius:10,color:"var(--text2)",fontSize:12,cursor:"pointer"}}>
        <span>🔍</span><span style={{color:"var(--text3)"}}>Search…</span>
        <kbd className="mono" style={{fontSize:10,background:"var(--card)",border:"1px solid var(--border)",padding:"1px 6px",borderRadius:4,color:"var(--text3)"}}>⌘K</kbd>
      </button>
      <button className="btn-ghost" onClick={()=>addToast("Report exported as PDF","info")} title="Export">📊</button>
      <div style={{position:"relative"}}>
        <button className="btn-ghost" onClick={()=>setNotif(!notifOpen)}>
          🔔
          {unread>0&&<span style={{position:"absolute",top:-4,right:-4,width:17,height:17,background:"#ef4444",borderRadius:"50%",fontSize:9,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid var(--card)"}}>{unread}</span>}
        </button>
        {notifOpen&&(
          <div className="scale" style={{position:"absolute",top:48,right:0,width:310,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,zIndex:999,boxShadow:"0 20px 60px rgba(0,0,0,.2)",overflow:"hidden"}}>
            <div style={{padding:"13px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{fontWeight:700,fontSize:14,margin:0}}>Notifications</p>
              <Tag bg="#fee2e2" c="#dc2626">{unread} new</Tag>
            </div>
            <div style={{maxHeight:300,overflowY:"auto"}}>
              {notifs.map((n,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"12px 16px",borderBottom:"1px solid var(--border)",background:!n.read?"var(--plight)":"transparent",cursor:"pointer",transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--card2)"}
                  onMouseLeave={e=>e.currentTarget.style.background=!n.read?"var(--plight)":"transparent"}>
                  <div style={{width:36,height:36,borderRadius:10,background:`${n.dot}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:600,fontSize:12,margin:"0 0 2px"}}>{n.title}</p>
                    <p style={{fontSize:11,color:"var(--text2)",margin:"0 0 3px",lineHeight:1.4}}>{n.desc}</p>
                    <p style={{fontSize:10,color:"var(--text3)",margin:0}}>{n.time} ago</p>
                  </div>
                  {!n.read&&<span style={{width:8,height:8,borderRadius:"50%",background:"var(--primary)",flexShrink:0,marginTop:3}}/>}
                </div>
              ))}
            </div>
            <div style={{padding:"9px 16px",display:"flex",justifyContent:"space-between",borderTop:"1px solid var(--border)"}}>
              <button style={{fontSize:12,color:"var(--primary)",fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif"}} onClick={()=>setNotif(false)}>Mark all read</button>
              <button style={{fontSize:12,color:"var(--text3)",background:"none",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif"}} onClick={()=>setNotif(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <button className="btn-ghost" onClick={()=>{setDark(!dark);addToast(`${!dark?"Dark":"Light"} mode`,"info");}}>{dark?"☀️":"🌙"}</button>
      <div onClick={()=>setPage("settings")} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 12px 5px 5px",background:"var(--card2)",borderRadius:30,border:"1px solid var(--border)",cursor:"pointer",transition:"all .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--primary)";e.currentTarget.style.boxShadow="0 0 0 3px rgba(99,102,241,.1)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{width:32,height:32,borderRadius:"50%",overflow:"hidden",background:"linear-gradient(135deg,#6366f1,#ec4899)",flexShrink:0,border:"2px solid var(--primary)"}}>
          {profile.avatar?<img src={profile.avatar} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13}}>{profile.name?.charAt(0)||"J"}</div>}
        </div>
        <div>
          <p style={{fontSize:12,fontWeight:700,margin:0,lineHeight:1}}>{profile.name||"Jeron R."}</p>
          <p className="mono" style={{fontSize:10,color:"var(--text3)",margin:0}}>{clock.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</p>
        </div>
      </div>
    </div>
  </header>
);