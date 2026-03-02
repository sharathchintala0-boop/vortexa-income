import { useState, useCallback } from "react";
import { Order, Expense } from "@/types/finance";
import { initialOrders, initialExpenses } from "@/data/initialData";

const ORDERS_KEY = "hosting_orders_v2";
const EXPENSES_KEY = "hosting_expenses_v2";
const REVENUE_OVERRIDE_KEY = "hosting_revenue_override";
const EXPENSES_OVERRIDE_KEY = "hosting_expenses_override";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useFinanceData() {
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage(ORDERS_KEY, initialOrders));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage(EXPENSES_KEY, initialExpenses));
  const [revenueOverride, setRevenueOverride] = useState<number | null>(() => loadFromStorage(REVENUE_OVERRIDE_KEY, null));
  const [expensesOverride, setExpensesOverride] = useState<number | null>(() => loadFromStorage(EXPENSES_OVERRIDE_KEY, null));

  const calculatedRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const calculatedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = revenueOverride ?? calculatedRevenue;
  const totalExpenses = expensesOverride ?? calculatedExpenses;
  const totalProfit = totalRevenue - totalExpenses;

  const overrideRevenue = useCallback((val: number) => {
    setRevenueOverride(val);
    saveToStorage(REVENUE_OVERRIDE_KEY, val);
  }, []);

  const overrideExpenses = useCallback((val: number) => {
    setExpensesOverride(val);
    saveToStorage(EXPENSES_OVERRIDE_KEY, val);
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id">) => {
    setOrders(prev => {
      const next = [...prev, { ...order, id: Date.now().toString() }];
      saveToStorage(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const updateOrder = useCallback((id: string, order: Partial<Order>) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, ...order } : o);
      saveToStorage(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => {
      const next = prev.filter(o => o.id !== id);
      saveToStorage(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setExpenses(prev => {
      const next = [...prev, { ...expense, id: Date.now().toString() }];
      saveToStorage(EXPENSES_KEY, next);
      return next;
    });
  }, []);

  const updateExpense = useCallback((id: string, expense: Partial<Expense>) => {
    setExpenses(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...expense } : e);
      saveToStorage(EXPENSES_KEY, next);
      return next;
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id);
      saveToStorage(EXPENSES_KEY, next);
      return next;
    });
  }, []);

  return {
    orders, expenses,
    totalRevenue, totalExpenses, totalProfit,
    addOrder, updateOrder, deleteOrder,
    addExpense, updateExpense, deleteExpense,
    overrideRevenue, overrideExpenses,
  };
}
