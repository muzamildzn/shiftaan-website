// Single source of truth for blog posts, FAQs and per-route SEO metadata.
// Plain JS (no JSX/browser APIs) so it can be imported both by src/App.tsx
// (via Vite) and by scripts/prerender.mjs (plain Node, run after build).

export const siteUrl = "https://shiftaan.com";

// Blog post <title>. seo_title from the CMS may already end in "| Shiftaan Blog",
// so strip it before appending to avoid "… | Shiftaan Blog | Shiftaan Blog".
export const blogTitle = (t) => `${String(t).replace(/(\s*\|\s*Shiftaan Blog)+\s*$/i, "")} | Shiftaan Blog`;

// Make a CMS image value ("x.jpg", "/assets/x.jpg" or a full URL) an absolute URL for og:image / JSON-LD.
export const absImage = (img) => !img ? "" : /^https?:\/\//.test(img) ? img : img.startsWith("/") ? siteUrl + img : `${siteUrl}/assets/${img}`;

// [slug, title, excerpt, image, category, readTime, isoDate]
export const posts = [
  ["how-to-track-your-work-hours-when-you-have-multiple-jobs","How to Track Your Work Hours When You Have Multiple Jobs","Why the Notes app isn't enough—and a simpler way to track hours, rates and unpaid shifts.","Track-Hours-Across-Multiple-Jobs.jpg","Shift tracking","6 min","2026-09-24"],
  ["if-i-work-6-hours-what-break-do-i-get-in-the-uk","If I Work 6 Hours, What Break Do I Get in the UK?","UK break rules explained clearly, including what counts and when breaks are paid.","Working-6-Hours_-Your-Break-UK.jpg","Work advice","5 min","2026-09-24"],
  ["national-minimum-wage-2026-what-security-guards-should-be-paid","National Minimum Wage 2026: What Security Guards Should Be Paid","The latest UK rates and what to do if you think you've been underpaid.","Minimum-Wage-2026-UK.jpg","Pay","7 min","2026-09-24"],
  ["security-guard-salary-uk-2026-what-you-can-really-earn","Security Guard Salary UK 2026: What You Can Really Earn","Average hourly pay, London rates and practical ways to understand your earnings.","Security-Guard-Pay-2026.jpg","Pay","8 min","2026-09-24"],
  ["how-to-get-an-sia-licence-in-2026-steps-costs-and-timeline","How to Get an SIA Licence in 2026","The steps, costs, first aid requirements and realistic timeline.","Get-Your-SIA-Licence.jpg","SIA licence","9 min","2026-09-24"],
  ["sia-security-guard-pay-rights-what-to-do-if-youre-not-paid-on-time","What to Do If You're Not Paid on Time","Know your rights and protect yourself with a clear record of every shift.","Not-Paid-On-Time.jpg","Pay rights","7 min","2026-09-24"],
  ["best-way-to-track-shifts-when-you-work-for-multiple-security-companies","Best Way to Track Shifts Across Security Companies","Keep hours, rates and pay organised across every company and site.","Track-Every-Shift.jpg","Shift tracking","6 min","2026-09-24"],
  ["unpaid-shifts-as-a-security-guard-how-to-track-what-youre-owed-uk-guide","Unpaid Shifts? How to Track What You're Owed","A practical UK guide to recording hours and proving outstanding pay.","Unpaid-Shifts_-Track-Them.jpg","Pay rights","8 min","2026-09-24"],
];

export const faqs=[["What is Shiftaan?","A personal shift and pay tracker that keeps your hours, rates, companies, sites and payments in one place."],["Who is Shiftaan for?","Security guards and other part-time or shift workers, especially people working across companies and sites."],["Is Shiftaan free?","Shiftaan is currently free to try during early access. Any future change will be shared clearly in advance."],["Can I track shifts for multiple companies?","Yes. Add each company separately and see its shifts, sites, rates and payments."],["Can I track different hourly rates?","Yes. Keep different rates for different companies and sites."],["Can I track different sites?","Yes. Add every site and connect each shift to the right place."],["Can I track whether I've been paid?","Yes. Mark payments as paid, awaiting, part-paid, overdue or disputed."],["Does Shiftaan schedule shifts?","No. Shiftaan is your own record of work and pay, not an employer scheduling system."],["Is Shiftaan available on mobile?","Yes. It works in your mobile browser. A dedicated app is on the roadmap."],["How do I get started?","Create a free account, add a company and site, then log your first shift."]];

// Per-route SEO metadata. `canonical` overrides the default (siteUrl + path)
// — used to point /contact at /support so they aren't indexed as duplicates.
export const pageMeta = {
  "/": {
    title: "Shiftaan | Shift Tracker App for Security Guards & Shift Workers",
    description: "Track your shifts, hours and pay in one place with Shiftaan — the shift tracking app built for security guards and workers with multiple employers.",
  },
  "/how-it-works": {
    title: "How Shiftaan Works | Track Shifts, Hours & Pay",
    description: "See how Shiftaan's shift tracker works: log a shift in under 30 seconds, then track your hours worked and what you're owed across every company.",
  },
  "/pricing": {
    title: "Pricing | Shiftaan Shift Tracker App",
    description: "Track shifts for one company free, or unlock unlimited companies for £2.49/month. Simple pricing for Shiftaan's security guard shift tracker.",
  },
  "/about": {
    title: "About Shiftaan | Built for Security Guards & Shift Workers",
    description: "Shiftaan was built to solve a real problem: tracking hours, pay and multiple employers as a part-time security guard. Read the story behind the app.",
  },
  "/blogs": {
    title: "Shiftaan Blog | Shift Work, Pay & SIA Licence Advice",
    description: "Practical guides on tracking shifts and pay, UK minimum wage, break rules, SIA licences and working for multiple security companies.",
  },
  "/support": {
    title: "Support & Contact | Shiftaan",
    description: "Get help with your Shiftaan account, shift tracking or pay tracking, or send us a message — we reply within 1–2 working days.",
  },
  "/contact": {
    title: "Support & Contact | Shiftaan",
    description: "Get help with your Shiftaan account, shift tracking or pay tracking, or send us a message — we reply within 1–2 working days.",
    canonical: "/support",
  },
  "/faq": {
    title: "FAQs | Shiftaan Shift Tracker App",
    description: "Answers to common questions about tracking shifts, hourly rates, multiple companies and pay status with the Shiftaan app.",
  },
  "/privacy": {
    title: "Privacy Policy | Shiftaan",
    description: "How Shiftaan collects, stores and protects your account, shift and pay information.",
  },
  "/terms": {
    title: "Terms & Conditions | Shiftaan",
    description: "The terms that apply when you use the Shiftaan shift and pay tracking app.",
  },
  "/cookies": {
    title: "Cookie Policy | Shiftaan",
    description: "What cookies and essential technology Shiftaan's website and app use, and why.",
  },
};

export const notFoundMeta = {
  title: "Page Not Found | Shiftaan",
  description: "The page you're looking for doesn't exist. Head back to Shiftaan to track your shifts, hours and pay.",
};

export function blogMeta(p){
  return {
    title: `${p[1]} | Shiftaan Blog`,
    description: p[2],
  };
}
