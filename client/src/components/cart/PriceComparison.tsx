import React, { useState } from 'react';
import { Scale, ArrowUpRight, Equal, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface PriceComparisonProps {
  megaMartTotal: number;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({ megaMartTotal }) => {
  const [otherShopInput, setOtherShopInput] = useState<string>('');

  const parsedOtherPrice = parseFloat(otherShopInput);
  const isValidOtherPrice = !isNaN(parsedOtherPrice) && parsedOtherPrice > 0;

  const difference = isValidOtherPrice ? Math.abs(megaMartTotal - parsedOtherPrice) : 0;
  const isMegaMartCheaper = isValidOtherPrice && megaMartTotal < parsedOtherPrice;
  const isOtherCheaper = isValidOtherPrice && megaMartTotal > parsedOtherPrice;
  const isSamePrice = isValidOtherPrice && megaMartTotal === parsedOtherPrice;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Price Comparison</h3>
        </div>

        {otherShopInput && (
          <button
            onClick={() => setOtherShopInput('')}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            title="Reset comparison"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="space-y-1.5">
        <label htmlFor="other-shop-total" className="block text-xs font-bold text-slate-700">
          Other Shop Total: ₹____
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
            ₹
          </span>
          <Input
            id="other-shop-total"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="Enter other shop total"
            value={otherShopInput}
            onChange={(e) => setOtherShopInput(e.target.value)}
            className="pl-7 pr-3 h-10 font-bold text-slate-900 placeholder:text-slate-400 border-slate-200 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      {/* Comparison Results */}
      {isValidOtherPrice ? (
        <div className="space-y-3 pt-1">
          {/* Breakdown Rows */}
          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs border border-slate-100">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">MegaMart Total</span>
              <span className="font-black text-slate-900">{formatCurrency(megaMartTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">Other Shop Total</span>
              <span className="font-bold text-slate-700">{formatCurrency(parsedOtherPrice)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center">
              <span className="font-semibold text-slate-600">Difference</span>
              <span className="font-black text-slate-900">{formatCurrency(difference)}</span>
            </div>
          </div>

          {/* Outcome Message Callout */}
          {isMegaMartCheaper && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-black text-emerald-800">
                You save {formatCurrency(difference)} at MegaMart
              </span>
            </div>
          )}

          {isOtherCheaper && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="font-black text-amber-800">
                MegaMart is {formatCurrency(difference)} more
              </span>
            </div>
          )}

          {isSamePrice && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2">
              <Equal className="w-5 h-5 text-slate-600 shrink-0" />
              <span className="font-black">Same price</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[11px] text-slate-400 bg-slate-50/70 p-2.5 rounded-xl border border-dashed border-slate-200 text-center">
          Enter another shop total to compare.
        </div>
      )}
    </div>
  );
};
