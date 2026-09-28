import { FormEvent, ReactNode, useEffect, useState } from "react";
import { faqs, pageMeta, notFoundMeta, siteUrl, blogTitle, absImage } from "./content.js";
import { supabase } from "./supabase.js";
import { AdminGate } from "./Admin";
import { BlogPostBody } from "./BlogPostBody";

const APP = "https://app.shiftaan.com";
const A = ({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) => <a href={href} className={className}>{children}</a>;
const CTA = ({ alt = false }: { alt?: boolean }) => <A href={alt ? "/#demo" : APP} className={`btn ${alt ? "secondary" : ""}`}>{alt ? "See how it works" : "Try Shiftaan Free"} <span>→</span></A>;
const I = ({ children }: { children: ReactNode }) => <span className="icon">{children}</span>;


function Logo(){return <A href="/" className="logo"><img src="/assets/Logo.svg" alt="Shiftaan"/></A>}
function Nav(){
  const [open,setOpen]=useState(false);
  const links=[["How it works","/how-it-works"],["Pricing","/pricing"],["Blog","/blogs"],["About","/about"]];
  return <header><nav className="wrap nav"><Logo/><div className="links">{links.map(x=><A key={x[1]} href={x[1]}>{x[0]}</A>)}</div><div className="navcta"><A href={APP}>Log in</A><CTA/></div><button className="hamb" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?"×":"☰"}</button></nav>{open&&<div className="mobile">{links.map(x=><A key={x[1]} href={x[1]}>{x[0]}</A>)}<A href={APP}>Log in</A><CTA/></div>}</header>
}
function Footer(){
  const cols=[["Product",["How it works","/how-it-works"],["Pricing","/pricing"],["FAQ","/faq"]],["Resources",["Blog","/blogs"],["Support","/support"]],["Company",["About","/about"]],["Legal",["Privacy Policy","/privacy"],["Terms & Conditions","/terms"],["Cookie Policy","/cookies"]]];
  return <footer><div className="wrap footergrid"><div><Logo/><p>Track your shifts, hours and pay in one place.</p><CTA/></div><div className="footlinks">{cols.map(c=><div key={c[0] as string}><b>{c[0]}</b>{c.slice(1).map((x:any)=><A href={x[1]} key={x[1]}>{x[0]}</A>)}</div>)}</div></div><div className="wrap fine"><span>© 2026 Shiftaan. All rights reserved.</span><span><A href="https://x.com/tryshiftaan">X</A> · <A href="https://instagram.com/tryshiftaan">Instagram</A> · @tryshiftaan</span></div></footer>
}
const GA_ID="G-N1XVMPYP5G";
const COOKIE_CONSENT_KEY="shiftaan-cookie-consent"; // "accepted" | "declined"

// Loads Google Analytics only once the visitor has actively accepted —
// never on page load, never for a "declined" or unmade choice. This is the
// only thing on shiftaan.com that sets a non-essential cookie.
function loadAnalytics(){
  if((window as any).__shiftaanGaLoaded)return;
  (window as any).__shiftaanGaLoaded=true;
  const s=document.createElement("script");
  s.async=true;
  s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  (window as any).dataLayer=(window as any).dataLayer||[];
  function gtag(...args:any[]){(window as any).dataLayer.push(args)}
  (window as any).gtag=gtag;
  gtag("js",new Date());
  gtag("config",GA_ID,{anonymize_ip:true});
}
function getCookieConsent(){try{return localStorage.getItem(COOKIE_CONSENT_KEY)}catch{return null}}
function CookieBanner(){
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const choice=getCookieConsent();
    if(choice==="accepted")loadAnalytics();
    else if(!choice)setShow(true);
  },[]);
  function accept(){setShow(false);try{localStorage.setItem(COOKIE_CONSENT_KEY,"accepted")}catch{}loadAnalytics()}
  function decline(){setShow(false);try{localStorage.setItem(COOKIE_CONSENT_KEY,"declined")}catch{}}
  if(!show)return null;
  return <div className="cookiebanner" role="dialog" aria-label="Cookie notice"><p>We'd like to use Google Analytics to understand how visitors use this site. Signing in to the Shiftaan app also uses one essential cookie to keep you logged in, always on. See our <A href="/cookies">Cookie Policy</A>.</p><div className="cookiebtns"><button className="btn secondary" onClick={decline}>Necessary only</button><button className="btn" onClick={accept}>Accept</button></div></div>;
}
const Layout=({children}:{children:ReactNode})=><><Nav/><main>{children}</main><Footer/><CookieBanner/></>;
function Heading({tag,title,copy,center=false}:{tag?:string;title:string;copy?:string;center?:boolean}){return <div className={`heading ${center?"center":""}`}>{tag&&<span className="eyebrow">{tag}</span>}<h2>{title}</h2>{copy&&<p>{copy}</p>}</div>}

