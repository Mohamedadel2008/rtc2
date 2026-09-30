import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, LogOut, Menu, X, ShieldCheck, Crown } from "lucide-react";

export default function AdminNavbar({ active, setActive, onLogout }: { active: string; setActive: (s: string) => void; onLogout: () => void }) {
  const { notifications, markRead, adminSession, hasPermission } = useRTC();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobile, setMobile] = useState(false);

  const adminNotifs = notifications.filter(n => n.for === "admin");
  const unread = adminNotifs.filter(n => !n.read).length;

  const all = [
    { id: "dashboard", label: "لوحة التحكم", perm: null },
    { id: "courses-mgmt", label: "الكورسات", perm: "الكورسات" },
    { id: "volunteers", label: "المتطوعون", perm: "المتطوعون" },
    { id: "evaluations", label: "التقييم", perm: "التقييم" },
    { id: "meetings", label: "الاجتماعات", perm: "الاجتماعات" },
    { id: "activities-mgmt", label: "الفعاليات", perm: "الفعاليات" },
    { id: "suggestions-mgmt", label: "الشكاوى", perm: "الشكاوى" },
    { id: "admins", label: "الأدمنز", perm: "الأدمنز" },
  ];

  const menu = all.filter(m => !m.perm || hasPermission(m.perm));

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0F2A5C] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD600] text-[#0F2A5C] grid place-items-center font-extrabold">RTC</div>
            <div className="leading-tight">
              <div className="font-extrabold flex items-center gap-2">لوحة الإدارة {adminSession?.isHead ? <Crown className="w-4 h-4 text-[#FFD600]"/> : <ShieldCheck className="w-4 h-4 text-emerald-300"/>}</div>
              <div className="text-xs text-white/70">{adminSession?.name} — {adminSession?.isHead ? "هيد الفرع 👑" : "مشرف"}</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {menu.map(m => (
              <button key={m.id} onClick={() => setActive(m.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${active === m.id ? "bg-[#FFD600] text-[#0F2A5C]" : "hover:bg-white/15 text-white"}`}>
                {m.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-full text-white hover:bg-white/15 hover:text-white" onClick={() => setShowNotifs(true)}>
              <Bell className="w-5 h-5" />
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] w-5 h-5 grid place-items-center rounded-full">{unread}</span>}
            </Button>

            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-3 py-1 border border-white/20">
              <div className="text-xs leading-tight">
                <div className="font-bold">{adminSession?.name}</div>
                <div className="text-[11px] text-white/70">{adminSession?.email}</div>
              </div>
              <button onClick={onLogout} className="p-2 hover:bg-white/20 rounded-full"><LogOut className="w-4 h-4" /></button>
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden rounded-full text-white hover:bg-white/15" onClick={() => setMobile(!mobile)}>
              {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobile && (
          <div className="lg:hidden border-t border-white/20 bg-[#0F2A5C] px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {menu.map(m => (
                <button key={m.id} onClick={() => { setActive(m.id); setMobile(false); }} className={`px-4 py-2 rounded-full text-sm font-bold ${active === m.id ? "bg-[#FFD600] text-[#0F2A5C]" : "bg-white/10 text-white"}`}>{m.label}</button>
              ))}
            </div>
            <button onClick={onLogout} className="mt-3 w-full bg-white/10 rounded-full py-2 text-sm font-bold flex items-center justify-center gap-2"><LogOut className="w-4 h-4"/> تسجيل خروج</button>
          </div>
        )}
      </header>

      <Dialog open={showNotifs} onOpenChange={setShowNotifs}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-right">إشعارات الإدارة</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3">
              {adminNotifs.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد إشعارات</p>}
              {adminNotifs.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-2xl border cursor-pointer ${n.read ? "bg-muted/50" : "bg-[#0F2A5C]/5 border-[#0F2A5C]/20"}`}>
                  <div className="font-bold text-sm">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.body}</div>
                  <div className="text-xs text-muted-foreground mt-1">{n.date}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
