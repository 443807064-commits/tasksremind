export interface Task {
  id: string;
  name: string;
  data: Record<string, string>; // key: "month-day", value: color
  customColors?: CustomColor[]; // optional custom colors per task
}

export interface CustomColor {
  id: string;
  name: string;
  hue: number; // HSL hue value (0-360)
}

export interface ColorOption {
  name: string;
  value: string;
  cssVar: string;
}

export const PALETTE_COLORS: ColorOption[] = [
  { name: "أخضر", value: "palette-green", cssVar: "hsl(var(--palette-green))" },
  { name: "أحمر", value: "palette-red", cssVar: "hsl(var(--palette-red))" },
  { name: "أزرق", value: "palette-blue", cssVar: "hsl(var(--palette-blue))" },
  { name: "أصفر", value: "palette-yellow", cssVar: "hsl(var(--palette-yellow))" },
  { name: "بنفسجي", value: "palette-purple", cssVar: "hsl(var(--palette-purple))" },
  { name: "برتقالي", value: "palette-orange", cssVar: "hsl(var(--palette-orange))" },
  { name: "وردي", value: "palette-pink", cssVar: "hsl(var(--palette-pink))" },
  { name: "فيروزي", value: "palette-teal", cssVar: "hsl(var(--palette-teal))" },
];

export const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const DEFAULT_COLORS = [
  { id: "complete", name: "أنجزت", hue: 142 },
  { id: "incomplete", name: "لم أنجز", hue: 0 },
];
