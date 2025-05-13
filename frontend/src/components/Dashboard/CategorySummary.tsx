
import { formatCurrency } from "./utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CategorySummaryItem = [string, number];

interface CategorySummaryProps {
  title: string;
  description: string;
  categories: CategorySummaryItem[];
  total: number;
  type: 'expense' | 'income';
}

export function CategorySummary({ title, description, categories, total, type}: CategorySummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{category}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((amount / total) * 100)}% of {type === 'expense' ? 'expenses' : 'income'}
                  </p>
                </div>
                <div className="font-medium">{formatCurrency(amount)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">
            No {type === 'expense' ? 'expenses' : 'income'} recorded for this period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
    