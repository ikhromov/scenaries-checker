"use client";

import type { Archetype } from "@/lib/interface-map";
import { verdicts, verdictTone } from "@/lib/interface-map";

export function VerdictPanel({
  selected,
  compare,
}: {
  selected: Archetype;
  compare: Archetype | null;
}) {
  return (
    <div className="space-y-4">
      {verdicts.map((verdict) => {
        const value = verdict.compute(selected.values);
        const other = compare ? verdict.compute(compare.values) : null;
        const tone = verdictTone(value);

        return (
          <div key={verdict.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium tracking-tight">
                {verdict.name}
              </span>
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: tone.color }}
              >
                {tone.label} · {Math.round(value * 100)}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
              {verdict.desc}
            </p>

            <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${value * 100}%`, backgroundColor: tone.color }}
              />
              {other !== null && (
                <div
                  className="absolute inset-y-0 w-0.5 bg-foreground/60"
                  style={{ left: `calc(${other * 100}% - 1px)` }}
                />
              )}
            </div>

            <p className="mt-1.5 font-mono text-[10px] leading-tight text-muted-foreground/70">
              из осей: {verdict.drivers}
            </p>
          </div>
        );
      })}
    </div>
  );
}
