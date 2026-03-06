import { useFinanceData } from "@/hooks/useFinanceData";
import { useCurrency } from "@/hooks/useCurrency";
import { StatsCards } from "@/components/StatsCards";
import { OrdersTable } from "@/components/OrdersTable";
import { ExpensesTable } from "@/components/ExpensesTable";

import { UpiBalanceCard } from "@/components/UpiBalanceCard";
import { CryptoBalanceCard } from "@/components/CryptoBalanceCard";
import { Server, Zap } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const }
  })
};

const Index = () => {
  const {
    orders, expenses,
    totalRevenue, totalExpenses, totalProfit,
    addOrder, updateOrder, deleteOrder,
    addExpense, updateExpense, deleteExpense,
    overrideRevenue, overrideExpenses,
  } = useFinanceData();

  const { isINR, rate, toggleCurrency, format, symbol } = useCurrency();

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-profit/5 rounded-full blur-3xl" />
      </div>

      <header className="relative border-b border-border/50 px-6 py-4 glass">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-md"
          >
            <Server className="h-5 w-5 text-primary-foreground" />
            <Zap className="absolute -top-1 -right-1 h-3.5 w-3.5 text-chart-3 animate-pulse-glow" />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold tracking-tight text-glow-primary"
            >
              Vortexacloud
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted-foreground font-mono uppercase tracking-widest"
            >
              Revenue Command Center
            </motion.p>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-6 space-y-6">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <StatsCards
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            totalProfit={totalProfit}
            orderCount={orders.length}
            onOverrideRevenue={overrideRevenue}
            onOverrideExpenses={overrideExpenses}
            format={format}
            symbol={symbol}
            isINR={isINR}
            onToggleCurrency={toggleCurrency}
            rate={rate}
          />
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UpiBalanceCard format={format} symbol={symbol} />
          <CryptoBalanceCard format={format} symbol={symbol} />
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <CategoryCards orders={orders} />
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <OrdersTable orders={orders} onAdd={addOrder} onUpdate={updateOrder} onDelete={deleteOrder} />
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <ExpensesTable expenses={expenses} onAdd={addExpense} onUpdate={updateExpense} onDelete={deleteExpense} />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
