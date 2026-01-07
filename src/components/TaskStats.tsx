import { DAYS_IN_MONTH, CustomColor } from "@/types/task";
import { TrendingUp, Calendar, Target, Palette } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TaskStatsProps {
  data: Record<string, string>;
  colors: CustomColor[];
}

export function TaskStats({ data, colors }: TaskStatsProps) {
  const { t } = useLanguage();
  const totalDays = DAYS_IN_MONTH.reduce((a, b) => a + b, 0);
  const filledDays = Object.keys(data).length;
  const completionRate = totalDays > 0 ? Math.round((filledDays / totalDays) * 100) : 0;

  // Count each color usage
  const colorCounts = colors.reduce((acc, color) => {
    acc[color.id] = Object.values(data).filter((v) => v === color.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-1 mb-2">
      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card rounded border border-border px-2 py-1 animate-fade-in">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-primary" />
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-muted-foreground">{t.recordedDays}</p>
              <p className="text-sm font-bold">{filledDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded border border-border px-2 py-1 animate-fade-in">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-primary" />
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-muted-foreground">{t.completionRate}</p>
              <p className="text-sm font-bold">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded border border-border px-2 py-1 animate-fade-in">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-primary" />
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-muted-foreground">{t.remainingDays}</p>
              <p className="text-sm font-bold">{totalDays - filledDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Color Statistics */}
      <div className="bg-card rounded border border-border px-2 py-1 animate-fade-in">
        <div className="flex items-center gap-1 mb-1">
          <Palette className="w-3 h-3 text-primary" />
          <h3 className="text-[10px] font-semibold text-foreground">{t.colorStats}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color.id}
              className="flex items-center gap-1 px-2 py-0.5 bg-background rounded border border-border"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: `hsl(${color.hue}, 70%, 50%)` }}
              />
              <p className="text-[10px] text-muted-foreground">{color.name}</p>
              <p className="text-xs font-bold">{colorCounts[color.id] || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
