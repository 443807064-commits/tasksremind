import { useState, useEffect } from "react";
import { Task, DEFAULT_COLORS } from "@/types/task";

const STORAGE_KEY = "task-tracker-data";

const DEFAULT_TASKS: Task[] = [
  { id: "exercise", name: "التمارين", data: {}, customColors: DEFAULT_COLORS },
  { id: "study", name: "الدراسة لمدة ٣٠ دقيقة", data: {}, customColors: DEFAULT_COLORS },
];

export function useTaskStorage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure all tasks have customColors
        return parsed.map((task: Task) => ({
          ...task,
          customColors: task.customColors || DEFAULT_COLORS,
        }));
      } catch {
        return DEFAULT_TASKS;
      }
    }
    return DEFAULT_TASKS;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    setIsLoaded(true);
  }, [tasks]);

  const updateTask = (taskId: string, data: Record<string, string>) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, data } : task
      );
      return updated;
    });
  };

  const addTask = (name: string) => {
    const id = `task-${Date.now()}`;
    const newTask: Task = {
      id,
      name,
      data: {},
      customColors: DEFAULT_COLORS,
    };
    setTasks((prev) => [...prev, newTask]);
    return id;
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const addColorToTask = (taskId: string, colorName: string, hue: number) => {
    setTasks((prev) => {
      return prev.map((task) => {
        if (task.id === taskId) {
          const newColor = {
            id: `color-${Date.now()}`,
            name: colorName,
            hue,
          };
          return {
            ...task,
            customColors: [...(task.customColors || []), newColor],
          };
        }
        return task;
      });
    });
  };

  const removeColorFromTask = (taskId: string, colorId: string) => {
    setTasks((prev) => {
      return prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            customColors: (task.customColors || []).filter((c) => c.id !== colorId),
          };
        }
        return task;
      });
    });
  };

  const getTask = (taskId: string): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  };

  return { 
    tasks, 
    updateTask, 
    getTask, 
    isLoaded, 
    addTask, 
    deleteTask,
    addColorToTask,
    removeColorFromTask,
  };
}
