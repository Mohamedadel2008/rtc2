import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Settings, Award, Calendar, Clock, BookOpen, Ban, Save, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProfileSection() {
  const { currentUser, registrations, blocks, evaluations, categories, updateUserProfile } = useRTC();
  const [tab, setTab] = useState<"نشاطي" | "شهاداتي" | "حضوري">("نشاطي");
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interests: [] as string[], avatar: "" });

  const openEdit = () => {
    if (!currentUser) return;
    setForm({ name: currentUser.name, phone: currentUser.phone || "", interests: currentUser.interests || [], avatar: currentUser.avatar || "" });
    setEditMode(true);
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setForm(s => ({ ...s, avatar: r.result as string })); r.readAsDataURL(f);
  };

  const toggleInterest = (cat: string) => {
    setForm(s => ({ ...s, interests: s.interests.includes(cat) ? s.interests.filter(x => x !== cat) : [...s.interests, cat] }));
  };

  const saveProfile = () => {
    if (!form.name.trim()) return alert("الاسم مطلوب");
    updateUserProfile({ name: form.name.trim(), phone: form.phone.trim(), interests: form.interests, avatar: form.avatar });
    setEditMode(false);
    alert("تم تحديث بروفايلك ✅ — البريد محمي ولا يمكن تغييره");
  };

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
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-3xl object-cover border-2 border-[#FFD600]" />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-[#FFD600] text-[#0F2A5C] grid place-items-center text-2xl font-extrabold">{currentUser.name[0]}</div>
          )}
          <div>
            <div className="text-2xl font-extrabold">{currentUser.name}</div>
            <div className="text-white/70 text-sm flex items-center gap-2">{currentUser.email}<Badge className="bg-white/20 text-white text-[10px]">البريد محمي 🔒</Badge></div>
            {currentUser.phone && <div className="text-white/70 text-xs">{currentUser.phone}</div>}
            <div className="flex gap-2 mt-2 flex-wrap">
              {currentUser.interests.map(i => <Badge key={i} className="bg-white/15 text-white border-white/20">{i}</Badge>)}
              {currentUser.interests.length === 0 && <span className="text-xs text-white/50">لم تحدد اهتمامات بعد</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={openEdit} className="rounded-full bg-[#FFD600] text-[#0F2A5C] hover:bg-[#FFD600]/90 font-bold"><Camera className="w-4 h-4 ml-2" /> تعديل البروفايل</Button>
          <Button onClick={() => setShowSettings(true)} variant="outline" className="rounded-full bg-white text-[#0F2A5C] hover:bg-white/90 font-bold"><Settings className="w-4 h-4 ml-2" /> الإعدادات</Button>
        </div>
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

      {/* Edit Profile */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-right">تعديل البروفايل</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              {form.avatar ? <img src={form.avatar} alt="avatar" className="w-24 h-24 rounded-3xl object-cover mx-auto border-2 border-[#FFD600]" /> : <div className="w-24 h-24 rounded-3xl bg-[#0F2A5C] text-[#FFD600] grid place-items-center text-2xl font-extrabold mx-auto">{form.name[0] || "؟"}</div>}
              <Label className="mt-3 inline-block bg-muted rounded-full px-4 py-2 cursor-pointer text-sm">📷 تغيير الصورة<input type="file" accept="image/*" onChange={handleAvatar} className="hidden" /></Label>
            </div>
            <div><Label>الاسم الكامل *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl mt-1" /></div>
            <div>
              <Label>البريد الإلكتروني 🔒</Label>
              <Input value={currentUser.email} disabled className="rounded-xl mt-1 bg-muted text-muted-foreground" dir="ltr" />
              <p className="text-[11px] text-muted-foreground mt-1">البريد لا يمكن تعديله لأسباب أمنية</p>
            </div>
            <div><Label>رقم الهاتف</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" className="rounded-xl mt-1" dir="ltr" /></div>
            <div>
              <Label>الاهتمامات (اختر ما تحب)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map(cat => (
                  <label key={cat} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm cursor-pointer border ${form.interests.includes(cat) ? "bg-[#0F2A5C] text-white border-[#0F2A5C]" : "bg-muted hover:bg-muted/80"}`}>
                    <Checkbox checked={form.interests.includes(cat)} onCheckedChange={() => toggleInterest(cat)} className={form.interests.includes(cat) ? "data-[state=checked]:bg-white data-[state=checked]:text-[#0F2A5C]" : ""} /> {cat}
                  </label>
                ))}
              </div>
            </div>
            <Button onClick={saveProfile} className="w-full rounded-full bg-[#0F2A5C] text-white font-bold h-11"><Save className="w-4 h-4 ml-2" /> حفظ التعديلات</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-right">الإعدادات</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="bg-muted rounded-xl p-4">
              <div className="font-bold">الاهتمامات</div>
              <div className="text-muted-foreground">سيصلك إشعار عند نزول كورس جديد في مجالاتك: {currentUser.interests.join("، ") || "لم تحدد بعد — عدّل بروفايلك"}</div>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <div className="font-bold">الإشعارات</div>
              <div className="text-muted-foreground">مفعلة - ستصلك تنبيهات للكورسات والفعاليات والردود</div>
            </div>
            <Button onClick={openEdit} variant="outline" className="w-full rounded-full">تعديل البروفايل</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
