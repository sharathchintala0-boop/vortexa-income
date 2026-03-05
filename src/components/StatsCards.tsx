import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Pencil, Check, X, ArrowLeftRight, Activity } from "lucide-react";

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
  label, value, icon: Icon, glowClass, textClass, onOverride, format,
}: {
  label: string; value: number; icon: React.ElementType; glowClass: string; textClass: string;
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
    <div className={`glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:border-border hover:shadow-lg ${glowClass}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          {onOverride && !editing && (
            <button onClick={startEdit} className="p-1 rounded hover:bg-secondary transition-colors">
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <div className={`p-1.5 rounded-md bg-secondary/50`}>
            <Icon className={`h-4 w-4 ${textClass}`} />
          </div>
        </div>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold font-mono ${textClass}`}>$</span>
          <input
            type="number" step="0.01" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="w-full rounded-md border border-border bg-secondary/80 px-2 py-1 text-lg font-bold font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <button onClick={save} className="p-1 rounded hover:bg-revenue/20"><Check className="h-4 w-4 text-revenue" /></button>
          <button onClick={() => setEditing(false)} className="p-1 rounded hover:bg-expense/20"><X className="h-4 w-4 text-expense" /></button>
        </div>
      ) : (
        <p className={`text-3xl font-bold font-mono ${textClass}`}>{format(value)}</p>
      )}
    </div>
  );
}

export function StatsCards({ totalRevenue, totalExpenses, totalProfit, orderCount, onOverrideRevenue, onOverrideExpenses, format, symbol, isINR, onToggleCurrency, rate }: StatsCardsProps) {
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground font-mono">
          {isINR ? `INR (₹1 = $${(1/rate).toFixed(4)})` : "USD"}
        </span>
        <button
          onClick={onToggleCurrency}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {isINR ? "Switch to USD" : "Switch to INR"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EditableStat label="Total Revenue" value={totalRevenue} icon={DollarSign} glowClass="hover:shadow-glow-revenue" textClass="text-revenue text-glow-revenue" onOverride={onOverrideRevenue} format={format} />
        <EditableStat label="Total Expenses" value={totalExpenses} icon={TrendingDown} glowClass="hover:shadow-glow-expense" textClass="text-expense text-glow-expense" onOverride={onOverrideExpenses} format={format} />

        <div className="glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:border-border hover:shadow-glow-profit">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Net Profit</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded-full ${margin >= 0 ? 'bg-revenue/10 text-revenue border border-revenue/20' : 'bg-expense/10 text-expense border border-expense/20'}`}>
                {margin >= 0 ? "+" : ""}{margin.toFixed(1)}%
              </span>
              <div className="p-1.5 rounded-md bg-secondary/50">
                <TrendingUp className="h-4 w-4 text-profit" />
              </div>
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-profit text-glow-profit">{format(totalProfit)}</p>
        </div>

        <div className="glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:border-border hover:shadow-glow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Orders</span>
            <div className="p-1.5 rounded-md bg-secondary/50">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{orderCount}</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">active clients</p>
        </div>
      </div>
    </div>
  );
}
