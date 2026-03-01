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
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <div className="h-8 w-8 rounded-md bg-revenue/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-revenue" />
          </div>
        </div>
        <p className="text-3xl font-bold font-mono text-revenue">${totalRevenue.toFixed(2)}</p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Expenses</span>
          <div className="h-8 w-8 rounded-md bg-expense/10 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-expense" />
          </div>
        </div>
        <p className="text-3xl font-bold font-mono text-expense">${totalExpenses.toFixed(2)}</p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Net Profit</span>
          <div className="h-8 w-8 rounded-md bg-profit/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-profit" />
          </div>
        </div>
        <p className="text-3xl font-bold font-mono text-profit">${totalProfit.toFixed(2)}</p>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Orders</span>
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">#</span>
          </div>
        </div>
        <p className="text-3xl font-bold font-mono text-foreground">{orderCount}</p>
      </div>
    </div>
  );
}
