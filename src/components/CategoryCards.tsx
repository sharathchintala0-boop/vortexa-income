import { Order } from "@/types/finance";
import { Server, Code, HardDrive, Globe, Package } from "lucide-react";

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
  "Python": Code,
  "Node.js": Server,
  "Python & Node.js": Code,
  "VPS": HardDrive,
  "Website": Globe,
  "Other": Package,
  "Slot": Package,
  "Mail Server": Server,
};

const categoryColors: Record<string, string> = {
  "Python": "bg-chart-1/15 text-chart-1 border-chart-1/30",
  "Node.js": "bg-revenue/15 text-revenue border-revenue/30",
  "Python & Node.js": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  "VPS": "bg-profit/15 text-profit border-profit/30",
  "Website": "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "Other": "bg-secondary text-muted-foreground border-border",
  "Slot": "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "Mail Server": "bg-chart-5/15 text-chart-5 border-chart-5/30",
};

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
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Categories</h2>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sorted.map(([cat, data]) => {
          const Icon = categoryIcons[cat] || Package;
          const colors = categoryColors[cat] || categoryColors["Other"];
          return (
            <div key={cat} className={`rounded-lg border p-4 ${colors}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold">{cat}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-80">{data.count} orders · ${data.revenue.toFixed(0)} revenue</p>
                <div className="text-xs opacity-70">
                  {Array.from(data.customers).slice(0, 5).map((c) => (
                    <span key={c} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-background/50 text-foreground text-[10px]">
                      {c}
                    </span>
                  ))}
                  {data.customers.size > 5 && (
                    <span className="text-[10px] opacity-60">+{data.customers.size - 5} more</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
