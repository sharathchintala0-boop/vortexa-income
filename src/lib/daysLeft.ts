export function calculateDaysLeft(orderDate: string, period: string): number | null {
  const p = period.toLowerCase().trim();
  const start = new Date(orderDate);
  if (isNaN(start.getTime())) return null;

  let endDate: Date;

  if (p.includes("year")) {
    endDate = new Date(start);
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else if (p === "1" || p.includes("month") || p.includes("1 month")) {
    endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    return null; // can't determine period
  }

  const now = new Date();
  const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
