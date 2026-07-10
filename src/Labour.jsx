import { useMemo, useRef, useState } from 'react';
import { BAGS0 } from './data';
import { downloadCSV, fmtC, fmtN, stockSt } from './helpers';
import { KPICard } from './KPICard';
import { Modal } from './Modal';
import { ProgressBar } from './ProgressBar';
import { Tag } from './Tag';

export const Labour = ({addToast}) => {
  const [bags,setBags]      = useState(BAGS0);
  const [view,setView]      = useState("grid");
  const [search,setSearch]  = useState("");
  const [cat,setCat]        = useState("All");
  const [sortBy,setSortBy]  = useState("name");
  const [showForm,setForm]  = useState(false);
  const [editId,setEditId]  = useState(null);
  const [viewId,setViewId]  = useState(null);
  const [selected,setSel]   = useState([]);
  const fileRef = useRef();
  const CATS = ["All","Tote Bags","Backpacks","Sling Bags","Office Bags","Travel Bags","School Bags","Handbags","Eco Bags"];
  const EMPTY = {name:"",cat:"Tote Bags",price:"",cost:"",pieces:"",min:"10",sku:"",gst:"12",emoji:"👜",color:"#6366f1",desc:"",image:null};
  const [form,setFrm] = useState(EMPTY);
  const [errs,setErrs] = useState({});

  const totalVal = bags.reduce((s,b)=>s+b.price*b.pieces,0);
  const shown = bags
    .filter(b=>(cat==="All"||b.cat===cat)&&(b.name.toLowerCase().includes(search.toLowerCase())||b.sku.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>sortBy==="price"?b.price-a.price:sortBy==="stock"?b.pieces-a.pieces:sortBy==="margin"?(((b.price-b.cost)/b.price)-(a.price-a.cost)/a.price):a.name.localeCompare(b.name));

  const save = () => {
    const e={};
    if(!form.name.trim()) e.name="Required";
    if(!form.price||isNaN(form.price)) e.price="Required";
    if(form.pieces===""||isNaN(form.pieces)) e.pieces="Required";
    if(Object.keys(e).length){setErrs(e);return;}
    setErrs({});
    const bag = {...form,price:+form.price,cost:+form.cost,pieces:+form.pieces,min:+form.min,gst:+form.gst};
    if(editId){ setBags(bags.map(b=>b.id===editId?{...b,...bag}:b)); addToast("Bag updated ✓"); }
    else { setBags([...bags,{...bag,id:Date.now()}]); addToast("Bag added ✓"); }
    setForm(false); setEditId(null); setFrm(EMPTY);
  };
  const del = id => { setBags(bags.filter(b=>b.id!==id)); setViewId(null); addToast("Removed","warn"); };
  const openEdit = b => { setFrm({...b,price:String(b.price),cost:String(b.cost),pieces:String(b.pieces),min:String(b.min),gst:String(b.gst)}); setEditId(b.id); setForm(true); setViewId(null); };
  const exportCSV = () => { downloadCSV(bags.map(({image,...b})=>b),"inventory.csv"); addToast("CSV exported ✓","info"); };
  const vb = viewId ? bags.find(b=>b.id===viewId) : null;
  const inpLbl = (t,req=false) => <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>{t}{req&&<span style={{color:"#ef4444"}}> *</span>}</label>;

  return (
    <div className="fade" style={{padding:24}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,margin:0}}>📦 Inventory</h2>
          <p style={{fontSize:13,color:"var(--text2)",marginTop:3}}>Manage products, stock levels & pricing</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {selected.length>0&&<button className="btn-red btn-sm" onClick={()=>{setBags(bags.filter(b=>!selected.includes(b.id)));setSel([]);addToast(`${selected.length} removed`,"warn");}}>🗑 Delete {selected.length}</button>}
          <button className="btn-outline btn-sm" onClick={exportCSV}>📊 Export CSV</button>
          <button className="btn btn-sm" onClick={()=>{setFrm(EMPTY);setEditId(null);setErrs({});setForm(!showForm);}}>
            {showForm?"✕ Close":"+ Add Bag"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {[
          {l:"Products",  v:bags.length,                                         c:"#6366f1",icon:"📦"},
          {l:"Pieces",    v:fmtN(bags.reduce((s,b)=>s+b.pieces,0)),              c:"#22c55e",icon:"🎒"},
          {l:"Stock Value",v:fmtC(totalVal),                                     c:"#f59e0b",icon:"💰"},
          {l:"Cost Value", v:fmtC(bags.reduce((s,b)=>s+b.cost*b.pieces,0)),     c:"#0ea5e9",icon:"📉"},
          {l:"Low/Out",   v:bags.filter(b=>b.pieces<b.min).length,               c:"#ef4444",icon:"⚠️"},
        ].map(c=>(
          <div key={c.l} className="card" style={{padding:"13px 15px",borderLeft:`3px solid ${c.c}`,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{c.icon}</span>
            <div>
              <p style={{fontSize:9,color:"var(--text3)",margin:0,fontWeight:500,textTransform:"uppercase",letterSpacing:".05em"}}>{c.l}</p>
              <p className="mono" style={{fontSize:16,fontWeight:700,color:c.c,margin:"2px 0 0"}}>{c.v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180,position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--text3)"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or SKU..." style={{paddingLeft:34}}/>
        </div>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:"auto"}}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:"auto"}}>
          <option value="name">Name A–Z</option>
          <option value="price">Price ↓</option>
          <option value="stock">Stock ↓</option>
          <option value="margin">Margin ↓</option>
        </select>
        <div style={{display:"flex",gap:3,background:"var(--card2)",padding:3,borderRadius:10,border:"1px solid var(--border)"}}>
          {[["grid","⊞"],["list","≡"]].map(([v,i])=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:"6px 12px",border:"none",borderRadius:7,fontSize:15,background:view===v?"var(--primary)":"transparent",color:view===v?"#fff":"var(--text3)",transition:"all .15s"}}>{i}</button>
          ))}
        </div>
        <span style={{fontSize:12,color:"var(--text3)"}}>{shown.length} items</span>
      </div>

      {/* Add/Edit Form */}
      {showForm&&(
        <div className="card fade" style={{padding:24,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{fontWeight:700,fontSize:16}}>{editId?"✏️ Edit Bag":"➕ Add New Bag"}</h3>
            <button className="btn-ghost" onClick={()=>setForm(false)} style={{fontSize:18}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"190px 1fr",gap:24}}>
            {/* Image upload */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div onClick={()=>!form.image&&fileRef.current.click()}
                style={{aspectRatio:"1",borderRadius:12,overflow:"hidden",border:`2px dashed ${form.image?"transparent":"var(--border)"}`,background:`${form.color}12`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
                {form.image
                  ?<><img src={form.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><button onClick={e=>{e.stopPropagation();setFrm(f=>({...f,image:null}));}} style={{position:"absolute",top:8,right:8,width:26,height:26,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.65)",color:"#fff",fontSize:14,cursor:"pointer"}}>✕</button></>
                  :<><span style={{fontSize:52,marginBottom:8}}>{form.emoji}</span><p style={{fontSize:11,color:"var(--text3)",textAlign:"center",padding:"0 8px"}}>Click to upload photo</p></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onloadend=()=>setFrm(fm=>({...fm,image:r.result}));r.readAsDataURL(f);}}/>
              <button className="btn-outline" style={{fontSize:11,padding:"7px",justifyContent:"center"}} onClick={()=>fileRef.current.click()}>📁 Browse Image</button>
              <div>{inpLbl("Emoji (fallback)")}<input value={form.emoji} onChange={e=>setFrm(f=>({...f,emoji:e.target.value}))} style={{textAlign:"center",fontSize:22}} maxLength={2}/></div>
              <div>{inpLbl("Card Color")}<input type="color" value={form.color} onChange={e=>setFrm(f=>({...f,color:e.target.value}))} style={{height:40,cursor:"pointer",padding:3}}/></div>
            </div>
            {/* Fields */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>{inpLbl("Bag Name",true)}<input value={form.name} onChange={e=>setFrm(f=>({...f,name:e.target.value}))} placeholder="e.g. Classic Leather Tote"/>{errs.name&&<span style={{fontSize:11,color:"#ef4444"}}>{errs.name}</span>}</div>
              <div>{inpLbl("SKU / Code")}<input value={form.sku} onChange={e=>setFrm(f=>({...f,sku:e.target.value}))} placeholder="e.g. TT-001"/></div>
              <div>{inpLbl("Category")}<select value={form.cat} onChange={e=>setFrm(f=>({...f,cat:e.target.value}))}>{CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
              <div>{inpLbl("GST Rate")}<select value={form.gst} onChange={e=>setFrm(f=>({...f,gst:e.target.value}))}><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option></select></div>
              <div>{inpLbl("Selling Price (₹)",true)}
                <div style={{display:"flex",border:"1.5px solid var(--border)",borderRadius:9,overflow:"hidden"}}>
                  <span style={{padding:"9px 10px",background:"var(--card2)",fontSize:13,fontWeight:600,color:"var(--text2)",borderRight:"1px solid var(--border)"}}>₹</span>
                  <input type="number" value={form.price} onChange={e=>setFrm(f=>({...f,price:e.target.value}))} placeholder="0" min="0" style={{border:"none!important",borderRadius:"0!important",flex:1}}/>
                </div>
                {errs.price&&<span style={{fontSize:11,color:"#ef4444"}}>{errs.price}</span>}
              </div>
              <div>{inpLbl("Cost Price (₹)")}
                <div style={{display:"flex",border:"1.5px solid var(--border)",borderRadius:9,overflow:"hidden"}}>
                  <span style={{padding:"9px 10px",background:"var(--card2)",fontSize:13,fontWeight:600,color:"var(--text2)",borderRight:"1px solid var(--border)"}}>₹</span>
                  <input type="number" value={form.cost} onChange={e=>setFrm(f=>({...f,cost:e.target.value}))} placeholder="0" min="0" style={{border:"none!important",borderRadius:"0!important",flex:1}}/>
                </div>
              </div>
              <div>{inpLbl("Stock Quantity",true)}<input type="number" value={form.pieces} onChange={e=>setFrm(f=>({...f,pieces:e.target.value}))} placeholder="e.g. 50" min="0"/>{errs.pieces&&<span style={{fontSize:11,color:"#ef4444"}}>{errs.pieces}</span>}</div>
              <div>{inpLbl("Min Stock Alert")}<input type="number" value={form.min} onChange={e=>setFrm(f=>({...f,min:e.target.value}))} placeholder="e.g. 10" min="0"/></div>
              <div style={{gridColumn:"1/-1"}}>{inpLbl("Description",true)}<textarea value={form.desc} onChange={e=>setFrm(f=>({...f,desc:e.target.value}))} placeholder="Material, features, use-case, available colours…" rows={3} style={{resize:"vertical",lineHeight:1.65}}/></div>
              {form.price&&form.cost&&(
                <div style={{gridColumn:"1/-1",padding:"10px 14px",background:"var(--plight)",borderRadius:10,border:"1px solid var(--primary)",display:"flex",gap:20,flexWrap:"wrap"}}>
                  {[["Margin",`${(((+form.price-+form.cost)/+form.price)*100).toFixed(1)}%`],["Profit/unit",fmtC(+form.price-+form.cost)],["+GST price",fmtC(+form.price*(1+(+form.gst/100)))]].map(([l,v])=>(
                    <div key={l}><p style={{fontSize:10,color:"var(--text3)",margin:0}}>{l}</p><p className="mono" style={{fontSize:14,fontWeight:700,color:"var(--primary)",margin:0}}>{v}</p></div>
                  ))}
                </div>
              )}
              <div style={{gridColumn:"1/-1",display:"flex",gap:10}}>
                <button className="btn" onClick={save}>{editId?"💾 Update":"✅ Add to Inventory"}</button>
                <button className="btn-outline" onClick={()=>setForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid view */}
      {view==="grid"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {shown.map(bag=>{
            const st=stockSt(bag.pieces,bag.min);
            const margin=bag.price>0?(((bag.price-bag.cost)/bag.price)*100).toFixed(1):0;
            const isSel=selected.includes(bag.id);
            return (
              <div key={bag.id} className="card" style={{overflow:"hidden",transition:"all .2s",outline:isSel?"2px solid var(--primary)":"none"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,.12)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{height:170,background:`${bag.color}14`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderBottom:`2px solid ${bag.color}25`}}>
                  {bag.image?<img src={bag.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:72}}>{bag.emoji}</span>}
                  <input type="checkbox" checked={isSel} onChange={e=>{e.stopPropagation();setSel(isSel?selected.filter(x=>x!==bag.id):[...selected,bag.id]);}} style={{position:"absolute",top:10,left:10,width:17,height:17,accentColor:"var(--primary)",cursor:"pointer"}}/>
                  <Tag bg={st.bg} c={st.c} style={{position:"absolute",top:10,right:10,fontSize:10}}>{st.l}</Tag>
                  {bag.sku&&<span style={{position:"absolute",bottom:10,left:10,background:"rgba(0,0,0,.55)",color:"#fff",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:5}}>{bag.sku}</span>}
                  <span style={{position:"absolute",bottom:10,right:10,background:parseFloat(margin)>40?"#dcfce7":"#fef9c3",color:parseFloat(margin)>40?"#15803d":"#92400e",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:5}}>{margin}% margin</span>
                </div>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:700,fontSize:14,margin:"0 0 4px",lineHeight:1.3}}>{bag.name}</p>
                      <span style={{fontSize:11,fontWeight:600,color:bag.color,background:`${bag.color}15`,padding:"2px 8px",borderRadius:20}}>{bag.cat}</span>
                    </div>
                    <div style={{textAlign:"right",marginLeft:8}}>
                      <p className="mono" style={{fontSize:17,fontWeight:800,margin:0}}>{fmtC(bag.price)}</p>
                      <p className="mono" style={{fontSize:10,color:"var(--text3)",margin:"2px 0 0"}}>Cost {fmtC(bag.cost)}</p>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.55,margin:"8px 0 10px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{bag.desc}</p>
                  <ProgressBar value={bag.pieces} max={bag.min*3} color={st.bar} label="Stock" valLabel={`${bag.pieces} / min ${bag.min}`}/>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:"var(--card2)",borderRadius:8,margin:"10px 0",border:"1px solid var(--border)"}}>
                    <span style={{fontSize:11,color:"var(--text3)"}}>Stock Value</span>
                    <span className="mono" style={{fontSize:13,fontWeight:700,color:"var(--primary)"}}>{fmtC(bag.price*bag.pieces)}</span>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setViewId(bag.id)} style={{flex:1,padding:"8px",border:"1px solid var(--border)",borderRadius:9,background:"var(--card2)",color:"var(--text2)",fontSize:12,fontWeight:600}}>👁 View</button>
                    <button onClick={()=>openEdit(bag)} style={{flex:1,padding:"8px",border:"1px solid var(--border)",borderRadius:9,background:"var(--card2)",color:"var(--text2)",fontSize:12,fontWeight:600}}>✏️ Edit</button>
                    <button onClick={()=>del(bag.id)} style={{padding:"8px 12px",border:"1px solid #fecaca",borderRadius:9,background:"#fef2f2",color:"#dc2626",fontSize:12}}>🗑</button>
                  </div>
                </div>
              </div>
            );
          })}
          {shown.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px",color:"var(--text3)"}}><p style={{fontSize:48,marginBottom:12}}>📦</p><p style={{fontSize:15,fontWeight:600,color:"var(--text2)",marginBottom:6}}>No bags found</p><p style={{fontSize:13}}>Try a different search or category.</p></div>}
        </div>
      )}

      {/* List view */}
      {view==="list"&&(
        <div className="card" style={{overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"var(--card2)"}}>
              <th style={{padding:"10px 14px",width:36}}><input type="checkbox" style={{accentColor:"var(--primary)"}} onChange={e=>setSel(e.target.checked?shown.map(b=>b.id):[])}/></th>
              {["Product","SKU","Category","Sell ₹","Cost ₹","Margin","Stock","Value","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em",borderBottom:"1px solid var(--border)",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {shown.map(b=>{
                const st=stockSt(b.pieces,b.min);
                const margin=b.price>0?(((b.price-b.cost)/b.price)*100).toFixed(1):0;
                return (
                  <tr key={b.id} className="trow" style={{borderBottom:"1px solid var(--border)"}}>
                    <td style={{padding:"10px 14px"}}><input type="checkbox" checked={selected.includes(b.id)} onChange={()=>setSel(selected.includes(b.id)?selected.filter(x=>x!==b.id):[...selected,b.id])} style={{accentColor:"var(--primary)"}}/></td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:38,height:38,borderRadius:9,overflow:"hidden",background:`${b.color}12`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {b.image?<img src={b.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:20}}>{b.emoji}</span>}
                        </div>
                        <div><p style={{fontWeight:600,margin:0}}>{b.name}</p><p style={{fontSize:10,color:"var(--text3)",margin:"1px 0 0"}}>{b.desc.substring(0,38)}…</p></div>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px"}}><span className="mono" style={{fontSize:11,background:"var(--card2)",padding:"2px 7px",borderRadius:5,border:"1px solid var(--border)"}}>{b.sku||"—"}</span></td>
                    <td style={{padding:"10px 12px"}}><Tag bg={`${b.color}14`} c={b.color}>{b.cat}</Tag></td>
                    <td style={{padding:"10px 12px"}}><span className="mono" style={{fontWeight:700}}>{fmtC(b.price)}</span></td>
                    <td style={{padding:"10px 12px"}}><span className="mono" style={{color:"var(--text2)"}}>{fmtC(b.cost)}</span></td>
                    <td style={{padding:"10px 12px"}}><span className="mono" style={{fontWeight:700,color:parseFloat(margin)>40?"#22c55e":"#f59e0b"}}>{margin}%</span></td>
                    <td style={{padding:"10px 12px"}}><span className="mono" style={{fontWeight:700,color:st.c}}>{b.pieces} pcs</span></td>
                    <td style={{padding:"10px 12px"}}><span className="mono" style={{color:"var(--primary)",fontWeight:700}}>{fmtC(b.price*b.pieces)}</span></td>
                    <td style={{padding:"10px 12px"}}><Tag bg={st.bg} c={st.c}>{st.l}</Tag></td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setViewId(b.id)} style={{padding:"5px 8px",borderRadius:7,border:"1px solid var(--border)",background:"var(--card2)",fontSize:12,color:"var(--text2)"}}>👁</button>
                        <button onClick={()=>openEdit(b)} style={{padding:"5px 8px",borderRadius:7,border:"1px solid var(--border)",background:"var(--card2)",fontSize:12,color:"var(--text2)"}}>✏️</button>
                        <button onClick={()=>del(b.id)} className="btn-red" style={{padding:"5px 8px",fontSize:11}}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!vb} onClose={()=>setViewId(null)} title={vb?.name||""} width={540}>
        {vb&&(
          <>
            <div style={{height:200,background:`${vb.color}14`,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,marginBottom:16,position:"relative",overflow:"hidden"}}>
              {vb.image?<img src={vb.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}/>:<span style={{fontSize:90}}>{vb.emoji}</span>}
              <Tag bg={stockSt(vb.pieces,vb.min).bg} c={stockSt(vb.pieces,vb.min).c} style={{position:"absolute",top:10,right:10,fontSize:11}}>{stockSt(vb.pieces,vb.min).l}</Tag>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[["SKU",vb.sku||"—"],["Category",vb.cat],["Sell Price",fmtC(vb.price)],["Cost Price",fmtC(vb.cost)],["Gross Margin",`${(((vb.price-vb.cost)/vb.price)*100).toFixed(1)}%`],["GST",`${vb.gst}%`],["In Stock",`${vb.pieces} pcs`],["Stock Value",fmtC(vb.price*vb.pieces)]].map(([k,v])=>(
                <div key={k} className="card2" style={{padding:"10px 12px"}}>
                  <p style={{fontSize:10,color:"var(--text3)",margin:"0 0 3px"}}>{k}</p>
                  <p className="mono" style={{fontSize:14,fontWeight:700,margin:0}}>{v}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.65,marginBottom:14}}>{vb.desc}</p>
            <ProgressBar value={vb.pieces} max={vb.min*3} color={stockSt(vb.pieces,vb.min).bar} label="Stock Level" valLabel={`${vb.pieces} / min ${vb.min}`}/>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="btn" style={{flex:1}} onClick={()=>openEdit(vb)}>✏️ Edit Bag</button>
              <button className="btn-red" onClick={()=>del(vb.id)}>🗑️ Delete</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  LABOUR PAGE
// ═══════════════════════════════════════════════
