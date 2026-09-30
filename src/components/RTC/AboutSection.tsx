export default function AboutSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] border p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo-main.jpeg" alt="RTC" className="w-12 h-12 rounded-xl object-cover" />
          <h2 className="text-2xl font-extrabold text-[#0F2A5C]">من نحن - مراكز رسالة للتدريب RTC</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          <strong className="text-foreground">RTC - Resala Training Center</strong> هو مشروع تنموي تطوعي تابع لجمعية رسالة للأعمال الخيرية.
          تأسس بهدف تقديم كورسات تنموية مجانية للشباب لتأهيلهم لسوق العمل وتنمية مهاراتهم الشخصية والمهنية.
          جميع الكورسات يقدمها متطوعون متخصصون، والمستفيدون هم شباب من مختلف الأعمار والخلفيات - بشكل مجاني تماماً أو برمز بسيط.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#0F2A5C] text-white rounded-2xl p-6">
            <div className="font-bold text-[#FFD600] mb-2">رسالتنا</div>
            <p className="text-sm text-white/80 leading-relaxed">نشر العلم النافع وتمكين الشباب بالمهارات العملية التي يحتاجها سوق العمل، مع غرس قيم العطاء والتطوع.</p>
          </div>
          <div className="bg-[#FFD600] rounded-2xl p-6">
            <div className="font-bold text-[#0F2A5C] mb-2">رؤيتنا</div>
            <p className="text-sm text-[#0F2A5C]/80 leading-relaxed">أن نكون أكبر منصة تطوعية تعليمية في مصر والعالم العربي - "علم ينتفع به".</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { k: "فرع المهندسين", v: "المقر الرئيسي" },
            { k: "فرع مصر الجديدة", v: "شرق القاهرة" },
            { k: "فرع المعادي", v: "جنوب القاهرة" },
            { k: "فرع الإسكندرية", v: "عاصمة المتوسط" },
          ].map(b => (
            <div key={b.k} className="bg-muted rounded-2xl p-4 text-center">
              <div className="font-bold text-[#0F2A5C]">{b.k}</div>
              <div className="text-xs text-muted-foreground">{b.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { t: "كورسات مجانية", d: "أكثر من 6 مجالات: لغات، كمبيوتر، تنمية بشرية، إدارة، ميديا وسوفت سكيلز" },
          { t: "مدربون متطوعون", d: "نخبة من المتطوعين المحترفين يشاركون علمهم حباً في الخير" },
          { t: "شهادات معتمدة", d: "شهادة حضور لكل كورس مكتمل مع متابعة للحضور والغياب" },
        ].map(x => (
          <div key={x.t} className="bg-white border rounded-3xl p-6">
            <div className="font-extrabold text-[#0F2A5C]">{x.t}</div>
            <div className="text-sm text-muted-foreground mt-1">{x.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
