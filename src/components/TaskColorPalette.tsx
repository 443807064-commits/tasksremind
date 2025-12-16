import { useState } from "react";
import { Check, X, Eraser, Plus, Trash2 } from "lucide-react";
import { CustomColor } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TaskColorPaletteProps {
  colors: CustomColor[];
  selectedColor: string | null;
  onSelectColor: (color: string | null) => void;
  onAddColor: (name: string, hue: number) => void;
  onRemoveColor: (colorId: string) => void;
}

const PRESET_HUES = [
  { name: "أخضر", hue: 142 },
  { name: "أحمر", hue: 0 },
  { name: "أزرق", hue: 200 },
  { name: "أصفر", hue: 45 },
  { name: "بنفسجي", hue: 270 },
  { name: "برتقالي", hue: 25 },
  { name: "وردي", hue: 330 },
  { name: "فيروزي", hue: 175 },
];

export function TaskColorPalette({ 
  colors, 
  selectedColor, 
  onSelectColor, 
  onAddColor,
  onRemoveColor 
}: TaskColorPaletteProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [selectedHue, setSelectedHue] = useState(142);

  const getColorStyle = (hue: number) => {
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      onAddColor(newColorName.trim(), selectedHue);
      setNewColorName("");
      setSelectedHue(142);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">حالة اليوم</h3>
      
      <div className="flex flex-col gap-2">
        {colors.map((color) => (
          <div key={color.id} className="flex items-center gap-2">
            <button
              onClick={() => onSelectColor(color.id)}
              className={`
                flex-1 flex items-center gap-3 p-3 rounded-lg cell-transition
                ${selectedColor === color.id 
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background" 
                  : "hover:bg-secondary"
                }
              `}
            >
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: getColorStyle(color.hue) }}
              >
                {color.id === "complete" ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : color.id === "incomplete" ? (
                  <X className="w-5 h-5 text-primary-foreground" />
                ) : null}
              </div>
              <span className="text-sm font-medium">{color.name}</span>
            </button>
            {color.id !== "complete" && color.id !== "incomplete" && (
              <button
                onClick={() => onRemoveColor(color.id)}
                className="p-2 text-muted-foreground hover:text-destructive cell-transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-3 p-3 rounded-lg cell-transition hover:bg-secondary border-2 border-dashed border-border">
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">إضافة لون</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>إضافة لون جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">اسم اللون</label>
                <Input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="مثال: مراجعة"
                  className="bg-background"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">اختر اللون</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_HUES.map((preset) => (
                    <button
                      key={preset.hue}
                      onClick={() => setSelectedHue(preset.hue)}
                      className={`
                        aspect-square rounded-lg cell-transition
                        ${selectedHue === preset.hue 
                          ? "ring-2 ring-ring ring-offset-2 ring-offset-background" 
                          : ""
                        }
                      `}
                      style={{ backgroundColor: getColorStyle(preset.hue) }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <div 
                  className="w-8 h-8 rounded-md"
                  style={{ backgroundColor: getColorStyle(selectedHue) }}
                />
                <span className="text-sm">{newColorName || "اسم اللون"}</span>
              </div>

              <Button 
                onClick={handleAddColor} 
                className="w-full"
                disabled={!newColorName.trim()}
              >
                إضافة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
