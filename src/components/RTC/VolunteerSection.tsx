import { useState } from "react";
import { useRTC, Team } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, CheckCircle, XCircle, Timer } from "lucide-react";

export default function VolunteerSection() {
  const { volunteerQuestions, volunteerRequests, addVolunteerRequest, currentUser } = useRTC();
  const [form, setForm] = useState({ name: currentUser?.name || "", phone: "", email: currentUser?.email || "", team: "" as Team | "", answers: {} as Record<string, string> });
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!form.name || !form.phone || !form.team) return alert("أكمل البيانات المطلوبة");
    addVolunteerRequest({
      id: Date.now().toString(),
      name: form.name,
      phone: form.phone,
      email: form.email,
      team: form.team as Team,
      answers: form.answers,
      status: "قيد الانتظار",
      date: new Date().toLocaleString("ar-EG"),
    });
    setDone(true);
  };

  const myReqs = volunteerRequests.filter(v => v.email === currentUser?.email || v.phone === form.phone);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0F2A5C] to-[#1a3a7a] rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#FFD600]/20 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row gap-6 items-center">
          <img src="/logo-rtc-2.jpeg" alt="RTC" className="w-28 h-28 rounded-3xl object-cover border-4 border-white/20 shadow-xl" />
          <div>
            <h2 className="text-3xl font-extrabold">تطوع معنا 💛</h2>
            <p className="text-white/80 mt-2 leading-relaxed">اختر الفريق اللي يناسبك: HR - PR - تنظيم - ميديا - BR. أسئلة الفورم يحددها الأدمن وستظهر حالاً هنا.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {(["HR", "PR", "تنظيم", "ميديا", "BR"] as const).map(t => <Badge key={t} className="bg-[#FFD600] text-[#0F2A5C] font-bold">{t}</Badge>)}
            </div>
          </div>
        </div>
      </div>

      {done ? (
        <div className="bg-white rounded-[2rem] border p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto grid place-items-center"><CheckCircle className="w-8 h-8" /></div>
          <div className="font-extrabold text-xl text-[#0F2A5C]">تم استلام طلبك بنجاح!</div>
          <p className="text-muted-foreground">ستظهر حالة طلبك في التايملاين أدناه. سيرد عليك الأدمن قريباً.</p>
          <Button onClick={() => setDone(false)} variant="outline" className="rounded-full">تقديم طلب آخر</Button>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border p-6 md:p-8 space-y-5">
          <h3 className="font-extrabold text-xl text-[#0F2A5C]">نموذج التطوع</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>الاسم *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="الاسم الكامل" className="rounded-xl mt-1" /></div>
            <div><Label>رقم الهاتف *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" className="rounded-xl mt-1" dir="ltr" /></div>
            <div><Label>البريد</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="mail@example.com" className="rounded-xl mt-1" dir="ltr" /></div>
            <div>
              <Label>الفريق المطلوب *</Label>
              <Select value={form.team} onValueChange={v => setForm({ ...form, team: v as Team })}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="اختر الفريق" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="PR">PR - علاقات عامة</SelectItem>
                  <SelectItem value="تنظيم">تنظيم</SelectItem>
                  <SelectItem value="ميديا">ميديا</SelectItem>
                  <SelectItem value="BR">BR - بناء علاقات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {volunteerQuestions.map((q, i) => (
            <div key={i}>
              <Label>{q}</Label>
              <Textarea value={form.answers[q] || ""} onChange={e => setForm({ ...form, answers: { ...form.answers, [q]: e.target.value } })} placeholder="اكتب إجابتك..." className="rounded-xl mt-1" rows={2} />
            </div>
          ))}

          <Button onClick={submit} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] hover:bg-[#FFD600]/90 font-extrabold h-12 text-base">إرسال الطلب <Heart className="mr-2 w-5 h-5" /></Button>
        </div>
      )}

      {myReqs.length > 0 && (
        <div className="bg-white rounded-[2rem] border p-6">
          <h3 className="font-extrabold text-[#0F2A5C] mb-4">تتبع طلباتك - تايملاين</h3>
          <div className="space-y-3">
            {myReqs.map(r => (
              <div key={r.id} className="flex gap-4 items-start bg-muted rounded-2xl p-4">
                <div className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${r.status === "مقبول" ? "bg-emerald-500 text-white" : r.status === "مرفوض" ? "bg-red-500 text-white" : r.status === "مقابلة" ? "bg-blue-500 text-white" : "bg-amber-400 text-white"}`}>
                  {r.status === "مقبول" ? <CheckCircle className="w-5 h-5" /> : r.status === "مرفوض" ? <XCircle className="w-5 h-5" /> : r.status === "مقابلة" ? <Clock className="w-5 h-5" /> : <Timer className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{r.team} — {r.status}</div>
                  <div className="text-xs text-muted-foreground">{r.date}</div>
                  {r.reply && <div className="mt-2 bg-white rounded-xl p-3 text-sm border">رد الأدمن: {r.reply}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
