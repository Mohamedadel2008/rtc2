import { useRTC } from "@/store/RTCStore";
import { GraduationCap, Users, Calendar, MessageCircle, Heart, Award } from "lucide-react";

export default function AdminDashboard() {
  const { courses, registrations, volunteerRequests, activities, suggestions, meetings } = useRTC();
  const stats = [
    { label: "الكورسات", value: courses.length, icon: GraduationCap, color: "bg-[#0F2A5C] text-white" },
    { label: "المسجلين", value: registrations.length, icon: Users, color: "bg-[#FFD600] text-[#0F2A5C]" },
    { label: "طلبات تطوع", value: volunteerRequests.length, icon: Heart, color: "bg-emerald-500 text-white" },
    { label: "الفعاليات", value: activities.length, icon: Calendar, color: "bg-orange-500 text-white" },
    { label: "الشكاوى", value: suggestions.length, icon: MessageCircle, color: "bg-red-500 text-white" },
    { label: "الاجتماعات", value: meetings.length, icon: Award, color: "bg-purple-500 text-white" },
  ];
  return (
    <div className="space-y-6">
      <div className="bg-[#0F2A5C] rounded-[1.7rem] p-8 text-white">
        <h2 className="text-2xl font-extrabold">لوحة تحكم هيد الفرع 👑</h2>
        <p className="text-white/70 mt-1">كل شيء يحدث في RTC أمامك لحظياً — كورسات، تطوع، فعاليات واجتماعات</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-3xl border p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl grid place-items-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div><div className="text-2xl font-extrabold text-[#0F2A5C]">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border p-6">
          <div className="font-bold text-[#0F2A5C] mb-3">آخر التسجيلات</div>
          <div className="space-y-2">
            {registrations.slice(0,5).map(r=> <div key={r.id} className="flex justify-between text-sm bg-muted rounded-xl px-3 py-2"><span>{r.name} — {r.courseTitle}</span><span className="text-xs text-muted-foreground">{r.date}</span></div>)}
            {registrations.length===0 && <p className="text-sm text-muted-foreground">لا يوجد تسجيلات بعد</p>}
          </div>
        </div>
        <div className="bg-white rounded-3xl border p-6">
          <div className="font-bold text-[#0F2A5C] mb-3">آخر طلبات التطوع</div>
          <div className="space-y-2">
            {volunteerRequests.slice(0,5).map(v=> <div key={v.id} className="flex justify-between text-sm bg-muted rounded-xl px-3 py-2"><span>{v.name} — {v.team}</span><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${v.status==="مقبول"?"bg-emerald-100 text-emerald-700":v.status==="مرفوض"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`}>{v.status}</span></div>)}
            {volunteerRequests.length===0 && <p className="text-sm text-muted-foreground">لا يوجد طلبات بعد</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
