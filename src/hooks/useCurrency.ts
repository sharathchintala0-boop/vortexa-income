import { useState, useEffect, useCallback } from "react";

const RATE_CACHE_KEY = "hosting_usd_inr_rate";
const CURRENCY_PREF_KEY = "hosting_currency_pref";

export function useCurrency() {
  const [isINR, setIsINR] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CURRENCY_PREF_KEY) === "INR";
    } catch { return false; }
  });

  const [rate, setRate] = useState<number>(() => {
    try {
      const cached = localStorage.getItem(RATE_CACHE_KEY);
      if (cached) {
        const { rate, timestamp } = JSON.parse(cached);
        // Use cache if less than 1 hour old
        if (Date.now() - timestamp < 3600000) return rate;
      }
    } catch { }
    return 85; // fallback
  });

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data?.rates?.INR) {
          setRate(data.rates.INR);
          localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate: data.rates.INR, timestamp: Date.now() }));
        }
      } catch {
        // keep fallback
      }
    };
    fetchRate();
  }, []);

  const toggleCurrency = useCallback(() => {
    setIsINR(prev => {
      const next = !prev;
      localStorage.setItem(CURRENCY_PREF_KEY, next ? "INR" : "USD");
      return next;
    });
  }, []);

  const format = useCallback((usdAmount: number) => {
    if (isINR) {
      return `₹${(usdAmount * rate).toFixed(2)}`;
    }
    return `$${usdAmount.toFixed(2)}`;
  }, [isINR, rate]);

  const symbol = isINR ? "₹" : "$";

  return { isINR, rate, toggleCurrency, format, symbol };
}
