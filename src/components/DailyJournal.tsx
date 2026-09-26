import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, ChevronRight, Plus, Trash2, Pencil, X, Check, CalendarDays } from "lucide-react";
import { useTaskStore } from "@/contexts/TaskStorageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EditableTitle } from "@/components/EditableTitle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ICONS = ["📋", "💪", "📚", "🏃", "🎯", "✨", "🎨", "💼", "🎵", "🍎", "💧", "🧘"];
const INITIAL_QUESTIONS = { ar: ["ما الشيء الذي تشعر بالامتنان تجاهه اليوم؟", "ما الذي تتطلع لإنجازه اليوم؟"], en: ["What are you grateful for today?", "What are you looking forward to accomplishing today?"] };
const read = <T,>(key: string, fallback: T): T => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } };
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function DailyJournal({ focusedTaskId }: { focusedTaskId?: string }) {
  const { tasks, addTask, deleteTask, updateTaskName, updateTaskIcon, updateTaskImage, updateTask, addColorToTask, removeColorFromTask } = useTaskStore();
  const { language, title, t } = useLanguage();
  const isAr = language === "ar";
  const year = /^\d{4}$/.test(title) ? Number(title) : new Date().getFullYear();
  const today = new Date();
  const [date, setDate] = useState(() => new Date(year, today.getFullYear() === year ? today.getMonth() : 0, today.getFullYear() === year ? today.getDate() : 1));
  const [notes, setNotes] = useState<Record<string, string>>(() => read("journal-notes", {}));
  const [answers, setAnswers] = useState<Record<string, string>>(() => read("journal-answers", {}));
  const [questions, setQuestions] = useState<Record<string, string[]>>(() => read("journal-questions", INITIAL_QUESTIONS));
  const [draftQuestion, setDraftQuestion] = useState("");
  const [newTask, setNewTask] = useState("");
  const [icon, setIcon] = useState("📋");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editImage, setEditImage] = useState<string | undefined>();
  const [taskDialog, setTaskDialog] = useState(false);
  const [colorDialog, setColorDialog] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("#7B9B8B");
  const [activeColor, setActiveColor] = useState("complete");
  const [showQuestions, setShowQuestions] = useState(true);
  const focusedTask = tasks.find(task => task.id === focusedTaskId);
  const visibleTasks = focusedTaskId ? (focusedTask ? [focusedTask] : []) : tasks;
  const day = dateKey(date);
  const calendarKey = `${date.getMonth()}-${date.getDate()}`;
  const journalKey = `${focusedTaskId || "home"}-${day}`;
  const locale = isAr ? "ar" : "en";
  const dayNames = Array.from({ length: new Date(year, date.getMonth() + 1, 0).getDate() }, (_, index) => new Date(year, date.getMonth(), index + 1));
  const activeQuestions = questions[language] || INITIAL_QUESTIONS[language];
  const paletteTask = focusedTask || tasks[0];
  const colors = paletteTask?.customColors || [];
  useEffect(() => { localStorage.setItem("journal-notes", JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem("journal-answers", JSON.stringify(answers)); }, [answers]);
  useEffect(() => { localStorage.setItem("journal-questions", JSON.stringify(questions)); }, [questions]);
  useEffect(() => { if (date.getFullYear() !== year) setDate(new Date(year, date.getMonth(), Math.min(date.getDate(), new Date(year, date.getMonth() + 1, 0).getDate()))); }, [year]);
  const moveMonth = (delta: number) => setDate(new Date(year, Math.max(0, Math.min(11, date.getMonth() + delta)), 1));
  const addNewTask = () => { if (!newTask.trim()) return; addTask(newTask.trim(), icon); setNewTask(""); setIcon("📋"); setTaskDialog(false); };
  const paint = (task: Task, colorId: string | null) => { const data = { ...task.data }; if (colorId) data[calendarKey] = colorId; else delete data[calendarKey]; updateTask(task.id, data); };
  const colorFor = (task: Task) => (task.customColors || []).find(c => c.id === task.data[calendarKey]);
  const openEdit = (task: Task) => { setEditTask(task); setEditName(task.name); setEditIcon(task.icon || "📋"); setEditImage(task.image); };
  const upload = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => setEditImage(typeof reader.result === "string" ? reader.result : undefined); reader.readAsDataURL(file); };
  const addColor = () => { if (!colorName.trim() || !paletteTask) return; addColorToTask(paletteTask.id, colorName.trim(), 0, colorValue); setColorDialog(false); setColorName(""); };
  const removeColor = (id: string) => { if (!paletteTask) return; removeColorFromTask(paletteTask.id, id); const data = { ...paletteTask.data }; Object.keys(data).forEach(key => { if (data[key] === id) delete data[key]; }); updateTask(paletteTask.id, data); if (activeColor === id) setActiveColor("complete"); };
  const label = (ar: string, en: string) => isAr ? ar : en;
  return <div className="min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pb-16">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground"><BookOpen size={21} /></span><div><div className="font-serif text-xl font-semibold">{label("مفكرتي اليومية", "My Daily Journal")}</div><div className="text-xs text-muted-foreground">{label("مساحة لكل يوم", "A page for every day")}</div></div></div>
        <div className="flex items-center gap-3"><span className="text-sm text-muted-foreground">{label("دفتر", "Journal")}</span><EditableTitle /><LanguageSwitcher /></div>
      </header>
      <div className="mt-6 grid gap-7 lg:grid-cols-[210px_minmax(0,1fr)_260px]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-5 flex items-center justify-between"><span className="text-xs font-bold text-muted-foreground">{label("فهرس الصفحات", "PAGE INDEX")}</span><CalendarDays size={16} className="text-primary" /></div>
          <div className="flex items-center justify-between border-b border-border pb-4"><Button variant="ghost" size="icon" onClick={() => moveMonth(isAr ? 1 : -1)} title={label("الشهر السابق", "Previous month")}><ChevronRight size={18} /></Button><strong className="text-sm">{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date)}</strong><Button variant="ghost" size="icon" onClick={() => moveMonth(isAr ? -1 : 1)} title={label("الشهر التالي", "Next month")}><ChevronLeft size={18} /></Button></div>
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible" aria-label={label("أيام الشهر", "Days of the month")}>{dayNames.map(d => <Button key={d.getDate()} variant={date.getDate() === d.getDate() ? "default" : "ghost"} size="sm" className="h-10 min-w-10 shrink-0 px-0" onClick={() => setDate(d)} title={new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(d)}>{new Intl.NumberFormat(locale).format(d.getDate())}</Button>)}</div>
          <div className="mt-6 hidden border-t border-border pt-5 lg:block"><div className="mb-3 text-xs font-bold text-muted-foreground">{label("المهام", "TASKS")}</div>{tasks.map(task => <Link key={task.id} to={`/task/${task.id}`} className={`flex items-center gap-2 py-2 text-sm ${focusedTaskId === task.id ? "font-bold text-primary" : "text-foreground hover:text-primary"}`}><span>{task.icon}</span><span className="truncate">{task.name}</span></Link>)}<Link to="/" className="mt-2 block text-sm text-primary">{label("كل المهام", "All tasks")}</Link></div>
        </aside>
        <main className="min-w-0 border-x border-border bg-card px-4 py-7 shadow-sm sm:px-8 lg:min-h-[700px] lg:px-12">
          <div className="mb-8 flex items-start justify-between gap-3 border-b border-border pb-6"><div><div className="mb-2 text-xs font-bold text-primary">{label("صفحة اليوم", "TODAY'S PAGE")} · {new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date)}</div><h1 className="font-serif text-3xl font-semibold sm:text-4xl">{new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(date)}</h1><p className="mt-2 text-sm text-muted-foreground">{focusedTask ? focusedTask.name : label("خطوة صغيرة، كل يوم.", "One little step, every day.")}</p></div><span className="font-serif text-5xl text-primary/20">{String(date.getDate()).padStart(2, "0")}</span></div>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-xl font-semibold">{label("مهام اليوم", "Today's tasks")}</h2>{!focusedTaskId && <Button variant="ghost" size="sm" onClick={() => setTaskDialog(true)}><Plus size={16} className="me-1" />{t.addNewTask}</Button>}</div>
          <div className="space-y-2">{visibleTasks.map(task => { const current = colorFor(task); return <div key={task.id} className="flex min-h-16 items-center gap-3 rounded-md border border-border bg-background px-4 py-3"><Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-md border-2" onClick={() => paint(task, task.data[calendarKey] === activeColor ? null : activeColor)} title={label("لوّن حالة المهمة", "Mark task with selected color")} style={current ? { backgroundColor: current.hex || `hsl(${current.hue} 55% 55%)` } : undefined}>{current && <Check size={17} className="text-primary-foreground" />}</Button><span className="shrink-0 text-xl">{task.icon}</span><div className="min-w-0 flex-1"><Link to={`/task/${task.id}`} className="block truncate font-semibold hover:text-primary">{task.name}</Link><span className="text-xs text-muted-foreground">{current?.name || label("لم تحدد الحالة بعد", "Not marked yet")}</span></div>{task.image && <img src={task.image} alt="" className="h-8 w-8 rounded object-cover" />}<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => openEdit(task)} title={t.editTask}><Pencil size={15} /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" title={t.deleteTask}><Trash2 size={15} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t.deleteTask}</AlertDialogTitle><AlertDialogDescription>{t.deleteTaskConfirm}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t.cancel}</AlertDialogCancel><AlertDialogAction onClick={() => deleteTask(task.id)}>{t.delete}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>; })}{!visibleTasks.length && <p className="py-8 text-sm text-muted-foreground">{label("لا توجد مهام بعد", "No tasks yet")}</p>}</div>
          <div className="mt-10 border-t border-border pt-7"><div className="mb-4 flex items-center gap-2"><Pencil size={17} className="text-primary" /><h2 className="font-serif text-xl font-semibold">{label("تدوينات اليوم", "Daily notes")}</h2></div><textarea aria-label={label("تدوينات اليوم", "Daily notes")} value={notes[journalKey] || ""} onChange={e => setNotes(prev => ({ ...prev, [journalKey]: e.target.value }))} placeholder={label("اكتب عن يومك هنا...", "Write about your day here...")} className="journal-lines min-h-64 w-full resize-y border-0 bg-transparent p-0 text-base leading-9 text-foreground outline-none placeholder:text-muted-foreground/60" /></div>
        </main>
        <aside className="lg:sticky lg:top-6 lg:self-start"><div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-lg font-semibold">{label("تأملات اليوم", "Daily reflections")}</h2><Button variant="ghost" size="sm" onClick={() => setShowQuestions(!showQuestions)}>{showQuestions ? label("إخفاء", "Hide") : label("إظهار", "Show")}</Button></div>{showQuestions && <div className="space-y-3">{activeQuestions.map((question, i) => <div key={i} className="border-s-4 border-primary bg-card px-4 py-4"><div className="flex items-start justify-between gap-2"><label htmlFor={`answer-${i}`} className="text-sm font-semibold leading-relaxed">{question}</label><Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setQuestions(prev => ({ ...prev, [language]: activeQuestions.filter((_, idx) => idx !== i) }))} title={label("حذف السؤال", "Remove question")}><X size={13} /></Button></div><textarea id={`answer-${i}`} value={answers[`${journalKey}-${language}-${question}`] || ""} onChange={e => setAnswers(prev => ({ ...prev, [`${journalKey}-${language}-${question}`]: e.target.value }))} placeholder={label("اكتب إجابتك...", "Write your answer...")} rows={2} className="mt-3 w-full resize-none border-0 border-b border-border bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary" /></div>)}<div className="flex gap-2"><Input aria-label={label("سؤال جديد", "New question")} value={draftQuestion} onChange={e => setDraftQuestion(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && draftQuestion.trim()) { setQuestions(prev => ({ ...prev, [language]: [...activeQuestions, draftQuestion.trim()] })); setDraftQuestion(""); } }} placeholder={label("أضف سؤالاً...", "Add a question...")} /><Button size="icon" variant="outline" title={label("إضافة سؤال", "Add question")} onClick={() => { if (draftQuestion.trim()) { setQuestions(prev => ({ ...prev, [language]: [...activeQuestions, draftQuestion.trim()] })); setDraftQuestion(""); } }}><Plus size={16} /></Button></div></div>}
          <div className="mt-8 border-t border-border pt-6"><h2 className="mb-3 font-serif text-lg font-semibold">{label("ألوان الحالة", "Status colors")}</h2><div className="flex flex-wrap gap-2">{colors.map(c => <div key={c.id} className="group relative"><Button variant={activeColor === c.id ? "default" : "outline"} size="sm" className="gap-2" onClick={() => setActiveColor(c.id)}><span className="h-3.5 w-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex || `hsl(${c.hue} 55% 55%)` }} />{c.name}</Button>{c.id !== "complete" && c.id !== "incomplete" && <Button variant="ghost" size="icon" className="absolute -top-3 -end-3 h-5 w-5 rounded-full bg-card text-destructive" onClick={() => removeColor(c.id)} title={label("حذف اللون", "Remove color")}><X size={12} /></Button>}</div>)}<Button variant="outline" size="sm" onClick={() => setColorDialog(true)}><Plus size={15} className="me-1" />{t.addColor}</Button></div><p className="mt-3 text-xs text-muted-foreground">{label("اختر لونًا ثم اضغط على مربع المهمة.", "Choose a color, then mark a task.")}</p></div>
        </aside>
      </div>
    </div>
    <Dialog open={taskDialog} onOpenChange={setTaskDialog}><DialogContent><DialogHeader><DialogTitle>{t.addNewTask}</DialogTitle></DialogHeader><Input aria-label={t.taskName} value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addNewTask()} placeholder={t.taskNamePlaceholder} /><div className="flex flex-wrap gap-1">{ICONS.map(item => <Button key={item} variant={icon === item ? "default" : "outline"} size="icon" onClick={() => setIcon(item)}>{item}</Button>)}</div><Button disabled={!newTask.trim()} onClick={addNewTask}>{t.addTask}</Button></DialogContent></Dialog>
    <Dialog open={!!editTask} onOpenChange={open => { if (!open) setEditTask(null); }}><DialogContent><DialogHeader><DialogTitle>{t.editTask}</DialogTitle></DialogHeader><Input aria-label={t.taskName} value={editName} onChange={e => setEditName(e.target.value)} /><div className="flex flex-wrap gap-1">{ICONS.map(item => <Button key={item} variant={editIcon === item ? "default" : "outline"} size="icon" onClick={() => setEditIcon(item)}>{item}</Button>)}</div><div className="flex items-center gap-3">{editImage && <><img src={editImage} alt={t.taskImage} className="h-12 w-12 rounded object-cover" /><Button variant="ghost" size="icon" onClick={() => setEditImage(undefined)} title={t.removeImage}><X size={16} /></Button></>}<Input type="file" accept="image/*" aria-label={t.taskImage} onChange={e => upload(e.target.files?.[0])} /></div><Button disabled={!editName.trim()} onClick={() => { if (!editTask || !editName.trim()) return; updateTaskName(editTask.id, editName.trim()); updateTaskIcon(editTask.id, editIcon); updateTaskImage(editTask.id, editImage); setEditTask(null); }}>{t.save}</Button></DialogContent></Dialog>
    <Dialog open={colorDialog} onOpenChange={setColorDialog}><DialogContent><DialogHeader><DialogTitle>{t.addColor}</DialogTitle></DialogHeader><Input aria-label={t.colorName} value={colorName} onChange={e => setColorName(e.target.value)} placeholder={t.colorName} /><div className="flex items-center gap-3"><input type="color" aria-label={t.selectColor} value={colorValue} onChange={e => setColorValue(e.target.value)} className="h-12 w-16 cursor-pointer border-0 bg-transparent" /><span className="text-sm text-muted-foreground">{t.selectColor}</span></div><Button disabled={!colorName.trim() || !paletteTask} onClick={addColor}>{t.save}</Button></DialogContent></Dialog>
  </div>;
}
