import type { AxisValues } from "./axes";
import type { Pattern, SurfaceId } from "./patterns";

export interface Mechanic {
  id: string;
  name: string;
  what: string;
  saves: string;
  requires: string;
  risk: string;
  surfaces: SurfaceId[];
  fit: (v: AxisValues) => number;
}

/**
 * Every mechanic keeps language on the input side and something structured on the
 * output side. None of them is a standalone chat window.
 */
export const mechanics: Mechanic[] = [
  {
    id: "query-bar",
    name: "Строка запроса над таблицей",
    what: "Поле «опишите, что нужно найти» над существующим гридом. Ответ остаётся таблицей, а не текстом.",
    saves: "Подбор фильтров вслепую и повторные попытки сузить выборку.",
    requires: "Показывать получившиеся фильтры, чтобы человек мог их поправить руками.",
    risk: "Молчаливо потерянные строки. Всегда видно, сколько отфильтровано и почему.",
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
    what: "Одно свободное поле раскладывается по обязательным полям, человек проверяет подстановку.",
    saves: "Механический перенос уже существующего текста в поля.",
    requires: "Подсветку заполненных моделью полей и лёгкий откат к пустому.",
    risk: "Человек перестаёт читать то, что подставлено. Критичные поля не заполняются молча.",
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
    what: "Вместо чистого листа — текст, собранный из фактов, которые уже есть в системах.",
    saves: "Страх пустого поля и вспоминание того, что система и так знает.",
    requires: "Доступ к фактуре. Без неё получится пустая вода.",
    risk: "Усреднение формулировок. Черновик должен быть заметно черновым.",
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
    what: "Правило формулируется фразой, система предзаполняет все строки, показывает дифф, коммит — одной кнопкой.",
    saves: "Повторение одной логики по каждому объекту вручную.",
    requires: "Явный дифф, проверку ограничений и полный откат.",
    risk: "Ошибка масштабируется сразу на все строки. Коммит остаётся человеческим.",
    surfaces: ["table", "form", "calendar"],
    fit: (v) =>
      0.35 * v.cardinality +
      0.25 * v.mode +
      0.2 * v.formStability +
      0.2 * v.delegation,
  },
  {
    id: "command-entry",
    name: "Единая строка входа",
    what: "Одно поле на весь портал: человек пишет, что хочет сделать, и попадает на нужный экран с контекстом.",
    saves: "Навигацию как таковую — самый чистый налог из всех.",
    requires: "Каталог экранов и действий с описаниями. Это разметка, а не модель.",
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
    saves: "Поход в поддержку с вопросом «а почему тут столько».",
    requires: "Ссылку на источник рядом с каждым утверждением.",
    risk: "Уверенное объяснение неверной причины. В чувствительных данных это дороже молчания.",
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
    what: "Вопросы задаются по одному и ветвятся. Нерелевантные поля не показываются вовсе.",
    saves: "Длинную форму, из которой в конкретном случае нужны несколько полей.",
    requires: "Знание правил применимости. Если набор полей фиксирован, обычная форма быстрее.",
    risk: "Диалог ради диалога. Для известного набора полей это замедление.",
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
    what: "Список сортируется и снабжается причиной. Человек идёт сверху вниз и подтверждает.",
    saves: "Просмотр всего списка, чтобы найти те несколько строк, где нужно решение.",
    requires: "Обоснование у каждой строки и возможность оспорить порядок.",
    risk: "Человек перестаёт смотреть хвост. Нужен выборочный контроль нижней части.",
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
    what: "К открытию экрана данные уже собраны. Человеку остаётся принять или поправить.",
    saves: "Роль курьера между системами до начала собственно работы.",
    requires: "Статус готовности, отметку свежести и явную приёмку.",
    risk: "Работа впустую и устаревшие данные.",
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
    what: "Модель собирает действие целиком. Подтверждает его человек отдельным явным шагом.",
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

export function abstainScore(v: AxisValues): number {
  return 0.4 * v.precision + 0.35 * (v.stake * v.trust) + 0.25 * (1 - v.openness);
}

export interface Scored {
  mechanic: Mechanic;
  score: number;
  surfaceMatch: boolean;
}

export function rankMechanics(p: Pattern): Scored[] {
  return mechanics
    .map((mechanic) => {
      const surfaceMatch = mechanic.surfaces.includes(p.surface);
      return {
        mechanic,
        surfaceMatch,
        score: mechanic.fit(p.values) * (surfaceMatch ? 1 : 0.4),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function needsHumanCommit(p: Pattern): boolean {
  return p.values.stake > 0.6 || p.values.trust > 0.65;
}
