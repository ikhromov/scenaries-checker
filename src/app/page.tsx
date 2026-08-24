"use client";

import { useState } from "react";

import { AxisSpectrum } from "@/components/axis-spectrum";
import { PlaneMap } from "@/components/plane-map";
import { RecommendationPanel } from "@/components/recommendation-panel";
import { Card } from "@/components/ui/card";
import { extremeAxes, spectrumAxes, zoneOf, zones } from "@/lib/axes";
import { mechanics, rankMechanics } from "@/lib/mechanics";
import { patterns, principles, surfaces } from "@/lib/patterns";
import type { Pattern } from "@/lib/patterns";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedId, setSelectedId] = useState("query-set");
  const [hovered, setHovered] = useState<Pattern | null>(null);

  const selected = patterns.find((p) => p.id === selectedId) ?? patterns[0];
  const compare = hovered && hovered.id !== selected.id ? hovered : null;
  const color = zones[zoneOf(selected.values)].color;
  const select = (p: Pattern) => setSelectedId(p.id);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 lg:py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          ИНТРАНЕТ · РЕТРОФИТ ЯЗЫКОВЫХ МЕХАНИК
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Паттерны, принципы и механики
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Инструмент для продуктовых менеджеров. Не каталог экранов, а восемь
          повторяющихся форм работы: человек узнаёт свою таблицу или форму в
          одном из паттернов и получает механику, которая в него встраивается.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Рекомендация считается из координат паттерна, а не проставлена вручную.
          <span className="hidden sm:inline">
            {" "}
            Наведите на второй — он ляжет призраком на шкалах.
          </span>
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-1.5">
        {patterns.map((p) => {
          const isSelected = selected.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p)}
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
                style={{ backgroundColor: zones[zoneOf(p.values)].color }}
              />
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <Card className="gap-0 p-4 sm:p-5 lg:col-span-7">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            ПЛОСКОСТЬ
          </p>
          <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
            Восемь форм работы
          </h2>
          <p className="mt-1 max-w-md text-[12px] leading-snug text-muted-foreground">
            Оценка против исполнения, закрытое против открытого. Навигация —
            рамка вокруг: это налог на размер портала, а не отдельный квадрант.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground/70 sm:hidden">
            Карта прокручивается вбок.
          </p>
          <div className="mt-2 overflow-x-auto">
            <div className="min-w-[640px]">
              <PlaneMap
                items={patterns}
                selected={selected}
                hovered={hovered}
                onSelect={select}
                onHover={setHovered}
              />
            </div>
          </div>
        </Card>

        <Card className="gap-0 p-4 sm:p-5 lg:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            КООРДИНАТЫ
          </p>
          <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
            Оси, из которых считается механика
          </h2>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            Два экрана «про таблицу» расходятся именно здесь — по веерности,
            ставке, форме результата.
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
              {surfaces[selected.surface]}
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {selected.tell}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed">{selected.principle}</p>

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
                РЯДОМ · {compare.name.toUpperCase()}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {compare.tell} Первая механика — «{rankMechanics(compare)[0].mechanic.name}».
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
            Оценка считается из осей и штрафуется, если механика не родная для
            этого типа экрана.
          </p>
          <div className="mt-4">
            <RecommendationPanel pattern={selected} />
          </div>
        </Card>
      </div>

      <section className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
          ПРИНЦИПЫ
        </p>
        <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
          Правила, которые не зависят от экрана
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {principles.map((item) => (
            <Card key={item.title} className="gap-0 p-4">
              <h4 className="text-[14px] font-medium tracking-tight">{item.title}</h4>
              <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
          МЕХАНИКИ
        </p>
        <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight">
          Десять способов встроить язык в существующий экран
        </h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-snug text-muted-foreground">
          Все держат язык на входе и структуру на выходе. Отдельного окна чата
          среди них нет.
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
          Чтобы решить, брать ли сценарий, продакт узнаёт его в одном из восьми
          паттернов, смотрит рекомендуемую механику и проверяет принципы. Объём
          и частота — уже следующий шаг, своими цифрами: карта отвечает на
          «подходит ли язык», а не на «хватит ли экономического эффекта».
        </p>
      </footer>
    </main>
  );
}
