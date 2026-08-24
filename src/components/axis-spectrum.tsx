"use client";

import type { AxisDef, Archetype } from "@/lib/interface-map";
import { zoneOf, zones } from "@/lib/interface-map";

interface Props {
  axis: AxisDef;
  selected: Archetype;
  compare: Archetype | null;
}

export function AxisSpectrum({ axis, selected, compare }: Props) {
  const value = selected.values[axis.id];
  const other = compare ? compare.values[axis.id] : null;
  const color = zones[zoneOf(selected)].color;

  return (
    <div className="group py-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13px] font-medium tracking-tight">{axis.name}</span>
        <span className="text-right text-[11px] leading-tight text-muted-foreground">
          {axis.hint}
        </span>
      </div>

      <div className="relative mt-2.5 h-4">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div
            key={t}
            className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-border"
            style={{ left: `${t * 100}%` }}
          />
        ))}

        {other !== null && (
          <>
            <div
              className="absolute top-1/2 h-px -translate-y-1/2 bg-foreground/25"
              style={{
                left: `${Math.min(value, other) * 100}%`,
                width: `${Math.abs(value - other) * 100}%`,
              }}
            />
            <div
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/50 bg-background"
              style={{ left: `${other * 100}%` }}
            />
          </>
        )}

        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-card transition-[left] duration-300 ease-out"
          style={{ left: `${value * 100}%`, backgroundColor: color }}
        />
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{axis.poles[0]}</span>
        <span>{axis.poles[1]}</span>
      </div>
    </div>
  );
}
