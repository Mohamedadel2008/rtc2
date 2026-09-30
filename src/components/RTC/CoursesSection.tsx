import { useState } from "react";
import { useRTC, Category } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, MapPin, Award, Users, Search, Filter } from "lucide-react";

const cats: (Category | "الكل")[] = ["الكل", "تنمية بشرية", "لغات", "كمبيوتر", "إدارة", "سوفت سكيلز", "ميديا"];

export default function CoursesSection() {
  const { courses, addRegistration, currentUser, blocks } = useRTC();
  const [activeCat, setActiveCat] = useState<string>("الكل");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showReg, setShowReg] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "" });

  const course = courses.find(c => c.id === selected);
  const filtered = courses.filter(c => (activeCat === "الكل" || c.category === activeCat) && c.title.includes(search));

  const blocked = currentUser ? blocks.find(b => b.userId === currentUser.email && b.active) : null;

  const handleReg = () => {
    if (!course) return;
    if (blocked) return alert(`أنت محظور حتى ${blocked.until}: ${blocked.reason}`);
    if (!regForm.name || !regForm.phone) return alert("أكمل البيانات");
    addRegistration({
      id: Date.now().toString(),
      courseId: course.id,
      courseTitle: course.title,
      name: regForm.name,
      email: regForm.email || currentUser?.email || "",
      phone: regForm.phone,
      date: new Date().toLocaleString("ar-EG"),
      status: "مؤكد",
      userId: currentUser?.email || regForm.email,
    });
    setShowReg(false);
    setRegForm({ name: "", email: "", phone: "" });
    alert("تم التسجيل بنجاح! ستصلك رسالة تأكيد");
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[1.7rem] border p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F2A5C] text-[#FFD600] grid place-items-center"><Filter className="w-5 h-5" /></div>
          <div><div className="font-extrabold text-[#0F2A5C]">كورسات الشهر الحالي</div><div className="text-xs text-muted-foreground">{filtered.length} كورس متاح</div></div>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن كورس..." className="pr-10 rounded-full" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold border transition ${activeCat === c ? "bg-[#0F2A5C] text-white border-[#0F2A5C]" : "bg-white hover:bg-muted"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {blocked && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          ⚠️ أنت محظور من التسجيل حتى <strong>{blocked.until}</strong> — السبب: {blocked.reason}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-[1.7rem] border overflow-hidden hover:shadow-lg transition group">
            <div className="relative h-44 overflow-hidden">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-[#FFD600] text-[#0F2A5C] hover:bg-[#FFD600] font-bold">{c.category}</Badge>
                {c.hasCertificate && <Badge className="bg-[#0F2A5C] text-white">شهادة</Badge>}
              </div>
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.hours} ساعة</div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-extrabold text-[#0F2A5C] leading-tight line-clamp-1">{c.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.branch}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.seats} مقعد</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" />{c.instructor}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">{c.price}</span>
                <span className="text-xs text-muted-foreground">{c.date}</span>
              </div>
              <Button onClick={() => setSelected(c.id)} className="w-full rounded-full bg-[#0F2A5C] hover:bg-[#0F2A5C]/90 font-bold">عرض التفاصيل</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {course && (
            <>
              <DialogHeader><DialogTitle className="text-right text-xl font-extrabold text-[#0F2A5C]">{course.title}</DialogTitle></DialogHeader>
              <img src={course.image} alt={course.title} className="rounded-2xl w-full h-48 object-cover" />
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted rounded-xl p-3"><div className="text-xs text-muted-foreground">المدرب</div><div className="font-bold">{course.instructor}</div></div>
                <div className="bg-muted rounded-xl p-3"><div className="text-xs text-muted-foreground">الفرع</div><div className="font-bold">{course.branch}</div></div>
                <div className="bg-muted rounded-xl p-3"><div className="text-xs text-muted-foreground">المدة</div><div className="font-bold">{course.hours} ساعة</div></div>
                <div className="bg-muted rounded-xl p-3"><div className="text-xs text-muted-foreground">الشهادة</div><div className="font-bold">{course.hasCertificate ? "يوجد شهادة" : "بدون شهادة"}</div></div>
              </div>
              <Button onClick={() => setShowReg(true)} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] hover:bg-[#FFD600]/90 font-extrabold h-12 text-base">سجّل الآن</Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showReg} onOpenChange={setShowReg}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-right">تسجيل في: {course?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>الاسم الكامل *</Label><Input value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} placeholder="أحمد محمد" className="rounded-xl mt-1" /></div>
            <div><Label>البريد الإلكتروني</Label><Input value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} placeholder="you@mail.com" className="rounded-xl mt-1" dir="ltr" /></div>
            <div><Label>رقم الهاتف *</Label><Input value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} placeholder="01xxxxxxxxx" className="rounded-xl mt-1" dir="ltr" /></div>
            <Button onClick={handleReg} className="w-full rounded-full bg-[#0F2A5C] text-white font-bold h-11">تأكيد التسجيل</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
