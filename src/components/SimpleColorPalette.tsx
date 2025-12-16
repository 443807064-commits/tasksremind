import { Check, X, Eraser } from "lucide-react";

interface SimpleColorPaletteProps {
  selectedColor: string | null;
  onSelectColor: (color: string | null) => void;
}

export function SimpleColorPalette({ selectedColor, onSelectColor }: SimpleColorPaletteProps) {
  const options = [
    { 
      value: "palette-green", 
      label: "أنجزت", 
      icon: Check,
      bgClass: "bg-palette-green"
    },
    { 
      value: "palette-red", 
      label: "لم أنجز", 
      icon: X,
      bgClass: "bg-palette-red"
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">حالة اليوم</h3>
      
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => onSelectColor(option.value)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cell-transition
                ${selectedColor === option.value 
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background" 
                  : "hover:bg-secondary"
                }
              `}
            >
              <div className={`w-8 h-8 rounded-md ${option.bgClass} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => onSelectColor(null)}
          className={`
            flex items-center gap-3 p-3 rounded-lg cell-transition
            ${selectedColor === null 
              ? "ring-2 ring-ring ring-offset-2 ring-offset-background" 
              : "hover:bg-secondary"
            }
          `}
        >
          <div className="w-8 h-8 rounded-md bg-cell-empty flex items-center justify-center">
            <Eraser className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">مسح</span>
        </button>
      </div>
    </div>
  );
}
