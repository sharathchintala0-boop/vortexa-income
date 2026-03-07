import { useMemo } from "react";
import { Order } from "@/types/finance";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  orders: Order[];
  format: (val: number) => string;
  symbol: string;
}

export function RevenueChart({ orders, format, symbol }: RevenueChartProps) {
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const d = new Date(o.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + o.price;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => {
        const [y, m] = month.split("-");
        const label = new Date(+y, +m - 1).toLocaleString("en", { month: "short", year: "2-digit" });
        return { month: label, revenue, raw: revenue };
      });
  }, [orders]);

  const totalAvg = monthlyData.length
    ? monthlyData.reduce((s, d) => s + d.revenue, 0) / monthlyData.length
    : 0;

  return (
    <div className="glow-card rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-revenue" />
            Monthly Revenue
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {monthlyData.length} months · avg{" "}
            <span className="text-revenue">{format(totalAvg)}</span>/mo
          </p>
        </div>
      </div>

      <div className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--revenue))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--revenue))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border) / 0.3)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${symbol}${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [format(value), "Revenue"]}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--revenue))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ r: 4, fill: "hsl(var(--revenue))", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "hsl(var(--revenue))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
