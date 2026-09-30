import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminMeetings(){
  const { meetings, addMeeting, volunteerRequests } = useRTC();
  const [form, setForm] = useState({ title:"", date:"", time:"", leader:"", topics:"", minutes:"", attendees:"", decisions:"" });

  const submit = ()=>{
    if(!form.title || !form.date) return alert("أكمل العنوان والتاريخ");
    addMeeting({ id: Date.now().toString(), title: form.title, date: form.date, time: form.time, leader: form.leader, topics: form.topics, minutes: form.minutes, attendees: form.attendees.split(",").map(s=>s.trim()).filter(Boolean), decisions: form.decisions });
    setForm({ title:"", date:"", time:"", leader:"", topics:"", minutes:"", attendees:"", decisions:"" });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">الاجتماعات</h2>
        <p className="text-sm text-muted-foreground">محضر، حضور، قرارات، مواضيع، وليدر الاجتماع</p>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-4">
        <h3 className="font-bold text-[#0F2A5C]">إضافة اجتماع</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>عنوان الاجتماع *</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="اجتماع تنظيم إطعام" className="rounded-xl mt-1"/></div>
          <div><Label>ليدر الاجتماع</Label><Input list="vols2" value={form.leader} onChange={e=>setForm({...form,leader:e.target.value})} placeholder="اختر الليدر" className="rounded-xl mt-1"/><datalist id="vols2">{volunteerRequests.map(v=> <option key={v.id} value={v.name}/>)}</datalist></div>
          <div><Label>التاريخ *</Label><Input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="rounded-xl mt-1"/></div>
          <div><Label>الساعة</Label><Input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="rounded-xl mt-1"/></div>
        </div>
        <div><Label>المواضيع</Label><Textarea value={form.topics} onChange={e=>setForm({...form,topics:e.target.value})} placeholder="مواضيع الاجتماع..." className="rounded-xl mt-1"/></div>
        <div><Label>محضر الاجتماع</Label><Textarea value={form.minutes} onChange={e=>setForm({...form,minutes:e.target.value})} placeholder="ما دار في الاجتماع..." className="rounded-xl mt-1"/></div>
        <div><Label>الحضور (افصل بفاصلة، أو ابحث)</Label><Input value={form.attendees} onChange={e=>setForm({...form,attendees:e.target.value})} placeholder="أحمد، سارة، عمر" className="rounded-xl mt-1"/></div>
        <div><Label>القرارات</Label><Textarea value={form.decisions} onChange={e=>setForm({...form,decisions:e.target.value})} placeholder="القرارات المتخذة..." className="rounded-xl mt-1"/></div>
        <Button onClick={submit} className="w-full rounded-full bg-[#0F2A5C] text-white font-bold h-11">حفظ الاجتماع</Button>
      </div>

      <div className="space-y-3">
        {meetings.length===0 && <div className="bg-white rounded-3xl border p-10 text-center text-muted-foreground">لا يوجد اجتماعات</div>}
        {meetings.map(m=> (
          <div key={m.id} className="bg-white rounded-3xl border p-5 space-y-2">
            <div className="flex justify-between"><span className="font-extrabold text-[#0F2A5C]">{m.title}</span><span className="text-xs text-muted-foreground">{m.date} {m.time}</span></div>
            <div className="text-sm text-muted-foreground">الليدر: {m.leader || "—"}</div>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-xl p-3"><div className="font-bold">المواضيع</div><div className="text-muted-foreground">{m.topics||"—"}</div></div>
              <div className="bg-muted rounded-xl p-3"><div className="font-bold">المحضر</div><div className="text-muted-foreground">{m.minutes||"—"}</div></div>
            </div>
            <div className="bg-[#FFD600]/20 rounded-xl p-3 text-sm"><span className="font-bold">الحضور: </span>{m.attendees.join("، ") || "—"}</div>
            <div className="bg-emerald-50 rounded-xl p-3 text-sm"><span className="font-bold">القرارات: </span>{m.decisions||"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
