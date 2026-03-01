import { useState } from "react";
import { Order } from "@/types/finance";
import { Pencil, Trash2, Plus } from "lucide-react";
import { OrderFormDialog } from "./OrderFormDialog";

interface OrdersTableProps {
  orders: Order[];
  onAdd: (order: Omit<Order, "id">) => void;
  onUpdate: (id: string, order: Partial<Order>) => void;
  onDelete: (id: string) => void;
}

export function OrdersTable({ orders, onAdd, onUpdate, onDelete }: OrdersTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Orders / Sales</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Customer ID</th>
              <th className="text-left p-3 font-medium">Server</th>
              <th className="text-left p-3 font-medium">Qty</th>
              <th className="text-left p-3 font-medium">Gateway</th>
              <th className="text-right p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Plan</th>
              <th className="text-left p-3 font-medium">Period</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{order.date}</td>
                <td className="p-3 font-medium">{order.customerId}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    {order.serverType}
                  </span>
                </td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3 text-xs">{order.paymentGateway}</td>
                <td className="p-3 text-right font-mono text-revenue font-semibold">${order.price.toFixed(2)}</td>
                <td className="p-3 text-xs">{order.plan}</td>
                <td className="p-3 text-xs">{order.months}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditingOrder(order)} className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => onDelete(order.id)} className="p-1.5 rounded hover:bg-destructive/20 transition-colors">
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
