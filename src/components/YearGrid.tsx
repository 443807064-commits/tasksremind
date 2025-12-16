import { MONTHS_AR, DAYS_IN_MONTH, CustomColor } from "@/types/task";

interface YearGridProps {
  data: Record<string, string>;
  colors: CustomColor[];
  selectedColor: string | null;
  onCellClick: (key: string) => void;
}

export function YearGrid({ data, colors, selectedColor, onCellClick }: YearGridProps) {
  const maxDays = Math.max(...DAYS_IN_MONTH);

  const getCellColor = (colorId: string | undefined) => {
    if (!colorId) return undefined;
    const color = colors.find((c) => c.id === colorId);
    if (color) {
      return `hsl(${color.hue}, 70%, 50%)`;
    }
    return undefined;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header - Months */}
        <div className="grid grid-cols-[60px_repeat(12,1fr)] gap-1 mb-2">
          <div className="text-xs text-muted-foreground text-center">اليوم</div>
          {MONTHS_AR.map((month, index) => (
            <div
              key={index}
              className="text-xs text-muted-foreground text-center font-medium"
            >
              {month}
            </div>
          ))}
        </div>

        {/* Grid - Days */}
        <div className="flex flex-col gap-1">
          {Array.from({ length: maxDays }, (_, dayIndex) => (
            <div
              key={dayIndex}
              className="grid grid-cols-[60px_repeat(12,1fr)] gap-1"
            >
              <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
                {dayIndex + 1}
              </div>
              {MONTHS_AR.map((_, monthIndex) => {
                const day = dayIndex + 1;
                const isValidDay = day <= DAYS_IN_MONTH[monthIndex];
                const cellKey = `${monthIndex}-${day}`;
                const cellColorId = data[cellKey];

                if (!isValidDay) {
                  return (
                    <div
                      key={cellKey}
                      className="aspect-square rounded-sm bg-transparent"
                    />
                  );
                }

                return (
                  <button
                    key={cellKey}
                    onClick={() => onCellClick(cellKey)}
                    className={`
                      aspect-square rounded-sm cell-transition cell-hover-effect
                      ${!cellColorId ? "bg-cell-empty" : ""}
                      ${selectedColor !== undefined ? "cursor-pointer" : "cursor-default"}
                    `}
                    style={cellColorId ? { backgroundColor: getCellColor(cellColorId) } : undefined}
                    title={`${MONTHS_AR[monthIndex]} ${day}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
