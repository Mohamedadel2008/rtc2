import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";

export default function AdminActivities(){
  const { activities, addActivity, exportCSV } = useRTC();
  const [form, setForm] = useState({ title:"", date:"", time:"", location:"", description:"" });

  const submit=()=>{
    if(!form.title || !form.date) return alert("أكمل البيانات");
    addActivity({ id: Date.now().toString(), title: form.title, date: form.date, time: form.time, location: form.location, description: form.description, image:"https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600", registrations:[]});
    setForm({title:"",date:"",time:"",location:"",description:""});
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6 flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">إدارة الفعاليات</h2>
        <Button variant="outline" className="rounded-full" onClick={()=>exportCSV("activities")}><Download className="w-4 h-4 ml-2"/>تصدير المشاركين Excel</Button>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-4">
        <h3 className="font-bold">إضافة فعالية</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>العنوان</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="إطعام" className="rounded-xl mt-1"/></div>
          <div><Label>المكان</Label><Input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="فرع المهندسين" className="rounded-xl mt-1"/></div>
          <div><Label>التاريخ</Label><Input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="rounded-xl mt-1"/></div>
          <div><Label>الساعة</Label><Input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="rounded-xl mt-1"/></div>
        </div>
        <div><Label>الوصف</Label><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="وصف الفعالية..." className="rounded-xl mt-1"/></div>
        <Button onClick={submit} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold">نشر الفعالية</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {activities.map(a=> (
          <div key={a.id} className="bg-white rounded-3xl border p-5 space-y-3">
            <div className="font-bold text-[#0F2A5C]">{a.title}</div>
            <div className="text-xs text-muted-foreground">{a.date} • {a.time} • {a.location}</div>
            <div className="text-sm text-muted-foreground">{a.description}</div>
            <div className="bg-muted rounded-2xl p-3">
              <div className="font-bold text-sm">المسجلون ({a.registrations.length})</div>
              <div className="mt-2 space-y-1 max-h-32 overflow-auto">
                {a.registrations.length===0 && <span className="text-xs text-muted-foreground">لا يوجد مسجلون</span>}
                {a.registrations.map((r,i)=> <div key={i} className="text-xs bg-white rounded-lg px-2 py-1 flex justify-between"><span>{r.name} — {r.age} سنة</span><span>{r.phone}</span></div>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
