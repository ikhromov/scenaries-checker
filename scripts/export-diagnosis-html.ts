/**
 * Renders the diagnosis dashboard as a single self-contained HTML file.
 * Scores come from src/lib/mechanics.ts — the same formulas as /diagnosis.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  extremeAxes,
  planeAxes,
  spectrumAxes,
  zoneOf,
  zones,
} from "../src/lib/axes.ts";
import { diagnosis } from "../src/lib/diagnosis.ts";
import {
  abstainScore,
  mechanics,
  needsHumanCommit,
  rankMechanics,
} from "../src/lib/mechanics.ts";
import { principles, surfaces } from "../src/lib/patterns.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "diagnosis.html");

const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const selected = diagnosis;
const zone = zoneOf(selected.values);
const color = zones[zone].color;
const ranked = rankMechanics(selected).slice(0, 3);
const best = ranked[0];
const abstain = abstainScore(selected.values);
const guard = needsHumanCommit(selected);

function tone(score: number) {
  if (score < 0.4) return "oklch(0.66 0.17 22)";
  if (score < 0.6) return "oklch(0.79 0.14 78)";
  return "oklch(0.75 0.15 155)";
}

const PLOT = { x0: 88, y0: 76, x1: 612, y1: 600 };
const toX = (v: number) => 106 + v * 488;
const toY = (v: number) => 92 + v * 468;
const CX = toX(0.5);
const CY = toY(0.5);
const FRAME = { x0: 60, y0: 48, x1: 640, y1: 628 };
const px = toX(selected.values.openness);
const py = toY(selected.values.mode);

const mono =
  'font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const muted = "oklch(0.685 0.012 264)";
const fg = "oklch(0.965 0.004 264)";

function planeSvg() {
  const quadrants = [
    ["observation", PLOT.x0, PLOT.y0, CX - PLOT.x0, CY - PLOT.y0],
    ["exploration", CX, PLOT.y0, PLOT.x1 - CX, CY - PLOT.y0],
    ["transaction", PLOT.x0, CY, CX - PLOT.x0, PLOT.y1 - CY],
    ["generation", CX, CY, PLOT.x1 - CX, PLOT.y1 - CY],
  ] as const;
  const labels = [
    { zone: "observation", x: PLOT.x0 + 16, y: PLOT.y0 + 26, anchor: "start" },
    { zone: "exploration", x: PLOT.x1 - 16, y: PLOT.y0 + 26, anchor: "end" },
    { zone: "transaction", x: PLOT.x0 + 16, y: PLOT.y1 - 26, anchor: "start" },
    { zone: "generation", x: PLOT.x1 - 16, y: PLOT.y1 - 26, anchor: "end" },
  ] as const;

  return `<svg viewBox="0 0 700 700" class="plane" role="img" aria-label="Плоскость паттернов: что делает пользователь по вертикали, открытость пространства по горизонтали">
      <defs>
        <clipPath id="plane-clip">
          <rect x="${PLOT.x0}" y="${PLOT.y0}" width="${PLOT.x1 - PLOT.x0}" height="${PLOT.y1 - PLOT.y0}" rx="10"/>
        </clipPath>
      </defs>
      <rect x="${FRAME.x0}" y="${FRAME.y0}" width="${FRAME.x1 - FRAME.x0}" height="${FRAME.y1 - FRAME.y0}" rx="16" fill="none" stroke="oklch(0.72 0.02 260)" stroke-opacity="0.35" stroke-dasharray="3 6"/>
      <rect x="${FRAME.x0 + 12}" y="${FRAME.y0 - 8}" width="210" height="17" fill="var(--card)"/>
      <text x="${FRAME.x0 + 18}" y="${FRAME.y0 + 4}" fill="${muted}" style="${mono}" font-size="10" letter-spacing="0.18em">НАВИГАЦИЯ · НАЛОГ НА РАЗМЕР</text>
      <rect x="${PLOT.x0}" y="${PLOT.y0}" width="${PLOT.x1 - PLOT.x0}" height="${PLOT.y1 - PLOT.y0}" rx="10" fill="var(--background)" stroke="var(--border)"/>
      <g clip-path="url(#plane-clip)">
        ${quadrants
          .map(
            ([z, x, y, w, h]) =>
              `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${zones[z].color}" fill-opacity="0.06"/>`,
          )
          .join("")}
        ${[0.25, 0.75]
          .map(
            (t) => `<g>
            <line x1="${toX(t)}" y1="${PLOT.y0}" x2="${toX(t)}" y2="${PLOT.y1}" stroke="var(--border)" stroke-opacity="0.5" stroke-dasharray="2 6"/>
            <line x1="${PLOT.x0}" y1="${toY(t)}" x2="${PLOT.x1}" y2="${toY(t)}" stroke="var(--border)" stroke-opacity="0.5" stroke-dasharray="2 6"/>
          </g>`,
          )
          .join("")}
        <line x1="${CX}" y1="${PLOT.y0}" x2="${CX}" y2="${PLOT.y1}" stroke="var(--border)"/>
        <line x1="${PLOT.x0}" y1="${CY}" x2="${PLOT.x1}" y2="${CY}" stroke="var(--border)"/>
      </g>
      ${labels
        .map(
          (q) => `<g>
          <text x="${q.x}" y="${q.y}" text-anchor="${q.anchor}" fill="${zones[q.zone].color}" fill-opacity="0.75" style="${mono}" font-size="11" letter-spacing="0.2em">${zones[q.zone].title}</text>
          <text x="${q.x}" y="${q.y + 14}" text-anchor="${q.anchor}" fill="${muted}" font-size="10">${esc(zones[q.zone].gloss)}</text>
        </g>`,
        )
        .join("")}
      <text x="350" y="26" text-anchor="middle" fill="${muted}" style="${mono}" font-size="10" letter-spacing="0.18em">${esc(planeAxes.y.poles[0].toUpperCase())}</text>
      <text x="350" y="668" text-anchor="middle" fill="${muted}" style="${mono}" font-size="10" letter-spacing="0.18em">${esc(planeAxes.y.poles[1].toUpperCase())}</text>
      <text x="26" y="338" text-anchor="middle" transform="rotate(-90 26 338)" fill="${muted}" style="${mono}" font-size="10" letter-spacing="0.18em">${esc(planeAxes.x.poles[0].toUpperCase())} ПРОСТРАНСТВО</text>
      <text x="676" y="338" text-anchor="middle" transform="rotate(90 676 338)" fill="${muted}" style="${mono}" font-size="10" letter-spacing="0.18em">${esc(planeAxes.x.poles[1].toUpperCase())} ПРОСТРАНСТВО</text>
      <circle cx="${px}" cy="${py}" r="13" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-opacity="0.55"/>
      <circle cx="${px}" cy="${py}" r="5.5" fill="${color}" stroke="${color}" stroke-width="1.6"/>
      <text x="${px + selected.label.dx}" y="${py + selected.label.dy}" text-anchor="${selected.label.anchor}" fill="${fg}" font-size="10.5">${esc(selected.name)}</text>
    </svg>`;
}

const axesHtml = spectrumAxes
  .map((axis) => {
    const t = selected.values[axis.id];
    return `<div class="axis">
      <div class="axis-head">
        <span class="axis-name">${esc(axis.name)}</span>
        <span class="axis-hint">${esc(axis.hint)}</span>
      </div>
      <div class="axis-track">
        <div class="axis-line"></div>
        ${[0, 0.25, 0.5, 0.75, 1].map((tick) => `<div class="axis-tick" style="left: calc(6px + ${tick} * (100% - 12px))"></div>`).join("")}
        <div class="axis-dot" style="left: calc(6px + ${t} * (100% - 12px)); background:${color}"></div>
      </div>
      <div class="axis-poles"><span>${esc(axis.poles[0])}</span><span>${esc(axis.poles[1])}</span></div>
    </div>`;
  })
  .join("");

const rankedHtml = ranked
  .map((r, i) => {
    const c = tone(r.score);
    return `<div class="rank">
      <div class="rank-row">
        <span class="rank-name"><span class="rank-i">${i + 1}</span>${esc(r.mechanic.name)}</span>
        <span class="rank-score" style="color:${c}">${Math.round(r.score * 100)}</span>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${r.score * 100}%;background:${c}"></div></div>
      ${
        r.surfaceMatch
          ? ""
          : `<p class="penalty">штраф: типичный экран «${esc(surfaces[selected.surface])}» не родной для этой механики</p>`
      }
    </div>`;
  })
  .join("");

const extremesHtml = extremeAxes(selected.values)
  .map(
    ({ axis, pole }) =>
      `<span class="chip"><span class="muted">${esc(axis.name)}</span><span>${esc(pole)}</span></span>`,
  )
  .join("");

const principlesHtml = principles
  .map(
    (item) =>
      `<article class="card pad">
        <h4>${esc(item.title)}</h4>
        <p class="muted small">${esc(item.body)}</p>
      </article>`,
  )
  .join("");

const mechanicsHtml = mechanics
  .map(
    (m) =>
      `<article class="card pad">
        <h4>${esc(m.name)}</h4>
        <p class="muted small tight">${esc(m.what)}</p>
        <div class="tags">${m.surfaces.map((s) => `<span class="tag">${esc(surfaces[s])}</span>`).join("")}</div>
      </article>`,
  )
  .join("");

const html = `<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Диагноз сценария — ${esc(selected.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap&amp;subset=cyrillic,latin" rel="stylesheet"/>
  <style>
    :root {
      --background: oklch(0.155 0.008 264);
      --foreground: oklch(0.965 0.004 264);
      --card: oklch(0.196 0.009 264);
      --muted: oklch(0.272 0.008 264);
      --muted-foreground: oklch(0.685 0.012 264);
      --border: oklch(1 0 0 / 11%);
      --ring: oklch(0.965 0.004 264 / 10%);
    }
    * { box-sizing: border-box; border-color: var(--border); }
    html, body { margin: 0; min-height: 100%; }
    body {
      background: var(--background);
      color: var(--foreground);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    main { margin: 0 auto; width: 100%; max-width: 1440px; padding: 2.5rem 1.25rem; }
    @media (min-width: 640px) { main { padding-left: 2rem; padding-right: 2rem; } }
    @media (min-width: 1024px) { main { padding-top: 3.5rem; padding-bottom: 3.5rem; } }
    .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 11px; letter-spacing: 0.2em; color: var(--muted-foreground);
    }
    h1 { margin: 0.75rem 0 0; font-size: 1.875rem; font-weight: 600; letter-spacing: -0.025em; text-wrap: balance; }
    @media (min-width: 640px) { h1 { font-size: 2.25rem; } }
    .lead { margin: 1rem 0 0; max-width: 48rem; font-size: 15px; line-height: 1.625; color: var(--muted-foreground); }
    .lead + .lead { margin-top: 0.75rem; }
    .grid { display: grid; gap: 1.25rem; margin-top: 1.25rem; }
    .grid.top { margin-top: 2rem; }
    @media (min-width: 1024px) {
      .grid { grid-template-columns: repeat(12, minmax(0, 1fr)); }
      .span-7 { grid-column: span 7; }
      .span-5 { grid-column: span 5; }
    }
    .card {
      background: var(--card);
      color: var(--foreground);
      border-radius: 0.875rem;
      box-shadow: 0 0 0 1px var(--ring);
    }
    .card.pad { padding: 1rem; }
    @media (min-width: 640px) { .card.panel { padding: 1.25rem; } .card.pad { padding: 1rem; } }
    .card.panel { padding: 1rem; }
    .label {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 10px; letter-spacing: 0.18em; color: color-mix(in oklch, var(--muted-foreground) 70%, transparent);
    }
    h2 { margin: 0.375rem 0 0; font-size: 15px; font-weight: 600; letter-spacing: -0.025em; }
    h3 { margin: 0; font-size: 1.125rem; font-weight: 600; letter-spacing: -0.025em; }
    h4 { margin: 0; font-size: 14px; font-weight: 500; letter-spacing: -0.025em; }
    .hint { margin: 0.25rem 0 0; max-width: 28rem; font-size: 12px; line-height: 1.375; color: var(--muted-foreground); }
    .scroll { margin-top: 0.5rem; overflow-x: auto; }
    .plane-wrap { min-width: 640px; }
    .plane { width: 100%; user-select: none; display: block; }
    .axis { padding: 0.625rem 0; border-bottom: 1px solid color-mix(in oklch, var(--border) 60%, transparent); }
    .axis:last-child { border-bottom: 0; }
    .axis-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
    .axis-name { font-size: 13px; font-weight: 500; letter-spacing: -0.025em; }
    .axis-hint { font-size: 11px; line-height: 1.25; text-align: right; color: var(--muted-foreground); }
    .axis-track { position: relative; margin-top: 0.625rem; height: 1rem; }
    .axis-line { position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--border); transform: translateY(-50%); }
    .axis-tick { position: absolute; top: 50%; width: 1px; height: 0.5rem; background: var(--border); transform: translate(-50%, -50%); }
    .axis-dot {
      position: absolute; top: 50%; width: 0.75rem; height: 0.75rem; border-radius: 999px;
      transform: translate(-50%, -50%); box-shadow: 0 0 0 4px var(--card);
    }
    .axis-poles {
      margin-top: 0.375rem; display: flex; justify-content: space-between;
      font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 10px; color: var(--muted-foreground);
    }
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.625rem; }
    .dot { width: 0.625rem; height: 0.625rem; border-radius: 999px; }
    .badge {
      border-radius: 999px; border: 1px solid color-mix(in oklch, var(--border) 70%, transparent);
      padding: 0.125rem 0.5rem; font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 10px; letter-spacing: 0.05em; color: var(--muted-foreground);
    }
    .body { margin: 0.75rem 0 0; font-size: 14px; line-height: 1.625; }
    .muted { color: var(--muted-foreground); }
    .small { margin: 0.375rem 0 0; font-size: 12.5px; line-height: 1.375; }
    .tight { font-size: 12px; }
    .chips { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.375rem; }
    .chip {
      display: inline-flex; align-items: baseline; gap: 0.375rem;
      border-radius: 0.375rem; border: 1px solid color-mix(in oklch, var(--border) 60%, transparent);
      background: color-mix(in oklch, var(--muted) 30%, transparent); padding: 0.25rem 0.5rem; font-size: 11.5px;
    }
    .chip span:last-child { font-weight: 500; }
    .rank + .rank { margin-top: 0.75rem; }
    .rank-row { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; }
    .rank-name { font-size: 13px; font-weight: 500; letter-spacing: -0.025em; }
    .rank-i { margin-right: 0.375rem; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; color: color-mix(in oklch, var(--muted-foreground) 70%, transparent); }
    .rank-score { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; font-variant-numeric: tabular-nums; }
    .bar { margin-top: 0.375rem; height: 0.375rem; overflow: hidden; border-radius: 999px; background: var(--muted); }
    .bar-fill { height: 100%; border-radius: 999px; }
    .penalty { margin: 0.25rem 0 0; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 10px; color: color-mix(in oklch, var(--muted-foreground) 70%, transparent); }
    .split { margin-top: 1.25rem; border-top: 1px solid color-mix(in oklch, var(--border) 60%, transparent); padding-top: 1rem; }
    .detail { margin: 0.5rem 0 0; font-size: 13.5px; line-height: 1.625; }
    dl { margin: 0.75rem 0 0; font-size: 12.5px; line-height: 1.375; }
    dl > div + div { margin-top: 0.5rem; }
    dt { display: inline; color: var(--muted-foreground); }
    dd { display: inline; margin: 0; }
    .note {
      margin-top: 1rem; border-radius: 0.375rem;
      border: 1px solid oklch(0.79 0.14 78 / 35%);
      background: oklch(0.79 0.14 78 / 8%);
      padding: 0.5rem 0.75rem; font-size: 12px; line-height: 1.375;
    }
    .note strong { font-weight: 500; }
    .section { margin-top: 3rem; }
    .cards { margin-top: 1rem; display: grid; gap: 0.75rem; }
    @media (min-width: 640px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (min-width: 1280px) { .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    .tags { margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.25rem; }
    .tag {
      border-radius: 0.25rem; border: 1px solid color-mix(in oklch, var(--border) 60%, transparent);
      background: color-mix(in oklch, var(--muted) 40%, transparent);
      padding: 0.125rem 0.375rem; font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 10px; color: var(--muted-foreground);
    }
    footer { margin-top: 3rem; max-width: 48rem; border-top: 1px solid color-mix(in oklch, var(--border) 60%, transparent); padding-top: 1.5rem; }
    footer p { margin: 0; font-size: 14px; line-height: 1.625; color: var(--muted-foreground); }
    .mobile-hint { margin-top: 0.5rem; font-size: 11px; color: color-mix(in oklch, var(--muted-foreground) 70%, transparent); }
    @media (min-width: 640px) { .mobile-hint { display: none; } }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="kicker">ИНТРАНЕТ · РЕТРОФИТ ЯЗЫКОВЫХ МЕХАНИК</p>
      <h1>Диагноз сценария</h1>
      <p class="lead">Один экран ставится на двенадцать осей. Рекомендация считается из координат, а не проставлена вручную: язык на входе, структура на выходе, коммит остаётся кнопкой.</p>
      <p class="lead">Точка на плоскости, шкалы и топ механик относятся только к этому сценарию — без соседних паттернов и без отдельного окна чата.</p>
    </header>

    <div class="grid top">
      <section class="card panel span-7">
        <p class="label">ПЛОСКОСТЬ</p>
        <h2>Где лежит сценарий</h2>
        <p class="hint">Оценка против исполнения, закрытое против открытого. Навигация — рамка вокруг: это налог на размер портала, а не отдельный квадрант.</p>
        <p class="mobile-hint">Карта прокручивается вбок.</p>
        <div class="scroll"><div class="plane-wrap">${planeSvg()}</div></div>
      </section>
      <section class="card panel span-5">
        <p class="label">КООРДИНАТЫ</p>
        <h2>Оси, из которых считается механика</h2>
        <p class="hint">Два экрана «про форму» расходятся именно здесь — по веерности, ставке, форме результата.</p>
        <div>${axesHtml}</div>
      </section>
    </div>

    <div class="grid">
      <section class="card panel span-7">
        <div class="row">
          <span class="dot" style="background:${color}"></span>
          <h3>${esc(selected.name)}</h3>
          <span class="badge">${esc(surfaces[selected.surface])}</span>
        </div>
        <p class="body muted">${esc(selected.tell)}</p>
        <p class="body">${esc(selected.principle)}</p>
        <p class="label" style="margin-top:1.25rem">ХАРАКТЕРНЫЕ КООРДИНАТЫ</p>
        <div class="chips">${extremesHtml}</div>
      </section>
      <section class="card panel span-5">
        <p class="label">РЕКОМЕНДАЦИЯ</p>
        <h2>Какую механику встраивать</h2>
        <p class="hint">Оценка считается из осей и штрафуется, если механика не родная для этого типа экрана.</p>
        <div style="margin-top:1rem">${rankedHtml}</div>
        ${
          best
            ? `<div class="split">
          <p class="label">ЧТО ИМЕННО ВСТРАИВАТЬ</p>
          <p class="detail">${esc(best.mechanic.what)}</p>
          <dl>
            <div><dt>Снимает: </dt><dd>${esc(best.mechanic.saves)}</dd></div>
            <div><dt>Требует: </dt><dd>${esc(best.mechanic.requires)}</dd></div>
            <div><dt>Риск: </dt><dd>${esc(best.mechanic.risk)}</dd></div>
          </dl>
        </div>`
            : ""
        }
        ${
          guard
            ? `<p class="note"><strong>Коммит остаётся кнопкой.</strong> Ставка или чувствительность данных высоки: модель собирает действие, человек подтверждает его с предпросмотром последствий.</p>`
            : ""
        }
        ${
          abstain > 0.45
            ? `<p class="note" style="border-color:oklch(0.66 0.17 22 / 35%);background:oklch(0.66 0.17 22 / 8%)"><strong>Паттерн сопротивляется языку</strong> (${Math.round(abstain * 100)} из 100). Узкое место не в формулировке намерения — механика скорее добавит шаг, чем уберёт.</p>`
            : ""
        }
      </section>
    </div>

    <section class="section">
      <p class="label">ПРИНЦИПЫ</p>
      <h2>Правила, которые не зависят от экрана</h2>
      <div class="cards">${principlesHtml}</div>
    </section>

    <section class="section">
      <p class="label">МЕХАНИКИ</p>
      <h2>Десять способов встроить язык в существующий экран</h2>
      <p class="hint" style="max-width:42rem">Все держат язык на входе и структуру на выходе. Отдельного окна чата среди них нет.</p>
      <div class="cards">${mechanicsHtml}</div>
    </section>

    <footer>
      <p>Чтобы решить, брать ли сценарий, продакт смотрит квадрант, рекомендуемую механику и принципы. Объём и частота — уже следующий шаг, своими цифрами: карта отвечает на «подходит ли язык», а не на «хватит ли экономического эффекта».</p>
    </footer>
  </main>
</body>
</html>
`;

writeFileSync(outPath, html);
console.log(`Wrote ${outPath}`);
