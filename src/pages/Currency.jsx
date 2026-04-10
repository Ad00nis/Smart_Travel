import React, { useState, useEffect } from "react";
import { fetchDestinations } from "@/api/destinations";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, RefreshCw, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CurrencySelector from "@/components/currency/CurrencySelector";
import ExchangeRateTable from "@/components/currency/ExchangeRateTable";

const POPULAR_CURRENCIES = ["GBP", "USD", "EUR", "JPY", "THB", "IDR", "VND", "MXN", "COP", "MAD", "ZAR", "NZD", "ISK", "HUF", "INR", "TZS", "PEN", "HRK"];

export default function Currency() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("GBP");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { data: destinations = [] } = useQuery({
    queryKey: ["destinations"],
    queryFn: () =>
          fetchDestinations(),
  });

  const fetchRates = async () => {
    setLoading(true);

    try {
      // Swapped to a free, open API endpoint that doesn't require an access key
      const res = await fetch("https://open.er-api.com/v6/latest/GBP");
      const data = await res.json();

      if (data.result === "success") {
        setRates(data.rates);
        setLastUpdated(new Date());
      } else {
        console.error("Failed to fetch rates:", data);
      }
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const getRate = (fromCurrency, toCurrency) => {
    if (!rates) return null;
    const fromToGBP = fromCurrency === "GBP" ? 1 : (rates["GBP"] ? 1 / rates[fromCurrency] : null);
    const gbpToTarget = rates[toCurrency];
    if (!gbpToTarget) return null;
    return fromToGBP ? fromToGBP * gbpToTarget : null;
  };

  const rate = getRate(from, to);
  const converted = rate ? (parseFloat(amount) * rate).toFixed(2) : null;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Destinations with their currency rates for quick reference
  const destCurrencies = [...new Set(destinations.map((d) => d.currency).filter(Boolean))].slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-8 bg-blue-400 rounded-full" />
            <span className="text-blue-400 text-base font-medium tracking-wider uppercase">Currency Tool</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            Currency{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Converter
            </span>
          </h1>
          <p className="mt-2 text-slate-300 max-w-lg">
            Compare exchange rates for all your travel destinations in one place.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Main converter card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* From */}
            <div className="flex-1 w-full">
              <label className="text-xs text-slate-500 font-medium mb-1.5 block">Amount</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-bold h-14 text-slate-800"
                  min="0"
                />
                <CurrencySelector value={from} onChange={setFrom} currencies={POPULAR_CURRENCIES} />
              </div>
            </div>

            {/* Swap */}
            <div className="flex-shrink-0 mt-4 md:mt-5">
              <Button variant="outline" size="icon" onClick={swap} className="h-14 w-14 rounded-xl">
                <ArrowLeftRight className="w-5 h-5 text-slate-500" />
              </Button>
            </div>

            {/* To */}
            <div className="flex-1 w-full">
              <label className="text-xs text-slate-500 font-medium mb-1.5 block">Converted</label>
              <div className="flex gap-2">
                <div className={cn(
                  "flex-1 flex items-center px-4 bg-emerald-50 rounded-xl border border-emerald-100 h-14 text-2xl font-bold",
                  loading ? "text-slate-300" : "text-emerald-700"
                )}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : converted ?? "—"}
                </div>
                <CurrencySelector value={to} onChange={setTo} currencies={POPULAR_CURRENCIES} />
              </div>
            </div>
          </div>

          {rate && !loading && (
            <div className="mt-4 flex items-center justify-between text-base text-slate-500">
              <span>1 {from} = {rate.toFixed(4)} {to}</span>
              <div className="flex items-center gap-2">
                {lastUpdated && <span className="text-xs">Updated {lastUpdated.toLocaleTimeString()}</span>}
                <Button variant="ghost" size="sm" onClick={fetchRates} disabled={loading}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Destination rates table */}
        {rates && (
          <ExchangeRateTable
            rates={rates}
            amount={parseFloat(amount) || 100}
            fromCurrency={from}
            destinations={destinations}
            getRate={getRate}
          />
        )}
      </div>
    </div>
  );
}