import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Crown, Eye, EyeOff } from "lucide-react";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { loginAdmin } = useRTC();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const handle = () => {
    setErr("");
    if (!email || !password) { setErr("أدخل البريد وكلمة المرور"); return; }
    const ok = loginAdmin(email.trim(), password.trim());
    if (!ok) setErr("بيانات خاطئة — تأكد من البريد وكلمة المرور الخاصة بحساب الإدارة");
    else onSuccess();
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-10" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[2rem] border shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#0F2A5C] text-[#FFD600] grid place-items-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F2A5C]">دخول الإدارة — RTC</h1>
          <p className="text-sm text-muted-foreground">هذه الصفحة منفصلة تماماً عن حسابات المستخدمين العاديين. الدخول فقط بحساب أنشأه <strong>هيد الفرع</strong> وبالصلاحيات التي حددها.</p>
        </div>

        <div className="bg-[#FFD600]/15 border border-[#FFD600]/40 rounded-2xl p-3 text-xs leading-relaxed text-[#0F2A5C]">
          <div className="font-bold flex items-center gap-1"><Crown className="w-4 h-4"/> حسابات تجريبية للاختبار:</div>
          <div className="mt-1 space-y-1 font-mono text-[11px]" dir="ltr">
            <div>head@rtc.com — هيد الفرع (كل الصلاحيات)</div>
            <div>hr@rtc.com — مسؤول HR (المتطوعون + التقييم فقط)</div>
          </div>
          <div className="mt-2 text-[10px] text-[#0F2A5C]/70">* كلمات المرور مخفية لأسباب أمنية. تواصل مع هيد الفرع للحصول على بيانات الاعتماد.</div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>بريد الإدارة</Label>
            <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="head@rtc.com" className="rounded-xl mt-1" dir="ltr" />
          </div>
          <div>
            <Label>كلمة المرور</Label>
            <div className="relative">
              <Input type={show ? "text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="rounded-xl mt-1 pr-10" dir="ltr" />
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
          </div>
          {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">{err}</div>}
          <Button onClick={handle} className="w-full rounded-full bg-[#0F2A5C] hover:bg-[#0F2A5C]/90 text-white font-bold h-11 text-base">دخول لوحة الإدارة</Button>
          <p className="text-center text-xs text-muted-foreground">لو نسيت بياناتك تواصل مع هيد الفرع — المستخدم العادي لا يملك دخول لهذه الصفحة.</p>
        </div>
      </div>
    </div>
  );
}
