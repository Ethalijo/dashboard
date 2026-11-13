'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Home, Map, Plus, Building2, MapPin, Star, ArrowRight, Wallet, CheckCircle2, X, ChevronLeft, AlertTriangle, Clock3, Filter, Ticket, Mail, Download, RotateCcw, Settings2, CreditCard, Bell, Search, UserRound } from 'lucide-react';

const TransportMap = dynamic(() => import('../components/TransportMap'), { ssr: false });
const INITIAL_CREDITS = 250;
const modes = ['Metro', 'Bus', 'Taxi', 'E-Scooter', 'Etihad Rail'];
const places = ['Dubai Marina', 'Dubai Mall', 'JBR', 'Deira', 'Business Bay', 'Dubai Airport', 'Home', 'Work'];
const deals = [
  ['🎉','Welcome Offer','10% OFF','WELCOME10'],
  ['🚌','Bus Saver','AED 5 OFF','BUS5'],
  ['🚕','Taxi Deal','AED 7 OFF','TAXI7'],
  ['🛴','Scooter Saver','5% OFF','SCOOT5']
];
const money = n => `AED ${Number(n).toFixed(2)}`;
const baseRoutes = [
  {id:'M1',mode:'Metro',label:'Metro Line 1',price:8,time:32,transfers:0,depart:'10:05',arrive:'10:37'},
  {id:'B1',mode:'Bus',label:'RTA Bus 8',price:6,time:52,transfers:1,depart:'10:10',arrive:'11:02'},
  {id:'T1',mode:'Taxi',label:'Standard Taxi',price:48,time:24,transfers:0,depart:'10:00',arrive:'10:24'},
  {id:'S1',mode:'E-Scooter',label:'Scooter Rental',price:18,time:43,transfers:0,depart:'10:02',arrive:'10:45'},
  {id:'E1',mode:'Etihad Rail',label:'Rail Connection (demo)',price:35,time:40,transfers:1,depart:'10:20',arrive:'11:00'},
  {id:'B2',mode:'Bus',label:'Express Bus',price:12,time:35,transfers:0,depart:'10:25',arrive:'11:00'},
  {id:'M2',mode:'Metro',label:'Metro + Bus',price:10,time:38,transfers:1,depart:'10:15',arrive:'10:53'}
];
const initialBooking = {ref:'UAT-DEMO-2048',route:baseRoutes[0],from:'Dubai Marina',to:'Dubai Mall',price:8,status:'Confirmed',paidBy:'Demo credits',refundable:8};

