import { useState, useCallback } from "react";
import { Order, Expense } from "@/types/finance";
import { initialOrders, initialExpenses } from "@/data/initialData";

const ORDERS_KEY = "hosting_orders_v2";
const EXPENSES_KEY = "hosting_expenses_v2";

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

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;

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
  };
}
