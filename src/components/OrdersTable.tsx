import { useState, useMemo } from "react";
import { Order } from "@/types/finance";
import { Pencil, Trash2, Plus, Clock, Search, Server, Code, HardDrive, Globe, Package, LayoutGrid } from "lucide-react";
import { OrderFormDialog } from "./OrderFormDialog";
import { calculateDaysLeft } from "@/lib/daysLeft";

interface OrdersTableProps {
  orders: Order[];
  onAdd: (order: Omit<Order, "id">) => void;
  onUpdate: (id: string, order: Partial<Order>) => void;
  onDelete: (id: string) => void;
}

function categorize(serverType: string): string {
  const s = serverType.toLowerCase();
  if (s.includes("python") && s.includes("node")) return "Python & Node.js";
  if (s.includes("python")) return "Python";
  if (s.includes("node")) return "Node.js";
  if (s.includes("vps")) return "VPS";
  if (s.includes("website")) return "Website";
  if (s.includes("slot")) return "Slot";
  if (s.includes("mail")) return "Mail Server";
  return "Other";
}

const categoryIcons: Record<string, React.ElementType> = {
  "All": LayoutGrid, "Python": Code, "Node.js": Server, "Python & Node.js": Code,
  "VPS": HardDrive, "Website": Globe, "Other": Package,
  "Slot": Package, "Mail Server": Server,
};

const categoryColors: Record<string, string> = {
  "All": "text-primary border-primary/30 bg-primary/10",
  "Python": "text-chart-1 border-chart-1/30 bg-chart-1/10",
  "Node.js": "text-revenue border-revenue/30 bg-revenue/10",
  "Python & Node.js": "text-accent-foreground border-accent/30 bg-accent/10",
  "VPS": "text-profit border-profit/30 bg-profit/10",
  "Website": "text-primary border-primary/30 bg-primary/10",
  "Other": "text-muted-foreground border-border bg-secondary/30",
  "Slot": "text-chart-5 border-chart-5/30 bg-chart-5/10",
  "Mail Server": "text-muted-foreground border-border bg-secondary/30",
};

export function OrdersTable({ orders, onAdd, onUpdate, onDelete }: OrdersTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Build category tabs with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    const revenue: Record<string, number> = {};
    orders.forEach((o) => {
      const cat = categorize(o.serverType);
      counts[cat] = (counts[cat] || 0) + 1;
      revenue[cat] = (revenue[cat] || 0) + o.price;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [
      { name: "All", count: orders.length, revenue: orders.reduce((s, o) => s + o.price, 0) },
      ...sorted.map(([name, count]) => ({ name, count, revenue: revenue[name] || 0 })),
    ];
  }, [orders]);

  const filtered = useMemo(() => {
    let result = orders;
    if (activeCategory !== "All") {
      result = result.filter((o) => categorize(o.serverType) === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) =>
        o.customerId.toLowerCase().includes(q) ||
        o.serverType.toLowerCase().includes(q) ||
        o.paymentGateway.toLowerCase().includes(q) ||
        o.plan.toLowerCase().includes(q) ||
        o.date.includes(q)
      );
    }
    return result;
  }, [orders, activeCategory, search]);

  const activeRev = categories.find(c => c.name === activeCategory)?.revenue || 0;

  return (
    <div className="glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50">
        <div>
          <h2 className="text-lg font-semibold">Orders / Sales</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {filtered.length} orders · <span className="text-revenue">${activeRev.toFixed(0)}</span> revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 h-8 pl-8 pr-3 rounded-md border border-border/50 bg-secondary/50 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium hover:shadow-glow-sm transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.name] || Package;
          const isActive = activeCategory === cat.name;
          const colors = categoryColors[cat.name] || categoryColors["Other"];
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? `${colors} shadow-sm`
                  : "text-muted-foreground border-transparent hover:border-border/50 hover:bg-secondary/30"
              }`}
            >
              <Icon className="h-3 w-3" />
              {cat.name}
              <span className={`ml-0.5 text-[10px] font-mono ${isActive ? "opacity-80" : "opacity-50"}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground text-sm">
                  No orders found{activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                </td>
              </tr>
            )}
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
