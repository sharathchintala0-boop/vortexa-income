import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Pencil, Check, X, Percent, ArrowLeftRight } from "lucide-react";

interface StatsCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  orderCount: number;
  onOverrideRevenue?: (val: number) => void;
  onOverrideExpenses?: (val: number) => void;
  format: (val: number) => string;
  symbol: string;
  isINR: boolean;
  onToggleCurrency: () => void;
  rate: number;
}

function EditableStat({
  label, value, icon: Icon, colorClass, onOverride, format,
}: {
  label: string; value: number; icon: React.ElementType; colorClass: string;
  onOverride?: (val: number) => void; format: (val: number) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value.toString());

  const startEdit = () => { setInput(value.toString()); setEditing(true); };
  const save = () => {
    const num = parseFloat(input);
    if (!isNaN(num) && onOverride) onOverride(num);
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          {onOverride && !editing && (
            <button onClick={startEdit} className="p-1 rounded hover:bg-secondary transition-colors">
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold font-mono ${colorClass}`}>$</span>
          <input
            type="number" step="0.01" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-lg font-bold font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
          <button onClick={save} className="p-1 rounded hover:bg-revenue/20"><Check className="h-4 w-4 text-revenue" /></button>
          <button onClick={() => setEditing(false)} className="p-1 rounded hover:bg-expense/20"><X className="h-4 w-4 text-expense" /></button>
        </div>
      ) : (
        <p className={`text-3xl font-bold font-mono ${colorClass}`}>{format(value)}</p>
      )}
    </div>
  );
}

export function StatsCards({ totalRevenue, totalExpenses, totalProfit, orderCount, onOverrideRevenue, onOverrideExpenses, format, symbol, isINR, onToggleCurrency, rate }: StatsCardsProps) {
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Currency toggle */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">
          {isINR ? `INR (₹1 = $${(1/rate).toFixed(4)})` : "USD"}
        </span>
        <button
          onClick={onToggleCurrency}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {isINR ? "Switch to USD" : "Switch to INR"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EditableStat label="Total Revenue" value={totalRevenue} icon={DollarSign} colorClass="text-revenue" onOverride={onOverrideRevenue} format={format} />
        <EditableStat label="Total Expenses" value={totalExpenses} icon={TrendingDown} colorClass="text-expense" onOverride={onOverrideExpenses} format={format} />

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Net Profit</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${margin >= 0 ? 'bg-revenue/10 text-revenue' : 'bg-expense/10 text-expense'}`}>
                {margin >= 0 ? "+" : ""}{margin.toFixed(1)}%
              </span>
              <TrendingUp className="h-4 w-4 text-profit" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-profit">{format(totalProfit)}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <span className="text-xs text-muted-foreground">clients</span>
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{orderCount}</p>
        </div>
      </div>
    </div>
  );
}
