import React, { createContext, useContext, useEffect, useState } from "react";

export type Category = "تنمية بشرية" | "لغات" | "كمبيوتر" | "إدارة" | "سوفت سكيلز" | "ميديا";
export type Branch = "فرع المهندسين" | "فرع مصر الجديدة" | "فرع المعادي" | "فرع الإسكندرية" | "أونلاين";
export type Team = "HR" | "PR" | "تنظيم" | "ميديا" | "BR";

export interface Course {
  id: string;
  title: string;
  category: Category;
  hours: number;
  hasCertificate: boolean;
  branch: Branch;
  description: string;
  instructor: string;
  date: string;
  seats: number;
  image: string;
  price: string;
}

export interface Registration { id:string; courseId:string; courseTitle:string; name:string; email:string; phone:string; date:string; status:string; userId:string }
export interface VolunteerRequest { id:string; name:string; phone:string; email:string; team:Team; answers:Record<string,string>; status:"قيد الانتظار"|"مقبول"|"مرفوض"|"مقابلة"; date:string; reply?:string }
export interface Evaluation { id:string; volunteerName:string; team:Team; scores:Record<string,number>; comment:string; date:string; evaluator:string }
export interface Meeting { id:string; title:string; date:string; time:string; leader:string; topics:string; minutes:string; attendees:string[]; decisions:string }
export interface Activity { id:string; title:string; date:string; time:string; location:string; description:string; image:string; registrations:{name:string; phone:string; age:string}[] }
export interface Suggestion { id:string; user:string; phone:string; type:"شكوى"|"اقتراح"; text:string; reason:string; image?:string; date:string; reply?:string; status:"جديد"|"تم الرد"|"قيد المراجعة" }
export interface AppNotification { id:string; title:string; body:string; date:string; read:boolean; for:"admin"|"user" }
export interface AdminUser { id:string; email:string; password:string; name:string; permissions:string[]; isHead?:boolean }
export interface BlockRecord { userId:string; reason:string; until:string; active:boolean }

