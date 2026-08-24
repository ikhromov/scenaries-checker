"use client";

import { applicability, expectedHours } from "@/lib/mechanics";
import { annualHoursSaved, domains } from "@/lib/scenarios";
import type { Scenario } from "@/lib/scenarios";

const PLOT = { x0: 104, y0: 64, x1: 648, y1: 592 };
const LO = 2.3;
const HI = 4.85;

const toX = (a: number) => PLOT.x0 + 22 + a * (PLOT.x1 - PLOT.x0 - 44);
const toY = (hours: number) => {
  const t = (Math.log10(Math.max(hours, 100)) - LO) / (HI - LO);
  return PLOT.y1 - 22 - Math.min(Math.max(t, 0), 1) * (PLOT.y1 - PLOT.y0 - 44);
};

const SPLIT_X = toX(0.55);
const SPLIT_Y = toY(8000);

const ticks = [
  { hours: 500, label: "500 ч" },
  { hours: 2000, label: "2 тыс." },
  { hours: 8000, label: "8 тыс." },
  { hours: 30000, label: "30 тыс." },
];

const quadrants = [
  { title: "БОЛЬШОЙ НАЛОГ, НО НЕ ЯЗЫКОМ", gloss: "искать другие средства", x: PLOT.x0 + 14, y: PLOT.y0 + 24, anchor: "start" as const },
  { title: "БРАТЬ ПЕРВЫМ", gloss: "объём есть, механика ложится", x: PLOT.x1 - 14, y: PLOT.y0 + 24, anchor: "end" as const },
  { title: "ОСТАВИТЬ КАК ЕСТЬ", gloss: "выигрыш не окупит работу", x: PLOT.x0 + 14, y: PLOT.y1 - 28, anchor: "start" as const },
  { title: "ДЕШЁВЫЕ ПОБЕДЫ", gloss: "хорошо ложится, но объём мал", x: PLOT.x1 - 14, y: PLOT.y1 - 28, anchor: "end" as const },
];

interface Props {
  items: Scenario[];
  selected: Scenario;
  hovered: Scenario | null;
  onSelect: (s: Scenario) => void;
  onHover: (s: Scenario | null) => void;
}

export function PriorityMap({ items, selected, hovered, onSelect, onHover }: Props) {
  const alwaysLabelled = new Set(
    [...items]
      .sort((a, b) => expectedHours(b) - expectedHours(a))
      .slice(0, 6)
      .map((s) => s.id),
  );

  return (
    <svg
      viewBox="0 0 700 660"
      className="w-full select-none"
      role="img"
      aria-label="Карта приоритетов: снимаемый налог в часах по вертикали, применимость языковой механики по горизонтали"
    >
      <defs>
        <clipPath id="priority-clip">
          <rect x={PLOT.x0} y={PLOT.y0} width={PLOT.x1 - PLOT.x0} height={PLOT.y1 - PLOT.y0} rx={10} />
        </clipPath>
      </defs>

      <rect
        x={PLOT.x0}
        y={PLOT.y0}
        width={PLOT.x1 - PLOT.x0}
        height={PLOT.y1 - PLOT.y0}
        rx={10}
        className="fill-background stroke-border"
      />

      <g clipPath="url(#priority-clip)">
        <rect
          x={SPLIT_X}
          y={PLOT.y0}
          width={PLOT.x1 - SPLIT_X}
          height={SPLIT_Y - PLOT.y0}
          fill="oklch(0.75 0.15 155)"
          fillOpacity={0.08}
        />
        <rect
          x={PLOT.x0}
          y={SPLIT_Y}
          width={SPLIT_X - PLOT.x0}
          height={PLOT.y1 - SPLIT_Y}
          fill="oklch(0.66 0.17 22)"
          fillOpacity={0.05}
        />
        {ticks.map((t) => (
          <line
            key={t.hours}
            x1={PLOT.x0}
            y1={toY(t.hours)}
            x2={PLOT.x1}
            y2={toY(t.hours)}
            className="stroke-border"
            strokeOpacity={0.5}
            strokeDasharray="2 6"
          />
        ))}
        <line x1={SPLIT_X} y1={PLOT.y0} x2={SPLIT_X} y2={PLOT.y1} className="stroke-border" />
        <line x1={PLOT.x0} y1={SPLIT_Y} x2={PLOT.x1} y2={SPLIT_Y} className="stroke-border" />
      </g>

      {quadrants.map((q) => (
        <g key={q.title}>
          <text
            x={q.x}
            y={q.y}
            textAnchor={q.anchor}
            className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
          >
            {q.title}
          </text>
          <text x={q.x} y={q.y + 13} textAnchor={q.anchor} className="fill-muted-foreground/60 text-[10px]">
            {q.gloss}
          </text>
        </g>
      ))}

      {ticks.map((t) => (
        <text
          key={t.hours}
          x={PLOT.x0 - 8}
          y={toY(t.hours) + 3.5}
          textAnchor="end"
          className="fill-muted-foreground/70 font-mono text-[9.5px]"
        >
          {t.label}
        </text>
      ))}

      <text
        x={30}
        y={(PLOT.y0 + PLOT.y1) / 2}
        textAnchor="middle"
        transform={`rotate(-90 30 ${(PLOT.y0 + PLOT.y1) / 2})`}
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]"
      >
        СНИМАЕМЫЙ НАЛОГ · ЧАСОВ В ГОД
      </text>
      <text x={PLOT.x0} y={PLOT.y1 + 26} className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]">
        ПРИМЕНИМОСТЬ ЯЗЫКОВОЙ МЕХАНИКИ
      </text>
      <text x={PLOT.x0} y={PLOT.y1 + 42} className="fill-muted-foreground/60 text-[10px]">
        считается из осей сценария и штрафуется за необратимость и точность
      </text>
      <text x={PLOT.x1} y={PLOT.y1 + 26} textAnchor="end" className="fill-muted-foreground/70 font-mono text-[10px]">
        выше →
      </text>

      {items.map((s) => {
        const x = toX(applicability(s));
        const y = toY(annualHoursSaved(s));
        const active = selected.id === s.id || hovered?.id === s.id;
        const showLabel = active || alwaysLabelled.has(s.id);
        const anchor = x > (PLOT.x0 + PLOT.x1) / 2 ? "end" : "start";
        const color = domains[s.domain].color;

        return (
          <g
            key={s.id}
            role="button"
            tabIndex={0}
            aria-label={s.name}
            aria-pressed={selected.id === s.id}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(s)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(s);
              }
            }}
            onMouseEnter={() => onHover(s)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(s)}
            onBlur={() => onHover(null)}
          >
            <circle cx={x} cy={y} r={16} fill="transparent" />
            {selected.id === s.id && (
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
            {showLabel && (
              <>
                <rect
                  x={anchor === "start" ? x + 9 : x - 9 - s.name.length * 5.2}
                  y={y - 8}
                  width={s.name.length * 5.2 + 8}
                  height={16}
                  rx={3}
                  fill="var(--card)"
                  fillOpacity={active ? 0.95 : 0.8}
                />
                <text
                  x={anchor === "start" ? x + 13 : x - 13}
                  y={y + 4}
                  textAnchor={anchor}
                  className={active ? "fill-foreground text-[10.5px]" : "fill-muted-foreground text-[10px]"}
                >
                  {s.name}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
