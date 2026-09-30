import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminSuggestions(){
  const { suggestions, replySuggestion, exportCSV } = useRTC();
  const [replies, setReplies] = useState<Record<string,string>>({});
  const [viewImg, setViewImg] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F2A5C]">الشكاوى والاقتراحات — مع الصور (R2)</h2>
          <p className="text-xs text-muted-foreground mt-1">صور الشكاوى محفوظة على Cloudflare R2 المجاني — حد 2MB للصورة — راقب الاستهلاك</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={()=>exportCSV("suggestions")}><Download className="w-4 h-4 ml-2"/>تصدير Excel</Button>
      </div>
      <div className="space-y-3">
        {suggestions.length===0 && <div className="bg-white rounded-3xl border p-10 text-center text-muted-foreground">لا يوجد شكاوى</div>}
        {suggestions.map(s=> (
          <div key={s.id} className="bg-white rounded-3xl border p-5 space-y-3">
            <div className="flex justify-between gap-2 flex-wrap">
              <div><span className="font-bold">{s.user}</span> — {s.phone} <Badge className={`${s.type==="شكوى"?"bg-red-500":"bg-emerald-500"} mr-2`}>{s.type}</Badge> <Badge variant="outline" className="text-[11px]">{s.status}</Badge></div>
              <span className="text-xs text-muted-foreground">{s.date}</span>
            </div>
            <div className="text-sm text-muted-foreground">السبب: {s.reason || "—"}</div>
            <div className="bg-muted rounded-xl p-3 text-sm">{s.text}</div>
            {s.image ? (
              <div className="bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0F2A5C] mb-2"><ImageIcon className="w-4 h-4" /> صورة مرفقة (R2 - Cloudflare)</div>
                <img src={s.image} alt="مرفق الشكوى" className="rounded-xl w-full max-h-72 object-cover border cursor-zoom-in" onClick={()=>setViewImg(s.image!)} />
                <button onClick={()=>setViewImg(s.image!)} className="mt-2 text-xs bg-white border rounded-full px-3 py-1 flex items-center gap-1 hover:bg-muted"><ExternalLink className="w-3 h-3"/> فتح بالحجم الكامل</button>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground bg-muted rounded-xl p-2">بدون مرفق صورة</div>
            )}
            {s.reply ? <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">ردك: {s.reply} {s.repliedBy && <span className="text-xs text-muted-foreground">— {s.repliedBy}</span>}</div> : (
              <div className="flex gap-2">
                <Input value={replies[s.id]||""} onChange={e=>setReplies({...replies,[s.id]:e.target.value})} placeholder="اكتب ردك وسيصل إشعار للمستخدم" className="rounded-full"/>
                <Button onClick={()=>{ if(!replies[s.id]) return; replySuggestion(s.id, replies[s.id]); setReplies({...replies,[s.id]:""}); }} className="rounded-full bg-[#0F2A5C] text-white">رد + إشعار</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!viewImg} onOpenChange={()=>setViewImg(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle className="text-right">صورة الشكوى — R2</DialogTitle></DialogHeader>
          {viewImg && <img src={viewImg} alt="صورة كاملة" className="w-full rounded-2xl object-contain max-h-[70vh]" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