export default function Page() {
  const [screen,setScreen] = useState('dashboard');
  const [balance,setBalance] = useState(INITIAL_CREDITS);
  const [amount,setAmount] = useState('50');
  const [topupSuccess,setTopupSuccess] = useState(null);
  const [modal,setModal] = useState(null);
  const [flow,setFlow] = useState('B');
  const [mode,setMode] = useState('Metro');
  const [from,setFrom] = useState('Dubai Marina');
  const [to,setTo] = useState('Dubai Mall');
  const [filter,setFilter] = useState('cheapest');
  const [results,setResults] = useState(false);
  const [selectedRoute,setSelectedRoute] = useState(null);
  const [saved,setSaved] = useState(['Home','Work']);
  const [homeAddress,setHomeAddress] = useState('');
  const [bookings,setBookings] = useState([initialBooking]);
  const [currentRef,setCurrentRef] = useState('UAT-DEMO-2048');
  const [message,setMessage] = useState('');
  const [auth,setAuth] = useState(false);
  const [authPage,setAuthPage] = useState('login');
  const [receipt,setReceipt] = useState(null);
  const [inbox,setInbox] = useState([]);
  const [disrupted,setDisrupted] = useState(false);
  const [studyOpen,setStudyOpen] = useState(false);
  const [participant,setParticipant] = useState('P01');
  const [task,setTask] = useState('Comparison A');
  const [studyStart,setStudyStart] = useState(null);
  const [rating,setRating] = useState('4');
  const [confidence,setConfidence] = useState('4');
  const [notes,setNotes] = useState('');
  const [records,setRecords] = useState([]);
  const [lastOutcome,setLastOutcome] = useState(null);
  const sequence = useRef(2049);
  const booked = bookings.find(b=>b.ref===currentRef) || bookings[0];
  const routes = baseRoutes.filter(r=>mode==='All modes'||r.mode===mode).sort((a,b)=>filter==='cheapest'?a.price-b.price:filter==='transfers'?a.transfers-b.transfers||a.price-b.price:a.time-b.time);
  const participantNumber = Number(participant.replace(/\D/g,'')) || 1;
  const order = participantNumber%2===1?'A then B':'B then A';
  function go(s){setScreen(s);setMessage('');if(typeof window!=='undefined')window.scrollTo(0,0);}
  function recordEvent(name,detail='') { setRecords(old=>[...old,{participant,task,event:name,detail,time:new Date().toISOString()}]); }
  function showReceipt(kind,data){const r={kind,id:`R-${String(sequence.current++).padStart(5,'0')}`,date:new Date().toLocaleString('en-GB'),...data};setReceipt(r);setInbox(old=>[r,...old]);recordEvent('receipt',r.id);go('receipt');}
  function topup(amt,method='Card'){
    const n=Number(amt);
    if(!Number.isFinite(n)||n<=0||n>1000){setMessage('Enter an amount from AED 1 to AED 1,000.');return;}
    const updated=Math.round((balance+n)*100)/100;
    setBalance(updated);setTopupSuccess({amount:n,updated,method});setModal(null);setMessage('');recordEvent('topup',`${method} ${money(n)}`);
  }
  function openPayment(){if(!selectedRoute)return;setMessage('');go('payment');}
  function pay(){
    if(!selectedRoute)return;
    if(balance<selectedRoute.price){setModal('insufficient');return;}
    setBalance(b=>Math.round((b-selectedRoute.price)*100)/100);
    const b={ref:`UAT-DEMO-${sequence.current++}`,route:selectedRoute,from,to,price:selectedRoute.price,status:'Confirmed',paidBy:'Demo credits',refundable:selectedRoute.price};
    setBookings(old=>[b,...old]);setCurrentRef(b.ref);recordEvent('booking_confirmed',b.ref);
    showReceipt('Journey payment',{amount:selectedRoute.price,description:`${from} → ${to} · ${selectedRoute.label}`,bookingRef:b.ref});
  }
  function changeBooking(status){
    if(!booked)return;
    const refund=booked.price;
    setBookings(old=>old.map(b=>b.ref===booked.ref?{...b,status}:b));
    if(status==='Cancelled' || status==='Refunded')setBalance(b=>Math.round((b+refund)*100)/100);
    recordEvent(status.toLowerCase(),booked.ref);
    setLastOutcome({status,refund,ref:booked.ref});
    go('outcome');
  }
  function rebook(){
    if(!booked)return;
    const newRoute=baseRoutes.find(r=>r.id==='B2');
    setBookings(old=>old.map(b=>b.ref===booked.ref?{...b,status:'Rebooked',route:newRoute}:b));
    setLastOutcome({status:'Rebooked',refund:0,ref:booked.ref});recordEvent('rebooked',booked.ref);go('outcome');
  }
  function reset(){
    setBalance(INITIAL_CREDITS);setAmount('50');setBookings([initialBooking]);setCurrentRef(initialBooking.ref);setSaved(['Home','Work']);setHomeAddress('');setResults(false);setSelectedRoute(null);setDisrupted(false);setTopupSuccess(null);setModal(null);setInbox([]);setReceipt(null);setAuth(false);setLastOutcome(null);setFlow('B');setFrom('Dubai Marina');setTo('Dubai Mall');setMode('Metro');setStudyStart(null);setMessage('');go('dashboard');recordEvent('reset');
  }
  function saveTask(completed){const elapsed=studyStart?Math.round((Date.now()-studyStart)/1000):null;setRecords(old=>[...old,{participant,task,version:flow,completed:completed?'Yes':'No',seconds:elapsed,difficulty:rating,confidence,notes,time:new Date().toISOString()}]);setStudyStart(null);setNotes('');}
  function csv(){const fields=['participant','task','version','completed','seconds','difficulty','confidence','event','detail','notes','time'];const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';const data=[fields.join(','),...records.map(r=>fields.map(f=>cell(r[f])).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`uae-transport-study-${participant}.csv`;a.click();URL.revokeObjectURL(url);}
  const btn=(label,fn,cls='primary-button')=><button type="button" className={cls} onClick={fn}>{label}</button>;
  const back=(target='dashboard')=><button className="back-link" onClick={()=>go(target)}><ChevronLeft size={17}/>Back</button>;
  const heading=(title,sub)=> <><h1 className="page-heading">{title}</h1>{sub&&<p className="page-subtitle">{sub}</p>}</>;
  const card=(children,cls='panel')=><section className={cls}>{children}</section>;
  const control=(label,value,setValue,list)=><label className="input-label">{label}<select value={value} onChange={e=>setValue(e.target.value)}>{list.map(x=><option key={x} value={x}>{x}</option>)}</select></label>;
  const navigateMode=()=>{setResults(false);setSelectedRoute(null);go('planner');};

  return <div className="app-shell">
    <main className="main-content">
      <header className="mini-header"><span className="mini-title">UAE Transport</span><div className="header-actions"><button className="icon-button" title="Demo login" onClick={()=>go('login')}><UserRound size={18}/></button><button className="icon-button" title="Notifications" onClick={()=>go('notifications')}><Bell size={18}/>{disrupted&&<span className="dot"/>}</button><button className="mini-credit" onClick={()=>go('topup')}><span>Credits</span><strong>{Math.round(balance)}</strong></button></div></header>

      {screen==='dashboard'&&<>
        <section className="digital-card"><div className="card-top"><strong>UAE Transport</strong><Wallet size={23}/></div><div className="card-balance-wrap"><div className="card-label">Available Balance</div><div className="card-balance">{money(balance)}</div></div><div className="card-bottom"><div>4829 •••• •••• 2048<small>DEMO PASSENGER</small></div><small>DEMO CARD</small></div></section>
        <section className="journey-section"><h2>Your Journey</h2><div className="journey-row"><div><span className="place-label">From</span><strong>{booked?.from||'Dubai Marina'}</strong></div><ArrowRight color="#63a79f"/><div className="end-place"><span className="place-label">To</span><strong>{booked?.to||'Dubai Mall'}</strong></div></div><div className="progress-track"><div className="progress-fill"/></div><div className="progress-meta"><span>Started</span><strong>60% Complete (demo)</strong></div><button className="text-link" onClick={()=>go('bookings')}>Manage bookings <ArrowRight size={15}/></button></section>
        <section className="saved-section"><h2>Saved Locations</h2><p>Quickly access your favourite places</p><div className="h-scroll locations-scroll">{[{label:'Home',Icon:Home},{label:'Work',Icon:Building2},{label:'Add location',Icon:Plus},{label:'Favourite',Icon:Star}].map(({label,Icon})=><button type="button" className="location-item" key={label} title={label} aria-label={label} onClick={()=>{if(label==='Add location')go('save-location');else {setFrom(label);navigateMode();}}}><Icon size={31}/></button>)}</div></section>
        {card(<><div className="topup-heading"><div className="topup-icon"><Wallet/></div><div><h2>Top Up Card</h2><p>Add credits to your transport wallet</p></div></div><div className="quick-amounts">{['25','50','100'].map(x=><button className={amount===x?'quick-option selected':'quick-option'} key={x} onClick={()=>setAmount(x)}>AED {x}</button>)}</div><button className="primary-button" onClick={()=>go('topup')}>Continue to top up</button></>,'topup-container')}
        <section className="deals-section"><h2>Coupons &amp; Deals</h2><div className="h-scroll deals-scroll">{deals.map(d=><article className="coupon-card" key={d[3]}><div className="coupon-header"><div className="coupon-copy"><h3>{d[0]} {d[1]}</h3><p>Use on eligible demo journeys</p><span>Code: {d[3]}</span></div><strong className="coupon-off">{d[2]}</strong></div></article>)}</div></section>
        <div className="dashboard-actions">{btn(<><Search size={17}/> Plan a Journey</>,navigateMode)}{btn(<><Ticket size={17}/> My Bookings</>,()=>go('bookings'),'secondary-button')}</div>
      </>}

      {screen==='planner'&&<>{back()}{heading('Plan your journey',flow==='A'?'Mode first: select transport, then locations':'Location first: enter locations, then select transport')}
        {card(<><div className="segmented"><button className={flow==='A'?'active':''} onClick={()=>{setFlow('A');setResults(false);}}>A · Mode first</button><button className={flow==='B'?'active':''} onClick={()=>{setFlow('B');setResults(false);}}>B · Location first</button></div>
          {flow==='A'&&control('Transport mode',mode,setMode,['All modes',...modes])}
          {control('From',from,setFrom,places)}{control('To',to,setTo,places)}
          {flow==='B'&&control('Transport mode',mode,setMode,['All modes',...modes])}
          <div className="two-inputs"><label className="input-label">Date<input type="date" defaultValue="2026-11-15"/></label><label className="input-label">Departure<input type="time" defaultValue="10:00"/></label></div>
          {message&&<p className="form-error">{message}</p>}
          {btn('Find routes',()=>{if(from===to){setMessage('Choose two different locations.');return;}setMessage('');setResults(true);recordEvent('searched',`${flow} ${from} → ${to}`);})}
        </>)}
        {results&&<><div className="section-heading"><h2>Available routes</h2><Filter size={19}/></div>{control('Sort results',filter,setFilter,["cheapest","transfers","fastest"])}<p className="help-text">{filter==='cheapest'?'Cheapest fares shown first.':filter==='transfers'?'Fewest transfers shown first.':'Fastest journeys shown first.'} Routes and fares are simulated.</p>{routes.map((r,i)=>card(<><div className="route-top"><span className="route-mode">{r.mode}</span>{i===0&&<span className="pill">Top match</span>}</div><h3>{r.label}</h3><div className="route-meta"><span><Clock3 size={15}/> {r.depart}–{r.arrive}</span><span>{r.time} min</span><span>{r.transfers} transfer{r.transfers===1?'':'s'}</span></div><div className="route-bottom"><strong>{money(r.price)}</strong><button onClick={()=>{setSelectedRoute(r);go('route');}}>View route <ArrowRight size={15}/></button></div></>))}</>}
      </>}

      {screen==='route'&&selectedRoute&&<>{back('planner')}{heading('Journey details','Review the route before booking.')}{card(<><span className="route-mode">{selectedRoute.mode}</span><h2>{selectedRoute.label}</h2><div className="journey-row"><strong>{from}</strong><ArrowRight size={17}/><strong>{to}</strong></div><div className="detail-row"><span>Departure</span><strong>{selectedRoute.depart}</strong></div><div className="detail-row"><span>Arrival</span><strong>{selectedRoute.arrive}</strong></div><div className="detail-row"><span>Transfers</span><strong>{selectedRoute.transfers}</strong></div><div className="detail-row"><span>Estimated fare</span><strong>{money(selectedRoute.price)}</strong></div></>)}{btn('Continue to booking',()=>go('booking'))}</>}

      {screen==='booking'&&selectedRoute&&<>{back('route')}{heading('Confirm booking','Review the simulated ticket and terms.')}{card(<><div className="route-mode">{selectedRoute.mode}</div><h2>{from} → {to}</h2><div className="detail-row"><span>Service</span><strong>{selectedRoute.label}</strong></div><div className="detail-row"><span>Departure</span><strong>{selectedRoute.depart}</strong></div><div className="detail-row"><span>Total</span><strong>{money(selectedRoute.price)}</strong></div></>)}<Policy/><label className="check-label"><input type="checkbox" checked={auth} onChange={e=>setAuth(e.target.checked)}/> I have reviewed the demo cancellation and refund policy.</label>{btn('Confirm booking & continue to payment',()=>auth?openPayment():setMessage('Please review and accept the demo policy.'))}{message&&<p className="form-error">{message}</p>}</>}

      {screen==='payment'&&selectedRoute&&<>{back('booking')}{heading('Payment','Pay securely using simulated transport credits.')}{card(<><h3>UAE Transport Card</h3><p>4829 •••• •••• 2048</p><div className="detail-row"><span>Available credits</span><strong>{money(balance)}</strong></div><div className="detail-row"><span>Booking total</span><strong>{money(selectedRoute.price)}</strong></div><div className="detail-row"><span>Balance after payment</span><strong>{money(balance-selectedRoute.price)}</strong></div></>)}{balance<selectedRoute.price&&<div className="warning-panel"><AlertTriangle size={19}/> You need {money(selectedRoute.price-balance)} more credit to continue.</div>}{btn(<><CreditCard size={17}/> Pay with credits</>,pay)}{btn('Top up first',()=>go('topup'),'secondary-button')}<p className="help-text">No real card is charged and no payment information is collected.</p></>}

      {screen==='topup'&&<>{back(selectedRoute?'payment':'dashboard')}{heading('Top up transport card','Choose an amount and a demo payment method.')}{card(<><h2>Balance: {money(balance)}</h2><div className="quick-amounts">{['25','50','100'].map(x=><button key={x} className={amount===x?'quick-option selected':'quick-option'} onClick={()=>setAmount(x)}>AED {x}</button>)}</div><label className="input-label">Top-up amount (AED)<input type="number" min="1" max="1000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label>{message&&<p className="form-error">{message}</p>}{btn('Continue to top-up payment',()=>{if(Number(amount)>0&&Number(amount)<=1000){setMessage('');setModal('topup-method');}else setMessage('Enter AED 1–1,000.');})}</>)}<p className="help-text">All top-ups are simulations. No real Apple Pay or bank integration is used.</p></>}

      {screen==='receipt'&&receipt&&<>{heading('Payment receipt','Confirmation of your demo transaction.')}<div className="success-icon"><CheckCircle2 size={42}/></div>{card(<><h2>{receipt.kind}</h2><div className="detail-row"><span>Receipt no.</span><strong>{receipt.id}</strong></div><div className="detail-row"><span>Date</span><strong>{receipt.date}</strong></div><div className="detail-row"><span>Amount</span><strong>{money(receipt.amount)}</strong></div><div className="detail-row"><span>Details</span><strong>{receipt.description}</strong></div>{receipt.bookingRef&&<div className="detail-row"><span>Booking</span><strong>{receipt.bookingRef}</strong></div>}</>)}{btn(<><Mail size={17}/> View demo email receipt</>,()=>go('inbox'))}{btn('Return to Dashboard',()=>go('dashboard'),'secondary-button')}<p className="help-text">A receipt is saved in the in-app demo inbox. No actual email is sent.</p></>}

      {screen==='inbox'&&<>{back()}{heading('Demo inbox','Simulated email receipts; no email was sent.')}{inbox.length===0?<p>No demo receipts yet.</p>:inbox.map(r=>card(<div key={r.id}><strong>{r.kind}: {money(r.amount)}</strong><p>{r.description}</p><small>{r.id} · {r.date}</small></div>))}</>}

      {screen==='save-location'&&<>{back()}{heading('Save Home','Add a simulated favourite location.')}{card(<><label className="input-label">Home location<input placeholder="e.g., Dubai Marina" value={homeAddress} onChange={e=>setHomeAddress(e.target.value)}/></label>{btn('Save Home',()=>{if(!homeAddress.trim()){setMessage('Enter a location first.');return;}setSaved(x=>[...new Set([...x,'Home'])]);setFrom('Home');setMessage('Home saved.');recordEvent('saved_home',homeAddress);go('planner');})}</>)}{message&&<p className="form-error">{message}</p>}</>}

      {screen==='bookings'&&<>{back()}{heading('My bookings','Manage upcoming and past demo journeys.')}{bookings.map(b=><section className="panel" key={b.ref}><div className="route-top"><span className="pill">{b.status}</span><span className="muted">{b.ref}</span></div><h3>{b.from} → {b.to}</h3><p>{b.route.label} · {money(b.price)}</p>{btn('Manage this booking',()=>{setCurrentRef(b.ref);go('manage');},'secondary-button')}</section>)}</>}

      {screen==='manage'&&booked&&<>{back('bookings')}{heading('Manage booking','Cancellation, refund and rebooking options.')}{card(<><span className="pill">{booked.status}</span><h2>{booked.from} → {booked.to}</h2><p>{booked.ref} · {booked.route.label}</p><div className="detail-row"><span>Paid</span><strong>{money(booked.price)}</strong></div><div className="detail-row"><span>Demo cancellation refund</span><strong>{money(booked.refundable)}</strong></div></>)}<Policy/>{booked.status==='Confirmed'&&<>{btn('Cancel booking',()=>setModal('confirm-cancel'))}{btn('Request refund',()=>setModal('confirm-refund'),'secondary-button')}</>}{disrupted&&booked.status==='Confirmed'&&<>{btn('Free rebooking',()=>rebook(),'secondary-button')}{btn('Full disruption refund',()=>changeBooking('Refunded'),'secondary-button')}</>}</>}

      {screen==='notifications'&&<>{back()}{heading('Notifications','Your travel service updates.')}{disrupted?card(<><div className="warning-panel"><AlertTriangle size={20}/> Metro Line 1 is suspended between JBR and Dubai Mall (demo alert).</div><p>You can rebook free of charge or request a full refund for the affected journey.</p>{btn('Rebook free of charge',rebook)}{btn('Request full refund',()=>changeBooking('Refunded'),'secondary-button')}</>):card(<p>No active disruptions. Your journeys are running normally (simulated).</p>)}</>}

      {screen==='outcome'&&lastOutcome&&<>{heading(lastOutcome.status==='Rebooked'?'Rebooking Confirmed':lastOutcome.status==='Cancelled'?'Booking Cancelled':'Refund Completed','Your demo action is complete.') }<div className="success-icon"><CheckCircle2 size={42}/></div>{card(<><div className="detail-row"><span>Booking</span><strong>{lastOutcome.ref}</strong></div><div className="detail-row"><span>Status</span><strong>{lastOutcome.status}</strong></div><div className="detail-row"><span>Demo credit refund</span><strong>{money(lastOutcome.refund)}</strong></div><p className="help-text">All statuses and refunds are simulated. Actual operator policies may differ.</p></>)}{btn('Return to Dashboard',()=>go('dashboard'))}</>}

      {screen==='login'&&<>{back()}{heading(authPage==='login'?'Sign in':'Create account','Demo account access for usability testing.')}{card(<><p>Demo access uses no personal information.</p>{btn('Continue as demo passenger',()=>{setAuth(true);go('dashboard');})}{btn('Continue with Google (setup required)',()=>setModal('google'),'secondary-button')}<button className="text-link" onClick={()=>setAuthPage(authPage==='login'?'signup':'login')}>{authPage==='login'?'Create demo account':'Already have an account?'}</button></>)}<p className="help-text">Real Google OAuth requires an approved provider configuration and credentials.</p></>}

      {screen==='maps'&&<>{heading('Maps','Explore illustrative Dubai transport locations.')}<TransportMap/><p className="help-text">Map markers are demonstration data; dotted lines do not represent actual routes.</p>{btn('Plan a journey',navigateMode)}</>}

      {message&&screen!=='payment'&&screen!=='topup'&&screen!=='booking'&&<p className="form-error">{message}</p>}
      <p className="disclaimer">University usability prototype • simulated fares, payments, refunds and alerts</p>
    </main>

    <nav className="bottom-navigation" aria-label="Main navigation"><button className={screen==='dashboard'?'nav-link active':'nav-link'} onClick={()=>go('dashboard')}><Home size={22}/>Dashboard</button><button className={screen==='maps'?'nav-link active':'nav-link'} onClick={()=>go('maps')}><Map size={22}/>Maps</button></nav>

    <button className="observer-toggle" onClick={()=>setStudyOpen(x=>!x)} aria-label="Open study controls"><Settings2 size={17}/> Study</button>
    {studyOpen&&<aside className="study-panel"><div className="study-top"><strong>Observer controls</strong><button onClick={()=>setStudyOpen(false)} aria-label="Close"><X size={18}/></button></div><p className="help-text">Use participant numbers only. No personal information.</p>
      <label>Participant<input value={participant} onChange={e=>setParticipant(e.target.value.toUpperCase())}/></label><p>Order: <strong>{order}</strong></p>
      <label>Task<select value={task} onChange={e=>setTask(e.target.value)}>{['Comparison A','Comparison B','Task 1: favourite and book','Task 2: top up and pay','Task 3: disruption','Task 4: cancel and refund'].map(t=><option key={t}>{t}</option>)}</select></label>
      <div className="study-buttons"><button onClick={()=>{setStudyStart(Date.now());recordEvent('task_started',task);}}>Start timer</button><button onClick={()=>{setDisrupted(true);recordEvent('disruption_triggered');go('notifications');}}>Trigger disruption</button></div>
      <label>Difficulty (1–7)<select value={rating} onChange={e=>setRating(e.target.value)}>{[1,2,3,4,5,6,7].map(n=><option key={n}>{n}</option>)}</select></label><label>Confidence (1–7)<select value={confidence} onChange={e=>setConfidence(e.target.value)}>{[1,2,3,4,5,6,7].map(n=><option key={n}>{n}</option>)}</select></label><label>Observer notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Wrong taps, issues, feedback..."/></label><div className="study-buttons"><button onClick={()=>saveTask(true)}>Mark complete</button><button onClick={()=>saveTask(false)}>Not complete</button></div><div className="study-buttons"><button onClick={()=>{setBalance(0);recordEvent('balance_set_to_zero');}}>Set 0 credits</button><button onClick={()=>setBalance(INITIAL_CREDITS)}>Restore credits</button></div><div className="study-buttons"><button onClick={csv}><Download size={15}/> Export CSV ({records.length})</button><button onClick={reset}><RotateCcw size={15}/> Reset demo</button></div><p className="help-text">Data is kept in this browser session. Export before closing.</p></aside>}

    {topupSuccess&&<div className="modal-backdrop"><div className="success-modal" role="dialog" aria-modal="true"><div className="success-icon"><CheckCircle2 size={37}/></div><h2>Card topped up!</h2><p>{money(topupSuccess.amount)} added using demo {topupSuccess.method}.</p><div className="updated-balance"><span>New balance</span><strong>{money(topupSuccess.updated)}</strong></div>{btn('View top-up receipt',()=>{const v=topupSuccess;setTopupSuccess(null);showReceipt('Card top-up',{amount:v.amount,description:`Demo ${v.method} payment`});})}{btn('Done',()=>{setTopupSuccess(null);},'secondary-button')}</div></div>}

    {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null);}}><div className="success-modal" role="dialog" aria-modal="true"><button className="modal-close" aria-label="Close" onClick={()=>setModal(null)}><X size={18}/></button>
      {modal==='topup-method'&&<><div className="success-icon"><Wallet size={34}/></div><h2>Top up {money(amount)}</h2><p>Choose a simulated payment method.</p>{btn('Pay with demo card',()=>topup(amount,'Card'))}{btn('Apple Pay style demo',()=>topup(amount,'Apple Pay'),'secondary-button')}<p className="help-text">This does not invoke Apple Pay or charge any card.</p></>}
      {modal==='insufficient'&&<><AlertTriangle size={40} color="#bd7f18"/><h2>Not enough credits</h2><p>You need {money(selectedRoute?selectedRoute.price-balance:0)} more to confirm this trip.</p>{btn('Refill transport card',()=>{setModal(null);setAmount(String(Math.max(25,Math.ceil((selectedRoute?.price||0)-balance))));go('topup');})}{btn('Choose another route',()=>{setModal(null);go('planner');},'secondary-button')}</>}
      {modal==='confirm-cancel'&&<><h2>Cancel this booking?</h2><p>Under the demo policy, you will receive {money(booked?.refundable||0)} in transport credits.</p>{btn('Confirm cancellation',()=>{setModal(null);changeBooking('Cancelled');})}{btn('Go back',()=>setModal(null),'secondary-button')}</>}
      {modal==='confirm-refund'&&<><h2>Request refund?</h2><p>In this simulated study the eligible refund is {money(booked?.refundable||0)}. Actual provider rules may differ.</p>{btn('Confirm demo refund',()=>{setModal(null);changeBooking('Refunded');})}{btn('Go back',()=>setModal(null),'secondary-button')}</>}
      {modal==='google'&&<><h2>Google login setup required</h2><p>Google OAuth is not connected. Use demo passenger mode for this study; production authentication requires a configured Google OAuth provider.</p>{btn('Continue as demo passenger',()=>{setModal(null);setAuth(true);go('dashboard');})}</>}
    </div></div>}
  </div>;
}

function Policy(){return <section className="policy-panel"><h2>Cancellation &amp; Refund Policy (demo)</h2><p>These are illustrative rules, not real operator policies.</p><ul><li>Before travel, demo cancellation returns the listed fare as credits.</li><li>If the operator cancels a service, participants can rebook free or receive a full demo credit refund.</li><li>Real refunds depend on provider-specific terms and payment method.</li></ul></section>}
