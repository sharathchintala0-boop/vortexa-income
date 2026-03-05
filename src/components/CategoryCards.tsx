import { useState } from "react";
import { Order } from "@/types/finance";
import { Server, Code, HardDrive, Globe, Package, ChevronDown, ChevronUp } from "lucide-react";

interface CategoryCardsProps {
  orders: Order[];
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
  "Python": Code, "Node.js": Server, "Python & Node.js": Code,
  "VPS": HardDrive, "Website": Globe, "Other": Package,
  "Slot": Package, "Mail Server": Server,
};

const categoryGlows: Record<string, string> = {
  "Python": "hover:shadow-glow-sm border-chart-1/20",
  "Node.js": "hover:shadow-glow-revenue border-revenue/20",
  "Python & Node.js": "hover:shadow-glow-accent border-accent/20",
  "VPS": "hover:shadow-glow-profit border-profit/20",
  "Website": "hover:shadow-glow-sm border-primary/20",
  "Other": "border-border/50",
  "Slot": "hover:shadow-glow-accent border-chart-5/20",
  "Mail Server": "border-border/50",
};

const categoryTextColors: Record<string, string> = {
  "Python": "text-chart-1", "Node.js": "text-revenue", "Python & Node.js": "text-accent-foreground",
  "VPS": "text-profit", "Website": "text-primary", "Other": "text-muted-foreground",
  "Slot": "text-chart-5", "Mail Server": "text-muted-foreground",
};

function CategoryCard({ cat, data, orders }: { cat: string; data: { customers: Set<string>; revenue: number; count: number }; orders: Order[] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = categoryIcons[cat] || Package;
  const glow = categoryGlows[cat] || categoryGlows["Other"];
  const textColor = categoryTextColors[cat] || categoryTextColors["Other"];
  const customerList = Array.from(data.customers);

  const customerOrders: Record<string, Order[]> = {};
  orders.forEach((order) => {
    if (categorize(order.serverType) === cat) {
      if (!customerOrders[order.customerId]) customerOrders[order.customerId] = [];
      customerOrders[order.customerId].push(order);
    }
  });

  return (
    <div
      className={`rounded-lg border bg-card/60 backdrop-blur-sm p-4 cursor-pointer transition-all duration-300 ${glow}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md bg-secondary/50`}>
            <Icon className={`h-3.5 w-3.5 ${textColor}`} />
          </div>
          <span className={`text-sm font-semibold ${textColor}`}>{cat}</span>
        </div>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <p className="text-xs text-muted-foreground mb-2 font-mono">
        {data.count} orders · {customerList.length} clients · <span className="text-revenue">${data.revenue.toFixed(0)}</span>
      </p>

      {!expanded && (
        <div className="text-xs">
          {customerList.slice(0, 3).map((c) => (
            <span key={c} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-secondary/50 text-secondary-foreground text-[10px] font-mono">
              {c}
            </span>
          ))}
          {customerList.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{customerList.length - 3} more</span>
          )}
        </div>
      )}

      {expanded && (
        <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
          {customerList.map((customer) => (
            <div key={customer} className="rounded-md bg-secondary/30 border border-border/30 p-2">
              <p className="text-xs font-semibold mb-1 text-foreground">{customer}</p>
              {customerOrders[customer]?.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{order.date} · {order.plan}</span>
                  <span className="font-semibold text-revenue">${order.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryCards({ orders }: CategoryCardsProps) {
  const groups: Record<string, { customers: Set<string>; revenue: number; count: number }> = {};

  orders.forEach((order) => {
    const cat = categorize(order.serverType);
    if (!groups[cat]) groups[cat] = { customers: new Set(), revenue: 0, count: 0 };
    groups[cat].customers.add(order.customerId);
    groups[cat].revenue += order.price;
    groups[cat].count += 1;
  });

  const sorted = Object.entries(groups).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold">Categories</h2>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sorted.map(([cat, data]) => (
          <CategoryCard key={cat} cat={cat} data={data} orders={orders} />
        ))}
      </div>
    </div>
  );
}
