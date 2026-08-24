"use client";

import { abstainScore, needsHumanCommit, rankMechanics } from "@/lib/mechanics";
import type { Scenario } from "@/lib/scenarios";
import { surfaces } from "@/lib/scenarios";

function tone(score: number) {
  if (score < 0.4) return "oklch(0.66 0.17 22)";
  if (score < 0.6) return "oklch(0.79 0.14 78)";
  return "oklch(0.75 0.15 155)";
}

export function RecommendationPanel({ scenario }: { scenario: Scenario }) {
  const ranked = rankMechanics(scenario).slice(0, 3);
  const [best] = ranked;
  const abstain = abstainScore(scenario.values);
  const guard = needsHumanCommit(scenario);

  return (
    <div>
      <div className="space-y-3">
        {ranked.map((r, i) => (
          <div key={r.mechanic.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium tracking-tight">
                <span className="mr-1.5 font-mono text-[11px] text-muted-foreground/70">
                  {i + 1}
                </span>
                {r.mechanic.name}
              </span>
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: tone(r.score) }}
              >
                {Math.round(r.score * 100)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${r.score * 100}%`, backgroundColor: tone(r.score) }}
              />
            </div>
            {!r.surfaceMatch && (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
                штраф: экран «{surfaces[scenario.surface]}» не родной для этой механики
              </p>
            )}
          </div>
        ))}
      </div>

      {best && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/70">
            ЧТО ИМЕННО ДЕЛАТЬ
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed">{best.mechanic.what}</p>
          <dl className="mt-3 space-y-2 text-[12.5px] leading-snug">
            <div>
              <dt className="inline text-muted-foreground">Снимает: </dt>
              <dd className="inline">{best.mechanic.saves}</dd>
            </div>
            <div>
              <dt className="inline text-muted-foreground">Требует: </dt>
              <dd className="inline">{best.mechanic.requires}</dd>
            </div>
            <div>
              <dt className="inline text-muted-foreground">Риск: </dt>
              <dd className="inline">{best.mechanic.risk}</dd>
            </div>
          </dl>
        </div>
      )}

      {(guard || abstain > 0.45) && (
        <div className="mt-4 space-y-2">
          {guard && (
            <p className="rounded-md border border-[oklch(0.79_0.14_78/35%)] bg-[oklch(0.79_0.14_78/8%)] px-3 py-2 text-[12px] leading-snug">
              <span className="font-medium">Коммит остаётся кнопкой.</span> Ставка или
              чувствительность данных здесь высоки: модель может собрать действие, но
              подтверждает его человек, с предпросмотром последствий и записью о том, кто
              нажал.
            </p>
          )}
          {abstain > 0.45 && (
            <p className="rounded-md border border-[oklch(0.66_0.17_22/35%)] bg-[oklch(0.66_0.17_22/8%)] px-3 py-2 text-[12px] leading-snug">
              <span className="font-medium">Сценарий сопротивляется языку</span> (
              {Math.round(abstain * 100)} из 100). Узкое место не в формулировке
              намерения, и языковая механика тут скорее добавит шаг, чем уберёт.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
