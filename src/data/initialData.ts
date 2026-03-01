import { Order, Expense } from "@/types/finance";

export const initialOrders: Order[] = [
  { id: "1", customerId: "k.sd.1_52668", serverType: "python", quantity: 2, paymentGateway: "crypto", price: 10, plan: "basic tier", months: "Yearly", date: "2026-01-05" },
  { id: "2", customerId: "exhaus_2", serverType: "node.js", quantity: 1, paymentGateway: "crypto", price: 3, plan: "4gb ram 75% 10gb disk", months: "1", date: "2026-01-05" },
  { id: "3", customerId: "call_me_bishwo", serverType: "Slot", quantity: 2, paymentGateway: "crypto", price: 3, plan: "-", months: "-", date: "2026-01-05" },
  { id: "4", customerId: "k.sd.1_52668", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 5, plan: "basic tier", months: "Yearly", date: "2026-01-07" },
  { id: "5", customerId: "radio_dev", serverType: "node.js", quantity: 1, paymentGateway: "UPI", price: 3, plan: "basic tier", months: "Yearly", date: "2026-01-09" },
  { id: "6", customerId: "exhaus_2", serverType: "node.js", quantity: 1, paymentGateway: "crypto", price: 3, plan: "4gb ram 200% 10gb disk (upgrade)", months: "1", date: "2026-01-10" },
  { id: "7", customerId: "k.sd.1_52668", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 5, plan: "basic tier", months: "Yearly", date: "2026-01-10" },
  { id: "8", customerId: "k07eqalt", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 3, plan: "basic tier", months: "Yearly", date: "2026-01-11" },
  { id: "9", customerId: "martinezsam01", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 3, plan: "basic tier", months: "Yearly", date: "2026-01-12" },
  { id: "10", customerId: "gamingwithahnaf_40456", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 3, plan: "basic tier", months: "Yearly", date: "2026-01-15" },
  { id: "11", customerId: "carter.accs", serverType: "python, node.js", quantity: 2, paymentGateway: "paypal", price: 6, plan: "basic tier", months: "Yearly", date: "2026-01-16" },
  { id: "12", customerId: "baymold", serverType: "node.js", quantity: 1, paymentGateway: "UPI", price: 3, plan: "pro tier", months: "1 month", date: "2026-01-16" },
  { id: "13", customerId: "KARTIK CHEAT", serverType: "python", quantity: 3, paymentGateway: "UPI", price: 1, plan: "standard tier", months: "Monthly", date: "2026-02-11" },
  { id: "14", customerId: "shelbivilis", serverType: "node.js", quantity: 1, paymentGateway: "UPI", price: 5.5, plan: "standard tier", months: "Yearly", date: "2026-02-13" },
  { id: "15", customerId: "Laur", serverType: "node.js", quantity: 1, paymentGateway: "paypal", price: 3, plan: "standard tier", months: "Yearly", date: "2026-02-14" },
  { id: "16", customerId: "KARTIK CHEAT", serverType: "python", quantity: 3, paymentGateway: "UPI", price: 1, plan: "standard tier", months: "Monthly", date: "2026-02-15" },
  { id: "17", customerId: "! xeno€ #Slot", serverType: "python", quantity: 1, paymentGateway: "LTC", price: 3, plan: "standard tier", months: "Monthly", date: "2026-02-15" },
  { id: "18", customerId: "dhruv819204", serverType: "VPS", quantity: 1, paymentGateway: "LTC", price: 6, plan: "standard tier", months: "Monthly", date: "2026-02-16", notes: "$3 paid to server" },
  { id: "19", customerId: "Muho Şekerci", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 3, plan: "standard tier", months: "Yearly", date: "2026-02-17" },
  { id: "20", customerId: "CazWR", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 1, plan: "1gb", months: "Monthly", date: "2026-02-18" },
  { id: "21", customerId: "! multiplaying", serverType: "python", quantity: 1, paymentGateway: "crypto", price: 3, plan: "standard tier", months: "Yearly", date: "2026-02-20" },
  { id: "22", customerId: "akr0p", serverType: "mailserver", quantity: 1, paymentGateway: "paypal", price: 2, plan: "standard tier", months: "Monthly", date: "2026-02-20" },
  { id: "23", customerId: "shelbivilis", serverType: "python", quantity: 1, paymentGateway: "paypal", price: 2, plan: "standard tier", months: "Monthly", date: "2026-02-20" },
  { id: "24", customerId: "PunisheR", serverType: "python", quantity: 1, paymentGateway: "UPI", price: 3, plan: "standard tier", months: "Yearly", date: "2026-02-21" },
  { id: "25", customerId: "crypto maker", serverType: "python", quantity: 1, paymentGateway: "Crypto LTC", price: 2.8, plan: "standard tier", months: "Yearly", date: "2026-02-23" },
  { id: "26", customerId: "Alex", serverType: "python", quantity: 1, paymentGateway: "Nitro", price: 10, plan: "standard tier", months: "Yearly", date: "2026-02-23", notes: "Paid with Nitro 1 month" },
  { id: "27", customerId: "website client", serverType: "website", quantity: 1, paymentGateway: "-", price: 3, plan: "-", months: "-", date: "2026-02-25" },
  { id: "28", customerId: "xrylsss", serverType: "python", quantity: 1, paymentGateway: "Crypto LTC", price: 3, plan: "standard tier", months: "Yearly", date: "2026-02-25" },
  { id: "29", customerId: "kingxtron", serverType: "python", quantity: 2, paymentGateway: "Crypto LTC", price: 5, plan: "standard tier", months: "Yearly", date: "2026-02-25" },
  { id: "30", customerId: "website client 2", serverType: "website", quantity: 1, paymentGateway: "-", price: 5.5, plan: "-", months: "-", date: "2026-02-28" },
  { id: "31", customerId: "akr0p", serverType: "VPS", quantity: 1, paymentGateway: "Paypal", price: 5.5, plan: "standard tier", months: "Yearly", date: "2026-02-28", notes: "$3 paid to server, profit $2.5" },
];

export const initialExpenses: Expense[] = [
  { id: "e1", description: "Server costs", amount: 25, date: "2026-01-01" },
];
