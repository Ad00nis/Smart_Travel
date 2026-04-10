import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CURRENCY_LABELS = {
  GBP: "🇬🇧 GBP", USD: "🇺🇸 USD", EUR: "🇪🇺 EUR", JPY: "🇯🇵 JPY",
  THB: "🇹🇭 THB", IDR: "🇮🇩 IDR", VND: "🇻🇳 VND", MXN: "🇲🇽 MXN",
  COP: "🇨🇴 COP", MAD: "🇲🇦 MAD", ZAR: "🇿🇦 ZAR", NZD: "🇳🇿 NZD",
  ISK: "🇮🇸 ISK", HUF: "🇭🇺 HUF", INR: "🇮🇳 INR", TZS: "🇹🇿 TZS",
  PEN: "🇵🇪 PEN", HRK: "🇭🇷 HRK",
};

export default function CurrencySelector({ value, onChange, currencies }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 h-14 text-base font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c} value={c}>
            {CURRENCY_LABELS[c] || c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}