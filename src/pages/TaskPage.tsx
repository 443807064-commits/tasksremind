import { Navigate, useParams } from "react-router-dom";
import { DailyJournal } from "@/components/DailyJournal";
import { useTaskStore } from "@/contexts/TaskStorageContext";
export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask } = useTaskStore();
  if (!taskId || !getTask(taskId)) return <Navigate to="/" replace />;
  return <DailyJournal focusedTaskId={taskId} />;
}
