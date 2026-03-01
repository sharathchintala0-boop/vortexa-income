import { useState } from "react";
import { Expense } from "@/types/finance";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface ExpensesTableProps {
  expenses: Expense[];
  onAdd: (expense: Omit<Expense, "id">) => void;
  onUpdate: (id: string, expense: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTable({ expenses, onAdd, onUpdate, onDelete }: ExpensesTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState({ description: "", amount: 0, date: new Date().toISOString().split("T")[0] });

  const resetForm = () => { setForm({ description: "", amount: 0, date: new Date().toISOString().split("T")[0] }); setShowForm(false); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      onUpdate(editing.id, { ...form, amount: Number(form.amount) });
    } else {
      onAdd({ ...form, amount: Number(form.amount) });
    }
    resetForm();
  };

  const startEdit = (exp: Expense) => {
    setEditing(exp);
    setForm({ description: exp.description, amount: exp.amount, date: exp.date });
    setShowForm(true);
  };

  const inputClass = "w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-expense text-expense-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Expense
        </button>
      </div>

      {showForm && (
        <div className="p-4 border-b border-border bg-secondary/30">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <input className={inputClass} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="w-28">
              <label className="text-xs text-muted-foreground mb-1 block">Amount ($)</label>
              <input type="number" step="0.01" className={inputClass} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} required />
            </div>
            <div className="w-36">
              <label className="text-xs text-muted-foreground mb-1 block">Date</label>
              <input type="date" className={inputClass} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              {editing ? "Update" : "Add"}
            </button>
            <button type="button" onClick={resetForm} className="p-2 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
          </form>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-3 font-medium">Date</th>
            <th className="text-left p-3 font-medium">Description</th>
            <th className="text-right p-3 font-medium">Amount</th>
            <th className="text-right p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
              <td className="p-3 font-mono text-xs text-muted-foreground">{exp.date}</td>
              <td className="p-3">{exp.description}</td>
              <td className="p-3 text-right font-mono text-expense font-semibold">${exp.amount.toFixed(2)}</td>
              <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => startEdit(exp)} className="p-1.5 rounded hover:bg-secondary transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => onDelete(exp.id)} className="p-1.5 rounded hover:bg-destructive/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-expense" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
