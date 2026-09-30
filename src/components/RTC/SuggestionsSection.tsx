import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MessageCircle, Image as ImageIcon, X } from "lucide-react";

export default function SuggestionsSection() {
  const { addSuggestion, suggestions, currentUser } = useRTC();
  const [form, setForm] = useState({ type: "اقتراح" as "شكوى" | "اقتراح", text: "", reason: "", phone: "" });
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return alert("حجم الصورة كبير — الحد الأقصى 2MB ضمن الخطة المجانية (R2)");
    if (!f.type.startsWith("image/")) return alert("اختر صورة فقط");
    const r = new FileReader();
    r.onload = () => {
      setImage(r.result as string);
      setImageName(f.name);
    };
    r.readAsDataURL(f);
  };

  const submit = () => {
    if (!form.text || !form.phone) return alert("أكمل البيانات");
    addSuggestion({
      id: Date.now().toString(),
      user: currentUser?.name || "مستخدم",
      phone: form.phone,
      type: form.type,
      text: form.text,
      reason: form.reason,
      image: image || undefined,
      date: new Date().toLocaleString("ar-EG"),
      status: "جديد",
    });
    setForm({ type: "اقتراح", text: "", reason: "", phone: "" });
    setImage(null);
    setImageName("");
    alert("تم إرسال رسالتك، سيرد الأدمن قريباً وستصلك إشعار ✅");
  };

  const mySugs = suggestions.filter(s => s.user === currentUser?.name);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="bg-white rounded-[1.7rem] border p-6">
        <h2 className="text-2xl font-extrabold text-[#0F2A5C] flex items-center gap-2"><MessageCircle className="w-6 h-6" /> شكاوى واقتراحات</h2>
        <p className="text-muted-foreground text-sm mt-1">رأيك يهمنا - اكتب مشكلتك أو اقتراحك وسنرد عليك. يمكنك إرفاق صورة (حد 2MB - تخزين R2 المجاني)</p>
      </div>

      <div className="bg-white rounded-[2rem] border p-6 md:p-8 space-y-4">
        <div>
          <Label>النوع</Label>
          <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any })}>
            <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="اقتراح">اقتراح</SelectItem><SelectItem value="شكوى">شكوى</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label>رقم الهاتف *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" className="rounded-xl mt-1" dir="ltr" /></div>
        <div><Label>السبب / الموضوع</Label><Input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="مثال: مشكلة في التسجيل" className="rounded-xl mt-1" /></div>
        <div><Label>التفاصيل *</Label><Textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="اكتب تفاصيل الشكوى أو الاقتراح..." className="rounded-xl mt-1" rows={4} /></div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> إرفاق صورة (اختياري - حد 2MB - R2)</Label>
          <Input type="file" accept="image/*" onChange={handleImage} className="rounded-xl" />
          {image && (
            <div className="relative bg-muted rounded-2xl p-3 flex gap-3 items-center">
              <img src={image} alt="preview" className="w-20 h-20 rounded-xl object-cover border" />
              <div className="flex-1">
                <div className="text-sm font-bold">{imageName}</div>
                <div className="text-xs text-muted-foreground">سيتم رفعها على R2 ضمن الحدود المجانية</div>
              </div>
              <button onClick={() => { setImage(null); setImageName(""); }} className="bg-white rounded-full p-2 hover:bg-red-50"><X className="w-4 h-4 text-red-500" /></button>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">الخطة المجانية: 10GB تخزين R2 — سيتم إيقاف الرفع مؤقتاً عند اقتراب الحد</p>
        </div>

        <Button onClick={submit} className="w-full rounded-full bg-[#0F2A5C] text-white font-bold h-11">إرسال <Send className="mr-2 w-4 h-4" /></Button>
      </div>

      {mySugs.length > 0 && (
        <div className="bg-white rounded-[1.7rem] border p-6 space-y-3">
          <h3 className="font-bold text-[#0F2A5C]">رسائلي السابقة</h3>
          {mySugs.map(s => (
            <div key={s.id} className="bg-muted rounded-2xl p-4">
              <div className="flex justify-between text-sm"><span className="font-bold">{s.type}: {s.reason || "بدون عنوان"}</span><span className="text-xs text-muted-foreground">{s.date}</span></div>
              <div className="text-sm mt-1">{s.text}</div>
              {s.image && <img src={s.image} alt="مرفق" className="mt-3 rounded-xl w-full max-h-64 object-cover border" />}
              {s.reply ? <div className="mt-2 bg-white border rounded-xl p-3 text-sm">رد الإدارة: {s.reply}</div> : <div className="text-xs text-amber-600 mt-2">قيد المراجعة — ستصلك إشعار عند الرد</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
