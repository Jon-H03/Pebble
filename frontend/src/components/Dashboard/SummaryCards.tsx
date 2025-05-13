import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "./utilities";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  net: number;
}

export function SummaryCards({ income, expenses, net }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(income)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total earnings this month
            </p>
          </CardContent>
        </Card>
        
        {/* Expense Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(expenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total expenses this month
            </p>
          </CardContent>
        </Card>

        {/* Net Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Income
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${net >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(net)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net income this month
            </p>
          </CardContent>
        </Card>

        </div>
    )
}