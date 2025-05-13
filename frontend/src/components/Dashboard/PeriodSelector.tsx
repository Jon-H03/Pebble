import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { type Period } from "./utilities";
import { type Transaction } from "@/types/transaction";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  transactions: Transaction[];
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function PeriodSelector({
  transactions,
  selectedPeriod,
  onPeriodChange,
}: PeriodSelectorProps) {
  // Build a very simple list of months with data -
  const monthOptions = useMemo(() => {

    const options = [];
    
    // Get current month and year
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // ALWAYS add current month
    const currentMonthOption = {
      label: format(today, "MMMM"),
      value: `${currentMonth}-${currentYear}`
    };
    options.push(currentMonthOption);
    
    // Check previous month
    if (transactions.some(tx => {
      try {
        const txDate = new Date(tx.date);
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear;
      } catch {
        return false;
      }
    })) {
      const prevMonthDate = new Date(today);
      prevMonthDate.setMonth(currentMonth - 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();
      
      const prevMonthOption = {
        label: format(prevMonthDate, "MMMM"),
        value: `${prevMonth}-${prevYear}`
      };
      options.push(prevMonthOption);
    }
    
    return options;
  }, [transactions]);
  
  // Handle period selection change
  const handlePeriodChange = (value: string) => {
    const [month, year] = value.split("-").map(Number);
    onPeriodChange({ month, year });
  };
  
  // Get the selected value
  const selectedValue = `${selectedPeriod.month}-${selectedPeriod.year}`;
  
  // Check if selection is valid
  const isValidSelection = monthOptions.some(option => option.value === selectedValue);
  const effectiveValue = isValidSelection ? selectedValue : monthOptions[0]?.value;
  
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <Select
        value={effectiveValue}
        onValueChange={handlePeriodChange}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.length > 0 ? (
            monthOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="current">Current Month</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}