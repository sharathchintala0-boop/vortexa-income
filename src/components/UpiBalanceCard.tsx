import { useState, useEffect } from "react";
import { Pencil, Check, X, Wallet } from "lucide-react";

const UPI_BALANCE_KEY = "hosting_upi_balance";

export function UpiBalanceCard() {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(UPI_BALANCE_KEY);
      return stored ? JSON.parse(stored) : 0;
    } catch { return 0; }
  });
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(balance.toString());

  useEffect(() => {
    localStorage.setItem(UPI_BALANCE_KEY, JSON.stringify(balance));
  }, [balance]);

  const save = () => {
    const num = parseFloat(input);
    if (!isNaN(num)) setBalance(num);
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">UPI Balance</span>
        <div className="flex items-center gap-1">
          {!editing && (
            <button onClick={() => { setInput(balance.toString()); setEditing(true); }} className="p-1 rounded hover:bg-secondary transition-colors">
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <Wallet className="h-4 w-4 text-profit" />
        </div>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono text-profit">$</span>
          <input
            type="number"
            step="0.01"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-lg font-bold font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
          <button onClick={save} className="p-1 rounded hover:bg-revenue/20"><Check className="h-4 w-4 text-revenue" /></button>
          <button onClick={() => setEditing(false)} className="p-1 rounded hover:bg-expense/20"><X className="h-4 w-4 text-expense" /></button>
        </div>
      ) : (
        <p className="text-3xl font-bold font-mono text-profit">${balance.toFixed(2)}</p>
      )}
    </div>
  );
}
