"use client";

import type { AxisDef, AxisValues } from "@/lib/axes";

/** Keep markers at the poles fully inside the track instead of half-clipped. */
const THUMB = 12;
const at = (t: number) => `calc(${THUMB / 2}px + ${t} * (100% - ${THUMB}px))`;

interface Props {
  axis: AxisDef;
  values: AxisValues;
  compareValues: AxisValues | null;
  color: string;
}

export function AxisSpectrum({ axis, values, compareValues, color }: Props) {
  const value = values[axis.id];
  const other = compareValues ? compareValues[axis.id] : null;

  return (
    <div className="py-2.5">
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
            style={{ left: at(t) }}
          />
        ))}

        {other !== null && (
          <>
            <div
              className="absolute top-1/2 h-px -translate-y-1/2 bg-foreground/25"
              style={{
                left: at(Math.min(value, other)),
                width: `calc(${Math.abs(value - other)} * (100% - ${THUMB}px))`,
              }}
            />
            <div
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/50 bg-background"
              style={{ left: at(other) }}
            />
          </>
        )}

        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-card transition-[left] duration-300 ease-out"
          style={{ left: at(value), backgroundColor: color }}
        />
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{axis.poles[0]}</span>
        <span>{axis.poles[1]}</span>
      </div>
    </div>
  );
}
