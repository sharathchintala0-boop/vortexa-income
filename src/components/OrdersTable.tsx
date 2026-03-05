import { useState } from "react";
import { Order } from "@/types/finance";
import { Pencil, Trash2, Plus, Clock, Search } from "lucide-react";
import { OrderFormDialog } from "./OrderFormDialog";
import { calculateDaysLeft } from "@/lib/daysLeft";

interface OrdersTableProps {
  orders: Order[];
  onAdd: (order: Omit<Order, "id">) => void;
  onUpdate: (id: string, order: Partial<Order>) => void;
  onDelete: (id: string) => void;
}

export function OrdersTable({ orders, onAdd, onUpdate, onDelete }: OrdersTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.customerId.toLowerCase().includes(q) ||
      o.serverType.toLowerCase().includes(q) ||
      o.paymentGateway.toLowerCase().includes(q) ||
      o.plan.toLowerCase().includes(q) ||
      o.date.includes(q)
    );
  });

  return (
    <div className="glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold shrink-0">Orders / Sales</h2>
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md border border-border/50 bg-secondary/50 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium hover:shadow-glow-sm transition-all duration-200"
        >
          <Plus className="h-4 w-4" /> Add Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Date</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Customer ID</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Server</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Qty</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Gateway</th>
              <th className="text-right p-3 font-medium text-xs uppercase tracking-wider">Price</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Plan</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Period</th>
              <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Days Left</th>
              <th className="text-right p-3 font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors group">
                <td className="p-3 font-mono text-xs text-muted-foreground">{order.date}</td>
                <td className="p-3 font-medium">{order.customerId}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                    {order.serverType}
                  </span>
                </td>
                <td className="p-3 font-mono">{order.quantity}</td>
                <td className="p-3 text-xs text-muted-foreground">{order.paymentGateway}</td>
                <td className="p-3 text-right font-mono text-revenue font-semibold">${order.price.toFixed(2)}</td>
                <td className="p-3 text-xs">{order.plan}</td>
                <td className="p-3 text-xs font-mono">{order.months}</td>
                <td className="p-3">
                  {(() => {
                    const days = calculateDaysLeft(order.date, order.months);
                    if (days === null) return <span className="text-xs text-muted-foreground">—</span>;
                    if (days <= 0) return <span className="text-xs font-semibold text-expense px-1.5 py-0.5 rounded bg-expense/10 border border-expense/20">Expired</span>;
                    if (days <= 7) return <span className="flex items-center gap-1 text-xs font-semibold text-expense"><Clock className="h-3 w-3 animate-pulse-glow" />{days}d</span>;
                    if (days <= 30) return <span className="flex items-center gap-1 text-xs font-medium text-chart-3"><Clock className="h-3 w-3" />{days}d</span>;
                    return <span className="text-xs text-muted-foreground font-mono">{days}d</span>;
                  })()}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingOrder(order)} className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => onDelete(order.id)} className="p-1.5 rounded hover:bg-expense/10 transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-expense" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <OrderFormDialog
          onSave={(data) => { onAdd(data); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}
      {editingOrder && (
        <OrderFormDialog
          order={editingOrder}
          onSave={(data) => { onUpdate(editingOrder.id, data); setEditingOrder(null); }}
          onClose={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
}
