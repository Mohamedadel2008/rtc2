import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Crown, Save, Pencil } from "lucide-react";

const perms = ["الكورسات", "المتطوعون", "التقييم", "الاجتماعات", "الفعاليات", "الشكاوى", "الأدمنز", "كل الصلاحيات"];

export default function AdminAdmins() {
  const { admins, addAdmin, removeAdmin, adminSession, updateHeadName, updateAdminProfile } = useRTC();
  const [form, setForm] = useState({ name: "", email: "", password: "", permissions: [] as string[] });
  const [headName, setHeadName] = useState(admins.find((a) => a.isHead)?.name || "");
  const [editingHead, setEditingHead] = useState(false);
  const head = admins.find((a) => a.isHead);

  const togglePerm = (p: string) => {
    setForm({ ...form, permissions: form.permissions.includes(p) ? form.permissions.filter((x) => x !== p) : [...form.permissions, p] });
  };

  const submit = () => {
    if (!form.email || !form.password) return alert("أكمل البيانات");
    if (admins.some((a) => a.email === form.email.trim())) return alert("البريد موجود بالفعل");
    addAdmin({ id: Date.now().toString(), name: form.name || form.email, email: form.email.trim(), password: form.password, permissions: form.permissions });
    setForm({ name: "", email: "", password: "", permissions: [] });
  };

  const saveHeadName = () => {
    if (!headName.trim()) return alert("الاسم مطلوب");
    updateHeadName(headName.trim());
    setEditingHead(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#0F2A5C] rounded-3xl p-6 text-white">
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <Crown className="w-6 h-6 text-[#FFD600]" /> إدارة الأدمنز — هيد الفرع فقط
        </h2>
        <p className="text-sm text-white/70 mt-1">أضف أدمن جديد وحدد صلاحياته. أي تعديل يسمع لحظياً في السجل عند الهيد وكل مصرح له.</p>
      </div>

      {/* Head info + editable name */}
      <div className="bg-white rounded-3xl border p-6">
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <div className="font-extrabold text-[#0F2A5C] flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#FFD600]" /> هيد الفرع الحالي
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">الاسم:</span> <span className="font-bold">{head?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">البريد:</span> <span dir="ltr" className="font-mono text-sm">{head?.email}</span> <Badge variant="secondary" className="text-[11px]">محمي 🔒</Badge>
              </div>
              <div className="text-xs text-muted-foreground">البريد لا يمكن تعديله — الاسم والصورة فقط قابلين للتعديل من بروفايل الهيد في الهيدر أو من هنا</div>
            </div>
          </div>
          <div className="min-w-[260px] flex-1 max-w-sm">
            {!editingHead ? (
              <Button variant="outline" className="rounded-full" onClick={() => { setHeadName(head?.name || ""); setEditingHead(true); }}>
                <Pencil className="w-4 h-4 ml-2" /> تعديل اسم الهيد
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>اسم هيد الفرع الجديد</Label>
                <div className="flex gap-2">
                  <Input value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="اسم الهيد" className="rounded-full" />
                  <Button onClick={saveHeadName} className="rounded-full bg-[#0F2A5C] text-white px-6">
                    <Save className="w-4 h-4 ml-1" /> حفظ
                  </Button>
                  <Button variant="ghost" className="rounded-full" onClick={() => setEditingHead(false)}>
                    إلغاء
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">يحفظ لحظياً ويسمع في السجل والإشعارات</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-4">
        <h3 className="font-bold text-[#0F2A5C]">إضافة أدمن جديد</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>الاسم</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="أحمد" className="rounded-xl mt-1" />
          </div>
          <div>
            <Label>البريد *</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@rtc.com" className="rounded-xl mt-1" dir="ltr" />
          </div>
          <div>
            <Label>كلمة المرور *</Label>
            <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••" className="rounded-xl mt-1" dir="ltr" />
          </div>
        </div>
        <div>
          <Label>الصلاحيات (اختر ما تريد منحه)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {perms.map((p) => (
              <label key={p} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm cursor-pointer border ${form.permissions.includes(p) ? "bg-[#0F2A5C] text-white border-[#0F2A5C]" : "bg-muted hover:bg-muted/80"}`}>
                <Checkbox checked={form.permissions.includes(p)} onCheckedChange={() => togglePerm(p)} /> {p}
              </label>
            ))}
          </div>
        </div>
        <Button onClick={submit} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold h-11">
          إضافة الأدمن + تفعيل دخوله فوراً
        </Button>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-3">
        <h3 className="font-bold text-[#0F2A5C]">الأدمنز الحاليون</h3>
        {admins.map((a) => (
          <div key={a.id} className="flex flex-wrap justify-between items-center bg-muted rounded-2xl p-4 gap-2">
            <div>
              <div className="font-bold flex items-center gap-2">
                {a.name} {a.isHead && <Badge className="bg-[#0F2A5C]">هيد الفرع 👑</Badge>}
              </div>
              <div className="text-xs text-muted-foreground" dir="ltr">
                {a.email}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {a.permissions.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[11px]">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            {!a.isHead && (
              <Button variant="destructive" className="rounded-full" onClick={() => { if (confirm(`حذف ${a.name} نهائياً؟`)) removeAdmin(a.id); }}>
                حذف
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
        <strong>ملاحظة مهمة:</strong> أي كورس أو فئة أو حظر أو تقييم يضيفه أي مدير يسجّل في <strong>السجل اللحظي</strong> ويظهر فوراً عند الهيد وكل أدمن له الصلاحية، مع إشعار — الحفظ في نفس الثانية بلا تأخير.
      </div>
    </div>
  );
}
