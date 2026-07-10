import { useMemo, useState } from 'react';
import { fmtC } from './helpers';
import { KPICard } from './KPICard';
import { ProgressBar } from './ProgressBar';

export const CostCalc = ({addToast}) => {
  const SIMPLE_BAGS = [
    {id:"backpack",name:"Backpack",  cost:1100,emoji:"🎒"},
    {id:"tote",    name:"Tote Bag",  cost:340, emoji:"👜"},
    {id:"laptop",  name:"Laptop Bag",cost:1800,emoji:"💼"},
    {id:"school",  name:"School Bag",cost:280, emoji:"🎓"},
    {id:"handbag", name:"Handbag",   cost:2800,emoji:"👛"},
    {id:"eco",     name:"Eco Tote",  cost:120, emoji:"🌿"},
  ];
  const [bagId,setBagId]   = useState("backpack");
  const [qty,setQty]       = useState(100);
  const [gst,setGst]       = useState(12);
  const [labour,setLabour] = useState(350);
  const [overhead,setOvhd] = useState(180);
  const [margin,setMargin] = useState(35);
  const [result,setResult] = useState(null);

  const calc = () => {
    const bag = SIMPLE_BAGS.find(b=>b.id===bagId);
    if(!bag) return;
    const matCost   = bag.cost;
    const totalCost = matCost + labour + overhead;
    const sellingP  = Math.round(totalCost / (1 - margin/100));
    const profit    = sellingP - totalCost;
    const gstAmt    = Math.round(sellingP * gst/100);
    setResult({bag,matCost,labour,overhead,totalCost,sellingP,profit,gst,gstAmt,priceWithGST:sellingP+gstAmt,totalRev:sellingP*qty,totalProfit:profit*qty,margin,qty});
    addToast("Cost calculated ✓");
  };

  return (
    <div className="fade" style={{padding:24}}>
      <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>🧮 Cost & Profit Calculator</h2>
      <p style={{fontSize:13,color:"var(--text2)",marginBottom:20}}>Calculate selling price, profit & GST for any bulk order</p>
      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:20}}>
        {/* Input */}
        <div className="card" style={{padding:22,alignSelf:"start"}}>
          <p style={{fontWeight:700,fontSize:15,marginBottom:18}}>⚙️ Input Parameters</p>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>Bag Type</label>
            <select value={bagId} onChange={e=>setBagId(e.target.value)}>
              {SIMPLE_BAGS.map(b=><option key={b.id} value={b.id}>{b.emoji} {b.name} (Material ₹{b.cost})</option>)}
            </select>
          </div>
          {[["Quantity (units)",qty,setQty,"#"],["Labour Cost (₹/bag)",labour,setLabour,"₹"],["Overhead (₹/bag)",overhead,setOvhd,"₹"]].map(([l,v,fn,pre])=>(
            <div key={l} style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>{l}</label>
              <div style={{display:"flex",border:"1.5px solid var(--border)",borderRadius:9,overflow:"hidden"}}>
                <span style={{padding:"9px 10px",background:"var(--card2)",fontSize:13,fontWeight:600,color:"var(--text2)",borderRight:"1px solid var(--border)"}}>{pre}</span>
                <input type="number" value={v} onChange={e=>fn(+e.target.value)} min="0" style={{border:"none!important",borderRadius:"0!important",flex:1}}/>
              </div>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>Target Profit Margin</label>
            <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
              {[20,30,35,40,50].map(m=>(
                <button key={m} onClick={()=>setMargin(m)} style={{flex:1,padding:"6px 4px",border:`1.5px solid ${margin===m?"var(--primary)":"var(--border)"}`,borderRadius:8,background:margin===m?"var(--plight)":"var(--card2)",color:margin===m?"var(--primary)":"var(--text2)",fontWeight:600,fontSize:11,minWidth:40}}>
                  {m}%
                </button>
              ))}
            </div>
            <input type="number" value={margin} onChange={e=>setMargin(+e.target.value)} placeholder="Custom %" min="0" max="99"/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>GST Rate</label>
            <select value={gst} onChange={e=>setGst(+e.target.value)}><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option></select>
          </div>
          <button className="btn" style={{width:"100%"}} onClick={calc}>🧮 Calculate</button>
        </div>

        {/* Result */}
        {result ? (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
              {[
                {l:"Selling Price",  v:fmtC(result.sellingP),     c:"#6366f1",icon:"💰",sub:"per bag"},
                {l:"Profit/Bag",     v:fmtC(result.profit),       c:"#22c55e",icon:"📈",sub:`${result.margin}% margin`},
                {l:"Price + GST",    v:fmtC(result.priceWithGST), c:"#f59e0b",icon:"🧾",sub:`GST ${result.gst}% = ${fmtC(result.gstAmt)}`},
                {l:"Net Profit (Bulk)",v:fmtC(result.totalProfit),c:"#ec4899",icon:"💎",sub:`for ${result.qty} bags`},
              ].map(c=>(
                <div key={c.l} className="card" style={{padding:"16px 18px",borderLeft:`3px solid ${c.c}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:11,color:"var(--text2)",fontWeight:600}}>{c.l}</span>
                    <span style={{fontSize:18}}>{c.icon}</span>
                  </div>
                  <p className="mono" style={{fontSize:24,fontWeight:900,color:c.c,margin:0}}>{c.v}</p>
                  <p style={{fontSize:11,color:"var(--text3)",marginTop:4}}>{c.sub}</p>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:"20px 22px"}}>
              <p style={{fontWeight:700,fontSize:14,marginBottom:14}}>📊 Full Breakdown — {result.bag.emoji} {result.bag.name} × {result.qty}</p>
              <div className="card2" style={{padding:"14px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--text2)",lineHeight:2.1,marginBottom:14}}>
                <span style={{color:"var(--text3)"}}>Material Cost    </span><span style={{color:"var(--text)",fontWeight:600}}>₹{fmtN(result.matCost)}</span><br/>
                <span style={{color:"var(--text3)"}}>Labour Cost      </span><span style={{color:"var(--text)",fontWeight:600}}>₹{fmtN(result.labour)}</span><br/>
                <span style={{color:"var(--text3)"}}>Overhead         </span><span style={{color:"var(--text)",fontWeight:600}}>₹{fmtN(result.overhead)}</span><br/>
                <hr style={{border:"none",borderTop:"1px solid var(--border)",margin:"3px 0"}}/><br/>
                <span style={{color:"#ef4444"}}>Total Cost/bag   </span><span style={{color:"#ef4444",fontWeight:700}}>₹{fmtN(result.totalCost)}</span><br/>
                <span style={{color:"#22c55e"}}>Selling Price    </span><span style={{color:"#22c55e",fontWeight:700}}>₹{fmtN(result.sellingP)} ({result.margin}% margin)</span><br/>
                <hr style={{border:"none",borderTop:"1px solid var(--border)",margin:"3px 0"}}/><br/>
                <span style={{color:"var(--text3)"}}>Bulk Revenue     </span><span style={{color:"var(--text)",fontWeight:600}}>₹{fmtN(result.totalRev)}</span><br/>
                <span style={{color:"#ec4899",fontSize:14}}>NET PROFIT       </span><span style={{color:"#ec4899",fontWeight:700,fontSize:14}}>₹{fmtN(result.totalProfit)}</span>
              </div>
              {[
                {l:"Material",v:result.matCost/result.totalCost*100,c:"#ef4444"},
                {l:"Labour",  v:result.labour/result.totalCost*100, c:"#f59e0b"},
                {l:"Overhead",v:result.overhead/result.totalCost*100,c:"#0ea5e9"},
                {l:"Profit",  v:result.margin,                       c:"#22c55e"},
              ].map(r=>(
                <div key={r.l} style={{marginBottom:8}}>
                  <ProgressBar value={r.v} max={100} color={r.c} label={r.l} valLabel={`${r.v.toFixed(1)}%`} h={8}/>
                </div>
              ))}
              <button className="btn-outline btn-sm" style={{marginTop:12}} onClick={()=>{downloadCSV([{BagType:result.bag.name,Qty:result.qty,MaterialCost:result.matCost,LabourCost:result.labour,Overhead:result.overhead,TotalCost:result.totalCost,SellingPrice:result.sellingP,ProfitPerBag:result.profit,GSTRate:`${result.gst}%`,GSTAmount:result.gstAmt,PriceWithGST:result.priceWithGST,TotalRevenue:result.totalRev,NetProfit:result.totalProfit}],"cost_calculation.csv");addToast("Exported ✓","info");}}>📊 Export Calculation</button>
            </div>
          </div>
        ) : (
          <div className="card" style={{padding:"5rem",textAlign:"center"}}>
            <p style={{fontSize:48,marginBottom:16}}>🧮</p>
            <p style={{fontWeight:700,fontSize:16,marginBottom:8}}>Ready to Calculate</p>
            <p style={{fontSize:13,color:"var(--text2)"}}>Fill in the parameters and click Calculate to see full cost breakdown, optimal price, GST, and net profit for your bulk order.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  SETTINGS PAGE
// ═══════════════════════════════════════════════
