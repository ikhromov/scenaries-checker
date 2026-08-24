"use client";

import { useState } from "react";

import { AxisSpectrum } from "@/components/axis-spectrum";
import { QuadrantMap } from "@/components/quadrant-map";
import { VerdictPanel } from "@/components/verdict-panel";
import { Card } from "@/components/ui/card";
import {
  archetypes,
  divergentAxes,
  extremeAxes,
  loci,
  planeAxes,
  spectrumAxes,
  zoneOf,
  zones,
} from "@/lib/interface-map";
import type { Archetype } from "@/lib/interface-map";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selected, setSelected] = useState<Archetype>(
    archetypes.find((a) => a.id === "dashboard") ?? archetypes[0],
  );
  const [hovered, setHovered] = useState<Archetype | null>(null);
  const compare = hovered && hovered.id !== selected.id ? hovered : null;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 lg:py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          КАРТА ИНТЕРФЕЙСОВ
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Оси, которые задают карту
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Класса задачи и модальности мало: два интерфейса совпадают по обоим
          уровням и остаются разными продуктами. Плоскость ниже задают только две
          оси. Остальные — независимые координаты, и именно они разводят то, что
          на плоскости слиплось.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Выберите архетип, чтобы увидеть его положение на всех осях сразу.
          Наведите на второй — он ляжет призраком рядом для сравнения.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-1.5">
        {archetypes.map((a) => {
          const zone = zones[zoneOf(a)];
          const isSelected = selected.id === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              onMouseEnter={() => setHovered(a)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(a)}
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
                style={{ backgroundColor: zone.color }}
              />
              {a.name}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <Card className="gap-0 overflow-hidden p-4 sm:p-5 lg:col-span-7">
          <SectionTitle
            eyebrow="Уровень 1 · плоскость"
            title="Две оси, на которых лежит классическая четвёрка"
            note={`${planeAxes.y.hint}. ${planeAxes.x.hint}.`}
          />
          <div className="mt-2">
            <QuadrantMap
              selected={selected}
              hovered={hovered}
              onSelect={setSelected}
              onHover={setHovered}
            />
          </div>
        </Card>

        <Card className="gap-0 p-4 sm:p-5 lg:col-span-5">
          <SectionTitle
            eyebrow="Уровень 2 · координаты"
            title="Оси, которых в плоскости нет"
            note="Ни одна из них не сводится ни к классу задачи, ни к модальности."
          />
          <div className="mt-1 divide-y divide-border/60">
            {spectrumAxes.map((axis) => (
              <AxisSpectrum
                key={axis.id}
                axis={axis}
                selected={selected}
                compare={compare}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <Card className="gap-0 p-4 sm:p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: zones[zoneOf(selected)].color }}
            />
            <h3 className="text-lg font-semibold tracking-tight">
              {selected.name}
            </h3>
            <span className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground">
              {selected.taskClass}
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {selected.blurb}
          </p>

          <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            ХАРАКТЕРНЫЕ КООРДИНАТЫ
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {extremeAxes(selected).map(({ axis, pole }) => (
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
                СИЛЬНЕЕ ВСЕГО РАСХОДЯТСЯ С «{compare.name.toUpperCase()}»
              </p>
              <div className="mt-2 space-y-1.5">
                {divergentAxes(selected, compare).map(({ axis, delta }) => (
                  <div
                    key={axis.id}
                    className="flex items-baseline justify-between gap-3 text-[12.5px]"
                  >
                    <span>{axis.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      разрыв {Math.round(delta * 100)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
                {compare.blurb}
              </p>
            </div>
          )}
        </Card>

        <Card className="gap-0 p-4 sm:p-5 lg:col-span-5">
          <SectionTitle
            eyebrow="Следствие"
            title="Где уместен язык"
            note="Считается из координат, а не проставлено вручную: положение на осях и есть ответ."
          />
          <div className="mt-4">
            <VerdictPanel selected={selected} compare={compare} />
          </div>
        </Card>
      </div>

      <section className="mt-12">
        <SectionTitle
          eyebrow="Другая половина"
          title="Классы задач, сгруппированные по локусу изменения"
          note="Плоский список классов вырождается в свалку. Дисциплинирует вопрос: что изменилось, если задача решена?"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {loci.map((locus) => (
            <Card key={locus.title} className="gap-0 p-4">
              <h4 className="text-[14px] font-medium tracking-tight">
                {locus.title}
              </h4>
              <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                {locus.note}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {locus.classes.map((c) => (
                  <span
                    key={c}
                    className="rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="mt-12 max-w-3xl border-t border-border/60 pt-6">
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Смысл в том, что интерфейс перестаёт быть элементом списка и становится
          точкой в пространстве. Зафиксируйте все оси кроме одной и подвиньте её —
          получите проектное решение, а не мнение. Тот же ad-hoc-анализ,
          переведённый с синхронного на фоновое исполнение, немедленно требует
          уведомления и приёмки; та же транзакция в вероятностном режиме требует
          предпросмотра и диффа.
        </p>
      </footer>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
        {eyebrow.toUpperCase()}
      </p>
      <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{note}</p>
    </div>
  );
}
