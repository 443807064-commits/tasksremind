import { useState, useEffect } from "react";
import { Task } from "@/types/task";

const STORAGE_KEY = "task-tracker-data";

const DEFAULT_TASKS: Task[] = [
  { id: "exercise", name: "التمارين", data: {} },
  { id: "study", name: "الدراسة لمدة ٣٠ دقيقة", data: {} },
];

export function useTaskStorage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize from localStorage synchronously
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_TASKS;
      }
    }
    return DEFAULT_TASKS;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Save to localStorage whenever tasks change
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

  const getTask = (taskId: string): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  };

  return { tasks, updateTask, getTask, isLoaded };
}
