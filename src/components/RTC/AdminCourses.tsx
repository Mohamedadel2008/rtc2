import { useState } from "react";
import { useRTC, Category, Branch, Course } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

export default function AdminCourses() {
  const { courses, registrations, addCourse, exportCSV } = useRTC();
  const [showAdd, setShowAdd] = useState(false);
  const [viewCourse, setViewCourse] = useState<string|null>(null);
  const [form, setForm] = useState({ title:"", category:"سوفت سكيلز" as Category, hours:12, branch:"فرع المهندسين" as Branch, description:"", instructor:"", date:"", hasCertificate:true, seats:30 });

  const c = courses.find(x=>x.id===viewCourse);
  const regsFor = (id:string)=> registrations.filter(r=>r.courseId===id);

  const handleAdd = ()=>{
    if(!form.title || !form.instructor) return alert("أكمل البيانات");
    const newCourse: Course = { id: Date.now().toString(), title: form.title, category: form.category, hours: Number(form.hours), hasCertificate: form.hasCertificate, branch: form.branch, description: form.description || "كورس جديد من RTC", instructor: form.instructor, date: form.date || new Date().toLocaleDateString("ar-EG"), seats: Number(form.seats), image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600", price:"مجاناً" };
    addCourse(newCourse);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6 flex flex-wrap gap-3 items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">إدارة الكورسات</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={()=>exportCSV("registrations")}><Download className="w-4 h-4 ml-2"/>تصدير Excel للمسجلين</Button>
          <Button onClick={()=>setShowAdd(true)} className="rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold hover:bg-[#FFD600]/90">+ إضافة كورس</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(co=> (
          <div key={co.id} className="bg-white rounded-3xl border p-5 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-[#0F2A5C] line-clamp-1">{co.title}</h3>
              <Badge className="bg-[#0F2A5C] shrink-0">{co.category}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">{co.branch} • {co.hours} ساعة • {co.instructor}</div>
            <div className="flex gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">{regsFor(co.id).length} مسجل</span>
              <span className="text-xs bg-muted px-3 py-1 rounded-full">{co.date}</span>
            </div>
            <Button onClick={()=>setViewCourse(co.id)} variant="outline" className="w-full rounded-full">عرض المسجلين</Button>
          </div>
        ))}
      </div>

      <Dialog open={!!viewCourse} onOpenChange={()=>setViewCourse(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-right">{c?.title} — المسجلون</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-[50vh] overflow-auto">
            {c && regsFor(c.id).length===0 && <p className="text-center text-muted-foreground py-6">لا يوجد مسجلون بعد</p>}
            {c && regsFor(c.id).map(r=> (
              <div key={r.id} className="bg-muted rounded-xl p-3 flex justify-between text-sm">
                <div><div className="font-bold">{r.name}</div><div className="text-xs text-muted-foreground">{r.email} • {r.phone}</div></div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-right">إضافة كورس جديد</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>عنوان الكورس</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="مثال: مهارات العرض" className="rounded-xl mt-1"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>الفئة</Label><Select value={form.category} onValueChange={v=>setForm({...form,category:v as Category})}><SelectTrigger className="rounded-xl mt-1"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="تنمية بشرية">تنمية بشرية</SelectItem><SelectItem value="لغات">لغات</SelectItem><SelectItem value="كمبيوتر">كمبيوتر</SelectItem><SelectItem value="إدارة">إدارة</SelectItem><SelectItem value="سوفت سكيلز">سوفت سكيلز</SelectItem><SelectItem value="ميديا">ميديا</SelectItem></SelectContent></Select></div>
              <div><Label>الفرع</Label><Select value={form.branch} onValueChange={v=>setForm({...form,branch:v as Branch})}><SelectTrigger className="rounded-xl mt-1"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="فرع المهندسين">فرع المهندسين</SelectItem><SelectItem value="فرع مصر الجديدة">فرع مصر الجديدة</SelectItem><SelectItem value="فرع المعادي">فرع المعادي</SelectItem><SelectItem value="فرع الإسكندرية">فرع الإسكندرية</SelectItem><SelectItem value="أونلاين">أونلاين</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>الساعات</Label><Input type="number" value={form.hours} onChange={e=>setForm({...form,hours:Number(e.target.value)})} className="rounded-xl mt-1"/></div>
              <div><Label>المقاعد</Label><Input type="number" value={form.seats} onChange={e=>setForm({...form,seats:Number(e.target.value)})} className="rounded-xl mt-1"/></div>
            </div>
            <div><Label>المدرب</Label><Input value={form.instructor} onChange={e=>setForm({...form,instructor:e.target.value})} placeholder="أ. أحمد" className="rounded-xl mt-1"/></div>
            <div><Label>التاريخ</Label><Input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="10 أكتوبر 2024" className="rounded-xl mt-1"/></div>
            <div><Label>الوصف</Label><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="وصف الكورس..." className="rounded-xl mt-1"/></div>
            <Button onClick={handleAdd} className="w-full rounded-full bg-[#0F2A5C] text-white font-bold h-11">حفظ الكورس + إشعار للمهتمين</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
