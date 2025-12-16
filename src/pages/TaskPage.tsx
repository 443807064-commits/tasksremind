import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ColorPalette } from "@/components/ColorPalette";
import { YearGrid } from "@/components/YearGrid";
import { TaskStats } from "@/components/TaskStats";
import { useTaskStorage } from "@/hooks/useTaskStorage";
import { Loader2 } from "lucide-react";

export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, updateTask, isLoaded } = useTaskStorage();
  const [selectedColor, setSelectedColor] = useState<string | null>("palette-green");

  const task = getTask(taskId || "");

  // Show loading while data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!task) {
    return <Navigate to="/" replace />;
  }

  const handleCellClick = (cellKey: string) => {
    const newData = { ...task.data };
    
    if (selectedColor === null) {
      delete newData[cellKey];
    } else {
      newData[cellKey] = selectedColor;
    }
    
    updateTask(task.id, newData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{task.name}</h1>
          <p className="text-muted-foreground">
            تتبع تقدمك اليومي على مدار السنة
          </p>
        </div>

        <TaskStats data={task.data} />

        <div className="flex gap-6">
          <div className="shrink-0">
            <ColorPalette
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          </div>

          <div className="flex-1 bg-card rounded-lg border border-border p-6 overflow-hidden">
            <YearGrid
              data={task.data}
              selectedColor={selectedColor}
              onCellClick={handleCellClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
