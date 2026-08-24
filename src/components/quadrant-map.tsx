"use client";

import { archetypes, planeAxes, zoneOf, zones } from "@/lib/interface-map";
import type { Archetype } from "@/lib/interface-map";
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
  selected: Archetype;
  hovered: Archetype | null;
  onSelect: (a: Archetype) => void;
  onHover: (a: Archetype | null) => void;
}

export function QuadrantMap({ selected, hovered, onSelect, onHover }: Props) {
  const plotted = archetypes.filter((a) => !a.meta);
  const metaOnes = archetypes.filter((a) => a.meta);

  return (
    <svg
      viewBox="0 0 700 700"
      className="w-full select-none"
      role="img"
      aria-label="Плоскость, заданная двумя главными осями: что делает пользователь и насколько открыто пространство вариантов"
    >
      <defs>
        <clipPath id="plot-clip">
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
        stroke={zones.meta.color}
        strokeOpacity={0.35}
        strokeWidth={1}
        strokeDasharray="3 6"
      />
      <rect x={FRAME.x0 + 12} y={FRAME.y0 - 8} width={196} height={17} fill="var(--card)" />
      <text
        x={FRAME.x0 + 18}
        y={FRAME.y0 + 4}
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
        НАВИГАЦИЯ · МЕТА-СЛОЙ
      </text>

      {/* Plane */}
      <rect
        x={PLOT.x0}
        y={PLOT.y0}
        width={PLOT.x1 - PLOT.x0}
        height={PLOT.y1 - PLOT.y0}
        rx={10}
        className="fill-background stroke-border"
        strokeWidth={1}
      />

      <g clipPath="url(#plot-clip)">
        <rect
          x={PLOT.x0}
          y={PLOT.y0}
          width={CX - PLOT.x0}
          height={CY - PLOT.y0}
          fill={zones.observation.color}
          fillOpacity={0.06}
        />
        <rect
          x={CX}
          y={PLOT.y0}
          width={PLOT.x1 - CX}
          height={CY - PLOT.y0}
          fill={zones.exploration.color}
          fillOpacity={0.06}
        />
        <rect
          x={PLOT.x0}
          y={CY}
          width={CX - PLOT.x0}
          height={PLOT.y1 - CY}
          fill={zones.transaction.color}
          fillOpacity={0.06}
        />
        <rect
          x={CX}
          y={CY}
          width={PLOT.x1 - CX}
          height={PLOT.y1 - CY}
          fill={zones.generation.color}
          fillOpacity={0.06}
        />

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

      {/* Pole labels sit outside the frame so the plane itself stays clean */}
      <text
        x={350}
        y={26}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
        {planeAxes.y.poles[0].toUpperCase()}
      </text>
      <text
        x={350}
        y={668}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
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

      {plotted.map((a) => (
        <Point
          key={a.id}
          archetype={a}
          x={toX(a.values.openness)}
          y={toY(a.values.mode)}
          selected={selected.id === a.id}
          hovered={hovered?.id === a.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      {metaOnes.map((a) => (
        <Point
          key={a.id}
          archetype={a}
          x={430}
          y={FRAME.y0}
          selected={selected.id === a.id}
          hovered={hovered?.id === a.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </svg>
  );
}

function Point({
  archetype,
  x,
  y,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  archetype: Archetype;
  x: number;
  y: number;
  selected: boolean;
  hovered: boolean;
  onSelect: (a: Archetype) => void;
  onHover: (a: Archetype | null) => void;
}) {
  const color = zones[zoneOf(archetype)].color;
  const active = selected || hovered;
  const { anchor, dx, dy } = archetype.label;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={archetype.name}
      aria-pressed={selected}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(archetype)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(archetype);
        }
      }}
      onMouseEnter={() => onHover(archetype)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(archetype)}
      onBlur={() => onHover(null)}
    >
      <circle cx={x} cy={y} r={16} fill="transparent" />
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={13}
          fill={color}
          fillOpacity={0.14}
          stroke={color}
          strokeOpacity={0.55}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={active ? 5.5 : 4}
        fill={active ? color : "var(--background)"}
        stroke={color}
        strokeWidth={1.6}
        strokeOpacity={active ? 1 : 0.7}
      />
      <text
        x={x + dx}
        y={y + dy}
        textAnchor={anchor}
        className={cn(
          "text-[10.5px] transition-[fill]",
          active ? "fill-foreground" : "fill-muted-foreground",
        )}
      >
        {archetype.name}
      </text>
    </g>
  );
}
