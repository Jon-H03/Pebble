import { expenseCategories, incomeCategories } from "./categories";
import { type TransactionFormData } from "@/types/transaction";
import { useTransactionForm } from "@/hooks/useTransactionForm";
// shadcn imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AddTransactionFormProps = {
  onAddTransaction: (formData: TransactionFormData) => void;
};

function sanitizeDecimalInput(value: string): string {
  const parts = value.split(".");

  // If there are multiple ".", just keep the first two parts
  const int = parts[0];
  const dec = parts[1] ?? "";

  // If there is a decimal value, slice it down to 2 numbers at max,
  // else just return the integer
  return dec.length > 0 ? `${int}.${dec.slice(0, 2)}` : int;
}

export function AddTransactionForm({
  onAddTransaction,
}: AddTransactionFormProps) {
  const {
    date,
    setDate,
    transactionType,
    setTransactionType,
    amount,
    setAmount,
    name,
    setName,
    category,
    setCategory,
    description,
    setDescription,
    handleSubmit,
  } = useTransactionForm({ onAddTransaction });

  // Get the appropriate categories based on expense type
  const categories =
    transactionType === "expense" ? expenseCategories : incomeCategories;

  return (
    <Card className="mt-[1em]">
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
        <CardDescription>Record your income or expenses</CardDescription>
      </CardHeader>

      {/*Start building the form */}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction type selector */}
          <Tabs
            value={transactionType}
            onValueChange={(value) =>
              setTransactionType(value as "expense" | "income")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step=".01"
                min="0"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) =>
                  setAmount(sanitizeDecimalInput(e.target.value))
                }
                required
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Transaction name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Additional details about this transaction"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Save Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
