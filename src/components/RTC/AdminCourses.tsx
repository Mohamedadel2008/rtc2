import { useState } from "react";
import { useRTC, Branch, Course } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Pencil, Trash2, Plus, Upload, FileText, Image as ImageIcon, Settings } from "lucide-react";

export default function AdminCourses() {
  const { courses, registrations, addCourse, updateCourse, deleteCourse, categories, addCategory, removeCategory, exportCSV } = useRTC();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewCourse, setViewCourse] = useState<string | null>(null);
  const [showCats, setShowCats] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [form, setForm] = useState<{ title: string; category: string; hours: number; branch: Branch; description: string; instructor: string; date: string; hasCertificate: boolean; seats: number; image: string; files: { name: string; url: string; type: string }[]; price: string }>({
    title: "", category: categories[0] || "سوفت سكيلز", hours: 12, branch: "فرع المهندسين", description: "", instructor: "", date: "", hasCertificate: true, seats: 30, image: "", files: [], price: "مجاناً"
  });

  const c = courses.find(x => x.id === viewCourse);
  const regsFor = (id: string) => registrations.filter(r => r.courseId === id);

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", category: categories[0] || "سوفت سكيلز", hours: 12, branch: "فرع المهندسين", description: "", instructor: "", date: "", hasCertificate: true, seats: 30, image: "", files: [], price: "مجاناً" });
    setShowForm(true);
  };
  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title, category: course.category, hours: course.hours, branch: course.branch, description: course.description, instructor: course.instructor, date: course.date, hasCertificate: course.hasCertificate, seats: course.seats, image: course.image, files: course.files || [], price: course.price
    });
    setShowForm(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(f => ({ ...f, files: [...f.files, { name: file.name, url: reader.result as string, type: file.type }] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (!form.title || !form.instructor) return alert("أكمل عنوان الكورس والمدرب");
    if (editingId) {
      updateCourse(editingId, { ...form });
    } else {
      const newCourse: Course = { id: Date.now().toString(), ...form, hours: Number(form.hours), seats: Number(form.seats) };
      addCourse(newCourse);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleAddCat = () => {
    if (!newCat.trim()) return;
    addCategory(newCat.trim());
    setForm(f => ({ ...f, category: newCat.trim() }));
    setNewCat("");
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F2A5C]">إدارة الكورسات</h2>
          <p className="text-xs text-muted-foreground">عدّل أي كورس قديم، غيّر الفئة، صورة، وملفات — كل تعديل يسمع لحظياً عند الهيد والأدمنز المصرح لهم</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => setShowCats(true)}><Settings className="w-4 h-4 ml-2" />إدارة الفئات</Button>
          <Button variant="outline" className="rounded-full" onClick={() => exportCSV("registrations")}><Download className="w-4 h-4 ml-2" />تصدير Excel للمسجلين</Button>
          <Button onClick={openAdd} className="rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold hover:bg-[#FFD600]/90"><Plus className="w-4 h-4 ml-1" /> إضافة كورس</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(co => (
          <div key={co.id} className="bg-white rounded-3xl border overflow-hidden hover:shadow-lg transition flex flex-col">
            {co.image && <img src={co.image} alt={co.title} className="w-full h-36 object-cover" />}
            <div className="p-5 space-y-3 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-[#0F2A5C] line-clamp-1">{co.title}</h3>
                <Badge className="bg-[#0F2A5C] shrink-0">{co.category}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{co.branch} • {co.hours} ساعة • {co.instructor}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{co.description}</div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">{regsFor(co.id).length} مسجل</span>
                <span className="text-xs bg-muted px-3 py-1 rounded-full">{co.date}</span>
                {co.files && co.files.length > 0 && <span className="text-xs bg-[#FFD600]/30 px-3 py-1 rounded-full font-bold flex items-center gap-1"><FileText className="w-3 h-3" />{co.files.length} ملف</span>}
              </div>
              {(co.createdBy || co.updatedBy) && <div className="text-[11px] text-muted-foreground">أنشأه: {co.createdBy || "—"} {co.updatedAt && `• آخر تعديل: ${co.updatedBy} ${co.updatedAt}`}</div>}
              <div className="flex gap-2 mt-auto">
                <Button onClick={() => setViewCourse(co.id)} variant="outline" className="flex-1 rounded-full text-xs">المسجلون</Button>
                <Button onClick={() => openEdit(co)} className="rounded-full bg-[#0F2A5C] text-white px-3"><Pencil className="w-4 h-4" /></Button>
                <Button variant="destructive" className="rounded-full px-3" onClick={() => { if (confirm("حذف الكورس نهائياً؟")) deleteCourse(co.id); }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!viewCourse} onOpenChange={() => setViewCourse(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-right">{c?.title} — المسجلون</DialogTitle></DialogHeader>
          {c?.image && <img src={c.image} alt={c.title} className="rounded-xl w-full h-40 object-cover" />}
          {c?.files && c.files.length > 0 && (
            <div className="space-y-2">
              <div className="font-bold text-sm">ملفات الكورس</div>
              {c.files.map((f, i) => <a key={i} href={f.url} download={f.name} className="flex items-center gap-2 text-sm bg-muted rounded-xl px-3 py-2 hover:bg-muted/80"><FileText className="w-4 h-4" />{f.name}</a>)}
            </div>
          )}
          <div className="space-y-2 max-h-[40vh] overflow-auto">
            {c && regsFor(c.id).length === 0 && <p className="text-center text-muted-foreground py-6">لا يوجد مسجلون بعد</p>}
            {c && regsFor(c.id).map(r => (
              <div key={r.id} className="bg-muted rounded-xl p-3 flex justify-between text-sm">
                <div><div className="font-bold">{r.name}</div><div className="text-xs text-muted-foreground">{r.email} • {r.phone}</div></div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle className="text-right">{editingId ? "تعديل كورس" : "إضافة كورس جديد"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>عنوان الكورس *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: مهارات العرض" className="rounded-xl mt-1" /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>الفئة *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-2">
                  <Input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="فئة جديدة..." className="rounded-full text-sm" />
                  <Button type="button" onClick={handleAddCat} className="rounded-full bg-[#0F2A5C] text-white px-4 text-xs">+ إضافة</Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">تقدر تضيف أي كاتيجوري جديدة وهتظهر فوراً في فلتر المستخدمين</p>
              </div>
              <div>
                <Label>الفرع</Label>
                <Select value={form.branch} onValueChange={v => setForm({ ...form, branch: v as Branch })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="فرع المهندسين">فرع المهندسين</SelectItem>
                    <SelectItem value="فرع مصر الجديدة">فرع مصر الجديدة</SelectItem>
                    <SelectItem value="فرع المعادي">فرع المعادي</SelectItem>
                    <SelectItem value="فرع الإسكندرية">فرع الإسكندرية</SelectItem>
                    <SelectItem value="أونلاين">أونلاين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><Label>الساعات</Label><Input type="number" value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} className="rounded-xl mt-1" /></div>
              <div><Label>المقاعد</Label><Input type="number" value={form.seats} onChange={e => setForm({ ...form, seats: Number(e.target.value) })} className="rounded-xl mt-1" /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><Label>المدرب *</Label><Input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} placeholder="أ. أحمد" className="rounded-xl mt-1" /></div>
              <div><Label>التاريخ</Label><Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="10 أكتوبر 2024" className="rounded-xl mt-1" /></div>
            </div>

            <div><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الكورس..." className="rounded-xl mt-1" /></div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>السعر</Label>
                <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="مجاناً" className="rounded-xl mt-1" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Checkbox checked={form.hasCertificate} onCheckedChange={v => setForm({ ...form, hasCertificate: !!v })} id="cert" />
                <Label htmlFor="cert">يوجد شهادة</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> صورة الكورس (رفع صورة)</Label>
              <Input type="file" accept="image/*" onChange={handleImage} className="rounded-xl" />
              {form.image && <img src={form.image} alt="preview" className="w-full h-40 object-cover rounded-xl border" />}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Upload className="w-4 h-4" /> ملفات للكورس (PDF, صور، أي ملف)</Label>
              <Input type="file" multiple onChange={handleFiles} className="rounded-xl" />
              {form.files.length > 0 && (
                <div className="space-y-1">
                  {form.files.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-muted rounded-xl px-3 py-2 text-sm">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4" />{f.name}</span>
                      <button onClick={() => setForm({ ...form, files: form.files.filter((_, idx) => idx !== i) })} className="text-red-500 font-bold">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSubmit} className="w-full rounded-full bg-[#0F2A5C] text-white font-bold h-11 text-base">
              {editingId ? "حفظ التعديلات + تحديث لحظي" : "حفظ الكورس + إشعار للمهتمين"}
            </Button>
            {editingId && <p className="text-xs text-center text-muted-foreground">يسمع فوراً عند الهيد وكل من له صلاحية الكورسات</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Manager */}
      <Dialog open={showCats} onOpenChange={setShowCats}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-right">إدارة الفئات (Categories)</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="اسم فئة جديدة" className="rounded-full" />
              <Button onClick={() => { if (newCat.trim()) { addCategory(newCat.trim()); setNewCat(""); } }} className="rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold">إضافة</Button>
            </div>
            <div className="space-y-2 max-h-[40vh] overflow-auto">
              {categories.map(cat => (
                <div key={cat} className="flex justify-between items-center bg-muted rounded-xl px-4 py-2">
                  <span className="font-medium">{cat}</span>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { if (confirm(`حذف فئة "${cat}"؟`)) removeCategory(cat); }}>حذف</Button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-center text-muted-foreground py-4">لا توجد فئات</p>}
            </div>
            <p className="text-xs text-muted-foreground">أي فئة تضيفها هنا تظهر فوراً في فلتر صفحة الكورسات عند المستخدمين وفي فورم إضافة/تعديل الكورس</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
