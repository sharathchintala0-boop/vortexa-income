import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  orderCount: number;
}

export function StatsCards({ totalRevenue, totalExpenses, totalProfit, orderCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <DollarSign className="h-4 w-4 text-revenue" />
        </div>
        <p className="text-3xl font-bold font-mono text-revenue">${totalRevenue.toFixed(2)}</p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Expenses</span>
          <TrendingDown className="h-4 w-4 text-expense" />
        </div>
        <p className="text-3xl font-bold font-mono text-expense">${totalExpenses.toFixed(2)}</p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Net Profit</span>
          <TrendingUp className="h-4 w-4 text-profit" />
        </div>
        <p className="text-3xl font-bold font-mono text-profit">${totalProfit.toFixed(2)}</p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Orders</span>
          <span className="text-xs text-muted-foreground">clients</span>
        </div>
        <p className="text-3xl font-bold font-mono text-foreground">{orderCount}</p>
      </div>
    </div>
  );
}
