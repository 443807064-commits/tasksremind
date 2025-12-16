import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTaskStorage } from "@/hooks/useTaskStorage";
import { CheckCircle2, ArrowLeft, Sparkles, Plus, Trash2 } from "lucide-react";
import { DAYS_IN_MONTH } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { tasks, addTask, deleteTask } = useTaskStorage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const navigate = useNavigate();
  const totalDays = DAYS_IN_MONTH.reduce((a, b) => a + b, 0);

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTaskId = addTask(newTaskName.trim());
      setNewTaskName("");
      setIsDialogOpen(false);
      navigate(`/task/${newTaskId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">تتبع عاداتك اليومية</span>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4">
            متتبع المهام السنوي
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            سجّل إنجازاتك اليومية على مدار السنة بتصميم بسيط وجميل
          </p>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tasks.map((task, index) => {
            const filledDays = Object.keys(task.data).length;
            const completionRate = Math.round((filledDays / totalDays) * 100);

            return (
              <div
                key={task.id}
                className="group bg-card rounded-xl border border-border p-6 cell-transition hover:border-primary/50 hover:glow-effect animate-fade-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 cell-transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف المهمة</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف "{task.name}"؟ سيتم حذف جميع البيانات المرتبطة بها.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteTask(task.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Link to={`/task/${task.id}`} className="block">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 cell-transition">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">
                          {task.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {filledDays} يوم مسجل
                        </p>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 cell-transition" />
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">التقدم</span>
                      <span className="text-primary font-medium">{completionRate}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full cell-transition"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Add Task Card */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="bg-card rounded-xl border-2 border-dashed border-border p-6 cell-transition hover:border-primary/50 flex flex-col items-center justify-center gap-4 min-h-[180px]">
                <div className="p-4 bg-secondary rounded-full">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground font-medium">إضافة مهمة جديدة</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>إضافة مهمة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">اسم المهمة</label>
                  <Input
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="مثال: القراءة لمدة ٢٠ دقيقة"
                    className="bg-background"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTask();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleAddTask} 
                  className="w-full"
                  disabled={!newTaskName.trim()}
                >
                  إضافة المهمة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2 p-6 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">
              اختر مهمة للبدء في تتبع تقدمك اليومي
            </p>
            <p className="text-sm text-muted-foreground/70">
              انقر على أي خلية لتلوينها • يمكنك إضافة ألوان مخصصة لكل مهمة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
