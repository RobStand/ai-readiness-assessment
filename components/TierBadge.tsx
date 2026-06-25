import type { ReadinessTier } from "@/lib/scoring";

const TIER_STYLES: Record<ReadinessTier, string> = {
  Foundation: "bg-slate-100 text-slate-700 ring-slate-300",
  Developing: "bg-brand-100 text-brand-700 ring-brand-300",
  Scaling: "bg-emerald-100 text-emerald-700 ring-emerald-300",
  Leading: "bg-purple-100 text-purple-700 ring-purple-300",
};

export default function TierBadge({ tier }: { tier: ReadinessTier }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ${TIER_STYLES[tier]}`}
    >
      {tier}
    </span>
  );
}
