import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import AdminNavbar from "@/components/RTC/AdminNavbar";
import AdminLogin from "@/components/RTC/AdminLogin";
import AdminDashboard from "@/components/RTC/AdminDashboard";
import AdminCourses from "@/components/RTC/AdminCourses";
import AdminVolunteers from "@/components/RTC/AdminVolunteers";
import AdminEvaluations from "@/components/RTC/AdminEvaluations";
import AdminMeetings from "@/components/RTC/AdminMeetings";
import AdminActivities from "@/components/RTC/AdminActivities";
import AdminSuggestions from "@/components/RTC/AdminSuggestions";
import AdminAdmins from "@/components/RTC/AdminAdmins";
import { ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const { adminSession, logoutAdmin, hasPermission } = useRTC();
  const [active, setActive] = useState("dashboard");

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-[#F0F2F8]" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-[#0F2A5C]"><span className="w-8 h-8 rounded-lg bg-[#0F2A5C] text-[#FFD600] grid place-items-center text-sm">RTC</span> بوابة الإدارة</div>
          <a href="/" className="text-sm text-muted-foreground hover:text-[#0F2A5C] underline">← العودة لموقع المستخدمين</a>
        </div>
        <AdminLogin onSuccess={() => setActive("dashboard")} />
      </div>
    );
  }

  const render = () => {
    switch (active) {
      case "dashboard": return <AdminDashboard />;
      case "courses-mgmt": return hasPermission("الكورسات") ? <AdminCourses /> : <NoPerm label="الكورسات" />;
      case "volunteers": return hasPermission("المتطوعون") ? <AdminVolunteers /> : <NoPerm label="المتطوعون" />;
      case "evaluations": return hasPermission("التقييم") ? <AdminEvaluations /> : <NoPerm label="التقييم" />;
      case "meetings": return hasPermission("الاجتماعات") ? <AdminMeetings /> : <NoPerm label="الاجتماعات" />;
      case "activities-mgmt": return hasPermission("الفعاليات") ? <AdminActivities /> : <NoPerm label="الفعاليات" />;
      case "suggestions-mgmt": return hasPermission("الشكاوى") ? <AdminSuggestions /> : <NoPerm label="الشكاوى" />;
      case "admins": return hasPermission("الأدمنز") ? <AdminAdmins /> : <NoPerm label="الأدمنز - هيد الفرع فقط" />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F8]" dir="rtl">
      <AdminNavbar active={active} setActive={setActive} onLogout={() => logoutAdmin()} />
      <main className="max-w-7xl mx-auto px-4 py-6">{render()}</main>
      <div className="text-center text-xs text-muted-foreground py-4">مسجل كـ {adminSession.name} • {adminSession.email} {adminSession.isHead && "• هيد الفرع 👑"}</div>
    </div>
  );
}

function NoPerm({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-[1.7rem] border p-10 text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 grid place-items-center mx-auto"><ShieldAlert className="w-7 h-7" /></div>
      <div className="font-extrabold text-[#0F2A5C]">ليس لديك صلاحية: {label}</div>
      <p className="text-sm text-muted-foreground">تواصل مع هيد الفرع ليمنحك هذه الصلاحية من صفحة الأدمنز.</p>
    </div>
  );
}
