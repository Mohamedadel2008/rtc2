import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const perms = ["الكورسات","المتطوعون","التقييم","الاجتماعات","الفعاليات","الشكاوى","الأدمنز","كل الصلاحيات"];

export default function AdminAdmins(){
  const { admins, addAdmin, removeAdmin } = useRTC();
  const [form, setForm] = useState({ name:"", email:"", password:"", permissions: [] as string[] });

  const togglePerm = (p:string)=>{
    setForm({...form, permissions: form.permissions.includes(p) ? form.permissions.filter(x=>x!==p) : [...form.permissions, p]});
  };

  const submit = ()=>{
    if(!form.email || !form.password) return alert("أكمل البيانات");
    addAdmin({ id: Date.now().toString(), name: form.name || form.email, email: form.email, password: form.password, permissions: form.permissions });
    setForm({name:"", email:"", password:"", permissions:[]});
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">إدارة الأدمنز — هيد الفرع فقط</h2>
        <p className="text-sm text-muted-foreground">أضف أدمن جديد ببريد وكلمة مرور وحدد صلاحياته. يمكنه تسجيل الدخول فوراً كأدمن.</p>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-4">
        <h3 className="font-bold text-[#0F2A5C]">إضافة أدمن</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div><Label>الاسم</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="أحمد" className="rounded-xl mt-1"/></div>
          <div><Label>البريد *</Label><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="admin@rtc.com" className="rounded-xl mt-1" dir="ltr"/></div>
          <div><Label>كلمة المرور *</Label><Input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••" className="rounded-xl mt-1" dir="ltr"/></div>
        </div>
        <div>
          <Label>الصلاحيات</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {perms.map(p=> (
              <label key={p} className="flex items-center gap-2 bg-muted rounded-full px-3 py-2 text-sm cursor-pointer">
                <Checkbox checked={form.permissions.includes(p)} onCheckedChange={()=>togglePerm(p)} /> {p}
              </label>
            ))}
          </div>
        </div>
        <Button onClick={submit} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold h-11">إضافة الأدمن</Button>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-3">
        <h3 className="font-bold text-[#0F2A5C]">الأدمنز الحاليون</h3>
        {admins.map(a=> (
          <div key={a.id} className="flex flex-wrap justify-between items-center bg-muted rounded-2xl p-4 gap-2">
            <div>
              <div className="font-bold">{a.name} {a.isHead && <Badge className="bg-[#0F2A5C] mr-2">هيد الفرع</Badge>}</div>
              <div className="text-xs text-muted-foreground">{a.email}</div>
              <div className="flex flex-wrap gap-1 mt-1">{a.permissions.map(p=> <Badge key={p} variant="secondary" className="text-[11px]">{p}</Badge>)}</div>
            </div>
            {!a.isHead && <Button variant="destructive" className="rounded-full" onClick={()=>removeAdmin(a.id)}>حذف / بلوك</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
