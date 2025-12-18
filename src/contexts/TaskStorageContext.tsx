import React, { createContext, useContext, ReactNode } from "react";
import { useTaskStorage } from "@/hooks/useTaskStorage";

/**
 * Single shared instance of task storage across the app.
 * Fixes TaskNav not updating when pages call useTaskStorage separately.
 */

type TaskStore = ReturnType<typeof useTaskStorage>;

const TaskStorageContext = createContext<TaskStore | null>(null);

export function TaskStorageProvider({ children }: { children: ReactNode }) {
  const store = useTaskStorage();
  return (
    <TaskStorageContext.Provider value={store}>
      {children}
    </TaskStorageContext.Provider>
  );
}

export function useTaskStore() {
  const ctx = useContext(TaskStorageContext);
  if (!ctx) {
    throw new Error("useTaskStore must be used within TaskStorageProvider");
  }
  return ctx;
}
