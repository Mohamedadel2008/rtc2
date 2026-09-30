import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Calendar, Clock } from "lucide-react";

export default function ActivitiesSection() {
  const { activities, registerActivity } = useRTC();
  const [active, setActive] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", age: "" });

  const act = activities.find(a => a.id === active);

  const handleReg = () => {
    if (!active || !form.name || !form.phone) return alert("أكمل البيانات");
    registerActivity(active, form);
    setForm({ name: "", phone: "", age: "" });
    setActive(null);
    alert("تم التسجيل في الفعالية بنجاح!");
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[1.7rem] border p-6">
        <h2 className="text-2xl font-extrabold text-[#0F2A5C]">النشاطات والفعاليات</h2>
        <p className="text-muted-foreground text-sm mt-1">سجّل في فعاليات رسالة الخيرية - إطعام، زيارات، حملات</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(a => (
          <div key={a.id} className="bg-white rounded-[1.7rem] border overflow-hidden hover:shadow-lg transition">
            <img src={a.image} alt={a.title} className="w-full h-44 object-cover" />
            <div className="p-5 space-y-3">
              <h3 className="font-extrabold text-[#0F2A5C]">{a.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.date} - {a.time}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{a.location}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-[#FFD600]/20 text-[#0F2A5C] px-3 py-1 rounded-full font-bold">{a.registrations.length} مشارك</span>
                <Button onClick={() => setActive(a.id)} className="rounded-full bg-[#0F2A5C] text-white font-bold">سجّل الآن</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-right">التسجيل في: {act?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-3 text-sm flex flex-col gap-1">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{act?.date} - {act?.time}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{act?.location}</span>
            </div>
            <div><Label>الاسم *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="الاسم الكامل" className="rounded-xl mt-1" /></div>
            <div><Label>السن</Label><Input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="22" className="rounded-xl mt-1" /></div>
            <div><Label>رقم الهاتف *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" className="rounded-xl mt-1" dir="ltr" /></div>
            <Button onClick={handleReg} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] font-extrabold h-11">تأكيد التسجيل</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
