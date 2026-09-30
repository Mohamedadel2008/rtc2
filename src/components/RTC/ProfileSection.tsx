import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Settings, Award, Calendar, Clock, BookOpen, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProfileSection() {
  const { currentUser, registrations, blocks, evaluations } = useRTC();
  const [tab, setTab] = useState<"نشاطي" | "شهاداتي" | "حضوري">("نشاطي");
  const [showSettings, setShowSettings] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-[2rem] border p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto grid place-items-center"><BookOpen className="w-8 h-8 text-muted-foreground" /></div>
        <div className="font-extrabold text-xl text-[#0F2A5C]">سجل دخول لعرض بروفايلك</div>
        <p className="text-muted-foreground">شاهد تقدمك، شهاداتك، وحضورك من هنا بعد تسجيل الدخول</p>
      </div>
    );
  }

  const myRegs = registrations.filter(r => r.userId === currentUser.email || r.email === currentUser.email);
  const myBlock = blocks.find(b => b.userId === currentUser.email && b.active);
  const myEvals = evaluations.filter(e => e.volunteerName.includes(currentUser.name.split(" ")[0]));

  return (
    <div className="space-y-5">
      <div className="bg-[#0F2A5C] rounded-[2rem] p-8 text-white flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-[#FFD600] text-[#0F2A5C] grid place-items-center text-2xl font-extrabold">{currentUser.name[0]}</div>
          <div>
            <div className="text-2xl font-extrabold">{currentUser.name}</div>
            <div className="text-white/70 text-sm">{currentUser.email}</div>
            <div className="flex gap-2 mt-2">
              {currentUser.interests.map(i => <Badge key={i} className="bg-white/15 text-white border-white/20">{i}</Badge>)}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowSettings(true)} variant="outline" className="rounded-full bg-white text-[#0F2A5C] hover:bg-white/90 font-bold"><Settings className="w-4 h-4 ml-2" /> الإعدادات</Button>
      </div>

      {myBlock && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
          <Ban className="w-6 h-6" />
          <div><div className="font-bold">تم حظرك مؤقتاً</div><div className="text-sm">السبب: {myBlock.reason} — حتى {myBlock.until}</div></div>
        </div>
      )}

      <div className="bg-white rounded-[1.7rem] border p-2 flex gap-2 w-fit">
        {(["نشاطي", "شهاداتي", "حضوري"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full text-sm font-bold ${tab === t ? "bg-[#0F2A5C] text-white" : "hover:bg-muted"}`}>{t}</button>
        ))}
      </div>

      {tab === "نشاطي" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border p-6 text-center">
            <div className="text-3xl font-extrabold text-[#0F2A5C]">{myRegs.length}</div>
            <div className="text-sm text-muted-foreground">كورس مسجل</div>
            <Progress value={Math.min(100, myRegs.length * 25)} className="mt-4 h-2" />
            <div className="text-xs text-muted-foreground mt-2">{Math.min(100, myRegs.length * 25)}% إنجاز</div>
          </div>
          <div className="bg-white rounded-3xl border p-6">
            <div className="font-bold text-[#0F2A5C] flex items-center gap-2"><Calendar className="w-4 h-4" /> كورساتي</div>
            <div className="mt-3 space-y-2">
              {myRegs.length === 0 && <p className="text-sm text-muted-foreground">لم تسجل في أي كورس بعد</p>}
              {myRegs.map(r => <div key={r.id} className="bg-muted rounded-xl px-3 py-2 text-sm flex justify-between"><span>{r.courseTitle}</span><Badge variant="secondary">{r.status}</Badge></div>)}
            </div>
          </div>
          <div className="bg-white rounded-3xl border p-6">
            <div className="font-bold text-[#0F2A5C]">تقييماتي كمتطوع</div>
            <div className="mt-3 space-y-2">
              {myEvals.length === 0 && <p className="text-sm text-muted-foreground">لا توجد تقييمات بعد</p>}
              {myEvals.map(e => <div key={e.id} className="bg-amber-50 rounded-xl p-3 text-sm"><div className="font-bold">{e.evaluator} قيّمك</div><div className="text-xs text-muted-foreground">{e.comment}</div></div>)}
            </div>
          </div>
        </div>
      )}

      {tab === "شهاداتي" && (
        <div className="grid md:grid-cols-2 gap-4">
          {myRegs.length === 0 && <div className="col-span-2 bg-white rounded-3xl border p-10 text-center text-muted-foreground">ستظهر شهاداتك هنا بعد إكمال الكورسات</div>}
          {myRegs.map(r => (
            <div key={r.id} className="bg-white rounded-3xl border p-6 flex gap-4 items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD600] grid place-items-center"><Award className="w-7 h-7 text-[#0F2A5C]" /></div>
              <div className="flex-1">
                <div className="font-bold text-[#0F2A5C]">{r.courseTitle}</div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
              </div>
              <Badge className="bg-emerald-500">مكتمل</Badge>
            </div>
          ))}
        </div>
      )}

      {tab === "حضوري" && (
        <div className="bg-white rounded-3xl border p-6">
          <div className="font-bold text-[#0F2A5C] flex items-center gap-2"><Clock className="w-5 h-5" /> سجل الحضور والغياب</div>
          <div className="mt-4 space-y-2">
            {myRegs.length === 0 && <p className="text-sm text-muted-foreground">لا يوجد سجل حضور بعد</p>}
            {myRegs.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                <span className="text-sm font-medium">{r.courseTitle}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${i % 2 === 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{i % 2 === 0 ? "حضر" : "غاب"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-right">الإعدادات</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="bg-muted rounded-xl p-4">
              <div className="font-bold">الاهتمامات</div>
              <div className="text-muted-foreground">سيصلك إشعار عند نزول كورس جديد في مجالاتك: {currentUser.interests.join("، ") || "لم تحدد بعد"}</div>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <div className="font-bold">الإشعارات</div>
              <div className="text-muted-foreground">مفعلة - ستصلك تنبيهات للكورسات والفعاليات</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
