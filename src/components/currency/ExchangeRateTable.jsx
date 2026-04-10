import React from "react";
import { TrendingUp, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CURRENCY_LABELS = {
  GBP: "British Pound", USD: "US Dollar", EUR: "Euro", JPY: "Japanese Yen",
  THB: "Thai Baht", IDR: "Indonesian Rupiah", VND: "Vietnamese Dong",
  MXN: "Mexican Peso", COP: "Colombian Peso", MAD: "Moroccan Dirham",
  ZAR: "South African Rand", NZD: "New Zealand Dollar", ISK: "Icelandic Króna",
  HUF: "Hungarian Forint", INR: "Indian Rupee", TZS: "Tanzanian Shilling",
  PEN: "Peruvian Sol", HRK: "Croatian Kuna",
};

export default function ExchangeRateTable({ rates, amount, fromCurrency, destinations, getRate }) {
  // Build a list of currencies with associated destinations
  const currencyDestMap = {};
  destinations.forEach((d) => {
    if (d.currency && !currencyDestMap[d.currency]) {
      currencyDestMap[d.currency] = d;
    }
  });

  const rows = Object.keys(rates)
    .filter((c) => c !== fromCurrency)
    .map((currency) => {
      const rate = getRate(fromCurrency, currency);
      const converted = rate ? (amount * rate) : null;
      const dest = currencyDestMap[currency];
      return { currency, rate, converted, dest };
    })
    .filter((r) => r.rate)
    .sort((a, b) => (a.dest ? -1 : 1));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <h3 className="font-semibold text-slate-800">Exchange Rates from {fromCurrency}</h3>
        <span className="text-base text-slate-400">— {amount} {fromCurrency} equals</span>
      </div>
      <div className="divide-y divide-slate-50">
        {rows.map(({ currency, rate, converted, dest }) => (
          <div key={currency} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-base font-bold text-slate-600">
                {currency.slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-slate-800 text-base">{currency}</p>
                <p className="text-xs text-slate-400">{CURRENCY_LABELS[currency] || currency}</p>
              </div>
              {dest && (
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{dest.name}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">
                {converted ? (converted > 1000 ? converted.toLocaleString(undefined, { maximumFractionDigits: 0 }) : converted.toFixed(2)) : "—"}
              </p>
              <p className="text-xs text-slate-400">1 {fromCurrency} = {rate?.toFixed(4)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}