export const ProgressBar = ({value,max,color="#6366f1",h=6,label,valLabel}) => {
  const pct = Math.min(100,(value/Math.max(max,1))*100);
  return (
    <div>
      {(label||valLabel)&&(
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          {label&&<span style={{fontSize:11,color:"var(--text2)"}}>{label}</span>}
          {valLabel&&<span className="mono" style={{fontSize:11,fontWeight:600,color}}>{valLabel}</span>}
        </div>
      )}
      <div style={{height:h,background:"var(--card3)",borderRadius:h/2,overflow:"hidden",border:"1px solid var(--border)"}}>
        <div style={{height:"100%",background:color,borderRadius:h/2,width:`${pct}%`,transition:"width .5s ease"}}/>
      </div>
    </div>
  );
};
