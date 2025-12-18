import { Link, useLocation } from "react-router-dom";
import { Task } from "@/types/task";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TaskNavProps {
  tasks: Task[];
}

export function TaskNav({ tasks }: TaskNavProps) {
  const location = useLocation();
  const { language } = useLanguage();

  return (
    <nav className="flex items-center gap-4 p-4 bg-card border-b border-border overflow-x-auto">
      <Link
        to="/"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg cell-transition shrink-0
          ${location.pathname === "/" 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-secondary text-foreground"
          }
        `}
      >
        <Home className="w-4 h-4" />
        <span>{language === "ar" ? "الرئيسية" : "Home"}</span>
      </Link>

      <div className="h-6 w-px bg-border shrink-0" />

      {tasks.map((task) => (
        <Link
          key={task.id}
          to={`/task/${task.id}`}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg cell-transition shrink-0
            ${location.pathname === `/task/${task.id}` 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-secondary text-foreground"
            }
          `}
        >
          {task.image ? (
            <img
              src={task.image}
              alt={language === "ar" ? `صورة مهمة ${task.name}` : `Task image for ${task.name}`}
              loading="lazy"
              className="h-6 w-6 rounded-md border border-border object-cover"
            />
          ) : (
            <span className="text-lg">{task.icon || "📋"}</span>
          )}
          <span>{task.name}</span>
        </Link>
      ))}
    </nav>
  );
}
