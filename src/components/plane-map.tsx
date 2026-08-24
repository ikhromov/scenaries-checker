"use client";

import { planeAxes, zones } from "@/lib/axes";
import { domains } from "@/lib/scenarios";
import type { Scenario } from "@/lib/scenarios";
import { cn } from "@/lib/utils";

const PLOT = { x0: 88, y0: 76, x1: 612, y1: 600 };
const toX = (v: number) => 106 + v * 488;
const toY = (v: number) => 92 + v * 468;
const CX = toX(0.5);
const CY = toY(0.5);
const FRAME = { x0: 60, y0: 48, x1: 640, y1: 628 };

const quadrantLabels = [
  { zone: "observation", x: PLOT.x0 + 16, y: PLOT.y0 + 26, anchor: "start" },
  { zone: "exploration", x: PLOT.x1 - 16, y: PLOT.y0 + 26, anchor: "end" },
  { zone: "transaction", x: PLOT.x0 + 16, y: PLOT.y1 - 26, anchor: "start" },
  { zone: "generation", x: PLOT.x1 - 16, y: PLOT.y1 - 26, anchor: "end" },
] as const;

interface Props {
  items: Scenario[];
  selected: Scenario;
  hovered: Scenario | null;
  onSelect: (s: Scenario) => void;
  onHover: (s: Scenario | null) => void;
}

