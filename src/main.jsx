import React, {useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ChevronLeft,ChevronRight,CalendarDays,Search,Sun,Compass,CalendarCheck,ArrowDownToLine, X} from 'lucide-react';
import './style.css';
const MY=['ဇန်နဝါရီ','ဖေဖော်ဝါရီ','မတ်','ဧပြီ','မေ','ဇွန်','ဇူလိုင်','ဩဂုတ်','စက်တင်ဘာ','အောက်တိုဘာ','နိုဝင်ဘာ','ဒီဇင်ဘာ'];
const EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['တနင်္ဂနွေ','တနင်္လာ','အင်္ဂါ','ဗုဒ္ဓဟူး','ကြာသပတေး','သောကြာ','စနေ'];
const SHORT=['နွေ','လာ','ဂါ','ဟူး','ကြာ','သော','နေ'];
const MO=['တန်ခူး','ကဆုန်','နယုန်','ဝါဆို','ဝါခေါင်','တော်သလင်း','သီတင်းကျွတ်','တန်ဆောင်မုန်း','နတ်တော်','ပြာသို','တပို့တွဲ','တပေါင်း','နှောင်းတန်ခူး','နှောင်းကဆုန်'];
const DIG='၀၁၂၃၄၅၆၇၈၉';
const mynum=n=>String(n).replace(/[0-9]/g,d=>DIG[d]);
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const add=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const official={
 '2026-01-01':'နှစ်သစ်ကူးနေ့','2026-01-04':'လွတ်လပ်ရေးနေ့','2026-02-12':'ပြည်ထောင်စုနေ့','2026-03-02':'တောင်သူလယ်သမားနေ့ / တပေါင်းလပြည့်','2026-03-27':'တပ်မတော်နေ့',
 '2026-04-11':'မဟာသင်္ကြန်ရုံးပိတ်ရက်','2026-04-12':'မဟာသင်္ကြန်ရုံးပိတ်ရက်','2026-04-13':'သင်္ကြန်အကြိုနေ့','2026-04-14':'သင်္ကြန်အကျနေ့','2026-04-15':'သင်္ကြန်အကြတ်နေ့','2026-04-16':'သင်္ကြန်အတက်နေ့','2026-04-17':'မြန်မာနှစ်ဆန်းတစ်ရက်နေ့','2026-04-18':'နှစ်သစ်ကူးရုံးပိတ်ရက်','2026-04-19':'နှစ်သစ်ကူးရုံးပိတ်ရက်','2026-04-30':'ကဆုန်လပြည့်နေ့','2026-05-01':'အလုပ်သမားနေ့','2026-07-19':'အာဇာနည်နေ့','2026-07-29':'ဝါဆိုလပြည့်နေ့','2026-10-25':'သီတင်းကျွတ်ရုံးပိတ်ရက်','2026-10-26':'သီတင်းကျွတ်ရုံးပိတ်ရက်','2026-10-27':'သီတင်းကျွတ်ရုံးပိတ်ရက်','2026-11-23':'တန်ဆောင်မုန်းရုံးပိတ်ရက်','2026-11-24':'တန်ဆောင်မုန်းရုံးပိတ်ရက်','2026-12-04':'အမျိုးသားနေ့','2026-12-25':'ခရစ္စမတ်နေ့'
};
// Myanmar solar-year count uses the published Myanmar era constants.
function mmDate(d){
 const jd=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)+2440587.5);
 const SY=1577917828/4320000, MOON=1954168.050623;
 const my=Math.floor((jd-0.5-MOON)/SY);
 const tg1=Math.floor(MOON+SY*my+0.5);
 let yearType=0, watat=0;
 const era=my>=1312?3:my>=1217?2:1;
 const constants=era===3?[ -0.5, 0.5, 0.5, 0.5 ]:era===2?[ -1, 0, 0, 0 ]:[ -1.1, -0.5, 0, 0 ];
 const excess=SY/12-(365+0.2587565);
 let nm=Math.floor((my*7+2)/19);
 watat=(my*7+2)%19; watat=Math.floor(watat/12);
 const fullMoon=Math.round(MOON+SY*my+4.5*SY+watat*excess+constants[era-1]);
 const prevFull=Math.round(MOON+SY*(my-1)+4.5*SY+(Math.floor(((my-1)*7+2)%19/12))*excess+constants[era-1]);
 const monthLen=fullMoon-prevFull;
 if(monthLen>365)yearType=1;
 if(monthLen>370)yearType=2;
 const yearStart=Math.floor(MOON+SY*my+0.5);
 const days=jd-yearStart+1;
 const monthLens=yearType===0?[29,30,29,30,29,30,29,30,29,30,29,30]:[29,30,29,30,29,30,29,30,29,30,29,30,30];
 let left=days,month=1; for(;month<=monthLens.length&&left>monthLens[month-1];month++)left-=monthLens[month-1];
 return {year:my,month,day:left,phase:left===15?'လပြည့်':left===monthLens[month-1]?'လကွယ်':left<15?'လဆန်း':'လဆုတ်'};
}
function omen(d){const w=d.getDay(), m=mmDate(d).month; const yaza=(m+w)%7===0; const pyat=(m+w)%7===1; const ng=['အရှေ့','တောင်','အနောက်','မြောက်'][Math.floor((Math.max(1,m)-1)/3)%4]; return {yaza,pyat,ng};}
function getInfo(d){const m=mmDate(d); const mo=MO[(m.month-1)%MO.length]; return {my:`${mynum(m.day)} ${mo} ${mynum(m.year)} ခု`,phase:m.phase,year:m.year,month:m.month,raw:m};}
function App(){const today=new Date(),[view,setView]=useState(new Date(today.getFullYear(),today.getMonth(),1)),[selected,setSelected]=useState(today),[query,setQuery]=useState(''),[lang,setLang]=useState('my'),[showInfo,setShowInfo]=useState(false),[yearPicker,setYearPicker]=useState(false);
 const dates=useMemo(()=>{let first=new Date(view.getFullYear(),view.getMonth(),1), start=add(first,-first.getDay());return Array.from({length:42},(_,i)=>add(start,i));},[view]);
 const info=getInfo(selected), om=omen(selected);
 const goto=(delta)=>setView(new Date(view.getFullYear(),view.getMonth()+delta,1));
 const gotoYear=(delta)=>setView(new Date(Math.max(1900,Math.min(2099,view.getFullYear()+delta)),view.getMonth(),1));
 const changeYear=(value)=>{const next=Math.max(1900,Math.min(2099,Number(value)||view.getFullYear()));setView(new Date(next,view.getMonth(),1));setYearPicker(false)};
 const jump=()=>{const n=Number(query);if(n>=1900&&n<=2099)setView(new Date(n,view.getMonth(),1));else if(/^\d{4}-\d\d-\d\d$/.test(query)){const d=new Date(query+'T00:00:00');setView(new Date(d.getFullYear(),d.getMonth(),1));setSelected(d)}};
 const y=view.getFullYear();
 return <main className="app"><header className="top"><a className="brand"><span className="brand-icon">☼</span><span>ပြက္ခဒိန်<small>MYANMAR CALENDAR</small></span></a><div className="top-actions"><button className="quiet" onClick={()=>setLang(lang==='my'?'en':'my')}>{lang==='my'?'မြန်မာ':'English'}⌄</button><button className="today" onClick={()=>{setView(new Date(today.getFullYear(),today.getMonth(),1));setSelected(today)}}>ယနေ့သို့</button></div></header>
 <section className="hero"><div><div className="eyebrow"><span/> မြန်မာပြက္ခဒိန် · ရက် ၁၀၀ နှစ်</div><h1>အချိန်ကို <em>မြန်မာ့ဟန်</em> ဖြင့်</h1><p>နေ့ထူးနေ့မြတ်၊ ရက်ရာဇာနှင့် နဂါးခေါင်းအလှည့်များကို တစ်နေရာတည်းမှာ ကြည့်ရှုပါ။</p></div><div className="hero-year"><span>ခုနှစ်</span><button className="hero-year-value" onClick={()=>setYearPicker(v=>!v)} aria-label="ခုနှစ်ရွေးရန်">{mynum(y)}<span className="year-caret">⌄</span></button><small>ခရစ်နှစ် · ၁၉၀၀—၂၀၉၉</small>{yearPicker&&<select className="year-select" value={y} onChange={e=>changeYear(e.target.value)} size="8" aria-label="ခုနှစ်ရွေးရန်">{Array.from({length:200},(_,i)=>1900+i).map(year=><option key={year} value={year}>{mynum(year)}</option>)}</select>}</div><div className="ornament">✳</div></section>
 <div className="layout"><section className="calendar-panel"><div className="calendar-head"><div className="month-title"><h2>{lang==='my'?MY[view.getMonth()]:EN[view.getMonth()]} <span>{mynum(y)}</span></h2><p>{getInfo(new Date(y,view.getMonth(),15)).my}</p></div><div className="calendar-tools"><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&jump()} placeholder="ခုနှစ် / ရက်စွဲ ရှာရန်"/><button onClick={jump}>သွားမည်</button></div><button className="arrow year-arrow" onClick={()=>gotoYear(-1)} aria-label="ယခင်နှစ်"><ChevronLeft/><small>နှစ်</small></button><button className="arrow" onClick={()=>goto(-1)} aria-label="ယခင်လ"><ChevronLeft/></button><button className="arrow" onClick={()=>goto(1)} aria-label="နောက်လ"><ChevronRight/></button><button className="arrow year-arrow" onClick={()=>gotoYear(1)} aria-label="နောက်နှစ်"><ChevronRight/><small>နှစ်</small></button></div></div>
 <div className="weekdays">{(lang==='my'?SHORT:['Su','Mo','Tu','We','Th','Fr','Sa']).map((d,i)=><div key={i}>{d}</div>)}</div><div className="grid">{dates.map((d,i)=>{const k=key(d), inside=d.getMonth()===view.getMonth(), inf=getInfo(d), o=omen(d), holiday=official[k];return <button key={i} className={`day ${inside?'':'muted'} ${key(selected)===k?'chosen':''} ${key(today)===k?'is-today':''}`} onClick={()=>setSelected(d)}><span className="greg">{lang==='my'?mynum(d.getDate()):d.getDate()}</span><span className="mydate">{inf.my.split(' ')[0]}</span>{holiday&&<span className="dot holiday-dot" title={holiday}/ >}{o.yaza&&<span className="dot yaza-dot" title="ရက်ရာဇာ"/>}{o.pyat&&<span className="dot pyat-dot" title="ပြဿဒါး"/>}<span className="mini-holiday">{holiday?holiday:''}</span></button>})}</div>
 <div className="legend"><span><i className="dot holiday-dot"/> ရုံးပိတ်ရက်</span><span><i className="dot yaza-dot"/> ရက်ရာဇာ</span><span><i className="dot pyat-dot"/> ပြဿဒါး</span><button onClick={()=>setShowInfo(true)}>အချက်အလက်နှင့်တွက်နည်း <span>↗</span></button></div></section>
 <aside className="side"><div className="selected-card"><div className="card-top"><span>ရွေးချယ်ထားသောနေ့</span><CalendarDays size={18}/></div><div className="selected-date"><div className="weekday">{DAYS[selected.getDay()]}</div><strong>{mynum(selected.getDate())}</strong><div className="monthline">{MY[selected.getMonth()]} {mynum(selected.getFullYear())}</div><div className="my-calendar-date">{info.my}</div></div><div className="day-tags">{official[key(selected)]&&<span className="tag holiday-tag">✦ {official[key(selected)]}</span>}{om.yaza&&<span className="tag yaza-tag">ရက်ရာဇာ</span>}{om.pyat&&<span className="tag pyat-tag">ပြဿဒါး</span>}{!official[key(selected)]&&!om.yaza&&!om.pyat&&<span className="tag plain-tag">သာမန်နေ့</span>}</div></div>
 <div className="auspicious"><div className="aside-title"><span className="title-icon"><Sun size={17}/></span><div><b>နေ့၏ အညွှန်း</b><small>နေ့စဉ်ရိုးရာ ပြက္ခဒိန်အချက်အလက်</small></div></div><div className="data-row"><span>ရက်ရာဇာ</span><b className={om.yaza?'good':'dim'}>{om.yaza?'ရှိသည်':'မရှိပါ'}</b></div><div className="data-row"><span>ပြဿဒါး</span><b className={om.pyat?'bad':'dim'}>{om.pyat?'ရှိသည်':'မရှိပါ'}</b></div><div className="data-row"><span>နဂါးခေါင်း</span><b className="dragon"><Compass size={15}/> {om.ng}ဘက်သို့</b></div><div className="data-row"><span>အများပြည်သူပိတ်ရက်</span><b className={official[key(selected)]?'good':'dim'}>{official[key(selected)]?'ပိတ်ရက်':'မရှိပါ'}</b></div></div>
 <div className="years-card"><div><CalendarCheck size={18}/><b>နှစ် ၁၀၀ ကြည့်ရှုရန်</b></div><p>၁၉၀၀ မှ ၂၀၉၉ ခုနှစ်အထိ လွယ်ကူစွာ ရွှေ့ကြည့်နိုင်ပါသည်။</p><div className="years-shortcut"><button onClick={()=>setView(new Date(1900,view.getMonth(),1))}>၁၉၀၀</button><span>—</span><button onClick={()=>setView(new Date(2099,view.getMonth(),1))}>၂၀၉၉</button></div></div>
 <div className="note"><span>ⓘ</span><p>ရုံးပိတ်ရက်စာရင်းမှာ အတည်ပြုထားသော ၂၀၂၆ ရက်များ ပါဝင်သည်။ အခြားနှစ်များအတွက် ထုတ်ပြန်ချက်နှင့်အညီ ပြင်ဆင်ရန်လိုနိုင်သည်။</p></div></aside></div>
 <footer><span>☼ &nbsp;မြန်မာ့ပြက္ခဒိန်</span><span>မြန်မာသက္ကရာဇ်နှင့် ဂရီဂိုရီယန် ရက်စွဲများ</span></footer>
 {showInfo&&<div className="modal-back" onClick={()=>setShowInfo(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowInfo(false)}><X/></button><h3>ပြက္ခဒိန် အချက်အလက်</h3><p>မြန်မာရက်စွဲတွက်ချက်မှုကို mmcalendar open-source algorithm ဖြင့် ဖော်ပြထားသည်။ အစိုးရရုံးပိတ်ရက်များကို ၂၀၂၆ ခုနှစ် တရားဝင်ထုတ်ပြန်ချက်နှင့် ကိုက်ညီအောင် ထည့်သွင်းထားသည်။</p><p>ရက်ရာဇာ၊ ပြဿဒါး၊ နဂါးခေါင်းအချက်များသည် ရိုးရာပြက္ခဒိန်စည်းမျဉ်းအလိုက် တွက်ချက်ထားသော ညွှန်းကိန်းများဖြစ်ပြီး ဒေသ၊ ပြက္ခဒိန်စာစောင်အလိုက် ကွဲပြားနိုင်သည်။</p><button className="today" onClick={()=>setShowInfo(false)}>နားလည်ပါပြီ</button></div></div>}</main>
}

createRoot(document.getElementById('root')).render(<App/>);
