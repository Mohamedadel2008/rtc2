import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

export default function AdminSuggestions(){
  const { suggestions, replySuggestion, exportCSV } = useRTC();
  const [replies, setReplies] = useState<Record<string,string>>({});

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6 flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">الشكاوى والاقتراحات</h2>
        <Button variant="outline" className="rounded-full" onClick={()=>exportCSV("suggestions")}><Download className="w-4 h-4 ml-2"/>تصدير Excel</Button>
      </div>
      <div className="space-y-3">
        {suggestions.length===0 && <div className="bg-white rounded-3xl border p-10 text-center text-muted-foreground">لا يوجد شكاوى</div>}
        {suggestions.map(s=> (
          <div key={s.id} className="bg-white rounded-3xl border p-5 space-y-3">
            <div className="flex justify-between gap-2">
              <div><span className="font-bold">{s.user}</span> — {s.phone} <Badge className={`${s.type==="شكوى"?"bg-red-500":"bg-emerald-500"} mr-2`}>{s.type}</Badge></div>
              <span className="text-xs text-muted-foreground">{s.date}</span>
            </div>
            <div className="text-sm text-muted-foreground">السبب: {s.reason || "—"}</div>
            <div className="bg-muted rounded-xl p-3 text-sm">{s.text}</div>
            {s.reply ? <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">ردك: {s.reply}</div> : (
              <div className="flex gap-2">
                <Input value={replies[s.id]||""} onChange={e=>setReplies({...replies,[s.id]:e.target.value})} placeholder="اكتب ردك وسيصل إشعار للمستخدم" className="rounded-full"/>
                <Button onClick={()=>{ if(!replies[s.id]) return; replySuggestion(s.id, replies[s.id]); setReplies({...replies,[s.id]:""}); }} className="rounded-full bg-[#0F2A5C] text-white">رد + إشعار</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
