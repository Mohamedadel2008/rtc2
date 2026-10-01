import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Heart, Users, Award, Sparkles, Download } from "lucide-react";

export default function HomeSection({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0F2A5C] text-white p-8 md:p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, #FFD600 2px, transparent 2px)`, backgroundSize: "30px 30px" }} />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-[#FFD600]/20 rounded-full blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-[#FFD600]" /> مراكز رسالة للتدريب
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              علّم <span className="text-[#FFD600]">ينتفع</span> به
            </h1>
            <p className="text-white/80 leading-relaxed text-lg">
              منصة RTC تجمع بين التدريب المجاني والتطوع الهادف. كورسات بشهادات، فعاليات خيرية، ومجتمع شبابي يصنع الأثر. نظام واحد لكل الفروع.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setActive("courses")} className="rounded-full bg-[#FFD600] text-[#0F2A5C] hover:bg-[#FFD600]/90 font-extrabold px-8 h-12 text-base">
                استكشف الكورسات <ArrowLeft className="mr-2 w-5 h-5" />
              </Button>
              <Button onClick={() => setActive("volunteer")} variant="outline" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#0F2A5C] h-12 px-8 font-bold">
                تطوع معنا <Heart className="mr-2 w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-6 pt-2">
              <div className="text-center"><div className="text-2xl font-extrabold text-[#FFD600]">+500</div><div className="text-xs text-white/70">متطوع</div></div>
              <div className="text-center"><div className="text-2xl font-extrabold text-[#FFD600]">+120</div><div className="text-xs text-white/70">كورس سنوياً</div></div>
              <div className="text-center"><div className="text-2xl font-extrabold text-[#FFD600]">5</div><div className="text-xs text-white/70">فروع + أونلاين</div></div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700" alt="volunteers" className="rounded-[1.7rem] w-full h-[380px] object-cover shadow-2xl border-4 border-white/20" />
            <div className="absolute -bottom-4 -right-4 bg-white text-[#0F2A5C] rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFD600] grid place-items-center"><GraduationCap className="w-7 h-7" /></div>
              <div><div className="font-extrabold">كورسات مجانية</div><div className="text-xs text-muted-foreground">بشهادات معتمدة</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: GraduationCap, title: "كورسات متنوعة", desc: "لغات، كمبيوتر، إدارة، ميديا وتنمية بشرية مع مدربين محترفين — فلترة حسب الفرع والفئة" },
          { icon: Users, title: "مجتمع تطوعي", desc: "انضم لفريق HR أو PR أو تنظيم أو ميديا واصنع أثر حقيقي — مسار تطوع كامل برابط تفعيل آمن" },
          { icon: Award, title: "شهادات ومتابعة", desc: "تتبع حضورك، تقدمك، وشهاداتك من بروفايلك الشخصي + إشعارات لحظية" },
        ].map(c => (
          <div key={c.title} className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#0F2A5C] text-[#FFD600] grid place-items-center mb-4"><c.icon className="w-6 h-6" /></div>
            <div className="font-extrabold text-lg text-[#0F2A5C]">{c.title}</div>
            <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* APK + Hosting distribution */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#0F2A5C] rounded-[1.7rem] p-6 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg"><Download className="w-6 h-6 text-[#FFD600]" /> حمّل تطبيق RTC</div>
            <p className="text-white/70 text-sm mt-2 leading-relaxed">التطبيق غير منشور على Google Play. حمّل ملف APK مباشرة من موقع RTC وثبّته على هاتفك — كل تحديث بينزل كـ APK جديد.</p>
            <ul className="text-xs text-white/60 mt-3 list-disc mr-5 space-y-1">
              <li>يدعم العربية RTL بالكامل</li>
              <li>إشعارات FCM للتسجيلات والردود</li>
              <li>نفس بيانات الموقع — نظام موحد</li>
            </ul>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault(); alert("سيتم رفع الـ APK عند النشر — حالياً جرّب نسخة الويب 🟡");}} className="mt-5 inline-flex items-center justify-center gap-2 bg-[#FFD600] text-[#0F2A5C] rounded-full py-3 font-extrabold hover:bg-[#FFD600]/90">تحميل APK للأندرويد <Download className="w-5 h-5" /></a>
        </div>
      </div>

      {/* CTA volunteer banner */}
      <div className="bg-gradient-to-r from-[#FFD600] to-[#FFE866] rounded-[1.7rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0F2A5C] text-white grid place-items-center"><Heart className="w-7 h-7" /></div>
          <div>
            <div className="font-extrabold text-xl text-[#0F2A5C]">عايز تكون جزء من رسالة؟</div>
            <div className="text-[#0F2A5C]/70">سجل كمتطوع واختر الفريق اللي يناسب شغفك</div>
          </div>
        </div>
        <Button onClick={() => setActive("volunteer")} className="rounded-full bg-[#0F2A5C] text-white hover:bg-[#0F2A5C]/90 px-8 h-12 font-bold">قدّم الآن</Button>
      </div>
    </div>
  );
}
