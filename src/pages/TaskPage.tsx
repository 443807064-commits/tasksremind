import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { TaskColorPalette } from "@/components/TaskColorPalette";
import { YearGrid } from "@/components/YearGrid";
import { TaskStats } from "@/components/TaskStats";
import { useTaskStore } from "@/contexts/TaskStorageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Loader2 } from "lucide-react";
import { DEFAULT_COLORS } from "@/types/task";

export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, updateTask, addColorToTask, removeColorFromTask, isLoaded } = useTaskStore();
  const { t } = useLanguage();
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-2 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-2 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">{task.name}</h1>
            <p className="text-xs text-muted-foreground">
              {t.trackYourProgress}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="shrink-0">
          <TaskStats data={task.data} colors={colors} />
        </div>

        <div className="flex flex-col md:flex-row gap-2 flex-1 overflow-hidden min-h-0">
          <div className="shrink-0 md:w-auto order-2 md:order-1">
            <TaskColorPalette
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              onAddColor={handleAddColor}
              onRemoveColor={handleRemoveColor}
            />
          </div>

          <div className="flex-1 bg-card rounded border border-border p-2 overflow-hidden flex flex-col min-h-[50vh] md:min-h-0 order-1 md:order-2">
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
