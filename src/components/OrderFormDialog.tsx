import { useState } from "react";
import { Order } from "@/types/finance";
import { X } from "lucide-react";

interface OrderFormDialogProps {
  order?: Order;
  onSave: (data: Omit<Order, "id">) => void;
  onClose: () => void;
}

export function OrderFormDialog({ order, onSave, onClose }: OrderFormDialogProps) {
  const [form, setForm] = useState({
    customerId: order?.customerId ?? "",
    serverType: order?.serverType ?? "",
    quantity: order?.quantity ?? 1,
    paymentGateway: order?.paymentGateway ?? "",
    price: order?.price ?? 0,
    plan: order?.plan ?? "",
    months: order?.months ?? "",
    date: order?.date ?? new Date().toISOString().split("T")[0],
    notes: order?.notes ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
  };

  const inputClass = "w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{order ? "Edit Order" : "New Order"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Customer ID</label>
              <input className={inputClass} value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Server Type</label>
              <input className={inputClass} value={form.serverType} onChange={e => setForm(f => ({ ...f, serverType: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
              <input type="number" className={inputClass} value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price ($)</label>
              <input type="number" step="0.01" className={inputClass} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Payment Gateway</label>
              <input className={inputClass} value={form.paymentGateway} onChange={e => setForm(f => ({ ...f, paymentGateway: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Plan</label>
              <input className={inputClass} value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Period</label>
              <input className={inputClass} value={form.months} onChange={e => setForm(f => ({ ...f, months: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date</label>
              <input type="date" className={inputClass} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
            <input className={inputClass} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <button type="submit" className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            {order ? "Update" : "Add"} Order
          </button>
        </form>
      </div>
    </div>
  );
}
