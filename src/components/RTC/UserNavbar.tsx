import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, LogOut, Menu, X } from "lucide-react";

export default function UserNavbar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const { notifications, currentUser, setCurrentUser, markRead } = useRTC();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", interests: "" });
  const [mobile, setMobile] = useState(false);

  const userNotifs = notifications.filter(n => n.for === "user");
  const unread = userNotifs.filter(n => !n.read).length;

  const handleAuth = () => {
    if (!form.email || !form.password) return alert("أكمل البريد وكلمة المرور");
    if (authMode === "register" && !form.name) return alert("أدخل اسمك");
    // فقط تسجيل يوزر عادي - لا علاقة له بالأدمن مهما كان الإيميل
    setCurrentUser({ name: form.name || form.email.split("@")[0], email: form.email, interests: form.interests ? [form.interests as any] : [] });
    setShowAuth(false);
    setForm({ name: "", email: "", password: "", interests: "" });
  };

  const menu = [
    { id: "home", label: "الرئيسية" },
    { id: "about", label: "من نحن" },
    { id: "courses", label: "الكورسات" },
    { id: "activities", label: "الفعاليات" },
    { id: "volunteer", label: "تطوع معنا" },
    { id: "suggestions", label: "شكاوى واقتراحات" },
    { id: "profile", label: "البروفايل" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setActive("home")}>
            <img src="/logo-main.jpeg" alt="RTC" className="w-10 h-10 rounded-xl object-cover border shadow-sm" />
            <div className="leading-tight">
              <div className="font-extrabold text-[#0F2A5C] text-lg">RTC</div>
              <div className="text-[11px] text-muted-foreground -mt-1">مراكز رسالة للتدريب</div>
            </div>
            <span className="hidden md:inline-flex ml-2 bg-[#FFD600] text-[#0F2A5C] text-xs font-bold px-3 py-1 rounded-full">علم ينتفع به</span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {menu.map(m => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${active === m.id ? "bg-[#0F2A5C] text-white shadow" : "hover:bg-muted text-foreground"}`}
              >
                {m.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setShowNotifs(true)}>
              <Bell className="w-5 h-5" />
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] w-5 h-5 grid place-items-center rounded-full">{unread}</span>}
            </Button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 bg-muted rounded-full pl-1 pr-3 py-1 border">
                <div className="w-8 h-8 rounded-full bg-[#0F2A5C] text-white grid place-items-center text-sm font-bold">{currentUser.name[0]}</div>
                <div className="text-sm leading-tight">
                  <div className="font-bold text-xs">{currentUser.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">{currentUser.email}</div>
                </div>
                <button onClick={() => setCurrentUser(null)} className="mr-1 p-2 hover:bg-white rounded-full"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <Button onClick={() => setShowAuth(true)} className="rounded-full bg-[#0F2A5C] hover:bg-[#0F2A5C]/90 text-white font-bold px-7 h-10">دخول</Button>
            )}

            <Button variant="outline" size="icon" className="lg:hidden rounded-full" onClick={() => setMobile(!mobile)}>
              {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobile && (
          <div className="lg:hidden border-t bg-white px-4 py-3 flex flex-wrap gap-2">
            {menu.map(m => (
              <button key={m.id} onClick={() => { setActive(m.id); setMobile(false); }} className={`px-4 py-2 rounded-full text-sm font-bold ${active === m.id ? "bg-[#0F2A5C] text-white" : "bg-muted"}`}>{m.label}</button>
            ))}
          </div>
        )}
      </header>

      <Dialog open={showNotifs} onOpenChange={setShowNotifs}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-right">إشعاراتك</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3">
              {userNotifs.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد إشعارات بعد</p>}
              {userNotifs.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-2xl border cursor-pointer ${n.read ? "bg-muted/50" : "bg-[#FFD600]/20 border-[#FFD600]/40"}`}>
                  <div className="font-bold text-sm">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.body}</div>
                  <div className="text-xs text-muted-foreground mt-1">{n.date}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-center text-xl font-extrabold text-[#0F2A5C]">{authMode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#FFD600]/20 border border-[#FFD600]/30 rounded-xl p-3 text-xs text-[#0F2A5C] leading-relaxed">
              هذا تسجيل <strong>المستخدم العادي فقط</strong>. حسابات الإدارة والهيد لها صفحة دخول منفصلة خاصة بها ولا يمكن الدخول بها من هنا.
            </div>
            {authMode === "register" && (
              <div>
                <Label>الاسم الكامل</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="أحمد محمد" className="rounded-xl mt-1" />
              </div>
            )}
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="rounded-xl mt-1" dir="ltr" />
            </div>
            <div>
              <Label>كلمة المرور</Label>
              <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="rounded-xl mt-1" dir="ltr" />
            </div>
            {authMode === "register" && (
              <div>
                <Label>المجال المهتم به (لتصلك إشعارات الكورسات)</Label>
                <Select value={form.interests} onValueChange={v => setForm({ ...form, interests: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="اختر مجالك" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تنمية بشرية">تنمية بشرية</SelectItem>
                    <SelectItem value="لغات">لغات</SelectItem>
                    <SelectItem value="كمبيوتر">كمبيوتر</SelectItem>
                    <SelectItem value="إدارة">إدارة</SelectItem>
                    <SelectItem value="سوفت سكيلز">سوفت سكيلز</SelectItem>
                    <SelectItem value="ميديا">ميديا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleAuth} className="w-full rounded-xl bg-[#0F2A5C] hover:bg-[#0F2A5C]/90 h-11 font-bold text-white">
              {authMode === "login" ? "دخول" : "تسجيل حساب"}
            </Button>

            <button onClick={() => { setCurrentUser({ name: "مستخدم جوجل", email: "google_user@rtc.com", interests: ["سوفت سكيلز"] }); setShowAuth(false); }} className="w-full border rounded-xl py-2.5 flex items-center justify-center gap-2 font-medium hover:bg-muted">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" /> المتابعة بجوجل
            </button>

            <p className="text-center text-sm">
              {authMode === "login" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} className="text-[#0F2A5C] font-bold mr-1 underline">{authMode === "login" ? "سجّل الآن" : "سجّل دخول"}</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
