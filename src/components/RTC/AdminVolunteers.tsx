import { useState } from "react";
import { useRTC, Team } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Ban } from "lucide-react";

export default function AdminVolunteers() {
  const { volunteerRequests, updateVolunteerStatus, volunteerQuestions, setVolunteerQuestions, exportCSV, toggleBlock } = useRTC();
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("الكل");
  const [newQ, setNewQ] = useState("");
  const [replyMap, setReplyMap] = useState<Record<string,string>>({});
  const [blockMap, setBlockMap] = useState<Record<string,{reason:string, until:string}>>({});

  const filtered = volunteerRequests.filter(v=>
    (teamFilter==="الكل" || v.team===teamFilter) &&
    (v.name.includes(search) || v.team.includes(search) || v.phone.includes(search))
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6 space-y-4">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">إدارة المتطوعين والطلبات</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث بالاسم أو الفريق أو الهاتف" className="pr-10 rounded-full"/>
          </div>
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-36 rounded-full"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="الكل">كل الفرق</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="PR">PR</SelectItem>
              <SelectItem value="تنظيم">تنظيم</SelectItem>
              <SelectItem value="ميديا">ميديا</SelectItem>
              <SelectItem value="BR">BR</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-full" onClick={()=>exportCSV("volunteers")}><Download className="w-4 h-4 ml-2"/>تصدير Excel</Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border p-6">
        <h3 className="font-bold text-[#0F2A5C] mb-3">أسئلة فورم التطوع (يحددها الأدمن)</h3>
        <div className="flex gap-2 mb-3">
          <Input value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="سؤال جديد..." className="rounded-full"/>
          <Button onClick={()=>{ if(!newQ) return; setVolunteerQuestions([...volunteerQuestions, newQ]); setNewQ(""); }} className="rounded-full bg-[#0F2A5C] text-white">إضافة</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {volunteerQuestions.map((q,i)=> (
            <span key={i} className="bg-muted rounded-full px-4 py-2 text-sm flex items-center gap-2">{q}
              <button onClick={()=>setVolunteerQuestions(volunteerQuestions.filter((_,idx)=>idx!==i))} className="text-red-500 font-bold">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length===0 && <div className="bg-white rounded-3xl border p-10 text-center text-muted-foreground">لا يوجد طلبات</div>}
        {filtered.map(v=> (
          <div key={v.id} className="bg-white rounded-3xl border p-5 space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="font-bold text-[#0F2A5C]">{v.name} — <Badge className="bg-[#FFD600] text-[#0F2A5C]">{v.team}</Badge></div>
                <div className="text-xs text-muted-foreground">{v.phone} • {v.email} • {v.date}</div>
              </div>
              <Badge className={`${v.status==="مقبول"?"bg-emerald-500":v.status==="مرفوض"?"bg-red-500":v.status==="مقابلة"?"bg-blue-500":"bg-amber-400"} text-white`}>{v.status}</Badge>
            </div>
            <div className="bg-muted rounded-2xl p-3 space-y-1 text-sm">
              {Object.entries(v.answers).map(([q,a])=> <div key={q}><span className="font-bold">س: {q}</span><br/><span className="text-muted-foreground">ج: {a || "—"}</span></div>)}
            </div>
            {v.reply && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">رد سابق: {v.reply}</div>}
            <div className="flex flex-wrap gap-2">
              <Select value={replyMap[v.id] ? undefined : v.status} onValueChange={val=>updateVolunteerStatus(v.id, val as any, replyMap[v.id])}>
                <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder="تحديث الحالة"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                  <SelectItem value="مقابلة">مقابلة</SelectItem>
                  <SelectItem value="مقبول">مقبول</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="رسالة رد للمتطوع" value={replyMap[v.id]||""} onChange={e=>setReplyMap({...replyMap,[v.id]:e.target.value})} className="flex-1 min-w-[180px] rounded-full"/>
              <Button onClick={()=>{ updateVolunteerStatus(v.id, v.status, replyMap[v.id]); setReplyMap({...replyMap,[v.id]:""}); }} className="rounded-full bg-[#0F2A5C] text-white">إرسال رد</Button>
            </div>
            <div className="flex gap-2 items-center pt-2 border-t">
              <Ban className="w-4 h-4 text-red-500"/>
              <Input placeholder="سبب البلوك" value={blockMap[v.id]?.reason||""} onChange={e=>setBlockMap({...blockMap,[v.id]:{...blockMap[v.id],reason:e.target.value, until:blockMap[v.id]?.until||""}})} className="rounded-full text-sm"/>
              <Input type="date" value={blockMap[v.id]?.until||""} onChange={e=>setBlockMap({...blockMap,[v.id]:{...blockMap[v.id], until:e.target.value, reason:blockMap[v.id]?.reason||""}})} className="rounded-full w-40"/>
              <Button variant="destructive" className="rounded-full" onClick={()=>{ const b=blockMap[v.id]; if(!b?.until) return alert("حدد مدة البلوك"); toggleBlock({userId:v.email, reason:b.reason||"مخالفة", until:b.until, active:true}); alert("تم حظر "+v.name); }}>حظر</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
