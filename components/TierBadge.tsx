import type { ReadinessTier } from "@/lib/scoring";

const TIER_ORDER: ReadinessTier[] = [
  "Foundation",
  "Developing",
  "Scaling",
  "Leading",
];

// Mono, uppercase, radius-sm tier strip. The achieved tier is filled cobalt;
// the rest read as a faint sequence so the badge doubles as a scale readout.
export default function TierBadge({ tier }: { tier: ReadinessTier }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-0.5 rounded-sm border border-hairline bg-surface-2 p-1 sm:gap-1">
      {TIER_ORDER.map((t) => {
        const active = t === tier;
        return (
          <span
            key={t}
            className={`rounded-sm px-1.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-normal transition sm:px-2.5 sm:text-xs sm:tracking-wide ${
              active ? "bg-accent text-white" : "text-faint"
            }`}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}
