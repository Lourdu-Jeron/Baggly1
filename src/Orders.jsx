import { useMemo, useState } from 'react';
import { ORDERS0 } from './data';
import { downloadCSV, fmtC, fmtN, ordSt, prioSt } from './helpers';
import { KPICard } from './KPICard';
import { Modal } from './Modal';
import { ProgressBar } from './ProgressBar';
import { Tag } from './Tag';

export const Orders = ({addToast}) => {
  const [orders,setOrders] = useState(ORDERS0);
  const [view,setView]     = useState("kanban");
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("All");
  const [invoiceId,setInv] = useState(null);
  const statuses = ["Pending","In Progress","Completed"];

  const shown = orders.filter(o=>(filter==="All"||o.priority===filter)&&(o.client.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase())));
  const update=(id,status)=>{setOrders(orders.map(o=>o.id===id?{...o,status}:o));addToast(`${id} → ${status}`,"info");};
  const del=id=>{setOrders(orders.filter(o=>o.id!==id));addToast("Order removed","warn");};
  const invOrd = invoiceId ? orders.find(o=>o.id===invoiceId) : null;

  return (
    <div className="fade" style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,margin:0}}>🛍️ Orders</h2>
          <p style={{fontSize:13,color:"var(--text2)",marginTop:3}}>Manage production orders & delivery</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-outline btn-sm" onClick={()=>{downloadCSV(orders,"orders.csv");addToast("Orders exported ✓","info");}}>📊 Export</button>
          <button className="btn btn-sm" onClick={()=>addToast("New order form — coming soon","info")}>+ New Order</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {l:"Total Orders",v:orders.length,                                              c:"#6366f1",icon:"🛍️"},
          {l:"Total Value", v:fmtC(orders.reduce((s,o)=>s+o.value,0)),                   c:"#22c55e",icon:"💰"},
          {l:"Pending",     v:orders.filter(o=>o.status==="Pending").length,              c:"#f59e0b",icon:"⏳"},
          {l:"In Progress", v:orders.filter(o=>o.status==="In Progress").length,          c:"#0ea5e9",icon:"⚙️"},
        ].map(c=>(
          <div key={c.l} className="card" style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${c.c}`}}>
            <span style={{fontSize:24}}>{c.icon}</span>
            <div>
              <p style={{fontSize:9,color:"var(--text3)",margin:0,fontWeight:500,textTransform:"uppercase",letterSpacing:".05em"}}>{c.l}</p>
              <p className="mono" style={{fontSize:17,fontWeight:700,color:c.c,margin:"2px 0 0"}}>{c.v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180,position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--text3)"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders or clients..." style={{paddingLeft:34}}/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"auto"}}>
          {["All","High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
        </select>
        <div style={{display:"flex",gap:3,background:"var(--card2)",padding:3,borderRadius:10,border:"1px solid var(--border)"}}>
          {[["kanban","⊞ Kanban"],["table","≡ Table"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:"6px 12px",border:"none",borderRadius:7,fontSize:12,fontWeight:600,background:view===v?"var(--primary)":"transparent",color:view===v?"#fff":"var(--text3)",transition:"all .15s"}}>{l}</button>
          ))}
        </div>
      </div>

      {view==="kanban"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {statuses.map(s=>{
            const ss=ordSt(s), cols=shown.filter(o=>o.status===s);
            return (
              <div key={s}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",marginBottom:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,borderTop:`3px solid ${ss.c}`}}>
                  <span style={{fontWeight:700,fontSize:13}}>{s}</span>
                  <Tag bg={ss.bg} c={ss.c}>{cols.length}</Tag>
                </div>
                {cols.map(o=>{
                  const ps=prioSt(o.priority);
                  return (
                    <div key={o.id} className="card fade" style={{padding:14,marginBottom:10,transition:"all .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,.12)"}
                      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span className="mono" style={{fontSize:11,fontWeight:600,color:"var(--primary)"}}>{o.id}</span>
                        <Tag bg={ps.bg} c={ps.c}>{o.priority}</Tag>
                      </div>
                      <p style={{fontWeight:700,fontSize:13,margin:"0 0 3px"}}>{o.client}</p>
                      <p style={{fontSize:11,color:"var(--text2)",margin:"0 0 8px"}}>{o.bag} × {o.qty}</p>
                      <p className="mono" style={{fontSize:15,fontWeight:800,color:"var(--primary)",margin:"0 0 6px"}}>{fmtC(o.value)}</p>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:10,color:"var(--text3)"}}>Due: {o.due}</span>
                        <button onClick={()=>setInv(o.id)} style={{fontSize:10,color:"var(--primary)",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontFamily:"'Inter',sans-serif"}}>📄 Invoice</button>
                      </div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {statuses.filter(x=>x!==s).map(ns=>(
                          <button key={ns} onClick={()=>update(o.id,ns)} style={{flex:1,padding:"5px 4px",borderRadius:7,border:"1px solid var(--border)",background:"var(--card2)",fontSize:10,fontWeight:600,color:"var(--text2)",minWidth:0}}>
                            {ns==="Completed"?"✅":ns==="In Progress"?"▶️":"⏸️"} {ns.split(" ")[0]}
                          </button>
                        ))}
                        <button onClick={()=>del(o.id)} className="btn-red" style={{padding:"5px 8px",fontSize:10,borderRadius:7}}>🗑</button>
                      </div>
                    </div>
                  );
                })}
                {cols.length===0&&<div style={{textAlign:"center",padding:"20px",color:"var(--text3)",fontSize:12,border:"2px dashed var(--border)",borderRadius:10}}>No {s.toLowerCase()} orders</div>}
              </div>
            );
          })}
        </div>
      )}

      {view==="table"&&(
        <div className="card" style={{overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"var(--card2)"}}>
              {["Order ID","Client","Product","Qty","Value","Priority","Status","Due","Actions"].map(h=>(
                <th key={h} style={{padding:"11px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em",borderBottom:"1px solid var(--border)",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {shown.map(o=>{
                const ss=ordSt(o.status),ps=prioSt(o.priority);
                return (
                  <tr key={o.id} className="trow" style={{borderBottom:"1px solid var(--border)"}}>
                    <td style={{padding:"11px 13px"}}><span className="mono" style={{fontSize:12,fontWeight:600,color:"var(--primary)"}}>{o.id}</span></td>
                    <td style={{padding:"11px 13px",fontWeight:600}}>{o.client}</td>
                    <td style={{padding:"11px 13px",color:"var(--text2)"}}>{o.bag}</td>
                    <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:600}}>{o.qty}</span></td>
                    <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:700,color:"var(--primary)"}}>{fmtC(o.value)}</span></td>
                    <td style={{padding:"11px 13px"}}><Tag bg={ps.bg} c={ps.c}>{o.priority}</Tag></td>
                    <td style={{padding:"11px 13px"}}><Tag bg={ss.bg} c={ss.c}>{o.status}</Tag></td>
                    <td style={{padding:"11px 13px",color:"var(--text2)",fontSize:12}}>{o.due}</td>
                    <td style={{padding:"11px 13px"}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setInv(o.id)} style={{padding:"5px 8px",borderRadius:7,border:"1px solid var(--border)",background:"var(--card2)",fontSize:12,color:"var(--text2)"}}>📄</button>
                        <button onClick={()=>update(o.id,o.status==="Completed"?"Pending":"Completed")} className="btn-green" style={{padding:"5px 8px",fontSize:11}}>✓</button>
                        <button onClick={()=>del(o.id)} className="btn-red" style={{padding:"5px 8px",fontSize:11}}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Modal */}
      <Modal open={!!invOrd} onClose={()=>setInv(null)} title="📄 Invoice Preview" width={460}>
        {invOrd&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <p style={{fontWeight:800,fontSize:18,color:"var(--primary)",margin:0}}>👜 Baggly</p>
                <p style={{fontSize:12,color:"var(--text3)",margin:"3px 0 0"}}>Baggly Manufacturing Co. · Tax Invoice</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p className="mono" style={{fontWeight:700,fontSize:15,margin:0}}>{invOrd.id}</p>
                <p style={{fontSize:12,color:"var(--text3)",margin:"3px 0 0"}}>Due: {invOrd.due}</p>
              </div>
            </div>
            <div className="card2" style={{padding:"12px 14px",marginBottom:14}}>
              <p style={{fontSize:11,color:"var(--text3)",margin:"0 0 2px"}}>Bill To</p>
              <p style={{fontWeight:700,fontSize:14,margin:0}}>{invOrd.client}</p>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
              <thead><tr style={{background:"var(--card2)"}}>
                {["Item","Qty","Rate","Amount"].map(h=><th key={h} style={{padding:"8px 10px",fontSize:11,textAlign:"left",fontWeight:600,color:"var(--text3)",borderBottom:"1px solid var(--border)"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                <tr>
                  <td style={{padding:"10px"}}>{invOrd.bag}</td>
                  <td style={{padding:"10px"}}>{invOrd.qty}</td>
                  <td style={{padding:"10px"}}>{fmtC(Math.round(invOrd.value/invOrd.qty))}</td>
                  <td style={{padding:"10px",fontWeight:700}}>{fmtC(invOrd.value)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{borderTop:"2px solid var(--border)",paddingTop:10}}>
              {[["Subtotal",invOrd.value],["GST (12%)",Math.round(invOrd.value*.12)],["Grand Total",invOrd.value+Math.round(invOrd.value*.12)]].map(([l,v],i)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontWeight:i===2?700:400}}>
                  <span style={{fontSize:i===2?14:12}}>{l}</span>
                  <span className="mono" style={{fontSize:i===2?16:13,color:i===2?"var(--primary)":"var(--text)"}}>{fmtC(v)}</span>
                </div>
              ))}
            </div>
            <button className="btn" style={{width:"100%",marginTop:16}} onClick={()=>{window.print();addToast("Sent to printer","info");}}>🖨️ Print Invoice</button>
          </>
        )}
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  ANALYTICS PAGE
// ═══════════════════════════════════════════════