const defaultCourses: Course[] = [
  { id:"1", title:"مهارات التواصل الفعّال", category:"سوفت سكيلز", hours:12, hasCertificate:true, branch:"فرع المهندسين", description:"كورس عملي لتعلم فن الإلقاء والتواصل والثقة بالنفس مع تدريبات عملية وشهادة معتمدة من RTC.", instructor:"أ.سارة أحمد", date:"10 أكتوبر 2024", seats:30, image:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600", price:"مجاناً" },
  { id:"2", title:"أساسيات الفوتوشوب للمبتدئين", category:"ميديا", hours:20, hasCertificate:true, branch:"أونلاين", description:"تعلم التصميم من الصفر حتى الاحتراف، أدوات الفوتوشوب وتطبيقات عملية.", instructor:"م.عمر خالد", date:"15 أكتوبر 2024", seats:50, image:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600", price:"مجاناً" },
  { id:"3", title:"اللغة الإنجليزية - المستوى الأول", category:"لغات", hours:30, hasCertificate:true, branch:"فرع مصر الجديدة", description:"تأسيس قوي في اللغة الإنجليزية محادثة وقواعد مع مدربين متخصصين.", instructor:"Ms. Nour", date:"18 أكتوبر 2024", seats:25, image:"https://images.unsplash.com/photo-1434030216411-0b793fbd8d77?w=600", price:"مجاناً" },
  { id:"4", title:"إدارة الموارد البشرية HR", category:"إدارة", hours:16, hasCertificate:true, branch:"فرع المعادي", description:"مدخل احترافي لعالم الـ HR والتوظيف وتقييم الأداء.", instructor:"أ.محمد سمير", date:"22 أكتوبر 2024", seats:40, image:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=600", price:"مجاناً" },
  { id:"5", title:"البرمجة بلغة بايثون", category:"كمبيوتر", hours:24, hasCertificate:true, branch:"أونلاين", description:"من الصفر إلى بناء مشاريع حقيقية بلغة بايثون.", instructor:"م.ليلى", date:"25 أكتوبر 2024", seats:35, image:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600", price:"مجاناً" },
  { id:"6", title:"الثقة بالنفس وقيادة الذات", category:"تنمية بشرية", hours:8, hasCertificate:false, branch:"فرع الإسكندرية", description:"ورشة تفاعلية لتعزيز الثقة وكسر الخوف من الجمهور.", instructor:"د.هاني", date:"28 أكتوبر 2024", seats:60, image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600", price:"مجاناً" },
];

const defaultActivities: Activity[] = [
  { id:"a1", title:"إطعام - مائدة الرحمن", date:"5 نوفمبر 2024", time:"4:00 مساءً", location:"فرع المهندسين - مطبخ رسالة", description:"تجهيز وتوزيع 300 وجبة للأسر المستحقة. شارك بوقتك وابتسامتك!", image:"https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600", registrations:[] },
  { id:"a2", title:"زيارة دار مسنين", date:"12 نوفمبر 2024", time:"10:00 صباحاً", location:"دار السعادة - المعادي", description:"يوم ترفيهي مع المسنين، ألعاب وهدايا وذكريات لا تنسى.", image:"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600", registrations:[] },
  { id:"a3", title:"حملة تبرع بالدم", date:"20 نوفمبر 2024", time:"9:00 صباحاً", location:"جامعة القاهرة", description:"نقطة دم تساوي حياة. كن سبباً في إنقاذ روح.", image:"https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600", registrations:[] },
];

interface RTCState {
  courses: Course[];
  registrations: Registration[];
  volunteerRequests: VolunteerRequest[];
  evaluations: Evaluation[];
  meetings: Meeting[];
  activities: Activity[];
  suggestions: Suggestion[];
  notifications: AppNotification[];
  admins: AdminUser[];
  blocks: BlockRecord[];
  volunteerQuestions: string[];
  currentUser: {name:string; email:string; interests:Category[] } | null;
  adminSession: AdminUser | null;
  addRegistration:(r:Registration)=>void;
  addVolunteerRequest:(v:VolunteerRequest)=>void;
  updateVolunteerStatus:(id:string,status:VolunteerRequest["status"],reply?:string)=>void;
  addEvaluation:(e:Evaluation)=>void;
  addMeeting:(m:Meeting)=>void;
  addActivity:(a:Activity)=>void;
  registerActivity:(id:string,data:{name:string;phone:string;age:string})=>void;
  addSuggestion:(s:Suggestion)=>void;
  replySuggestion:(id:string,reply:string)=>void;
  addNotification:(n:AppNotification)=>void;
  markRead:(id:string)=>void;
  addAdmin:(a:AdminUser)=>void;
  removeAdmin:(id:string)=>void;
  setCurrentUser:(u:RTCState["currentUser"])=>void;
  setVolunteerQuestions:(q:string[])=>void;
  toggleBlock:(b:BlockRecord)=>void;
  addCourse:(c:Course)=>void;
  exportCSV:(type:string)=>void;
  loginAdmin:(email:string,password:string)=> AdminUser | null;
  logoutAdmin:()=>void;
  hasPermission:(perm:string)=>boolean;
}

const RTCContext = createContext<RTCState|null>(null);

export const RTCProvider:React.FC<{children:React.ReactNode}> = ({children})=>{
  const [courses,setCourses]=useState<Course[]>(()=>{
    const s=localStorage.getItem("rtc_courses"); return s?JSON.parse(s):defaultCourses;
  });
  const [registrations,setRegistrations]=useState<Registration[]>(()=>JSON.parse(localStorage.getItem("rtc_regs")||"[]"));
  const [volunteerRequests,setVolunteerRequests]=useState<VolunteerRequest[]>(()=>JSON.parse(localStorage.getItem("rtc_volReq")||"[]"));
  const [evaluations,setEvaluations]=useState<Evaluation[]>(()=>JSON.parse(localStorage.getItem("rtc_evals")||"[]"));
  const [meetings,setMeetings]=useState<Meeting[]>(()=>JSON.parse(localStorage.getItem("rtc_meetings")||"[]"));
  const [activities,setActivities]=useState<Activity[]>(()=>{
    const s=localStorage.getItem("rtc_acts"); return s?JSON.parse(s):defaultActivities;
  });
  const [suggestions,setSuggestions]=useState<Suggestion[]>(()=>JSON.parse(localStorage.getItem("rtc_sugs")||"[]"));
  const [notifications,setNotifications]=useState<AppNotification[]>(()=>JSON.parse(localStorage.getItem("rtc_notifs")||"[]"));
  const [admins,setAdmins]=useState<AdminUser[]>(()=>{
    const s=localStorage.getItem("rtc_admins");
    return s?JSON.parse(s):[{id:"head1", email:"head@rtc.com", password:"123456", name:"هيد الفرع - أحمد رسالة", permissions:["كل الصلاحيات"], isHead:true},{id:"a2", email:"hr@rtc.com", password:"123", name:"مسؤول HR", permissions:["المتطوعون","التقييم"]}];
  });
  const [blocks,setBlocks]=useState<BlockRecord[]>(()=>JSON.parse(localStorage.getItem("rtc_blocks")||"[]"));
  const [volunteerQuestions,setVolunteerQuestions]=useState<string[]>(()=>{
    const s=localStorage.getItem("rtc_volQ");
    return s?JSON.parse(s):["ليه عايز تتطوع في رسالة؟","إيه المهارات اللي تقدر تضيفها للفريق؟","وقت فراغك قد إيه في الأسبوع؟","اشتغلت تطوع قبل كده؟ احكي لنا"];
  });
  const [currentUser,setCurrentUser]=useState<RTCState["currentUser"]>(()=>{
    const s=localStorage.getItem("rtc_user"); return s?JSON.parse(s):null;
  });
  const [adminSession,setAdminSession]=useState<AdminUser | null>(()=>{
    const s=localStorage.getItem("rtc_admin_session"); return s?JSON.parse(s):null;
  });

  useEffect(()=>localStorage.setItem("rtc_courses",JSON.stringify(courses)),[courses]);
  useEffect(()=>localStorage.setItem("rtc_regs",JSON.stringify(registrations)),[registrations]);
  useEffect(()=>localStorage.setItem("rtc_volReq",JSON.stringify(volunteerRequests)),[volunteerRequests]);
  useEffect(()=>localStorage.setItem("rtc_evals",JSON.stringify(evaluations)),[evaluations]);
  useEffect(()=>localStorage.setItem("rtc_meetings",JSON.stringify(meetings)),[meetings]);
  useEffect(()=>localStorage.setItem("rtc_acts",JSON.stringify(activities)),[activities]);
  useEffect(()=>localStorage.setItem("rtc_sugs",JSON.stringify(suggestions)),[suggestions]);
  useEffect(()=>localStorage.setItem("rtc_notifs",JSON.stringify(notifications)),[notifications]);
  useEffect(()=>localStorage.setItem("rtc_admins",JSON.stringify(admins)),[admins]);
  useEffect(()=>localStorage.setItem("rtc_blocks",JSON.stringify(blocks)),[blocks]);
  useEffect(()=>localStorage.setItem("rtc_volQ",JSON.stringify(volunteerQuestions)),[volunteerQuestions]);
  useEffect(()=>{ if(currentUser) localStorage.setItem("rtc_user",JSON.stringify(currentUser)); else localStorage.removeItem("rtc_user");},[currentUser]);
  useEffect(()=>{ if(adminSession) localStorage.setItem("rtc_admin_session",JSON.stringify(adminSession)); else localStorage.removeItem("rtc_admin_session");},[adminSession]);

  const addRegistration=(r:Registration)=>{
    setRegistrations(p=>[r,...p]);
    setNotifications(n=>[{id:Date.now().toString(), title:"تسجيل جديد في كورس", body:`${r.name} سجل في ${r.courseTitle}`, date:new Date().toLocaleString("ar-EG"), read:false, for:"admin"},...n]);
    setNotifications(n=>[{id:(Date.now()+1).toString(), title:"تم تأكيد تسجيلك!", body:`تم تسجيلك في ${r.courseTitle} بنجاح`, date:new Date().toLocaleString("ar-EG"), read:false, for:"user"},...n]);
  };
  const addVolunteerRequest=(v:VolunteerRequest)=>{ setVolunteerRequests(p=>[v,...p]); setNotifications(n=>[{id:Date.now().toString(), title:"طلب تطوع جديد", body:`${v.name} قدم طلب تطوع - فريق ${v.team}`, date:new Date().toLocaleString("ar-EG"), read:false, for:"admin"},...n]);};
  const updateVolunteerStatus=(id:string,status:VolunteerRequest["status"],reply?:string)=>{ setVolunteerRequests(p=>p.map(x=>x.id===id?{...x,status,reply:reply||x.reply}:x)); setNotifications(n=>[{id:Date.now().toString(), title:"تحديث طلب التطوع", body:`تم تحديث حالة طلبك إلى: ${status}`, date:new Date().toLocaleString("ar-EG"), read:false, for:"user"},...n]);};
  const addEvaluation=(e:Evaluation)=>setEvaluations(p=>[e,...p]);
  const addMeeting=(m:Meeting)=>setMeetings(p=>[m,...p]);
  const addActivity=(a:Activity)=>setActivities(p=>[a,...p]);
  const registerActivity=(id:string,data:{name:string;phone:string;age:string})=>{ setActivities(p=>p.map(a=>a.id===id?{...a, registrations:[...a.registrations,data]}:a)); setNotifications(n=>[{id:Date.now().toString(), title:"تسجيل في فعالية", body:`تسجيل جديد في ${activities.find(x=>x.id===id)?.title}`, date:new Date().toLocaleString("ar-EG"), read:false, for:"admin"},...n]);};
  const addSuggestion=(s:Suggestion)=>{ setSuggestions(p=>[s,...p]); setNotifications(n=>[{id:Date.now().toString(), title:"شكوى / اقتراح جديد", body:`${s.type} جديد من ${s.user}: ${s.text.slice(0,30)}...`, date:new Date().toLocaleString("ar-EG"), read:false, for:"admin"},...n]);};
  const replySuggestion=(id:string,reply:string)=>{ setSuggestions(p=>p.map(s=>s.id===id?{...s, reply, status:"تم الرد" as const}:s)); setNotifications(n=>[{id:Date.now().toString(), title:"تم الرد على رسالتك", body:reply.slice(0,40), date:new Date().toLocaleString("ar-EG"), read:false, for:"user"},...n]);};
  const addNotification=(n:AppNotification)=>setNotifications(p=>[n,...p]);
  const markRead=(id:string)=>setNotifications(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const addAdmin=(a:AdminUser)=>setAdmins(p=>[...p,a]);
  const removeAdmin=(id:string)=>setAdmins(p=>p.filter(a=>a.id!==id));
  const toggleBlock=(b:BlockRecord)=>{ setBlocks(p=>{ const ex=p.find(x=>x.userId===b.userId); if(ex) return p.map(x=>x.userId===b.userId?b:x); return [...p,b];});};
  const addCourse=(c:Course)=>{
    setCourses(p=>[c,...p]);
    setNotifications(n=>[{id:Date.now().toString(), title:"كورس جديد نزل!", body:`كورس ${c.title} في فئة ${c.category} متاح الآن`, date:new Date().toLocaleString("ar-EG"), read:false, for:"user"},...n]);
  };
  const exportCSV=(type:string)=>{
    let rows:any[]=[]; let name="export.csv";
    if(type==="registrations") {rows=registrations; name="registrations.csv";}
    else if(type==="volunteers") {rows=volunteerRequests; name="volunteers.csv";}
    else if(type==="activities") {rows=activities.flatMap(a=>a.registrations.map(r=>({activity:a.title,...r}))); name="activities.csv";}
    else if(type==="suggestions") {rows=suggestions; name="suggestions.csv";}
    if(!rows.length) return alert("لا توجد بيانات للتصدير");
    const header=Object.keys(rows[0]).join(",");
    const csv=[header,...rows.map(r=>Object.values(r).map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
  };
  const loginAdmin=(email:string,password:string)=>{
    const found = admins.find(a=> a.email===email && a.password===password);
    if(found){ setAdminSession(found); return found; }
    return null;
  };
  const logoutAdmin=()=> setAdminSession(null);
  const hasPermission=(perm:string)=>{
    if(!adminSession) return false;
    if(adminSession.isHead) return true;
    if(adminSession.permissions.includes("كل الصلاحيات")) return true;
    return adminSession.permissions.includes(perm);
  };

  return <RTCContext.Provider value={{courses, registrations, volunteerRequests, evaluations, meetings, activities, suggestions, notifications, admins, blocks, volunteerQuestions, currentUser, adminSession, addRegistration, addVolunteerRequest, updateVolunteerStatus, addEvaluation, addMeeting, addActivity, registerActivity, addSuggestion, replySuggestion, addNotification, markRead, addAdmin, removeAdmin, setCurrentUser, setVolunteerQuestions, toggleBlock, addCourse, exportCSV, loginAdmin, logoutAdmin, hasPermission}}>{children}</RTCContext.Provider>
};

export const useRTC=()=>{ const c=useContext(RTCContext); if(!c) throw new Error("RTCContext missing"); return c; };
