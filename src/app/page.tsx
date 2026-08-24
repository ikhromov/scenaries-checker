"use client";

import { useMemo, useState } from "react";

import { AxisSpectrum } from "@/components/axis-spectrum";
import { PlaneMap } from "@/components/plane-map";
import { PriorityMap } from "@/components/priority-map";
import { RecommendationPanel } from "@/components/recommendation-panel";
import { Card } from "@/components/ui/card";
import { extremeAxes, spectrumAxes } from "@/lib/axes";
import {
  applicability,
  expectedHours,
  formatHours,
  mechanics,
  rankMechanics,
} from "@/lib/mechanics";
import {
  affectedPeople,
  annualHoursSaved,
  domains,
  roles,
  scenarios,
  surfaces,
} from "@/lib/scenarios";
import type { RoleId, Scenario } from "@/lib/scenarios";
import { cn } from "@/lib/utils";

type View = "priority" | "plane";
type RoleFilter = RoleId | "all";

const roleOrder: RoleFilter[] = ["all", "employee", "manager", "pro"];

export default function Home() {
  const [view, setView] = useState<View>("priority");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [selectedId, setSelectedId] = useState("self-review");
  const [hovered, setHovered] = useState<Scenario | null>(null);

  const visible = useMemo(
    () =>
      roleFilter === "all"
        ? scenarios
        : scenarios.filter((s) => s.role === roleFilter),
    [roleFilter],
  );

  const selected =
    visible.find((s) => s.id === selectedId) ?? visible[0] ?? scenarios[0];
  const compare = hovered && hovered.id !== selected.id ? hovered : null;
  const color = domains[selected.domain].color;

  const queue = useMemo(
    () => [...visible].sort((a, b) => expectedHours(b) - expectedHours(a)).slice(0, 8),
    [visible],
  );

  const select = (s: Scenario) => setSelectedId(s.id);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 lg:py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          ИНТРАНЕТ · КУДА ВСТРАИВАТЬ ЯЗЫКОВЫЕ МЕХАНИКИ
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Карта налога и применимости
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Инструмент для продуктовых менеджеров: где чатовая механика снимет
          настоящий налог, где даст косметику, а где только добавит шаг. Налог
          считается на популяцию, а не на одного пользователя, потому что цели,
          самоотзывы и согласования — это не основная работа, а нагрузка поверх неё.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Применимость выводится из координат сценария по тем же осям, а не
          проставлена вручную. Выберите сценарий, чтобы увидеть его положение и
          рекомендованную механику.
          <span className="hidden sm:inline">
            {" "}
            Наведите на другой — он ляжет призраком рядом.
          </span>
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-1 rounded-full border border-border/70 p-1">
          {roleOrder.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              aria-pressed={roleFilter === r}
              className={cn(
                "rounded-full px-3 py-1 text-[12.5px] transition-colors",
                "focus-visible:ring-ring/60 focus-visible:ring-2 focus-visible:outline-none",
                roleFilter === r
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r === "all" ? "Все роли" : roles[r].name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {Object.entries(domains).map(([id, d]) => (
            <span key={id} className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {roleFilter !== "all" && (
        <p className="mt-3 max-w-2xl text-[12.5px] leading-snug text-muted-foreground">
          {roles[roleFilter].note} Популяция роли — {roles[roleFilter].headcount.toLocaleString("ru-RU")} человек.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {visible.map((s) => {
          const isSelected = selected.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s)}
              onBlur={() => setHovered(null)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] transition-colors",
                "focus-visible:ring-ring/60 focus-visible:ring-2 focus-visible:outline-none",
                isSelected
                  ? "border-foreground/25 bg-card text-foreground"
                  : "border-border/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: domains[s.domain].color }}
              />
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <Card className="gap-0 p-4 sm:p-5 lg:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
                {view === "priority" ? "ЧТО БРАТЬ" : "ПОЧЕМУ ИМЕННО ЭТА МЕХАНИКА"}
              </p>
              <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
                {view === "priority"
                  ? "Карта приоритетов"
                  : "Плоскость типов задач"}
              </h2>
              <p className="mt-1 max-w-md text-[12px] leading-snug text-muted-foreground">
                {view === "priority"
                  ? "Вертикаль — сколько часов в год снимается на всей компании. Горизонталь — насколько язык вообще уместен в этом шаге."
                  : "Оценка против исполнения и закрытое против открытого. Отсюда следует, какая механика подойдёт, а навигация остаётся рамкой вокруг."}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border/70 p-1">
              {(["priority", "plane"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11.5px] transition-colors",
                    "focus-visible:ring-ring/60 focus-visible:ring-2 focus-visible:outline-none",
                    view === v
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "priority" ? "Приоритеты" : "Типы"}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground/70 sm:hidden">
            Карта прокручивается вбок.
          </p>
          {/* Below ~640px the labels shrink past legibility, so pan instead of scale. */}
          <div className="mt-2 overflow-x-auto">
            <div className="min-w-[640px]">
              {view === "priority" ? (
                <PriorityMap
                  items={visible}
                  selected={selected}
                  hovered={hovered}
                  onSelect={select}
                  onHover={setHovered}
                />
              ) : (
                <PlaneMap
                  items={visible}
                  selected={selected}
                  hovered={hovered}
                  onSelect={select}
                  onHover={setHovered}
                />
              )}
            </div>
          </div>
        </Card>

        <Card className="gap-0 p-4 sm:p-5 lg:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            КООРДИНАТЫ СЦЕНАРИЯ
          </p>
          <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
            Оси, из которых считается всё остальное
          </h2>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            Ни одна не сводится к классу задачи или типу экрана. Именно они
            разводят сценарии, которые выглядят одинаково.
          </p>
          <div className="mt-1 divide-y divide-border/60">
            {spectrumAxes.map((axis) => (
              <AxisSpectrum
                key={axis.id}
                axis={axis}
                values={selected.values}
                compareValues={compare ? compare.values : null}
                color={color}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <Card className="gap-0 p-4 sm:p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="text-lg font-semibold tracking-tight">{selected.name}</h3>
            <span className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground">
              {roles[selected.role].short}
            </span>
            <span className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground">
              {surfaces[selected.surface]}
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {selected.pain}
          </p>

          <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            ОТКУДА БЕРЁТСЯ НАЛОГ
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            <Figure label="исполнителей" value={affectedPeople(selected).toLocaleString("ru-RU")} />
            <Figure label="раз в год" value={String(selected.runsPerYear)} />
            <Figure label="минут за раз" value={String(selected.minutesPerRun)} />
            <Figure
              label="снимается языком"
              value={`${Math.round(selected.removableShare * 100)}%`}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-border/60 pt-3">
            <span className="text-[13px]">
              <span className="text-muted-foreground">Налог: </span>
              <span className="font-mono tabular-nums">
                {formatHours(annualHoursSaved(selected))} в год
              </span>
            </span>
            <span className="text-[13px]">
              <span className="text-muted-foreground">С поправкой на применимость: </span>
              <span className="font-mono tabular-nums">
                {formatHours(expectedHours(selected))}
              </span>
              <span className="text-muted-foreground"> ({Math.round(applicability(selected) * 100)}%)</span>
            </span>
          </div>

          <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            ХАРАКТЕРНЫЕ КООРДИНАТЫ
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {extremeAxes(selected.values).map(({ axis, pole }) => (
              <span
                key={axis.id}
                className="inline-flex items-baseline gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 py-1 text-[11.5px]"
              >
                <span className="text-muted-foreground">{axis.name}</span>
                <span className="font-medium">{pole}</span>
              </span>
            ))}
          </div>

          {compare && (
            <div className="mt-5 border-t border-border/60 pt-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
                СРАВНЕНИЕ С «{compare.name.toUpperCase()}»
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                {formatHours(annualHoursSaved(compare))} в год, применимость{" "}
                {Math.round(applicability(compare) * 100)}%, первая механика — «
                {rankMechanics(compare)[0].mechanic.name}».
              </p>
            </div>
          )}
        </Card>

        <Card className="gap-0 p-4 sm:p-5 lg:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            РЕКОМЕНДАЦИЯ
          </p>
          <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
            Какую механику встраивать
          </h2>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            Оценка каждой механики считается из осей и штрафуется, если она не
            родная для этого экрана.
          </p>
          <div className="mt-4">
            <RecommendationPanel scenario={selected} />
          </div>
        </Card>
      </div>

      <section className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
          ОЧЕРЕДЬ ВНЕДРЕНИЯ
        </p>
        <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
          Порядок, если начинать завтра
        </h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-snug text-muted-foreground">
          Сортировка по ожидаемой экономии — налог, умноженный на применимость.
          {roleFilter !== "all" && " В пределах выбранной роли."}
        </p>
        <div className="mt-4 space-y-1.5">
          {queue.map((s, i) => {
            const share = expectedHours(s) / expectedHours(queue[0]);
            const best = rankMechanics(s)[0].mechanic.name;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => select(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                  selected.id === s.id
                    ? "border-foreground/25 bg-card"
                    : "border-transparent hover:border-border hover:bg-card/60",
                )}
              >
                <span className="w-4 shrink-0 font-mono text-[11px] text-muted-foreground/70 tabular-nums">
                  {i + 1}
                </span>
                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: domains[s.domain].color }} />
                <span className="w-52 shrink-0 truncate text-[13px]">{s.name}</span>
                <span className="hidden w-44 shrink-0 truncate text-[12px] text-muted-foreground sm:block">
                  {best}
                </span>
                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${share * 100}%`,
                      backgroundColor: domains[s.domain].color,
                      opacity: 0.75,
                    }}
                  />
                </span>
                <span className="w-20 shrink-0 text-right font-mono text-[12px] tabular-nums">
                  {formatHours(expectedHours(s))}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
          СЛОВАРЬ
        </p>
        <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
          Десять механик, которые ложатся в существующие экраны
        </h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-snug text-muted-foreground">
          Все они держат язык на входе и структуру на выходе. Отдельного окна чата
          среди них нет: в интранете почти везде выигрывает поле поверх уже
          работающего экрана.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {mechanics.map((m) => (
            <Card key={m.id} className="gap-0 p-4">
              <h4 className="text-[14px] font-medium tracking-tight">{m.name}</h4>
              <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">
                {m.what}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {m.surfaces.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {surfaces[s]}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="mt-12 max-w-3xl border-t border-border/60 pt-6">
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Цифры популяций и длительностей — рабочая гипотеза, а не замер; их нужно
          заменить своей аналитикой, и тогда очередь пересоберётся сама. Ценность
          карты не в конкретных часах, а в том, что спор «нужен ли тут ИИ»
          превращается в проверяемый вопрос: сколько людей, как часто, сколько
          минут и какая доля из них снимается языком.
        </p>
      </footer>
    </main>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[15px] tabular-nums">{value}</p>
      <p className="text-[11px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}
