import { useState } from "react";
import { Check, X, Eraser, Plus, Trash2 } from "lucide-react";
import { CustomColor } from "@/types/task";
import { useLanguage } from "@/contexts/LanguageContext";
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
  { hue: 142 },
  { hue: 0 },
  { hue: 200 },
  { hue: 45 },
  { hue: 270 },
  { hue: 25 },
  { hue: 330 },
  { hue: 175 },
];

export function TaskColorPalette({ 
  colors, 
  selectedColor, 
  onSelectColor, 
  onAddColor,
  onRemoveColor 
}: TaskColorPaletteProps) {
  const { t } = useLanguage();
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
    <div className="flex flex-col gap-1 p-2 bg-card rounded border border-border">
      <h3 className="text-[10px] font-medium text-muted-foreground">{t.selectColor}</h3>
      
      <div className="flex flex-col gap-1">
        {colors.map((color) => (
          <div key={color.id} className="flex items-center gap-1">
            <button
              onClick={() => onSelectColor(color.id)}
              className={`
                flex-1 flex items-center gap-1.5 px-1.5 py-1 rounded cell-transition
                ${selectedColor === color.id 
                  ? "ring-1 ring-ring ring-offset-1 ring-offset-background" 
                  : "hover:bg-secondary"
                }
              `}
            >
              <div 
                className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: getColorStyle(color.hue) }}
              >
                {color.id === "complete" ? (
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                ) : color.id === "incomplete" ? (
                  <X className="w-2.5 h-2.5 text-primary-foreground" />
                ) : null}
              </div>
              <span className="text-[10px] font-medium truncate">{color.name}</span>
            </button>
            {color.id !== "complete" && color.id !== "incomplete" && (
              <button
                onClick={() => onRemoveColor(color.id)}
                className="p-0.5 text-muted-foreground hover:text-destructive cell-transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => onSelectColor(null)}
          className={`
            flex items-center gap-1.5 px-1.5 py-1 rounded cell-transition
            ${selectedColor === null 
              ? "ring-1 ring-ring ring-offset-1 ring-offset-background" 
              : "hover:bg-secondary"
            }
          `}
        >
          <div className="w-4 h-4 rounded bg-cell-empty flex items-center justify-center">
            <Eraser className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-medium">{t.eraser}</span>
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1.5 px-1.5 py-1 rounded cell-transition hover:bg-secondary border border-dashed border-border">
              <div className="w-4 h-4 rounded bg-secondary flex items-center justify-center">
                <Plus className="w-2.5 h-2.5 text-muted-foreground" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{t.addColor}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>{t.addColor}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t.colorName}</label>
                <Input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder=""
                  className="bg-background"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t.selectColor}</label>
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
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <div 
                  className="w-8 h-8 rounded-md"
                  style={{ backgroundColor: getColorStyle(selectedHue) }}
                />
                <span className="text-sm">{newColorName || t.colorName}</span>
              </div>

              <Button 
                onClick={handleAddColor} 
                className="w-full"
                disabled={!newColorName.trim()}
              >
                {t.save}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
