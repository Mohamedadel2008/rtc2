import { useState } from "react";
import UserNavbar from "@/components/RTC/UserNavbar";
import HomeSection from "@/components/RTC/HomeSection";
import AboutSection from "@/components/RTC/AboutSection";
import CoursesSection from "@/components/RTC/CoursesSection";
import ProfileSection from "@/components/RTC/ProfileSection";
import VolunteerSection from "@/components/RTC/VolunteerSection";
import ActivitiesSection from "@/components/RTC/ActivitiesSection";
import SuggestionsSection from "@/components/RTC/SuggestionsSection";
import MamMark from "@/components/RTC/MamMark";

export default function Index() {
  const [active, setActive] = useState("home");

  const render = () => {
    switch (active) {
      case "home": return <HomeSection setActive={setActive} />;
      case "about": return <AboutSection />;
      case "courses": return <CoursesSection />;
      case "activities": return <ActivitiesSection />;
      case "volunteer": return <VolunteerSection />;
      case "suggestions": return <SuggestionsSection />;
      case "profile": return <ProfileSection />;
      default: return <HomeSection setActive={setActive} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB]" dir="rtl">
      <UserNavbar active={active} setActive={setActive} />
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {render()}
        <MamMark />
      </main>
      <footer className="mt-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src="/logo-main.jpeg" alt="RTC" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-[#0F2A5C]">RTC - مراكز رسالة للتدريب</span>
              <span>• علم ينتفع به • مبني بحب للتطوع</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="/admin" className="text-xs border rounded-full px-3 py-1 hover:bg-muted">دخول الإدارة 🔒</a>
              <span className="text-xs">© 2024 RTC Resala Training Center</span>
            </div>
          </div>
          <MamMark compact />
        </div>
      </footer>
    </div>
  );
}
