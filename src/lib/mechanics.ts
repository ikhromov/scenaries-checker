import type { AxisValues } from "./axes";
import type { Scenario, SurfaceId } from "./scenarios";
import { annualHoursSaved } from "./scenarios";

export interface Mechanic {
  id: string;
  name: string;
  /** What the retrofit physically is, in one line. */
  what: string;
  saves: string;
  requires: string;
  risk: string;
  surfaces: SurfaceId[];
  fit: (v: AxisValues) => number;
}

/**
 * Every mechanic keeps language on the input side and something structured on the
 * output side, because that asymmetry is the whole point.
 */
export const mechanics: Mechanic[] = [
  {
    id: "query-bar",
    name: "Строка запроса над таблицей",
    what: "Поле «опишите, что нужно найти» над существующим гридом. Ответ остаётся таблицей, а не текстом.",
    saves: "Подбор фильтров вслепую и повторные попытки сузить выборку.",
    requires: "Показывать получившиеся фильтры, чтобы человек мог их поправить руками.",
    risk: "Молчаливо потерянные строки. Всегда показывайте, сколько отфильтровано и почему.",
    surfaces: ["table", "catalog", "navigation"],
    fit: (v) =>
      0.35 * v.openness +
      0.25 * (1 - v.mode) +
      0.2 * v.formStability +
      0.2 * (1 - v.stake),
  },
  {
    id: "extract-to-form",
    name: "Извлечение в поля формы",
    what: "Одно свободное поле или вложенный файл раскладываются по обязательным полям, человек проверяет.",
    saves: "Механический перенос уже существующего текста в поля.",
    requires: "Подсветку заполненных моделью полей и лёгкий откат к пустому.",
    risk: "Человек перестаёт читать то, что подставлено. Не подставляйте молча критичные поля.",
    surfaces: ["form", "document", "table"],
    fit: (v) =>
      0.35 * v.formStability +
      0.25 * v.mode +
      0.2 * (1 - v.precision) +
      0.2 * (1 - v.stake),
  },
  {
    id: "draft",
    name: "Черновик на правку",
    what: "Вместо чистого листа — готовый текст, собранный из фактов, которые уже есть в системах.",
    saves: "Страх чистого листа и вспоминание того, что было полгода назад.",
    requires: "Доступ к фактуре: задачи, цели, прошлые периоды. Без неё выйдет пустая вода.",
    risk: "Усреднение формулировок и потеря авторского голоса. Черновик должен быть заметно черновым.",
    surfaces: ["blank", "form"],
    fit: (v) =>
      0.3 * v.openness +
      0.3 * (1 - v.formStability) +
      0.2 * v.mode +
      0.2 * (1 - v.stake),
  },
  {
    id: "bulk-by-policy",
    name: "Массовое действие по политике",
    what: "Руководитель формулирует правило фразой, система предзаполняет все строки, показывает дифф, коммит — одной кнопкой.",
    saves: "Повторение одной и той же логики по каждому подчинённому вручную.",
    requires: "Явный дифф до и после, проверку ограничений (бюджет, вилки) и полный откат.",
    risk: "Ошибка масштабируется на всю команду сразу. Коммит обязан оставаться человеческим.",
    surfaces: ["table", "form"],
    fit: (v) =>
      0.35 * v.cardinality +
      0.25 * v.mode +
      0.2 * v.formStability +
      0.2 * v.delegation,
  },
  {
    id: "command-entry",
    name: "Единая строка входа",
    what: "Одно поле на весь интранет: человек пишет, что хочет сделать, и попадает на нужный экран с готовым контекстом.",
    saves: "Навигацию как таковую — самый чистый налог из всех.",
    requires: "Каталог действий и экранов с описаниями. Это работа по разметке, а не по модели.",
    risk: "Уверенный переход не туда. Показывайте альтернативы, а не один ответ.",
    surfaces: ["navigation", "catalog", "table"],
    fit: (v) =>
      0.35 * v.openness +
      0.3 * (1 - v.precision) +
      0.2 * (1 - v.stake) +
      0.15 * (1 - v.initiative),
  },
  {
    id: "annotate",
    name: "Пояснение поверх данных",
    what: "Модель подписывает существующие цифры и правила, не трогая саму таблицу.",
    saves: "Поход в поддержку и в HR с вопросом «а почему тут столько».",
    requires: "Ссылку на источник рядом с каждым утверждением.",
    risk: "Уверенное объяснение неверной причины. В деньгах это дороже, чем молчание.",
    surfaces: ["table", "document", "catalog"],
    fit: (v) =>
      0.35 * v.formStability +
      0.3 * (1 - v.mode) +
      0.2 * (1 - v.openness) +
      0.15 * v.stake,
  },
  {
    id: "dialog-form",
    name: "Диалог вместо длинной формы",
    what: "Вопросы задаются по одному и ветвятся, нерелевантные поля не показываются вовсе.",
    saves: "Тридцать полей, из которых конкретному человеку нужны шесть.",
    requires: "Знание правил применимости. Если набор полей фиксирован, обычная форма быстрее.",
    risk: "Диалог ради диалога. Для известного набора полей это замедление, а не ускорение.",
    surfaces: ["form", "catalog"],
    fit: (v) =>
      0.35 * (1 - v.expertise) +
      0.25 * v.mode +
      0.2 * v.openness +
      0.2 * (1 - v.stake),
  },
  {
    id: "ranked-queue",
    name: "Очередь с обоснованием",
    what: "Список сортируется моделью и снабжается причиной, человек проходит его сверху вниз и подтверждает.",
    saves: "Просмотр всего списка целиком, чтобы найти те несколько строк, где нужно решение.",
    requires: "Обоснование у каждой строки и возможность оспорить порядок.",
    risk: "Человек перестаёт смотреть хвост списка. Держите выборочный контроль нижней части.",
    surfaces: ["table", "catalog"],
    fit: (v) =>
      0.35 * v.cardinality +
      0.25 * v.initiative +
      0.2 * v.stake +
      0.2 * v.formStability,
  },
  {
    id: "background-agent",
    name: "Фоновая подготовка с приёмкой",
    what: "К моменту, когда человек откроет экран, данные уже собраны и сведены, ему остаётся принять или поправить.",
    saves: "Сбор фактуры из нескольких систем перед началом работы.",
    requires: "Уведомление, понятный статус готовности и явную приёмку.",
    risk: "Работа впустую и устаревшие данные. Нужна отметка, когда сводка собрана.",
    surfaces: ["table", "calendar", "form"],
    fit: (v) =>
      0.4 * v.temporality +
      0.3 * v.delegation +
      0.2 * v.openness +
      0.1 * (1 - v.stake),
  },
  {
    id: "prefilled-commit",
    name: "Предзаполненная транзакция",
    what: "Модель собирает заявку целиком, но подтверждает её человек отдельным явным действием.",
    saves: "Сбор реквизитов и проверку правил перед необратимым шагом.",
    requires: "Предпросмотр в терминах последствий, а не полей, и запись о том, кто подтвердил.",
    risk: "Автоматизм подтверждения. Чем удобнее кнопка, тем формальнее её нажимают.",
    surfaces: ["form", "document", "table"],
    fit: (v) =>
      0.35 * v.stake +
      0.25 * v.mode +
      0.2 * v.formStability +
      0.2 * (1 - v.expertise),
  },
];

