import { useMemo, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { INIT_LISTINGS, INIT_SALES } from './data';
import { downloadCSV, fmtC, fmtN } from './helpers';
import { KPICard } from './KPICard';
import { Modal } from './Modal';
import { ProgressBar } from './ProgressBar';
import { Tag } from './Tag';

export const Sales = ({addToast}) => {
  const [listings,  setListings] = useState(INIT_LISTINGS);
  const [sales,     setSales]    = useState(INIT_SALES);
  const [tab,       setTab]      = useState("catalogue");
  const [showForm,  setShowForm] = useState(false);
  const [editId,    setEditId]   = useState(null);
  const [viewId,    setViewId]   = useState(null);
  const [cart,      setCart]     = useState([]);
  const [cartOpen,  setCartOpen] = useState(false);
  const [search,    setSearch]   = useState("");
  const [catFilter, setCatFilter]= useState("All");
  const [saleSearch,setSaleSearch]=useState("");
  const [errs,      setErrs]     = useState({});
  const fileRef = useRef();

  const CATS = ["All","Tote Bags","Backpacks","Sling Bags","Office Bags","Travel Bags","School Bags","Handbags","Eco Bags"];
  const EMPTY = {name:"",cat:"Tote Bags",price:"",mrp:"",stock:"",gst:"12",badge:"",color:"#6366f1",emoji:"👜",desc:"",image:null};
  const [form, setFrm] = useState(EMPTY);

  // ── Stats ──
  const totalRevenue   = sales.reduce((s,sl)=>s+sl.total, 0);
  const totalUnitsSold = sales.reduce((s,sl)=>s+sl.qty,   0);
  const totalListings  = listings.length;
  const cartTotal      = cart.reduce((s,c)=>s+c.price*c.qty, 0);

  // ── Filtered ──
  const shownListings = listings.filter(l=>
    (catFilter==="All"||l.cat===catFilter)&&
    (l.name.toLowerCase().includes(search.toLowerCase())||l.cat.toLowerCase().includes(search.toLowerCase()))
  );
  const shownSales = sales.filter(s=>
    s.listing.toLowerCase().includes(saleSearch.toLowerCase())||
    s.customer.toLowerCase().includes(saleSearch.toLowerCase())||
    s.id.toLowerCase().includes(saleSearch.toLowerCase())
  );

  // ── Helpers ──
  const discount  = l => l.mrp>l.price ? Math.round(((l.mrp-l.price)/l.mrp)*100) : 0;
  const saleSt    = s => ({Delivered:{bg:"#dcfce7",c:"#15803d"},Shipped:{bg:"#dbeafe",c:"#1d4ed8"},Processing:{bg:"#fef9c3",c:"#d97706"}}[s]||{bg:"#f1f5f9",c:"#64748b"});
  const badgeColor= b => ({Bestseller:{bg:"#fef9c3",c:"#92400e"},Premium:{bg:"#f5f3ff",c:"#7c3aed"},Luxury:{bg:"#fdf2f8",c:"#be185d"},"Top Rated":{bg:"#dcfce7",c:"#15803d"},"Low Stock":{bg:"#fee2e2",c:"#dc2626"},"Eco Pick":{bg:"#ecfdf5",c:"#065f46"}}[b]||{bg:"var(--card2)",c:"var(--text3)"});

  // ── Cart actions ──
  const addToCart = l => {
    if (l.stock===0) { addToast("Out of stock","error"); return; }
    setCart(c=>{const ex=c.find(x=>x.id===l.id); return ex?c.map(x=>x.id===l.id?{...x,qty:Math.min(x.qty+1,l.stock)}:x):[...c,{...l,qty:1}];});
    addToast(`${l.name} added to cart`,"info");
  };
  const removeFromCart = id => setCart(c=>c.filter(x=>x.id!==id));
  const changeQty  = (id,qty) => setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,qty)}:x));
  const checkout   = () => {
    if (!cart.length) return;
    const newSales = cart.map((c,i)=>({
      id:`SL-${String(sales.length+i+1).padStart(3,"0")}`,
      listing:c.name, qty:c.qty, price:c.price, total:c.price*c.qty,
      date:new Date().toISOString().split("T")[0], customer:"Walk-in",
      channel:"Direct", status:"Processing",
    }));
    setSales([...newSales,...sales]);
    setListings(listings.map(l=>{const ci=cart.find(c=>c.id===l.id);return ci?{...l,stock:l.stock-ci.qty,sold:l.sold+ci.qty}:l;}));
    setCart([]); setCartOpen(false);
    addToast(`${cart.length} item(s) sold — ₹${fmtN(cartTotal)}`,"ok");
  };

  // ── Listing CRUD ──
  const validate = f=>{const e={};if(!f.name.trim())e.name="Required";if(!f.price||isNaN(f.price))e.price="Required";if(f.stock===""||isNaN(f.stock))e.stock="Required";return e;};
  const saveListing = () => {
    const e=validate(form); if(Object.keys(e).length){setErrs(e);return;} setErrs({});
    const l={...form,price:+form.price,mrp:+form.mrp||+form.price,stock:+form.stock,gst:+form.gst,sold:0};
    if(editId){setListings(listings.map(x=>x.id===editId?{...x,...l}:x));addToast("Listing updated ✓");}
    else{setListings([...listings,{...l,id:Date.now()}]);addToast("Listing added ✓");}
    setShowForm(false); setEditId(null); setFrm(EMPTY);
  };
  const delListing = id=>{setListings(listings.filter(l=>l.id!==id));setViewId(null);addToast("Listing removed","warn");};
  const openEdit   = l=>{setFrm({...l,price:String(l.price),mrp:String(l.mrp),stock:String(l.stock),gst:String(l.gst)});setEditId(l.id);setShowForm(true);setViewId(null);};

  const vl = viewId ? listings.find(l=>l.id===viewId) : null;
  const lbl=(t,req=false)=><label style={{fontSize:11,fontWeight:600,color:"var(--text2)",display:"block",marginBottom:5}}>{t}{req&&<span style={{color:"#ef4444"}}> *</span>}</label>;

  return (
    <div className="fade" style={{padding:24}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,margin:0}}>🏪 Sales</h2>
          <p style={{fontSize:13,color:"var(--text2)",marginTop:3}}>Manage bag listings, pricing & track all sales</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Cart button */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setCartOpen(!cartOpen)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",background:cart.length?"var(--primary)":"var(--card2)",border:`1px solid ${cart.length?"var(--primary)":"var(--border)"}`,borderRadius:10,color:cart.length?"#fff":"var(--text2)",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .2s"}}>
              🛒 Cart
              {cart.length>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cart.reduce((s,c)=>s+c.qty,0)}</span>}
            </button>

            {/* Cart dropdown */}
            {cartOpen&&(
              <div className="scale" style={{position:"absolute",top:48,right:0,width:340,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,zIndex:99,boxShadow:"0 20px 60px rgba(0,0,0,.2)",overflow:"hidden"}}>
                <div style={{padding:"13px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <p style={{fontWeight:700,fontSize:14,margin:0}}>🛒 Cart ({cart.reduce((s,c)=>s+c.qty,0)} items)</p>
                  <button onClick={()=>setCartOpen(false)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--text3)"}}>✕</button>
                </div>
                <div style={{maxHeight:260,overflowY:"auto"}}>
                  {cart.length===0
                    ?<p style={{padding:"24px",textAlign:"center",color:"var(--text3)",fontSize:13}}>Your cart is empty</p>
                    :cart.map(c=>(
                      <div key={c.id} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
                        <div style={{width:40,height:40,borderRadius:9,background:`${c.color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                          {c.image?<img src={c.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/>:c.emoji}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontWeight:600,fontSize:13,margin:"0 0 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</p>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <button onClick={()=>changeQty(c.id,c.qty-1)} style={{width:22,height:22,borderRadius:6,border:"1px solid var(--border)",background:"var(--card2)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                            <span className="mono" style={{fontSize:12,fontWeight:600,minWidth:20,textAlign:"center"}}>{c.qty}</span>
                            <button onClick={()=>changeQty(c.id,c.qty+1)} style={{width:22,height:22,borderRadius:6,border:"1px solid var(--border)",background:"var(--card2)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <p className="mono" style={{fontWeight:700,fontSize:13,margin:"0 0 4px",color:"var(--primary)"}}>{fmtC(c.price*c.qty)}</p>
                          <button onClick={()=>removeFromCart(c.id)} style={{fontSize:10,color:"#dc2626",background:"none",border:"none",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Remove</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {cart.length>0&&(
                  <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                      <span style={{fontWeight:700,fontSize:14}}>Total</span>
                      <span className="mono" style={{fontWeight:800,fontSize:16,color:"var(--primary)"}}>{fmtC(cartTotal)}</span>
                    </div>
                    <button className="btn" style={{width:"100%"}} onClick={checkout}>✅ Confirm Sale — {fmtC(cartTotal)}</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="btn-outline btn-sm" onClick={()=>{downloadCSV(sales,"sales.csv");addToast("Sales exported ✓","info");}}>📊 Export</button>
          <button className="btn btn-sm" onClick={()=>{setFrm(EMPTY);setEditId(null);setErrs({});setShowForm(!showForm);}}>
            {showForm?"✕ Close":"+ Add Listing"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[
          {l:"Total Listings",  v:totalListings,                          c:"#6366f1",icon:"🏪"},
          {l:"Total Revenue",   v:fmtC(totalRevenue),                    c:"#22c55e",icon:"💰"},
          {l:"Units Sold",      v:fmtN(totalUnitsSold),                   c:"#f59e0b",icon:"📦"},
          {l:"Avg Sale Value",  v:sales.length?fmtC(Math.round(totalRevenue/sales.length)):"₹0", c:"#0ea5e9",icon:"📈"},
        ].map(c=>(
          <div key={c.l} className="card" style={{padding:"16px 18px",borderLeft:`3px solid ${c.c}`,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:26}}>{c.icon}</span>
            <div>
              <p style={{fontSize:10,color:"var(--text3)",margin:0,fontWeight:500,textTransform:"uppercase",letterSpacing:".05em"}}>{c.l}</p>
              <p className="mono" style={{fontSize:20,fontWeight:800,color:c.c,margin:"3px 0 0"}}>{c.v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Listing Form */}
      {showForm&&(
        <div className="card fade" style={{padding:24,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{fontWeight:700,fontSize:16}}>{editId?"✏️ Edit Listing":"➕ Add New Bag Listing"}</h3>
            <button className="btn-ghost" onClick={()=>setShowForm(false)} style={{fontSize:18}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:24}}>
            {/* Image side */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {/* Image upload box */}
              <div onClick={()=>!form.image&&fileRef.current.click()}
                style={{width:"100%",aspectRatio:"1",borderRadius:14,overflow:"hidden",
                  border:`2px dashed ${form.image?"transparent":"var(--border)"}`,
                  background:`${form.color}12`,display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",
                  transition:"all .2s"}}
                onMouseEnter={e=>!form.image&&(e.currentTarget.style.borderColor="var(--primary)")}
                onMouseLeave={e=>!form.image&&(e.currentTarget.style.borderColor="var(--border)")}>
                {form.image
                  ?<>
                    <img src={form.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={e=>{e.stopPropagation();setFrm(f=>({...f,image:null}));}}
                      style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.65)",color:"#fff",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </>
                  :<>
                    <span style={{fontSize:52,marginBottom:10}}>{form.emoji}</span>
                    <p style={{fontSize:12,color:"var(--text3)",textAlign:"center",padding:"0 8px",lineHeight:1.5}}>Click to upload<br/>product photo</p>
                    <p style={{fontSize:10,color:"var(--text3)",marginTop:4}}>JPG, PNG, WEBP</p>
                  </>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
                onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onloadend=()=>setFrm(fm=>({...fm,image:r.result}));r.readAsDataURL(f);}}/>
              <button className="btn-outline" style={{fontSize:12,padding:"8px",justifyContent:"center"}} onClick={()=>fileRef.current.click()}>
                📸 {form.image?"Change Photo":"Upload Photo"}
              </button>

              {/* Emoji + color */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  {lbl("Emoji")}
                  <input value={form.emoji} onChange={e=>setFrm(f=>({...f,emoji:e.target.value}))} style={{textAlign:"center",fontSize:22,padding:"6px!important"}} maxLength={2}/>
                </div>
                <div>
                  {lbl("Color")}
                  <input type="color" value={form.color} onChange={e=>setFrm(f=>({...f,color:e.target.value}))} style={{height:40,cursor:"pointer",padding:"3px!important"}}/>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{gridColumn:"1/-1"}}>
                {lbl("Bag Name",true)}
                <input value={form.name} onChange={e=>setFrm(f=>({...f,name:e.target.value}))} placeholder="e.g. Classic Leather Tote"/>
                {errs.name&&<span style={{fontSize:11,color:"#ef4444"}}>{errs.name}</span>}
              </div>

              <div>{lbl("Category")}<select value={form.cat} onChange={e=>setFrm(f=>({...f,cat:e.target.value}))}>{CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
              <div>{lbl("Badge / Label")}<input value={form.badge} onChange={e=>setFrm(f=>({...f,badge:e.target.value}))} placeholder="e.g. Bestseller, New, Sale"/></div>

              <div>
                {lbl("Selling Price (₹)",true)}
                <div style={{display:"flex",border:"1.5px solid var(--border)",borderRadius:9,overflow:"hidden"}}>
                  <span style={{padding:"9px 10px",background:"var(--card2)",fontSize:13,fontWeight:600,color:"var(--text2)",borderRight:"1px solid var(--border)"}}>₹</span>
                  <input type="number" value={form.price} onChange={e=>setFrm(f=>({...f,price:e.target.value}))} placeholder="0" min="0" style={{border:"none!important",borderRadius:"0!important",flex:1}}/>
                </div>
                {errs.price&&<span style={{fontSize:11,color:"#ef4444"}}>{errs.price}</span>}
              </div>

              <div>
                {lbl("MRP / Original Price (₹)")}
                <div style={{display:"flex",border:"1.5px solid var(--border)",borderRadius:9,overflow:"hidden"}}>
                  <span style={{padding:"9px 10px",background:"var(--card2)",fontSize:13,fontWeight:600,color:"var(--text2)",borderRight:"1px solid var(--border)"}}>₹</span>
                  <input type="number" value={form.mrp} onChange={e=>setFrm(f=>({...f,mrp:e.target.value}))} placeholder="0" min="0" style={{border:"none!important",borderRadius:"0!important",flex:1}}/>
                </div>
              </div>

              <div>
                {lbl("Stock Available",true)}
                <input type="number" value={form.stock} onChange={e=>setFrm(f=>({...f,stock:e.target.value}))} placeholder="e.g. 50" min="0"/>
                {errs.stock&&<span style={{fontSize:11,color:"#ef4444"}}>{errs.stock}</span>}
              </div>

              <div>{lbl("GST Rate")}<select value={form.gst} onChange={e=>setFrm(f=>({...f,gst:e.target.value}))}><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option></select></div>

              {/* Live discount preview */}
              {form.price && form.mrp && +form.mrp > +form.price && (
                <div style={{gridColumn:"1/-1",padding:"10px 14px",background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,display:"flex",gap:20}}>
                  <div><p style={{fontSize:10,color:"#92400e",margin:0}}>Discount</p><p className="mono" style={{fontSize:15,fontWeight:700,color:"#ea580c",margin:0}}>{Math.round(((+form.mrp-+form.price)/+form.mrp)*100)}% OFF</p></div>
                  <div><p style={{fontSize:10,color:"#92400e",margin:0}}>You save</p><p className="mono" style={{fontSize:15,fontWeight:700,color:"#ea580c",margin:0}}>{fmtC(+form.mrp-+form.price)}/unit</p></div>
                  <div><p style={{fontSize:10,color:"#92400e",margin:0}}>Price + GST</p><p className="mono" style={{fontSize:15,fontWeight:700,color:"#ea580c",margin:0}}>{fmtC(+form.price*(1+(+form.gst/100)))}</p></div>
                </div>
              )}

              <div style={{gridColumn:"1/-1"}}>
                {lbl("Product Description")}
                <textarea value={form.desc} onChange={e=>setFrm(f=>({...f,desc:e.target.value}))} placeholder="Material, features, use case, available colours…" rows={3} style={{resize:"vertical",lineHeight:1.65}}/>
              </div>

              <div style={{gridColumn:"1/-1",display:"flex",gap:10}}>
                <button className="btn" onClick={saveListing}>{editId?"💾 Update Listing":"🏪 Add to Catalogue"}</button>
                <button className="btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[["catalogue","🏪 Catalogue"],["sales","📋 Sales History"],["insights","📊 Sales Insights"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 18px",borderRadius:10,border:tab===id?"none":"1px solid var(--border)",fontWeight:600,fontSize:13,transition:"all .15s",background:tab===id?"var(--primary)":"var(--card)",color:tab===id?"#fff":"var(--text2)",boxShadow:tab===id?"0 3px 10px rgba(99,102,241,.3)":"none"}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── CATALOGUE TAB ── */}
      {tab==="catalogue"&&(
        <>
          {/* Filters */}
          <div className="card" style={{padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:180,position:"relative"}}>
              <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--text3)"}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search bag name or category…" style={{paddingLeft:34}}/>
            </div>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{width:"auto"}}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
            <span style={{fontSize:12,color:"var(--text3)"}}>{shownListings.length} listings</span>
          </div>

          {/* Product grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {shownListings.map(l=>{
              const disc=discount(l);
              const inCart=cart.find(c=>c.id===l.id);
              const bc=badgeColor(l.badge);
              return (
                <div key={l.id} className="card" style={{overflow:"hidden",transition:"all .22s",display:"flex",flexDirection:"column"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,.13)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>

                  {/* Product Image Area */}
                  <div style={{height:190,background:`${l.color}12`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderBottom:`2px solid ${l.color}20`,flexShrink:0}}>
                    {l.image
                      ?<img src={l.image} alt={l.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:80}}>{l.emoji}</span>}

                    {/* Discount badge */}
                    {disc>0&&<span style={{position:"absolute",top:10,left:10,background:"#ef4444",color:"#fff",fontSize:11,fontWeight:800,padding:"3px 9px",borderRadius:20}}>−{disc}% OFF</span>}

                    {/* Badge label */}
                    {l.badge&&<span style={{position:"absolute",top:10,right:10,...bc,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,border:`1px solid ${bc.c}30`}}>{l.badge}</span>}

                    {/* Stock indicator */}
                    {l.stock===0&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:800,fontSize:16,background:"rgba(0,0,0,.6)",padding:"6px 16px",borderRadius:8}}>OUT OF STOCK</span></div>}
                  </div>

                  {/* Product Info */}
                  <div style={{padding:"14px 16px",flex:1,display:"flex",flexDirection:"column"}}>
                    <div style={{marginBottom:8}}>
                      <p style={{fontWeight:700,fontSize:15,margin:"0 0 4px",lineHeight:1.3}}>{l.name}</p>
                      <span style={{fontSize:11,fontWeight:600,color:l.color,background:`${l.color}14`,padding:"2px 8px",borderRadius:20}}>{l.cat}</span>
                    </div>

                    <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.55,margin:"0 0 10px",flex:1,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{l.desc}</p>

                    {/* Price section */}
                    <div style={{display:"flex",alignItems:"flex-end",gap:8,marginBottom:10}}>
                      <p className="mono" style={{fontSize:22,fontWeight:900,color:"var(--text)",margin:0}}>{fmtC(l.price)}</p>
                      {l.mrp>l.price&&<p className="mono" style={{fontSize:14,color:"var(--text3)",textDecoration:"line-through",margin:"0 0 2px"}}>{fmtC(l.mrp)}</p>}
                      <span style={{fontSize:11,color:"var(--text3)",marginBottom:2}}>+{l.gst}% GST</span>
                    </div>

                    {/* Stock & sold */}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,padding:"6px 10px",background:"var(--card2)",borderRadius:8,border:"1px solid var(--border)"}}>
                      <span style={{fontSize:11,color:l.stock<10?"#ef4444":l.stock<20?"#d97706":"#15803d",fontWeight:600}}>📦 {l.stock} in stock</span>
                      <span style={{fontSize:11,color:"var(--text3)"}}>✅ {l.sold} sold</span>
                    </div>

                    {/* Cart + action buttons */}
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>addToCart(l)} disabled={l.stock===0}
                        style={{flex:1,padding:"9px 0",border:"none",borderRadius:9,fontWeight:700,fontSize:13,cursor:l.stock===0?"not-allowed":"pointer",transition:"all .18s",
                          background:l.stock===0?"var(--card3)":inCart?"#dcfce7":"var(--primary)",
                          color:l.stock===0?"var(--text3)":inCart?"#15803d":"#fff",
                          opacity:l.stock===0?.6:1}}>
                        {l.stock===0?"Out of Stock":inCart?`🛒 In Cart (${inCart.qty})`:"🛒 Add to Cart"}
                      </button>
                      <button onClick={()=>setViewId(l.id)} style={{padding:"9px 12px",border:"1px solid var(--border)",borderRadius:9,background:"var(--card2)",color:"var(--text2)",fontSize:13,cursor:"pointer"}}>👁</button>
                      <button onClick={()=>openEdit(l)} style={{padding:"9px 12px",border:"1px solid var(--border)",borderRadius:9,background:"var(--card2)",color:"var(--text2)",fontSize:13,cursor:"pointer"}}>✏️</button>
                      <button onClick={()=>delListing(l.id)} style={{padding:"9px 10px",border:"1px solid #fecaca",borderRadius:9,background:"#fef2f2",color:"#dc2626",fontSize:13,cursor:"pointer"}}>🗑</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {shownListings.length===0&&(
              <div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px",color:"var(--text3)"}}>
                <p style={{fontSize:48,marginBottom:12}}>🏪</p>
                <p style={{fontSize:15,fontWeight:600,color:"var(--text2)",marginBottom:6}}>No listings found</p>
                <p style={{fontSize:13}}>Try a different search or add a new listing.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── SALES HISTORY TAB ── */}
      {tab==="sales"&&(
        <>
          <div className="card" style={{padding:"12px 16px",marginBottom:16}}>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"var(--text3)"}}>🔍</span>
              <input value={saleSearch} onChange={e=>setSaleSearch(e.target.value)} placeholder="Search by listing, customer or sale ID…" style={{paddingLeft:34}}/>
            </div>
          </div>

          <div className="card" style={{overflow:"hidden",marginBottom:16}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"var(--card2)"}}>
                {["Sale ID","Listing","Customer","Channel","Qty","Unit Price","Total","Date","Status"].map(h=>(
                  <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em",borderBottom:"1px solid var(--border)",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {shownSales.map(s=>{
                  const ss=saleSt(s.status);
                  return (
                    <tr key={s.id} className="trow" style={{borderBottom:"1px solid var(--border)"}}>
                      <td style={{padding:"11px 14px"}}><span className="mono" style={{fontSize:12,fontWeight:600,color:"var(--primary)"}}>{s.id}</span></td>
                      <td style={{padding:"11px 14px",fontWeight:600,maxWidth:160}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{s.listing}</span></td>
                      <td style={{padding:"11px 14px",color:"var(--text2)"}}>{s.customer}</td>
                      <td style={{padding:"11px 14px"}}><Tag bg="var(--plight)" c="var(--primary)">{s.channel}</Tag></td>
                      <td style={{padding:"11px 14px"}}><span className="mono" style={{fontWeight:600}}>{s.qty}</span></td>
                      <td style={{padding:"11px 14px"}}><span className="mono">{fmtC(s.price)}</span></td>
                      <td style={{padding:"11px 14px"}}><span className="mono" style={{fontWeight:700,color:"var(--primary)"}}>{fmtC(s.total)}</span></td>
                      <td style={{padding:"11px 14px",color:"var(--text2)",fontSize:12}}>{s.date}</td>
                      <td style={{padding:"11px 14px"}}><Tag bg={ss.bg} c={ss.c}>{s.status}</Tag></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{background:"var(--card2)",borderTop:"2px solid var(--border)"}}>
                  <td colSpan={5} style={{padding:"11px 14px",fontWeight:700}}>Total ({shownSales.length} sales)</td>
                  <td style={{padding:"11px 14px"}}><span className="mono" style={{fontWeight:700}}>{fmtN(shownSales.reduce((s,sl)=>s+sl.qty,0))} units</span></td>
                  <td style={{padding:"11px 14px"}}><span className="mono" style={{fontWeight:800,fontSize:15,color:"var(--primary)"}}>{fmtC(shownSales.reduce((s,sl)=>s+sl.total,0))}</span></td>
                  <td colSpan={2}/>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* ── SALES INSIGHTS TAB ── */}
      {tab==="insights"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            {/* Revenue by listing bar chart */}
            <div className="card" style={{padding:"18px 20px"}}>
              <p style={{fontWeight:700,fontSize:14,marginBottom:4}}>Revenue by Listing</p>
              <p style={{fontSize:12,color:"var(--text2)",marginBottom:14}}>Total earnings per product</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={listings.map(l=>({name:l.name.split(" ").slice(0,2).join(" "),rev:l.price*l.sold,color:l.color})).sort((a,b)=>b.rev-a.rev).slice(0,6)} layout="vertical" margin={{left:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:10,fill:"var(--text3)"}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <YAxis dataKey="name" type="category" tick={{fontSize:11,fill:"var(--text2)"}} width={100}/>
                  <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,fontSize:12}} formatter={v=>[fmtC(v),"Revenue"]}/>
                  <Bar dataKey="rev" radius={[0,6,6,0]} name="Revenue">
                    {listings.map((l,i)=><Cell key={i} fill={l.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Units sold donut */}
            <div className="card" style={{padding:"18px 20px"}}>
              <p style={{fontWeight:700,fontSize:14,marginBottom:4}}>Units Sold Share</p>
              <p style={{fontSize:12,color:"var(--text2)",marginBottom:10}}>% of total units per product</p>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={listings.filter(l=>l.sold>0).map(l=>({name:l.name.split(" ")[0],value:l.sold,color:l.color}))} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {listings.filter(l=>l.sold>0).map((l,i)=><Cell key={i} fill={l.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
                {listings.filter(l=>l.sold>0).sort((a,b)=>b.sold-a.sold).slice(0,4).map(l=>(
                  <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:2,background:l.color,display:"inline-block"}}/><span style={{fontSize:12,color:"var(--text2)"}}>{l.name.split(" ").slice(0,2).join(" ")}</span></div>
                    <span className="mono" style={{fontSize:12,fontWeight:600}}>{l.sold} sold</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top performers table */}
          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
              <p style={{fontWeight:700,fontSize:14,margin:0}}>🏆 Product Performance Ranking</p>
              <p style={{fontSize:12,color:"var(--text2)",margin:"3px 0 0"}}>Sorted by total revenue generated</p>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"var(--card2)"}}>
                {["Rank","Product","Category","Price","MRP","Discount","Stock","Sold","Revenue","Margin"].map(h=>(
                  <th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid var(--border)",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...listings].sort((a,b)=>(b.price*b.sold)-(a.price*a.sold)).map((l,i)=>{
                  const disc=discount(l);
                  return (
                    <tr key={l.id} className="trow" style={{borderBottom:"1px solid var(--border)"}}>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:700,color:i<3?["#f5a623","#94a3b8","#c97b3c"][i]:"var(--text3)",fontSize:16}}>{i<3?["🥇","🥈","🥉"][i]:i+1}</span></td>
                      <td style={{padding:"11px 13px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:36,height:36,borderRadius:9,background:`${l.color}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                            {l.image?<img src={l.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:20}}>{l.emoji}</span>}
                          </div>
                          <span style={{fontWeight:600}}>{l.name}</span>
                        </div>
                      </td>
                      <td style={{padding:"11px 13px"}}><Tag bg={`${l.color}14`} c={l.color}>{l.cat}</Tag></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:700}}>{fmtC(l.price)}</span></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{color:"var(--text3)",textDecoration:"line-through"}}>{fmtC(l.mrp)}</span></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{color:disc>0?"#ef4444":"var(--text3)",fontWeight:disc>0?700:400}}>{disc>0?`${disc}% OFF`:"—"}</span></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{color:l.stock<10?"#ef4444":l.stock<20?"#d97706":"#22c55e",fontWeight:600}}>{l.stock}</span></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:600}}>{l.sold}</span></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:700,color:"var(--primary)"}}>{fmtC(l.price*l.sold)}</span></td>
                      <td style={{padding:"11px 13px"}}><span className="mono" style={{fontWeight:700,color:disc>20?"#22c55e":"#f59e0b"}}>{disc}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!vl} onClose={()=>setViewId(null)} title={vl?.name||""} width={520}>
        {vl&&(
          <>
            <div style={{height:210,background:`${vl.color}12`,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,marginBottom:16,position:"relative",overflow:"hidden"}}>
              {vl.image?<img src={vl.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:12}}/>:<span style={{fontSize:96}}>{vl.emoji}</span>}
              {vl.badge&&<span style={{position:"absolute",top:12,right:12,...badgeColor(vl.badge),fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20}}>{vl.badge}</span>}
              {discount(vl)>0&&<span style={{position:"absolute",top:12,left:12,background:"#ef4444",color:"#fff",fontSize:12,fontWeight:800,padding:"4px 10px",borderRadius:20}}>−{discount(vl)}% OFF</span>}
            </div>

            <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:8}}>
              <p className="mono" style={{fontSize:26,fontWeight:900,margin:0}}>{fmtC(vl.price)}</p>
              {vl.mrp>vl.price&&<p className="mono" style={{fontSize:16,color:"var(--text3)",textDecoration:"line-through",margin:"0 0 3px"}}>{fmtC(vl.mrp)}</p>}
            </div>
            <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.65,marginBottom:14}}>{vl.desc}</p>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[["Category",vl.cat],["GST Rate",`${vl.gst}%`],["In Stock",`${vl.stock} pcs`],["Units Sold",vl.sold],["Price + GST",fmtC(vl.price*(1+vl.gst/100))],["Revenue",fmtC(vl.price*vl.sold)]].map(([k,v])=>(
                <div key={k} className="card2" style={{padding:"10px 12px"}}>
                  <p style={{fontSize:10,color:"var(--text3)",margin:"0 0 3px"}}>{k}</p>
                  <p className="mono" style={{fontSize:14,fontWeight:700,margin:0}}>{v}</p>
                </div>
              ))}
            </div>

            <ProgressBar value={vl.sold} max={vl.sold+vl.stock} color={vl.color} label="Sold vs Available" valLabel={`${vl.sold} sold / ${vl.stock} left`}/>

            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="btn" style={{flex:1}} onClick={()=>{addToCart(vl);setViewId(null);}}>🛒 Add to Cart</button>
              <button className="btn-outline" style={{flex:1}} onClick={()=>openEdit(vl)}>✏️ Edit</button>
              <button className="btn-red" onClick={()=>delListing(vl.id)}>🗑</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  PAGES CONFIG
// ═══════════════════════════════════════════════
