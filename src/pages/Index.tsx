import { useFinanceData } from "@/hooks/useFinanceData";
import { StatsCards } from "@/components/StatsCards";
import { OrdersTable } from "@/components/OrdersTable";
import { ExpensesTable } from "@/components/ExpensesTable";
import { Server } from "lucide-react";

const Index = () => {
  const {
    orders, expenses,
    totalRevenue, totalExpenses, totalProfit,
    addOrder, updateOrder, deleteOrder,
    addExpense, updateExpense, deleteExpense,
  } = useFinanceData();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Server className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HostPanel</h1>
            <p className="text-xs text-muted-foreground">Hosting Revenue Tracker</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <StatsCards
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          totalProfit={totalProfit}
          orderCount={orders.length}
        />
        <OrdersTable orders={orders} onAdd={addOrder} onUpdate={updateOrder} onDelete={deleteOrder} />
        <ExpensesTable expenses={expenses} onAdd={addExpense} onUpdate={updateExpense} onDelete={deleteExpense} />
      </main>
    </div>
  );
};

export default Index;
