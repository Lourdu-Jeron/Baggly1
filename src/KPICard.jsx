export const KPICard = ({label,value,icon,color,sub,trend}) => (
  <div className="card fade" style={{padding:"18px 20px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-10,right:-10,width:70,height:70,borderRadius:"50%",background:`${color}14`}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <span style={{fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>{label}</span>
      <span style={{fontSize:22}}>{icon}</span>
    </div>
    <p className="mono" style={{fontSize:26,fontWeight:900,color,lineHeight:1,marginBottom:5,animation:"countUp .4s ease"}}>{value}</p>
    {sub&&<p style={{fontSize:11,color:"var(--text3)",display:"flex",alignItems:"center",gap:4}}>
      {trend!==undefined&&<span style={{color:trend>=0?"#22c55e":"#ef4444",fontWeight:700}}>{trend>=0?"▲":"▼"}{Math.abs(trend)}%</span>}
      {sub}
    </p>}
  </div>
);