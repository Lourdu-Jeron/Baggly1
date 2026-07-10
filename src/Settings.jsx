import { useRef, useState } from 'react';
import { PALETTES } from './data';
import { KPICard } from './KPICard';
import { Modal } from './Modal';
import { Tag } from './Tag';

export const Settings = ({dark,setDark,addToast,profile,setProfile}) => {
  const [co,setCo]       = useState({name:"Baggly Manufacturing Co.",phone:"9876543210",email:"ops@baggly.in",gst:"27AABCU9603R1ZV",address:"Plot 14, SIDCO Industrial Estate, Dharavi, Mumbai 400017"});
  const [activeTab,setTab]= useState("profile");
  const avatarRef        = useRef();
  const coverRef         = useRef();

  const handleAvatar = e => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onloadend=()=>setProfile(p=>({...p,avatar:r.result})); r.readAsDataURL(f);
    addToast("Profile photo updated ✓");
  };
  const handleCover = e => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onloadend=()=>setProfile(p=>({...p,cover:r.result})); r.readAsDataURL(f);
    addToast("Cover photo updated ✓");
  };

  const lbl=(t)=><label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>{t}</label>;

  return (
    <div className="fade" style={{padding:24}}>
      <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>⚙️ Settings</h2>
      <p style={{fontSize:13,color:"var(--text2)",marginBottom:20}}>Manage your profile, company info & preferences</p>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["profile","👤 Profile"],["company","🏭 Company"],["appearance","🎨 Appearance"],["shortcuts","⌨️ Shortcuts"],["data","📊 Data"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"8px 16px",borderRadius:9,border:activeTab===id?"none":"1px solid var(--border)",fontWeight:600,fontSize:12,transition:"all .15s",background:activeTab===id?"var(--primary)":"var(--card)",color:activeTab===id?"#fff":"var(--text2)",boxShadow:activeTab===id?"0 3px 10px rgba(99,102,241,.3)":"none"}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab==="profile"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:16}}>

          {/* Left — visual profile card */}
          <div className="card" style={{overflow:"hidden",alignSelf:"start"}}>
            {/* Cover photo */}
            <div style={{position:"relative",height:140,background:profile.cover?"transparent":"linear-gradient(135deg,#6366f1,#ec4899)",overflow:"hidden",cursor:"pointer"}}
              onClick={()=>coverRef.current.click()}>
              {profile.cover
                ?<img src={profile.cover} alt="cover" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:28}}>🖼️</span>
                  <p style={{fontSize:11,color:"rgba(255,255,255,.8)",fontWeight:500}}>Click to set cover photo</p>
                </div>}
              {/* Cover edit overlay */}
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"}}
                onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                onMouseLeave={e=>e.currentTarget.style.opacity="0"}>
                <span style={{fontSize:24}}>📷</span>
                <p style={{fontSize:12,color:"#fff",fontWeight:600,marginLeft:8}}>Change Cover</p>
              </div>
              <input ref={coverRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleCover}/>
            </div>

            {/* Avatar */}
            <div style={{padding:"0 20px 20px",position:"relative"}}>
              <div style={{position:"relative",display:"inline-block",marginTop:-40}}>
                <div style={{width:80,height:80,borderRadius:"50%",overflow:"hidden",border:"4px solid var(--card)",boxShadow:"0 4px 16px rgba(0,0,0,.15)",background:"linear-gradient(135deg,#6366f1,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}
                  onClick={()=>avatarRef.current.click()}>
                  {profile.avatar
                    ?<img src={profile.avatar} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    :<span style={{fontSize:30,color:"#fff",fontWeight:800}}>{profile.name?.charAt(0)||"J"}</span>}
                  {/* Hover overlay */}
                  <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="0"}>
                    <span style={{fontSize:18}}>📷</span>
                  </div>
                </div>
                {/* Camera badge */}
                <div onClick={()=>avatarRef.current.click()} style={{position:"absolute",bottom:2,right:2,width:24,height:24,borderRadius:"50%",background:"var(--primary)",border:"2px solid var(--card)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11}}>📷</div>
                <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatar}/>
              </div>

              {/* Name & role */}
              <div style={{marginTop:10,marginBottom:16}}>
                <p style={{fontWeight:800,fontSize:18,margin:"0 0 2px"}}>{profile.name||"Jeron R."}</p>
                <p style={{fontSize:13,color:"var(--text2)",margin:"0 0 2px"}}>{profile.role||"Owner & Founder"}</p>
                <p style={{fontSize:12,color:"var(--text3)",margin:0}}>{profile.email||"owner@baggly.in"}</p>
              </div>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                {[["12","Orders"],["₹2.5L","Revenue"],["6","Workers"]].map(([v,l])=>(
                  <div key={l} style={{background:"var(--card2)",borderRadius:10,padding:"10px 8px",textAlign:"center",border:"1px solid var(--border)"}}>
                    <p className="mono" style={{fontSize:16,fontWeight:700,color:"var(--primary)",margin:"0 0 2px"}}>{v}</p>
                    <p style={{fontSize:10,color:"var(--text3)",margin:0}}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div style={{display:"flex",gap:8}}>
                {[["🌐","Website"],["📸","Instagram"],["💼","LinkedIn"]].map(([icon,l])=>(
                  <button key={l} style={{flex:1,padding:"7px 4px",border:"1px solid var(--border)",borderRadius:9,background:"var(--card2)",fontSize:11,fontWeight:500,color:"var(--text2)",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--primary)";e.currentTarget.style.color="var(--primary)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text2)";}}>
                    {icon} {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — edit form */}
          <div className="card" style={{padding:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <p style={{fontWeight:700,fontSize:15,margin:0}}>✏️ Edit Profile</p>
              <div style={{display:"flex",gap:6}}>
                {/* Avatar quick-upload button */}
                <button className="btn-outline btn-sm" onClick={()=>avatarRef.current.click()}>📷 Change Photo</button>
                <button className="btn-outline btn-sm" onClick={()=>coverRef.current.click()}>🖼️ Cover</button>
              </div>
            </div>

            {/* Avatar preview strip */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)",marginBottom:18}}>
              <div style={{width:56,height:56,borderRadius:"50%",overflow:"hidden",border:"3px solid var(--primary)",background:"linear-gradient(135deg,#6366f1,#ec4899)",flexShrink:0,cursor:"pointer"}} onClick={()=>avatarRef.current.click()}>
                {profile.avatar
                  ?<img src={profile.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",fontWeight:800}}>{profile.name?.charAt(0)||"J"}</div>}
              </div>
              <div style={{flex:1}}>
                <p style={{fontWeight:600,fontSize:13,margin:"0 0 4px"}}>Profile Photo</p>
                <p style={{fontSize:11,color:"var(--text3)",margin:"0 0 8px"}}>JPG, PNG or GIF · Recommended 400×400px</p>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-sm" onClick={()=>avatarRef.current.click()}>Upload Photo</button>
                  {profile.avatar&&<button className="btn-red btn-sm" onClick={()=>{setProfile(p=>({...p,avatar:null}));addToast("Photo removed","warn");}}>Remove</button>}
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {k:"name", l:"Full Name",      ph:"e.g. Jeron Rodrigues"},
                {k:"role", l:"Role / Title",   ph:"e.g. Owner & Founder"},
                {k:"email",l:"Email Address",  ph:"owner@baggly.in"},
                {k:"phone",l:"Phone Number",   ph:"9876543210"},
                {k:"city", l:"City",           ph:"e.g. Mumbai"},
                {k:"bio",  l:"Short Bio",      ph:"e.g. Bag manufacturer since 2018",span:true},
              ].map(f=>(
                <div key={f.k} style={{gridColumn:f.span?"1/-1":"auto"}}>
                  {lbl(f.l)}
                  <input value={profile[f.k]||""} onChange={e=>setProfile(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
                </div>
              ))}
            </div>

            {/* Password change section */}
            <div style={{marginTop:16,padding:"14px 16px",background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)"}}>
              <p style={{fontWeight:600,fontSize:13,margin:"0 0 10px"}}>🔒 Change Password</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>{lbl("Current Password")}<input type="password" placeholder="••••••••"/></div>
                <div>{lbl("New Password")}<input type="password" placeholder="••••••••"/></div>
              </div>
            </div>

            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="btn" onClick={()=>addToast("Profile saved ✓")}>💾 Save Profile</button>
              <button className="btn-outline" onClick={()=>addToast("Changes discarded","warn")}>Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPANY TAB ── */}
      {activeTab==="company"&&(
        <div className="card" style={{padding:22,maxWidth:640}}>
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--card2)",borderRadius:12,border:"1px solid var(--border)",marginBottom:20}}>
            <div style={{width:52,height:52,borderRadius:12,background:"linear-gradient(135deg,#6366f1,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>👜</div>
            <div>
              <p style={{fontWeight:700,fontSize:15,margin:"0 0 2px"}}>{co.name}</p>
              <p style={{fontSize:12,color:"var(--text3)",margin:0}}>GST: {co.gst}</p>
            </div>
          </div>
          {Object.entries(co).map(([k,v])=>(
            <div key={k} style={{marginBottom:12}}>
              {lbl(k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase()))}
              <input value={v} onChange={e=>setCo(c=>({...c,[k]:e.target.value}))}/>
            </div>
          ))}
          <button className="btn" style={{marginTop:6}} onClick={()=>addToast("Company info saved ✓")}>💾 Save Company Info</button>
        </div>
      )}

      {/* ── APPEARANCE TAB ── */}
      {activeTab==="appearance"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:520}}>
          <div className="card" style={{padding:20}}>
            <p style={{fontWeight:700,fontSize:15,marginBottom:16}}>🌙 Theme</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <p style={{fontWeight:600,fontSize:13,margin:0}}>Dark Mode</p>
                <p style={{fontSize:12,color:"var(--text2)",margin:"3px 0 0"}}>Switch between light and dark interface</p>
              </div>
              <div onClick={()=>{setDark(!dark);addToast(`${!dark?"Dark":"Light"} mode enabled`,"info");}}
                style={{width:46,height:26,borderRadius:13,background:dark?"var(--primary)":"var(--card3)",cursor:"pointer",position:"relative",transition:"background .3s",border:"1px solid var(--border)",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:dark?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .3s",boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["☀️ Light","Clean white interface",false],["🌙 Dark","Easy on the eyes at night",true]].map(([icon,desc,d])=>(
                <div key={icon} onClick={()=>{setDark(d);addToast(`${d?"Dark":"Light"} mode enabled`,"info");}}
                  style={{padding:"14px 16px",borderRadius:12,border:`2px solid ${dark===d?"var(--primary)":"var(--border)"}`,background:dark===d?"var(--plight)":"var(--card2)",cursor:"pointer",transition:"all .2s"}}>
                  <p style={{fontSize:22,marginBottom:6}}>{icon.split(" ")[0]}</p>
                  <p style={{fontWeight:600,fontSize:13,margin:"0 0 3px",color:dark===d?"var(--primary)":"var(--text)"}}>{icon.split(" ")[1]} Mode</p>
                  <p style={{fontSize:11,color:"var(--text3)",margin:0}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SHORTCUTS TAB ── */}
      {activeTab==="shortcuts"&&(
        <div className="card" style={{padding:22,maxWidth:480}}>
          <p style={{fontWeight:700,fontSize:15,marginBottom:16}}>⌨️ Keyboard Shortcuts</p>
          {[["⌘ K","Open Command Palette"],["⌘ D","Go to Dashboard"],["⌘ I","Go to Inventory"],["⌘ L","Go to Labour"],["Esc","Close Modal / Panel"],["⌘ /","Focus search"]].map(([k,l])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,marginBottom:6,background:"var(--card2)",border:"1px solid var(--border)"}}>
              <span style={{fontSize:13,color:"var(--text2)"}}>{l}</span>
              <kbd className="mono" style={{fontSize:11,background:"var(--card)",border:"1px solid var(--border)",padding:"4px 12px",borderRadius:7,color:"var(--primary)",fontWeight:700,boxShadow:"0 2px 4px rgba(0,0,0,.06)"}}>{k}</kbd>
            </div>
          ))}
        </div>
      )}

      {/* ── DATA TAB ── */}
      {activeTab==="data"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:500}}>
          <div className="card" style={{padding:22}}>
            <p style={{fontWeight:700,fontSize:15,marginBottom:14}}>📊 Data Management</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[["📊 Export All Data (CSV)","Export all bags, workers, orders","info"],["💾 Create Backup","Save full app data backup","info"],["📤 Import Data","Restore from backup file","ok"]].map(([label,desc,type])=>(
                <button key={label} onClick={()=>addToast(`${label.split(" ").slice(1).join(" ")} ✓`,type)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",border:"1px solid var(--border)",borderRadius:12,background:"var(--card2)",textAlign:"left",cursor:"pointer",transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--primary)";e.currentTarget.style.background="var(--plight)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--card2)";}}>
                  <span style={{fontSize:22,flexShrink:0}}>{label.split(" ")[0]}</span>
                  <div>
                    <p style={{fontWeight:600,fontSize:13,margin:"0 0 2px"}}>{label.split(" ").slice(1).join(" ")}</p>
                    <p style={{fontSize:11,color:"var(--text3)",margin:0}}>{desc}</p>
                  </div>
                </button>
              ))}
              <div style={{borderTop:"1px solid var(--border)",paddingTop:10,marginTop:4}}>
                <button onClick={()=>addToast("All data cleared","warn")} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",border:"1px solid #fecaca",borderRadius:12,background:"#fef2f2",textAlign:"left",cursor:"pointer",width:"100%",transition:"all .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#fee2e2"}
                  onMouseLeave={e=>e.currentTarget.style.background="#fef2f2"}>
                  <span style={{fontSize:22,flexShrink:0}}>🗑️</span>
                  <div>
                    <p style={{fontWeight:600,fontSize:13,margin:"0 0 2px",color:"#dc2626"}}>Clear All Data</p>
                    <p style={{fontSize:11,color:"#ef4444",margin:0}}>Permanently delete all records — cannot be undone</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════
//  SALES PAGE
// ═══════════════════════════════════════════════