export function PlaneMap({ items, selected, hovered, onSelect, onHover }: Props) {
  return (
    <svg
      viewBox="0 0 700 700"
      className="w-full select-none"
      role="img"
      aria-label="Плоскость: что делает пользователь по вертикали, открытость пространства вариантов по горизонтали"
    >
      <defs>
        <clipPath id="plane-clip">
          <rect
            x={PLOT.x0}
            y={PLOT.y0}
            width={PLOT.x1 - PLOT.x0}
            height={PLOT.y1 - PLOT.y0}
            rx={10}
          />
        </clipPath>
      </defs>

      {/* Navigation is not a quadrant — it is the ring you pass through to reach one. */}
      <rect
        x={FRAME.x0}
        y={FRAME.y0}
        width={FRAME.x1 - FRAME.x0}
        height={FRAME.y1 - FRAME.y0}
        rx={16}
        fill="none"
        stroke="oklch(0.72 0.02 260)"
        strokeOpacity={0.35}
        strokeDasharray="3 6"
      />
      <rect x={FRAME.x0 + 12} y={FRAME.y0 - 8} width={210} height={17} fill="var(--card)" />
      <text
        x={FRAME.x0 + 18}
        y={FRAME.y0 + 4}
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
        НАВИГАЦИЯ · НАЛОГ НА РАЗМЕР
      </text>

      <rect
        x={PLOT.x0}
        y={PLOT.y0}
        width={PLOT.x1 - PLOT.x0}
        height={PLOT.y1 - PLOT.y0}
        rx={10}
        className="fill-background stroke-border"
      />

      <g clipPath="url(#plane-clip)">
        {(
          [
            ["observation", PLOT.x0, PLOT.y0, CX - PLOT.x0, CY - PLOT.y0],
            ["exploration", CX, PLOT.y0, PLOT.x1 - CX, CY - PLOT.y0],
            ["transaction", PLOT.x0, CY, CX - PLOT.x0, PLOT.y1 - CY],
            ["generation", CX, CY, PLOT.x1 - CX, PLOT.y1 - CY],
          ] as const
        ).map(([zone, x, y, w, h]) => (
          <rect
            key={zone}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={zones[zone].color}
            fillOpacity={0.06}
          />
        ))}

        {[0.25, 0.75].map((t) => (
          <g key={t}>
            <line
              x1={toX(t)}
              y1={PLOT.y0}
              x2={toX(t)}
              y2={PLOT.y1}
              className="stroke-border"
              strokeOpacity={0.5}
              strokeDasharray="2 6"
            />
            <line
              x1={PLOT.x0}
              y1={toY(t)}
              x2={PLOT.x1}
              y2={toY(t)}
              className="stroke-border"
              strokeOpacity={0.5}
              strokeDasharray="2 6"
            />
          </g>
        ))}
        <line x1={CX} y1={PLOT.y0} x2={CX} y2={PLOT.y1} className="stroke-border" />
        <line x1={PLOT.x0} y1={CY} x2={PLOT.x1} y2={CY} className="stroke-border" />
      </g>

      {quadrantLabels.map((q) => (
        <g key={q.zone}>
          <text
            x={q.x}
            y={q.y}
            textAnchor={q.anchor}
            fill={zones[q.zone].color}
            fillOpacity={0.75}
            className="font-mono text-[11px] tracking-[0.2em]"
          >
            {zones[q.zone].title}
          </text>
          <text
            x={q.x}
            y={q.y + 14}
            textAnchor={q.anchor}
            className="fill-muted-foreground text-[10px]"
          >
            {zones[q.zone].gloss}
          </text>
        </g>
      ))}

      <text x={350} y={26} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]">
        {planeAxes.y.poles[0].toUpperCase()}
      </text>
      <text x={350} y={668} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]">
        {planeAxes.y.poles[1].toUpperCase()}
      </text>
      <text
        x={26}
        y={338}
        textAnchor="middle"
        transform="rotate(-90 26 338)"
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
        {planeAxes.x.poles[0].toUpperCase()} ПРОСТРАНСТВО
      </text>
      <text
        x={676}
        y={338}
        textAnchor="middle"
        transform="rotate(90 676 338)"
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
        {planeAxes.x.poles[1].toUpperCase()} ПРОСТРАНСТВО
      </text>

      {items.map((s) => {
        const meta = s.meta;
        const x = meta ? 470 : toX(s.values.openness);
        const y = meta ? FRAME.y0 : toY(s.values.mode);
        return (
          <PlotDot
            key={s.id}
            scenario={s}
            x={x}
            y={y}
            color={domains[s.domain].color}
            selected={selected.id === s.id}
            hovered={hovered?.id === s.id}
            labelAnchor={x > 430 ? "end" : "start"}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </svg>
  );
}

export function PlotDot({
  scenario,
  x,
  y,
  color,
  selected,
  hovered,
  labelAnchor,
  onSelect,
  onHover,
}: {
  scenario: Scenario;
  x: number;
  y: number;
  color: string;
  selected: boolean;
  hovered: boolean;
  labelAnchor: "start" | "end";
  onSelect: (s: Scenario) => void;
  onHover: (s: Scenario | null) => void;
}) {
  const active = selected || hovered;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={scenario.name}
      aria-pressed={selected}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(scenario)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(scenario);
        }
      }}
      onMouseEnter={() => onHover(scenario)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(scenario)}
      onBlur={() => onHover(null)}
    >
      <circle cx={x} cy={y} r={16} fill="transparent" />
      {selected && (
        <circle cx={x} cy={y} r={13} fill={color} fillOpacity={0.14} stroke={color} strokeOpacity={0.55} />
      )}
      <circle
        cx={x}
        cy={y}
        r={active ? 5.5 : 4}
        fill={active ? color : "var(--background)"}
        stroke={color}
        strokeWidth={1.6}
        strokeOpacity={active ? 1 : 0.75}
      />
      {active && (
        <>
          <rect
            x={labelAnchor === "start" ? x + 9 : x - 9 - scenario.name.length * 5.4}
            y={y - 8}
            width={scenario.name.length * 5.4 + 8}
            height={16}
            rx={3}
            fill="var(--card)"
            fillOpacity={0.92}
          />
          <text
            x={labelAnchor === "start" ? x + 13 : x - 13}
            y={y + 4}
            textAnchor={labelAnchor}
            className={cn("fill-foreground text-[10.5px]")}
          >
            {scenario.name}
          </text>
        </>
      )}
    </g>
  );
}
