import { useState, useCallback, useEffect } from "react";
import { Order, Expense } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

async function notifyDiscord(action: string, type: string, data: any) {
  try {
    await supabase.functions.invoke("discord-notify", {
      body: { action, type, data },
    });
  } catch (e) {
    console.error("Discord notify failed:", e);
  }
}

const REVENUE_OVERRIDE_KEY = "hosting_revenue_override";
const EXPENSES_OVERRIDE_KEY = "hosting_expenses_override";

function loadOverride(key: string): number | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    serverType: row.server_type,
    quantity: row.quantity,
    paymentGateway: row.payment_gateway,
    price: Number(row.price),
    plan: row.plan,
    months: row.months,
    date: row.date,
    notes: row.notes ?? undefined,
  };
}

function mapExpense(row: any): Expense {
  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    date: row.date,
  };
}

export function useFinanceData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenueOverride, setRevenueOverride] = useState<number | null>(() => loadOverride(REVENUE_OVERRIDE_KEY));
  const [expensesOverride, setExpensesOverride] = useState<number | null>(() => loadOverride(EXPENSES_OVERRIDE_KEY));

  // Fetch from DB + realtime sync
  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from("orders").select("*").order("date", { ascending: true });
      if (data) setOrders(data.map(mapOrder));
    };
    const fetchExpenses = async () => {
      const { data } = await supabase.from("expenses").select("*").order("date", { ascending: true });
      if (data) setExpenses(data.map(mapExpense));
    };
    fetchOrders();
    fetchExpenses();

    // Realtime subscriptions for live sync
    const ordersChannel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    const expensesChannel = supabase
      .channel('expenses-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchExpenses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(expensesChannel);
    };
  }, []);

  const calculatedRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const calculatedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = revenueOverride ?? calculatedRevenue;
  const totalExpenses = expensesOverride ?? calculatedExpenses;
  const totalProfit = totalRevenue - totalExpenses;

  const overrideRevenue = useCallback((val: number) => {
    setRevenueOverride(val);
    localStorage.setItem(REVENUE_OVERRIDE_KEY, JSON.stringify(val));
  }, []);

  const overrideExpenses = useCallback((val: number) => {
    setExpensesOverride(val);
    localStorage.setItem(EXPENSES_OVERRIDE_KEY, JSON.stringify(val));
  }, []);

  const addOrder = useCallback(async (order: Omit<Order, "id">) => {
    const { data } = await supabase.from("orders").insert({
      customer_id: order.customerId,
      server_type: order.serverType,
      quantity: order.quantity,
      payment_gateway: order.paymentGateway,
      price: order.price,
      plan: order.plan,
      months: order.months,
      date: order.date,
      notes: order.notes || null,
    }).select().single();
    if (data) {
      setOrders(prev => [...prev, mapOrder(data)]);
      // Clear revenue override so calculated total is used
      setRevenueOverride(null);
      localStorage.removeItem(REVENUE_OVERRIDE_KEY);
      notifyDiscord("added", "order", order);
    }
  }, []);

  const updateOrder = useCallback(async (id: string, order: Partial<Order>) => {
    const update: any = {};
    if (order.customerId !== undefined) update.customer_id = order.customerId;
    if (order.serverType !== undefined) update.server_type = order.serverType;
    if (order.quantity !== undefined) update.quantity = order.quantity;
    if (order.paymentGateway !== undefined) update.payment_gateway = order.paymentGateway;
    if (order.price !== undefined) update.price = order.price;
    if (order.plan !== undefined) update.plan = order.plan;
    if (order.months !== undefined) update.months = order.months;
    if (order.date !== undefined) update.date = order.date;
    if (order.notes !== undefined) update.notes = order.notes;
    await supabase.from("orders").update(update).eq("id", id);
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, ...order } : o);
      const found = updated.find(o => o.id === id);
      if (found) notifyDiscord("updated", "order", found);
      return updated;
    });
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    const toDelete = orders.find(o => o.id === id);
    await supabase.from("orders").delete().eq("id", id);
    setOrders(prev => prev.filter(o => o.id !== id));
    setRevenueOverride(null);
    localStorage.removeItem(REVENUE_OVERRIDE_KEY);
    if (toDelete) notifyDiscord("deleted", "order", toDelete);
  }, [orders]);

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    const { data } = await supabase.from("expenses").insert({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
    }).select().single();
    if (data) {
      setExpenses(prev => [...prev, mapExpense(data)]);
      notifyDiscord("added", "expense", expense);
    }
  }, []);

  const updateExpense = useCallback(async (id: string, expense: Partial<Expense>) => {
    const update: any = {};
    if (expense.description !== undefined) update.description = expense.description;
    if (expense.amount !== undefined) update.amount = expense.amount;
    if (expense.date !== undefined) update.date = expense.date;
    await supabase.from("expenses").update(update).eq("id", id);
    setExpenses(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...expense } : e);
      const found = updated.find(e => e.id === id);
      if (found) notifyDiscord("updated", "expense", found);
      return updated;
    });
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    const toDelete = expenses.find(e => e.id === id);
    await supabase.from("expenses").delete().eq("id", id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (toDelete) notifyDiscord("deleted", "expense", toDelete);
  }, [expenses]);

  return {
    orders, expenses,
    totalRevenue, totalExpenses, totalProfit,
    addOrder, updateOrder, deleteOrder,
    addExpense, updateExpense, deleteExpense,
    overrideRevenue, overrideExpenses,
  };
}
