import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { BAGS0, WORKERS0, ORDERS0, WEEK_LABELS, PROD_DATA, REV_DATA, CAT_DATA } from './data';
import { fmtC, fmtN } from './helpers';
import { KPICard } from './KPICard';
import { ProgressBar } from './ProgressBar';

export const Analytics = ({dark}) => {
  const totalRev = REV_DATA.reduce((s,r)=>s+r.v,0);
  const radarD = WORKERS0.filter(w=>w.status==="Present").map(w=>({
    name:w.name.split(" ")[0],
    productivity:Math.round((w.bags/30)*100),
    quality:Math.round(70+Math.random()*25),
    attendance:w.status==="Present"?100:0,
  }));

  return (
    <div className="fade" style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,margin:0}}>📈 Analytics</h2>
          <p style={{fontSize:13,color:"var(--text2)",marginTop:3}}>Business performance & production insights</p>
        </div>
        <button className="btn-outline btn-sm" onClick={()=>{}}>📊 Export Report</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {l:"Total Revenue",  v:fmtC(totalRev),                       c:"#22c55e",icon:"💰",trend:8},
          {l:"Avg Daily Bags", v:`${Math.round(PROD_DATA.reduce((a,b)=>a+b,0)/7)} bags`, c:"#6366f1",icon:"🎒",trend:5},
          {l:"Best Day",       v:`${Math.max(...PROD_DATA)} bags`,      c:"#f59e0b",icon:"⭐"},
          {l:"Active Products",v:BAGS0.length,                          c:"#0ea5e9",icon:"📦"},
        ].map(c=>(
          <div key={c.l} className="card" style={{padding:"14px 16px",borderLeft:`3px solid ${c.c}`,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:24}}>{c.icon}</span>
            <div>
              <p style={{fontSize:9,color:"var(--text3)",margin:0,fontWeight:500,textTransform:"uppercase",letterSpacing:".05em"}}>{c.l}</p>
              <p className="mono" style={{fontSize:16,fontWeight:700,color:c.c,margin:"2px 0 0"}}>{c.v}</p>
              {c.trend&&<p style={{fontSize:10,color:"#22c55e",margin:"1px 0 0"}}>▲ {c.trend}% vs last period</p>}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card" style={{padding:"18px 20px"}}>
          <p style={{fontWeight:700,fontSize:14,marginBottom:4}}>Monthly Revenue (Jan–Jun 2025)</p>
          <p style={{fontSize:12,color:"var(--text2)",marginBottom:14}}>Total: {fmtC(totalRev)}</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={REV_DATA}>
              <defs><linearGradient id="revg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={.6}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"}/>
              <XAxis dataKey="m" tick={{fontSize:11,fill:"var(--text3)"}}/>
              <YAxis tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:"var(--text3)"}}/>
              <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,fontSize:12}} formatter={v=>[fmtC(v),"Revenue"]}/>
              <Bar dataKey="v" fill="url(#revg)" radius={[7,7,0,0]} name="Revenue"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{padding:"18px 20px"}}>
          <p style={{fontWeight:700,fontSize:14,marginBottom:4}}>Worker Performance Radar</p>
          <p style={{fontSize:12,color:"var(--text2)",marginBottom:14}}>Productivity · Quality · Attendance %</p>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radarD}>
              <PolarGrid stroke="var(--border)"/>
              <PolarAngleAxis dataKey="name" tick={{fontSize:11,fill:"var(--text2)"}}/>
              {["productivity","quality","attendance"].map((k,i)=>(
                <Radar key={k} name={k} dataKey={k} stroke={["#6366f1","#22c55e","#f59e0b"][i]} fill={["#6366f1","#22c55e","#f59e0b"][i]} fillOpacity={0.1} strokeWidth={1.5}/>
              ))}
              <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,fontSize:12}}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{padding:"18px 20px"}}>
        <p style={{fontWeight:700,fontSize:14,marginBottom:14}}>Weekly Production Heatmap</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:16}}>
          {WEEK_LABELS.map((d,i)=>{
            const v=PROD_DATA[i], max=Math.max(...PROD_DATA), pct=v/max;
            return (
              <div key={d} style={{textAlign:"center"}}>
                <p style={{fontSize:10,color:"var(--text3)",marginBottom:6}}>{d}</p>
                <div style={{height:64,background:`rgba(99,102,241,${0.08+pct*0.85})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(99,102,241,.15)"}}>
                  <span className="mono" style={{fontSize:13,fontWeight:700,color:pct>0.75?"#6366f1":"var(--text)"}}>{v}</span>
                </div>
              </div>
            );
          })}
        </div>
        {WEEK_LABELS.map((d,i)=>(
          <div key={d} style={{marginBottom:7}}>
            <ProgressBar value={PROD_DATA[i]} max={300} color="#6366f1" label={d} valLabel={`${PROD_DATA[i]} bags`} h={5}/>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  COST CALCULATOR PAGE
// ═══════════════════════════════════════════════
