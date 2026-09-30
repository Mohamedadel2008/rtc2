import { useState } from "react";
import Navbar from "@/components/RTC/Navbar";
import HomeSection from "@/components/RTC/HomeSection";
import AboutSection from "@/components/RTC/AboutSection";
import CoursesSection from "@/components/RTC/CoursesSection";
import ProfileSection from "@/components/RTC/ProfileSection";
import VolunteerSection from "@/components/RTC/VolunteerSection";
import ActivitiesSection from "@/components/RTC/ActivitiesSection";
import SuggestionsSection from "@/components/RTC/SuggestionsSection";
import AdminDashboard from "@/components/RTC/AdminDashboard";
import AdminCourses from "@/components/RTC/AdminCourses";
import AdminVolunteers from "@/components/RTC/AdminVolunteers";
import AdminEvaluations from "@/components/RTC/AdminEvaluations";
import AdminMeetings from "@/components/RTC/AdminMeetings";
import AdminActivities from "@/components/RTC/AdminActivities";
import AdminSuggestions from "@/components/RTC/AdminSuggestions";
import AdminAdmins from "@/components/RTC/AdminAdmins";

export default function Index() {
  const [active, setActive] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);

  const renderUser = () => {
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

  const renderAdmin = () => {
    switch (active) {
      case "dashboard": return <AdminDashboard />;
      case "courses-mgmt": return <AdminCourses />;
      case "volunteers": return <AdminVolunteers />;
      case "evaluations": return <AdminEvaluations />;
      case "meetings": return <AdminMeetings />;
      case "activities-mgmt": return <AdminActivities />;
      case "suggestions-mgmt": return <AdminSuggestions />;
      case "admins": return <AdminAdmins />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB]" dir="rtl">
      <Navbar active={active} setActive={setActive} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {isAdmin ? renderAdmin() : renderUser()}
      </main>
      <footer className="mt-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo-main.jpeg" alt="RTC" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-[#0F2A5C]">RTC - مراكز رسالة للتدريب</span>
            <span>• علم ينتفع به • مبني بحب للتطوع</span>
          </div>
          <span>© 2024 RTC Resala Training Center — جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  );
}