function ShiftUI(){
  return <div className="ui shiftui"><div className="uitop"><b>Add shift</b><span>×</span></div>{[["Company","GoodWood Security"],["Site","Chichester Boots"]].map(x=><label key={x[0]}>{x[0]}<span>{x[1]}⌄</span></label>)}<div className="fields"><label>Start<span>19:00</span></label><label>Finish<span>07:00</span></label><label>Break<span>30 min</span></label><label>Rate<span>£15.00</span></label></div><button className="save">Save shift</button></div>
}
function CompanyUI(){return <div className="ui"><div className="uitop"><b>Companies & sites</b><em>+ Add company</em></div>{[["A","All Time Security","Westfield · Chichester","£13.50/hr"],["G","GoodWood Security","New Age · Gatehouse","£15.00/hr"],["S","Southampton College","Main campus","£12.80/hr"]].map(x=><div className="row" key={x[1]}><i>{x[0]}</i><span><b>{x[1]}</b><small>{x[2]}</small></span><strong>{x[3]}</strong></div>)}</div>}
function PayUI(){
  return <div className="ui payui"><div className="uitop"><span><small>September overview</small><b>Your money</b></span><button>This month⌄</button></div><div className="totals"><div><small>Total earned</small><strong>£3,284.50</strong><em>↑ 12.4% this month</em></div><div><small>Paid</small><strong>£2,116</strong></div><div><small>Still owed</small><strong>£1,168.50</strong></div></div>{[["GoodWood Security","£648.50","Awaiting","warn"],["All Time Security","£920.00","Paid","good"],["Southampton College","£486.00","Part-paid","blue"],["City Protection","£312.00","Overdue","bad"],["Events North","£180.00","Disputed","purple"]].map(x=><div className="payrow" key={x[0]}><span><b>{x[0]}</b><small>September shifts</small></span><strong>{x[1]}</strong><em className={x[3]}>● {x[2]}</em></div>)}</div>
}
function Hero(){return <section className="hero"><div className="wrap herogrid"><div><span className="eyebrow">Your work, finally organised</span><h1>Lose the Notes app. Let Shiftaan track your shifts.</h1><p>Track your shifts, hours and pay in one place. Especially useful when you work across multiple companies and sites.</p><div className="actions"><CTA/><CTA alt/></div><small className="trust">✓ Free to try　 ✓ Built for workers　 ✓ Track every shift</small></div><div className="heroimg"><img src="/assets/Hero-image-compressed.png" alt="Shiftaan dashboard on desktop and mobile"/><div className="float one"><I>£</I><span><b>£648.50</b><small>Still owed</small></span></div><div className="float two"><I>✓</I><span><b>Shift saved</b><small>12 hrs · £180</small></span></div></div></div></section>}
function Problem(){return <section className="section warm"><div className="wrap"><Heading tag="A familiar problem" title="Still tracking shifts in your Notes app?" copy="When you work across companies, sites and hourly rates, keeping track of everything gets messy." center/><div className="problem"><div className="notes"><div className="notehead"><span>‹ Notes</span><b>September shifts</b><span>•••</span></div><div className="notebody"><p><b>GoodWood Security</b><br/>Mon 4 Sep — Chichester Boots<br/>7pm–7am (30 min break?) · £15/hr</p><p>Wed 6 — All Time / Westfield<br/>09:00–17:00 — think £13.50/hr</p><p>Fri 8: Southampton College<br/>8? hours + parking £12</p><p>Did All Time pay August yet?<br/>Check WhatsApp for Sunday time<br/><s>send invoice to GoodWood</s><br/>remember travel receipt!!</p></div><i>One messy note</i></div><strong className="arr">→</strong><div className="ui"><div className="uitop"><b>Your shifts</b><em>+ Add shift</em></div>{[["04","GoodWood Chichester","19:00–07:00","£180"],["06","Chichester Boots","09:00–17:00","£108"],["08","All Time Security","20:00–08:00","£162"]].map(x=><div className="row" key={x[0]}><i>{x[0]}</i><span><b>{x[1]}</b><small>{x[2]} · 30 min break</small></span><strong>{x[3]}</strong></div>)}</div></div></div></section>}
const features=[["◷","Track every shift","Record start, finish, breaks, company, site and rate."],["£","Know what you're owed","See paid, part-paid, overdue or disputed payments."],["▦","Work across companies","Keep companies, sites and rates organised separately."],["↗","See your earnings","Understand daily, weekly and monthly earnings automatically."]];
// Live numbers from the Shiftaan app's Supabase project (app.shiftaan.com), via the public get_landing_stats RPC.
const STATS_URL="https://aqyskmjprcbmftjmggak.supabase.co/rest/v1/rpc/get_landing_stats";
const STATS_KEY="sb_publishable_VSpPXHGJbjZ5VksX63FWIQ_BDU6LgcU";
type LandingStats={launch_date:string;signups:number;shifts:number;pay_tracked:number;signups_week?:number;shifts_today?:number;pay_week?:number};
function Stats(){const [s,setS]=useState<LandingStats|null>(null);useEffect(()=>{fetch(STATS_URL,{method:"POST",headers:{apikey:STATS_KEY,Authorization:`Bearer ${STATS_KEY}`,"Content-Type":"application/json"},body:"{}"}).then(r=>r.ok?r.json():Promise.reject(r.status)).then(setS).catch(()=>{})},[]);const days=s?Math.max(0,Math.floor((Date.now()-new Date(s.launch_date+"T00:00:00Z").getTime())/86400000)):null;const n=(v:number|null|undefined)=>v==null?"—":v.toLocaleString("en-GB");const up=(v:number|undefined,label:string,money=false)=>v?`+${money?"£":""}${n(Math.round(v))} ${label}`:"";const data=[[n(days),"Days since launch",s?"+1 today":""],[n(s?.signups),"People signed up",up(s?.signups_week,"this week")],[n(s?.shifts),"Shifts added",up(s?.shifts_today,"today")],[s?"£"+n(Math.round(s.pay_tracked)):"—","Pay tracked",up(s?.pay_week,"this week",true)]];return <section className="stats"><div className="wrap"><div className="statshead"><div><span className="live"><i/> LIVE FROM THE SHIFTAAN APP</span><h2>Here's what's happening on Shiftaan</h2></div><span className="updated">{s?"Updated just now":"Loading live stats…"}</span></div><div className="statgrid">{data.map((x,i)=><article key={x[1]}><div className="statmeta"><small>{x[1]}</small><i className={`activity activity-${i}`}><span/><span/><span/><span/><span/></i></div><strong id={["shiftaan-days-since","shiftaan-signups","shiftaan-shifts","shiftaan-pay"][i]}>{x[0]}</strong>{x[2]&&<em>{x[2]}</em>}</article>)}</div></div></section>}
function Founder({large=false}:{large?:boolean}){return <section className="founder"><div className="wrap foundergrid"><div className="portrait"><span/><img src="/assets/malikmuzmil-Background-Removed.png" alt="Malik Muzamil, founder of Shiftaan"/></div><div><span className="eyebrow">The founder story</span>{large?<h1>I built Shiftaan because I needed it myself.</h1>:<h2>I built Shiftaan because I needed it myself.</h2>}<p>I was studying and working part-time for different companies. Keeping track of shifts, hours and expenses got harder every week, so I built a Google Sheet.</p><p>Every time something became difficult, I added another column. Then I realised other part-time workers had the same problem. That sheet became Shiftaan.</p><p>The name comes from Punjabi and relates to shifts. The idea is simple: you should always know what work you've done and what you're owed.</p><b className="signature">Malik Muzamil <small>Founder, Shiftaan</small></b></div></div></section>}
function FAQ({page=false}:{page?:boolean}){return <section className={`section ${page?"faqpage":""}`}><div className="wrap faq"><div><span className="eyebrow">Questions, answered</span>{page?<h1>Frequently asked questions</h1>:<h2>A few things you might be wondering.</h2>}<p>Can't find what you need?</p><A href="/support" className="textlink">Get in touch →</A></div><div>{faqs.map((x,i)=><details key={x[0]} open={i===0}><summary>{x[0]} <span>+</span></summary><p>{x[1]}</p></details>)}</div></div></section>}
function Final(){return <section className="final"><div className="wrap"><span className="eyebrow">Ready when you are</span><h2>Stop losing track of your shifts.</h2><p>Keep every shift, every hour and every pound in one place.</p><CTA/><small>Start tracking in minutes.</small></div></section>}

function Home(){
  return <Layout><Hero/><Problem/><section className="section features-compact"><div className="wrap"><Heading tag="Everything together" title="Everything about your shifts. In one place." copy="No complicated workforce software. Just a clear record of the work you've done and the money you've earned."/><div className="featuregrid">{features.map(x=><article key={x[1]}><I>{x[0]}</I><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section><section className="section demo" id="demo"><div className="wrap split"><div><Heading tag="Fast by design" title="Log a shift in under 30 seconds." copy="Start, finish, break, rate. Done."/><div className="speedstat"><strong>30s</strong><span>Average time to log a full shift</span></div><ol className="speedsteps">{["Choose your company","Choose your site","Add your shift time","Add break and rate","Save"].map((x,i)=><li key={x}><i>{i+1}</i><b>{x}</b></li>)}</ol></div><ShiftUI/></div></section><Stats/><Founder/><FAQ/><Final/></Layout>
}
function PageHero({tag,title,copy}:{tag:string;title:string;copy:string}){return <section className="pagehero"><div className="wrap"><span className="eyebrow">{tag}</span><h1>{title}</h1><p>{copy}</p><CTA/></div></section>}
function How(){const steps=[["Create your account","Start free in your mobile or desktop browser."],["Add your companies and sites","Set up each place you work and its usual rate."],["Log your shifts","Add start, finish, break and rate in under 30 seconds."],["Track what you've earned","Shiftaan calculates your hours and expected pay."],["Track what's been paid","Update the status when a payment arrives."],["Understand what you're still owed","See outstanding pay across every company."]];return <Layout><PageHero tag="How it works" title="From first shift to full overview." copy="Six simple steps. No spreadsheet setup, no complicated admin."/><section className="section"><div className="wrap timeline">{steps.map((x,i)=><article key={x[0]}><strong>0{i+1}</strong><div><h2>{x[0]}</h2><p>{x[1]}</p></div>{i===1?<CompanyUI/>:i===2?<ShiftUI/>:i>2?<PayUI/>:<div className="welcome"><img src="/assets/FavIcon.svg" alt=""/><b>Welcome to Shiftaan</b><small>Ready to log your first shift?</small></div>}</article>)}</div></section><Final/></Layout>}
function Pricing(){return <Layout><PageHero tag="Simple pricing" title="Start free. Add more companies when you need them." copy="Track unlimited shifts for up to 3 companies for free, or unlock unlimited companies with one simple plan."/><section className="section pricing"><div className="wrap pricegrid"><article className="plantier"><span className="planlabel">Free</span><div className="planprice"><b>£0</b><small>forever</small></div><p>Everything you need to track work across up to 3 companies.</p><ul><li>✓ Unlimited shifts</li><li>✓ Up to 3 companies</li><li>✓ Full money-owed tracking for those companies</li></ul><CTA/></article><article className="plantier paid"><span className="planlabel">Paid</span><div className="planprice"><b>£2.49</b><small>/month</small></div><div className="or">or <strong>£14.99/year</strong></div><p>For workers who need to track more than 3 companies.</p><ul><li>✓ Unlimited companies</li></ul><CTA/></article></div><div className="unlock"><div><span className="eyebrow">Referral</span><h2>Invite a friend, get another company slot.</h2><p>For every friend who signs up through your referral, you get <b>+1 free company slot.</b></p><div className="unlockfacts"><span>Permanent</span><span>Stackable</span></div></div><aside><span className="eyebrow">One-time extra</span><h3>Follow Shiftaan on social media and get 1 free company slot.</h3><p>This is a one-time company slot.</p><A href="https://x.com/tryshiftaan" className="textlink">Follow @tryshiftaan →</A></aside></div></section><FAQ/><Final/></Layout>}
function BlogCard({p,featured=false}:{p:any;featured?:boolean}){return <article className={`blogcard ${featured?"featured":""}`}><A href={`/blogs/${p.slug}`}>{p.featured_image?<img src={p.featured_image} alt={p.image_alt||""}/>:<div className="blogcardph"/>}</A><div><small>{p.category}　·　{p.published_at?new Date(p.published_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):""}　·　{p.reading_time} read</small><h3>{p.title}</h3><p>{p.excerpt}</p><A className="textlink" href={`/blogs/${p.slug}`}>Read article →</A></div></article>}
function useBlogPosts(){
  const [posts,setPosts]=useState<any[]|null>(null);
  const [error,setError]=useState("");
  useEffect(()=>{supabase.from("blog_posts").select("*").eq("status","published").order("published_at",{ascending:false}).then(({data,error})=>{if(error){setError(error.message);return}setPosts(data||[])})},[]);
  return {posts,error};
}
function Blogs(){
  const {posts,error}=useBlogPosts();
  return <Layout><section className="pagehero bloghero"><div className="wrap"><span className="eyebrow">Resources</span><h1>Shiftaan Blog</h1><p>Practical advice for security guards and part-time workers.</p></div></section><section className="section"><div className="wrap">
    {error?<p>Couldn't load posts right now.</p>:!posts?<p>Loading articles…</p>:posts.length===0?<p>No articles published yet — check back soon.</p>:<>
      <h2 className="smalltitle">Featured article</h2><BlogCard p={posts[0]} featured/>
      {posts.length>1&&<><h2 className="latest">Latest articles</h2><div className="bloggrid">{posts.slice(1).map(p=><BlogCard p={p} key={p.slug}/>)}</div></>}
    </>}
  </div></section><Final/></Layout>;
}
function Blog({slug}:{slug:string}){
  const [state,setState]=useState<{post:any}|{notFound:true}|null>(null);
  const [related,setRelated]=useState<any[]>([]);
  useEffect(()=>{
    let cancelled=false;
    supabase.from("blog_posts").select("*").eq("slug",slug).eq("status","published").maybeSingle().then(({data})=>{
      if(cancelled)return;
      if(!data){setState({notFound:true});document.title=notFoundMeta.title;setMeta("description",notFoundMeta.description);setMeta("robots","noindex");return}
      setState({post:data});
      const title=blogTitle(data.seo_title||data.title);
      const description=data.meta_description||data.excerpt;
      document.title=title;
      setMeta("description",description);
      setMeta("og:title",data.og_title||title,"property");
      setMeta("og:description",data.og_description||description,"property");
      setMeta("og:image",absImage(data.featured_image)||`${siteUrl}/assets/social-share.png`,"property");
      const canonicalUrl=data.canonical_url||`${siteUrl}/blogs/${slug}`;
      setCanonical(canonicalUrl);
      setMeta("og:url",canonicalUrl,"property");
      supabase.from("blog_posts").select("*").eq("status","published").neq("slug",slug).limit(3).then(({data:r})=>{if(!cancelled)setRelated(r||[])});
    });
    return ()=>{cancelled=true};
  },[slug]);
  if(!state) return <Layout><section className="section"><div className="wrap"><p>Loading article…</p></div></section></Layout>;
  if("notFound" in state) return <NotFound/>;
  return <Layout><BlogPostBody p={state.post}/><section className="section soft"><div className="wrap"><Heading title="Related articles"/><div className="bloggrid">{related.map(x=><BlogCard p={x} key={x.slug}/>)}</div></div></section><Final/></Layout>;
}
function About(){return <Layout><Founder large/><section className="section"><div className="wrap about"><Heading tag="Why Shiftaan exists" title="Your own clear record of your work."/><div><p>Employers have systems for schedules and payroll. Workers still use Notes, WhatsApp and memory to understand their own hours.</p><p>Shiftaan fixes that gap with a personal tool that stays simple, even when you work across several companies and sites.</p></div></div></section><Final/></Layout>}
const CONTACT_FN_URL="https://qazegonoysisqrpyeucf.supabase.co/functions/v1/contact-submit";
const CONTACT_ANON_KEY="sb_publishable_s2rK08Vjocuq5OeMWgCf7w_23gop4y0";
function Support(){
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [err,setErr]=useState("");
  const startedAt=useState(()=>Date.now())[0];
  async function submit(e:FormEvent){
    e.preventDefault();
    setErr("");
    const f=e.target as HTMLFormElement;
    const data={
      name:(f.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email:(f.elements.namedItem("email") as HTMLInputElement).value.trim(),
      subject:(f.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message:(f.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      company:(f.elements.namedItem("company") as HTMLInputElement).value, // honeypot
      started_at:startedAt,
    };
    setSending(true);
    try{
      const res=await fetch(CONTACT_FN_URL,{method:"POST",headers:{apikey:CONTACT_ANON_KEY,Authorization:`Bearer ${CONTACT_ANON_KEY}`,"Content-Type":"application/json"},body:JSON.stringify(data)});
      const body=await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(body.error||"Something went wrong. Please try again.");
      setSent(true);
    }catch(e:any){
      setErr(e.message||"Something went wrong. Please try again.");
    }finally{
      setSending(false);
    }
  }
  return <Layout><section className="support"><div className="wrap"><h1>How can we help?</h1><p>Find a quick answer below, or send us a message and we'll get back to you within 1–2 working days.</p></div></section><section className="section"><div className="wrap supportgrid">{[["Account help","Getting started, signing in and managing your details."],["Shift tracking help","Adding, editing and organising shift records."],["Payments & pay tracking","Understanding statuses and recording payments."],["Technical issues","Help when something is not working."]].map(x=><A href="/faq" key={x[0]}><I>?</I><h3>{x[0]}</h3><p>{x[1]}</p><b>View common questions →</b></A>)}</div></section><section className="section soft"><div className="wrap contact"><div><h2>Still need help? Tell us what's happening</h2><p>We aim to reply within 1–2 working days. For account issues, use the email connected to your account.</p></div><form onSubmit={submit}>{sent?<div><I>✓</I><h3>Message sent</h3><p>Thanks — we've got your message and will reply within 1–2 working days.</p></div>:<><label>Name<input name="name" required autoComplete="name"/></label><label>Email<input name="email" required type="email" autoComplete="email"/></label><label>Subject<input name="subject" required/></label><label>Message<textarea name="message" required rows={6}/></label><label className="hp" aria-hidden="true" tabIndex={-1}>Company<input name="company" tabIndex={-1} autoComplete="off"/></label>{err&&<p className="formerror">{err}</p>}<button className="btn" disabled={sending}>{sending?"Sending…":"Send message →"}</button></>}</form></div></section></Layout>
}
const legalNote="This page describes Shiftaan's actual functionality as of the date below. It's prepared as accurately as possible but isn't a substitute for independent legal advice — have it reviewed by a solicitor before relying on it for formal compliance.";
const privacyContent:[string,string|string[]][]=[
  ["Overview","Shiftaan is a personal shift, hours and pay tracker built for security guards and other part-time or shift workers. This policy explains what information Shiftaan collects through the website (shiftaan.com) and the app (app.shiftaan.com), and how that information is used."],
  ["Information we collect",[
    "Account information — the email address and password you use to sign in, managed through Shiftaan's authentication provider.",
    "Shift information — the dates, start times, finish times, breaks and rates you record for each shift.",
    "Company and site information — the names of the companies and sites you add, and the rate you set for each.",
    "Work and pay information — the pay amounts and statuses (paid, awaiting, part-paid, overdue, disputed) you record against your shifts.",
    "Expense information — if you choose to record work-related expenses, the details and amounts you enter.",
    "Payment information — if you upgrade to a paid plan, your subscription and card details are collected and processed directly by Stripe, our payment processor. Shiftaan does not store your full card details.",
    "Device and browser information — standard technical information (such as browser type and device type) collected automatically as part of running the service securely.",
  ]],
  ["What Shiftaan doesn't collect","Shiftaan does not currently collect or store SIA licence numbers or SIA licence details."],
  ["How we use your information","We use your information to create and secure your account, to calculate your hours, pay and earnings summaries from the shifts you log, to process subscription payments for the paid plan, to respond to support requests, and to keep the service reliable and secure."],
  ["How we store your information","Shiftaan's data is stored using Supabase, our backend and database provider, which applies industry-standard security practices. Your information is kept only for as long as your account is active or as needed to provide the service."],
  ["Data security","We take reasonable technical and organisational steps to protect your information, but no online service can be guaranteed 100% secure. We recommend using a strong, unique password for your Shiftaan account."],
  ["Third-party services","Shiftaan currently uses Supabase for authentication and data storage, and Stripe for processing payments on the paid plan. These providers only receive the information needed to perform their function. The shiftaan.com marketing website uses Google Analytics, but only if you accept it from the cookie banner — see our Cookie Policy for details. We don't use any advertising services."],
  ["Data sharing","We do not sell your personal information. We share information only with the service providers listed above, where necessary to run Shiftaan, or where we're required to by law."],
  ["Cookies","The shiftaan.com marketing website does not use cookies. See our Cookie Policy for details on the essential technology the app uses to keep you signed in."],
  ["Your rights","Depending on where you live, you may have rights to access, correct, export or delete your personal information, and to object to or restrict how it's used. To exercise any of these rights, contact us using the details below."],
  ["Data retention","We keep your information for as long as your account is active. If you delete your account, your data is removed except where we need to keep limited records for legal, security or fraud-prevention reasons."],
  ["Account deletion","You can delete your account and its associated data at any time directly within the Shiftaan app."],
  ["Contact","For any privacy question or request, use the contact form on our Support page, or the email address connected to your account."],
  ["Changes to this policy","If we make material changes to this policy, we'll update the date below and let you know through an appropriate Shiftaan channel."],
];
const termsContent:[string,string|string[]][]=[
  ["Using Shiftaan","Shiftaan is a personal tool for recording your own shifts, hours, pay and (optionally) expenses. It is not an employer scheduling, payroll or HR system, and using it doesn't create any employment relationship between you and Shiftaan."],
  ["Creating an account","You need an account to use Shiftaan. You agree to provide accurate information when signing up, to keep your login details secure, and not to share your account with anyone else."],
  ["Accuracy of information you enter","Shiftaan calculates hours, pay and earnings summaries entirely from the shift, rate and payment information you enter. We don't verify this against your employer's own records, so you're responsible for keeping your entries accurate and up to date."],
  ["Shift and pay tracking","Your shift and pay records in Shiftaan are your own personal record of work. They can be a useful reference if a pay dispute comes up, but they aren't a substitute for your employer's official payroll records."],
  ["Personal use","Shiftaan is intended for your own personal use tracking your own work. You shouldn't use it to store or manage other people's employment records."],
  ["Free plan","The free plan lets you track unlimited shifts for up to 3 companies, including full pay-tracking for those companies, at no cost."],
  ["Paid plan","The paid plan (currently £2.49/month or £14.99/year) unlocks unlimited companies. Payments are processed securely by Stripe; Shiftaan does not store your full card details."],
  ["Subscriptions","Paid subscriptions renew automatically until cancelled. You can cancel at any time; your paid access continues until the end of the period you've already paid for."],
  ["Referral benefits","For every friend who signs up through your referral, you get one additional company slot, permanently and stackably. Following @tryshiftaan on social media currently unlocks one additional, one-time company slot."],
  ["Account suspension and termination","We may suspend or terminate an account that we reasonably believe is being used fraudulently, abusively, or in breach of these terms. You can close your own account at any time."],
  ["Intellectual property","The Shiftaan name, logo and website content belong to Shiftaan. You may not copy, reuse or represent them as your own without permission."],
  ["Availability of the service","Shiftaan is currently in early access and provided on an \"as available\" basis. Features, pricing and functionality may change as the product develops, and the service may occasionally be unavailable for maintenance or updates."],
  ["Limitation of liability","Shiftaan is a personal record-keeping tool. We aren't liable for decisions you make, or disputes with an employer, based on the records you keep in Shiftaan — for formal pay or employment disputes, you should seek independent advice."],
  ["Changes to the service","We may add, change or remove features as Shiftaan develops."],
  ["Changes to these terms","If we make material changes to these terms, we'll update the date below and let you know through an appropriate Shiftaan channel."],
  ["Governing law","These terms are governed by the laws of England and Wales."],
  ["Contact","Questions about these terms can be sent through the contact form on our Support page."],
];
const cookiesContent:[string,string|string[]][]=[
  ["What cookies are","Cookies (and similar technologies like local storage) are small pieces of data a website or app can store in your browser, typically to remember who you are or how you've used the site."],
  ["What the Shiftaan website uses","The shiftaan.com marketing website sets no cookies by default. If you accept analytics from the cookie banner, Google Analytics sets cookies (see below) to understand how visitors use the site. We never use advertising cookies."],
  ["What the Shiftaan app uses","To keep you signed in, the Shiftaan app (app.shiftaan.com) relies on essential authentication storage provided by Supabase, our authentication provider, held in your browser as local storage or a cookie depending on your device. This is strictly necessary for the app to work — without it, you'd be signed out every time you opened it."],
  ["Analytics and measurement","With your consent, given through the cookie banner, we use Google Analytics to understand how visitors use the marketing website — which pages are visited, roughly how, and from where. Google Analytics sets its own cookies (typically named _ga and _ga_*) to do this, and IP addresses are anonymised before being stored. It only runs if you click \"Accept\" on the cookie banner; choosing \"Necessary only\" means it never loads. You can opt out of Google Analytics across all websites using Google's browser add-on at tools.google.com/dlpage/gaoptout."],
  ["Third-party cookies","Google Analytics is the only third-party cookie the shiftaan.com marketing website can set, and only after you accept it."],
  ["Managing cookies","Use the buttons below to change your choice at any time — this clears your saved preference and the banner reappears immediately."],
  ["Contact","Questions about this policy can be sent through the contact form on our Support page."],
];
function CookieChoiceControl(){
  const [choice,setChoice]=useState<string|null>(null);
  useEffect(()=>{setChoice(getCookieConsent())},[]);
  function reset(){try{localStorage.removeItem(COOKIE_CONSENT_KEY)}catch{}location.reload()}
  return <div className="cookiechoice"><p>Your current choice: <b>{choice==="accepted"?"Analytics accepted":choice==="declined"?"Necessary only":"Not yet chosen"}</b></p><button className="btn secondary" onClick={reset}>Change my cookie choice</button></div>;
}
function Legal({type}:{type:string}){
  const titles:any={privacy:"Privacy Policy",terms:"Terms & Conditions",cookies:"Cookie Policy"};
  const content:any={privacy:privacyContent,terms:termsContent,cookies:cookiesContent};
  const data:[string,string|string[]][]=content[type];
  return <Layout><section className="legal"><div className="wrap"><aside><b>Legal</b><A href="/privacy">Privacy Policy</A><A href="/terms">Terms & Conditions</A><A href="/cookies">Cookie Policy</A></aside><article><span className="eyebrow">Last updated: 27 September 2026</span><h1>{titles[type]}</h1><p className="lead">{legalNote}</p>{type==="cookies"&&<CookieChoiceControl/>}{data.map(([h,c])=><section key={h}><h2>{h}</h2>{Array.isArray(c)?<ul>{c.map(li=><li key={li}>{li}</li>)}</ul>:<p>{c}</p>}</section>)}</article></div></section></Layout>;
}
function NotFound(){return <Layout><section className="lost"><div><strong>404</strong><h1>Looks like this shift got lost.</h1><p>The page you're looking for doesn't exist.</p><div className="actions"><A className="btn secondary" href="/">Back home</A><CTA/></div></div></section></Layout>}
function Router(){const p=location.pathname.replace(/\/+$/,"")||"/";if(p==="/")return <Home/>;if(p==="/how-it-works")return <How/>;if(p==="/pricing")return <Pricing/>;if(p==="/blogs")return <Blogs/>;if(p.startsWith("/blogs/"))return <Blog slug={p.split("/").pop()||""}/>;if(p==="/about")return <About/>;if(p==="/support"||p==="/contact")return <Support/>;if(p==="/faq")return <Layout><FAQ page/><Final/></Layout>;if(["/privacy","/terms","/cookies"].includes(p))return <Legal type={p.slice(1)}/>;if(p==="/admin"||p.startsWith("/admin/"))return <AdminGate/>;return <NotFound/>}
function setMeta(name:string,content:string,attr:"name"|"property"="name"){
  let el=document.querySelector(`meta[${attr}="${name}"]`);
  if(!el){el=document.createElement("meta");el.setAttribute(attr,name);document.head.appendChild(el)}
  el.setAttribute("content",content);
}
function setCanonical(href:string){
  let el=document.querySelector('link[rel="canonical"]');
  if(!el){el=document.createElement("link");el.setAttribute("rel","canonical");document.head.appendChild(el)}
  el.setAttribute("href",href);
}
export default function App(){
  useEffect(()=>{
    const p=location.pathname.replace(/\/+$/,"")||"/";
    const known=["/","/how-it-works","/pricing","/blogs","/about","/support","/contact","/faq","/privacy","/terms","/cookies"];
    const isBlog=p.startsWith("/blogs/");
    const isAdmin=p==="/admin"||p.startsWith("/admin/");
    scrollTo(0,0);
    if(isAdmin){
      document.title="Shiftaan Admin";
      setMeta("robots","noindex, nofollow");
      return;
    }
    if(isBlog){
      // Blog() sets its own title/description once the post loads from Supabase —
      // there's no static post list here anymore to read metadata from up front.
      document.title="Loading… | Shiftaan Blog";
      return;
    }
    const meta:any=known.includes(p)?(pageMeta as any)[p]:notFoundMeta;
    document.title=meta.title;
    setMeta("description",meta.description);
    setMeta("og:title",meta.title,"property");
    setMeta("og:description",meta.description,"property");
    setMeta("og:image",`${siteUrl}/assets/social-share.png`,"property");
    const canonicalPath=meta.canonical||p;
    const canonicalUrl=`${siteUrl}${canonicalPath==="/"?"/":canonicalPath}`;
    setCanonical(canonicalUrl);
    setMeta("og:url",canonicalUrl,"property");
  },[]);
  return <Router/>;
}
