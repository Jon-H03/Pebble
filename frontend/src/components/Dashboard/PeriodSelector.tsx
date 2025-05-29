// PeriodSelector.tsx
import { Calendar } from "lucide-react";
import { type Period } from "./utilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: PeriodSelectorProps) {
  // Simple hardcoded months - no logic needed!
  const monthOptions = [
    { label: "December", value: "11-2025", month: 11 },
    { label: "November", value: "10-2025", month: 10 },
    { label: "October", value: "9-2025", month: 9 },
    { label: "September", value: "8-2025", month: 8 },
    { label: "August", value: "7-2025", month: 7 },
    { label: "July", value: "6-2025", month: 6 },
    { label: "June", value: "5-2025", month: 5 },
    { label: "May", value: "4-2025", month: 4 },
    { label: "April", value: "3-2025", month: 3 },
    { label: "March", value: "2-2025", month: 2 },
    { label: "February", value: "1-2025", month: 1 },
    { label: "January", value: "0-2025", month: 0 },
  ].filter(option => option.month <= new Date().getMonth());
  
  // Handle period selection change
  const handlePeriodChange = (value: string) => {
    const [month] = value.split("-").map(Number);
    onPeriodChange({ month, year: 2025 });
  };
  
  // Get the selected value
  const selectedValue = `${selectedPeriod.month}-${selectedPeriod.year}`;
  
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <Select
        value={selectedValue}
        onValueChange={handlePeriodChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}