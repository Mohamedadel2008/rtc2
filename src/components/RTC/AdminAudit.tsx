import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Download, Eye, Activity, Search } from "lucide-react";

export default function AdminAudit() {
  const { auditLogs, exportCSV, adminSession } = useRTC();
  const [q, setQ] = useState("");
  const filtered = auditLogs.filter(l =>
    !q || l.action.includes(q) || l.actor.includes(q) || l.detail.includes(q) || l.target.includes(q)
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#0F2A5C] rounded-3xl p-6 text-white flex flex-wrap justify-between gap-4 items-center">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2"><Eye className="w-6 h-6 text-[#FFD600]" /> سجل المراقبة — كل حركة لحظياً</h2>
          <p className="text-white/70 text-sm mt-1">أي كورس، حظر، تقييم، اجتماع أو شكوى يضاف/يتعدل يسمع هنا في نفس الثانية عند الهيد وكل مصرح له</p>
          <p className="text-[#FFD600] text-xs mt-2 font-bold">هيد الفرع الحالي: {adminSession?.isHead ? adminSession.name : "—"} • {adminSession?.email}</p>
        </div>
        <Button variant="outline" className="rounded-full bg-white text-[#0F2A5C] font-bold" onClick={() => exportCSV("audit")}><Download className="w-4 h-4 ml-2" />تصدير Excel للسجل</Button>
      </div>

      <div className="bg-white rounded-3xl border p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث: اسم المدير، نوع العملية، الفئة..." className="pr-10 rounded-full" />
        </div>
        <Badge className="bg-emerald-500 px-3 py-1 text-xs">{filtered.length} سجل</Badge>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2 font-bold text-[#0F2A5C]"><Activity className="w-5 h-5" /> كل التحركات (الأحدث أولاً)</div>
        <div className="max-h-[60vh] overflow-auto divide-y">
          {filtered.length === 0 && <div className="p-10 text-center text-muted-foreground">لا يوجد سجلات بعد — جرّب تنشئ كورس أو تعدل واحد وشوفه يظهر لحظياً هنا</div>}
          {filtered.map(log => (
            <div key={log.id} className="p-4 flex gap-3 hover:bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-[#0F2A5C] text-white grid place-items-center font-bold shrink-0 text-sm">{log.actor[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-bold text-[#0F2A5C] text-sm">{log.action}</span>
                  <Badge variant="secondary" className="text-[11px]">{log.target}</Badge>
                  <span className="text-xs text-muted-foreground">{log.date}</span>
                </div>
                <div className="text-sm text-muted-foreground truncate">{log.detail}</div>
                <div className="text-[11px] text-muted-foreground">بواسطة: {log.actor} • {log.actorEmail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFD600]/20 border border-[#FFD600]/40 rounded-2xl p-4 text-sm text-[#0F2A5C]">
        <strong>ملاحظة:</strong> السجل محفوظ محلياً (localStorage) ويتحدث في نفس اللحظة عند الهيد وكل أدمن له الصلاحية. عند حذف كورس/فئة أو تعديله يظهر فوراً هنا ويصل إشعار للإدارة.
      </div>
    </div>
  );
}
