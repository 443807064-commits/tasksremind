import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { TaskColorPalette } from "@/components/TaskColorPalette";
import { YearGrid } from "@/components/YearGrid";
import { TaskStats } from "@/components/TaskStats";
import { useTaskStorage } from "@/hooks/useTaskStorage";
import { Loader2 } from "lucide-react";
import { DEFAULT_COLORS } from "@/types/task";

export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, updateTask, addColorToTask, removeColorFromTask, isLoaded } = useTaskStorage();
  const [selectedColor, setSelectedColor] = useState<string | null>("complete");

  const task = getTask(taskId || "");

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

  const colors = task.customColors || DEFAULT_COLORS;

  const handleCellClick = (cellKey: string) => {
    const newData = { ...task.data };
    
    if (selectedColor === null) {
      delete newData[cellKey];
    } else {
      newData[cellKey] = selectedColor;
    }
    
    updateTask(task.id, newData);
  };

  const handleAddColor = (name: string, hue: number) => {
    addColorToTask(task.id, name, hue);
  };

  const handleRemoveColor = (colorId: string) => {
    removeColorFromTask(task.id, colorId);
    // Also remove this color from the grid data
    const newData = { ...task.data };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === colorId) {
        delete newData[key];
      }
    });
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
            <TaskColorPalette
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              onAddColor={handleAddColor}
              onRemoveColor={handleRemoveColor}
            />
          </div>

          <div className="flex-1 bg-card rounded-lg border border-border p-6 overflow-hidden">
            <YearGrid
              data={task.data}
              colors={colors}
              selectedColor={selectedColor}
              onCellClick={handleCellClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
