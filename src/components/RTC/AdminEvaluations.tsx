import { useState } from "react";
import { useRTC } from "@/store/RTCStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const criteria = ["الثقة","التحدث","الانتباه","الالتزام","النشاط"];

export default function AdminEvaluations(){
  const { evaluations, addEvaluation, volunteerRequests } = useRTC();
  const [form, setForm] = useState({ volunteerName:"", team:"HR" as any, scores: {الثقة:5, التحدث:5, الانتباه:5, الالتزام:5, النشاط:5} as Record<string,number>, comment:"", evaluator:"هيد الفرع" });
  const [search, setSearch] = useState("");

  const filtered = evaluations.filter(e=> e.volunteerName.includes(search));

  const submit = ()=>{
    if(!form.volunteerName) return alert("اختر متطوع");
    addEvaluation({ id: Date.now().toString(), volunteerName: form.volunteerName, team: form.team, scores: form.scores, comment: form.comment, date: new Date().toLocaleString("ar-EG"), evaluator: form.evaluator });
    setForm({...form, volunteerName:"", comment:""});
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border p-6">
        <h2 className="text-xl font-extrabold text-[#0F2A5C]">تقييم المتطوعين</h2>
        <p className="text-sm text-muted-foreground">قيّم كل متطوع من 10 في 5 معايير + تعليق</p>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-4">
        <h3 className="font-bold text-[#0F2A5C]">تقييم جديد</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>ابحث واختر متطوع</Label>
            <Input list="vols" value={form.volunteerName} onChange={e=>setForm({...form, volunteerName:e.target.value})} placeholder="اكتب اسم المتطوع" className="rounded-xl mt-1"/>
            <datalist id="vols">{volunteerRequests.map(v=> <option key={v.id} value={v.name}/>)}</datalist>
          </div>
          <div>
            <Label>الفريق</Label>
            <Select value={form.team} onValueChange={v=>setForm({...form, team:v as any})}><SelectTrigger className="rounded-xl mt-1"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="HR">HR</SelectItem><SelectItem value="PR">PR</SelectItem><SelectItem value="تنظيم">تنظيم</SelectItem><SelectItem value="ميديا">ميديا</SelectItem><SelectItem value="BR">BR</SelectItem></SelectContent></Select>
          </div>
        </div>
        {criteria.map(c=> (
          <div key={c} className="space-y-1">
            <div className="flex justify-between text-sm"><Label>{c}</Label><span className="font-bold text-[#0F2A5C]">{form.scores[c]}/10</span></div>
            <Slider value={[form.scores[c]]} min={1} max={10} step={1} onValueChange={v=>setForm({...form, scores:{...form.scores,[c]:v[0]}})} />
          </div>
        ))}
        <div><Label>تعليقات</Label><Textarea value={form.comment} onChange={e=>setForm({...form, comment:e.target.value})} placeholder="اكتب ملاحظاتك..." className="rounded-xl mt-1"/></div>
        <Button onClick={submit} className="w-full rounded-full bg-[#FFD600] text-[#0F2A5C] font-bold h-11">حفظ التقييم</Button>
      </div>

      <div className="bg-white rounded-3xl border p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[#0F2A5C]">سجل التقييمات</h3>
          <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث باسم" className="w-40 rounded-full"/>
        </div>
        {filtered.length===0 && <p className="text-center text-muted-foreground py-6">لا يوجد تقييمات</p>}
        {filtered.map(e=> (
          <div key={e.id} className="bg-muted rounded-2xl p-4">
            <div className="flex justify-between"><span className="font-bold">{e.volunteerName} — {e.team}</span><span className="text-xs text-muted-foreground">{e.date}</span></div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(e.scores).map(([k,v])=> <span key={k} className="bg-white rounded-full px-3 py-1 text-xs font-bold border">{k}: {v}/10</span>)}
            </div>
            {e.comment && <div className="text-sm mt-2 bg-white rounded-xl p-2 border">{e.comment}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