/** How strongly the scenario argues against a language mechanic at all. */
export function abstainScore(v: AxisValues): number {
  return 0.4 * v.precision + 0.35 * (v.stake * v.trust) + 0.25 * (1 - v.openness);
}

export interface Scored {
  mechanic: Mechanic;
  score: number;
  surfaceMatch: boolean;
}

export function rankMechanics(s: Scenario): Scored[] {
  return mechanics
    .map((mechanic) => {
      const surfaceMatch = mechanic.surfaces.includes(s.surface);
      return {
        mechanic,
        surfaceMatch,
        // A mechanic can still apply on an adjacent surface, just less cleanly.
        score: mechanic.fit(s.values) * (surfaceMatch ? 1 : 0.4),
      };
    })
    .sort((a, b) => b.score - a.score);
}

/** Best mechanic fit, discounted by how loudly the scenario says «не трогай». */
export function applicability(s: Scenario): number {
  const best = rankMechanics(s)[0]?.score ?? 0;
  return Math.max(0, Math.min(1, best * (1 - 0.45 * abstainScore(s.values))));
}

/** Irreversible or money-and-personal-data scenarios never get an autonomous commit. */
export function needsHumanCommit(s: Scenario): boolean {
  return s.values.stake > 0.6 || s.values.trust > 0.65;
}

/** Expected recoverable hours — the number a PM should sort by. */
export function expectedHours(s: Scenario): number {
  return annualHoursSaved(s) * applicability(s);
}

export function formatHours(hours: number): string {
  if (hours >= 10000) return `${Math.round(hours / 1000)} тыс. ч`;
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)} тыс. ч`;
  return `${Math.round(hours)} ч`;
}
