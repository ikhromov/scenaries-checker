import type { AxisValues } from "./axes";

export type SurfaceId =
  | "table"
  | "form"
  | "blank"
  | "catalog"
  | "navigation"
  | "calendar"
  | "document";

export const surfaces: Record<SurfaceId, string> = {
  table: "таблица",
  form: "форма",
  blank: "чистый лист",
  catalog: "каталог",
  navigation: "навигация",
  calendar: "календарь",
  document: "документ",
};

export interface Pattern {
  id: string;
  name: string;
  /** How a PM recognises this shape in their own product. */
  tell: string;
  principle: string;
  surface: SurfaceId;
  /** Drawn on the navigation frame rather than inside the plane. */
  meta?: boolean;
  label: { anchor: "start" | "end"; dx: number; dy: number };
  values: AxisValues;
}

const v = (values: AxisValues) => values;

/**
 * Recurring shapes of work in a large intranet. Not product features —
 * a product manager maps their own screen onto one of these.
 */
export const patterns: Pattern[] = [
  {
    id: "find-screen",
    name: "Найти нужный экран",
    tell: "Человек знает, что хочет сделать, и не знает, в какой из десятков систем это живёт.",
    principle:
      "Навигация — не задача, а налог на размер портала. Язык снимает её первым, потому что пространство действий огромно, а цена ошибки — один лишний клик.",
    surface: "navigation",
    meta: true,
    label: { anchor: "start", dx: 12, dy: 4 },
    values: v({
      openness: 0.8,
      mode: 0.45,
      initiative: 0.0,
      temporality: 0.0,
      delegation: 0.05,
      expertise: 0.25,
      stake: 0.1,
      trust: 0.1,
      attention: 0.25,
      cardinality: 0.05,
      precision: 0.1,
      formStability: 0.4,
    }),
  },
  {
    id: "read-shown",
    name: "Понять уже показанное",
    tell: "Цифры, статусы или правила на экране есть. Не хватает причины, почему они такие.",
    principle:
      "Стабильный экран ценен сравнимостью. Модель подписывает его, а не перерисовывает текстом: иначе аномалию больше нельзя поймать боковым зрением.",
    surface: "table",
    label: { anchor: "start", dx: 12, dy: 4 },
    values: v({
      openness: 0.22,
      mode: 0.12,
      initiative: 0.15,
      temporality: 0.1,
      delegation: 0.05,
      expertise: 0.2,
      stake: 0.25,
      trust: 0.55,
      attention: 0.3,
      cardinality: 0.15,
      precision: 0.2,
      formStability: 0.95,
    }),
  },
  {
    id: "query-set",
    name: "Выборка по описанию",
    tell: "Нужный набор строк формулируется словами, а ищется фильтрами, названия которых человек не знает.",
    principle:
      "Язык компилирует намерение в запрос. Результат обязан остаться таблицей: иначе нельзя сравнить, отсортировать и взять несколько строк дальше.",
    surface: "table",
    label: { anchor: "end", dx: -12, dy: 4 },
    values: v({
      openness: 0.88,
      mode: 0.2,
      initiative: 0.1,
      temporality: 0.2,
      delegation: 0.15,
      expertise: 0.45,
      stake: 0.15,
      trust: 0.3,
      attention: 0.3,
      cardinality: 0.45,
      precision: 0.18,
      formStability: 0.9,
    }),
  },
  {
    id: "gather",
    name: "Собрать фактуру",
    tell: "Работе предшествует сборка сводки из нескольких систем. Пока сводки нет, сам шаг даже не начался.",
    principle:
      "Если данные можно собрать без человека, не заставляйте его быть курьером между экранами. К открытию экрана сводка уже должна лежать, а человеку остаётся принять или поправить.",
    surface: "table",
    label: { anchor: "end", dx: -12, dy: 4 },
    values: v({
      openness: 0.62,
      mode: 0.38,
      initiative: 0.35,
      temporality: 0.9,
      delegation: 0.7,
      expertise: 0.55,
      stake: 0.4,
      trust: 0.45,
      attention: 0.35,
      cardinality: 0.7,
      precision: 0.25,
      formStability: 0.9,
    }),
  },
  {
    id: "fill-form",
    name: "Заполнить форму из намерения",
    tell: "Мысль умещается в одно предложение, а раскладывается по обязательным полям, часть из которых этому случаю не нужна.",
    principle:
      "Форма остаётся формой: язык только раскладывает намерение по полям. Человек правит подстановку, а не диктует каждое значение заново.",
    surface: "form",
    label: { anchor: "start", dx: 12, dy: 4 },
    values: v({
      openness: 0.45,
      mode: 0.82,
      initiative: 0.15,
      temporality: 0.2,
      delegation: 0.2,
      expertise: 0.35,
      stake: 0.25,
      trust: 0.25,
      attention: 0.3,
      cardinality: 0.25,
      precision: 0.25,
      formStability: 0.85,
    }),
  },
  {
    id: "bulk-rule",
    name: "Одно правило на много строк",
    tell: "Одна и та же логика вручную повторяется по каждому объекту: людям, строкам бюджета, слотам календаря.",
    principle:
      "Веерность важнее частоты. Имеет смысл автоматизировать не «ещё раз то же самое», а правило, которое применяется ко всем сразу — с диффом и одной кнопкой коммита.",
    surface: "table",
    label: { anchor: "start", dx: 12, dy: 4 },
    values: v({
      openness: 0.52,
      mode: 0.86,
      initiative: 0.4,
      temporality: 0.4,
      delegation: 0.8,
      expertise: 0.6,
      stake: 0.7,
      trust: 0.55,
      attention: 0.4,
      cardinality: 0.9,
      precision: 0.35,
      formStability: 0.95,
    }),
  },
  {
    id: "blank-page",
    name: "Написать с чистого листа",
    tell: "Нужен связный текст, все факты для которого уже лежат в системах, а человек смотрит в пустое поле.",
    principle:
      "Чистый лист — налог на вспоминание, а не на мысль. Черновик собирается из фактуры; человек правит смысл и голос, а не восстанавливает, что было полгода назад.",
    surface: "blank",
    label: { anchor: "end", dx: -12, dy: 4 },
    values: v({
      openness: 0.86,
      mode: 0.84,
      initiative: 0.55,
      temporality: 0.25,
      delegation: 0.25,
      expertise: 0.25,
      stake: 0.35,
      trust: 0.3,
      attention: 0.45,
      cardinality: 0.2,
      precision: 0.15,
      formStability: 0.22,
    }),
  },
  {
    id: "irreversible",
    name: "Необратимое подтверждение",
    tell: "Действие юридически или финансово значимо, и человек проходит его редко. Узкое место — не набор полей, а цена ошибки.",
    principle:
      "Язык — плохой протокол коммита. Модель может собрать заявку, но подтверждение остаётся отдельным явным действием с предпросмотром последствий. Часто здесь правильнее ускорить доставку и напоминание, а не формулировку.",
    surface: "document",
    label: { anchor: "start", dx: 12, dy: 4 },
    values: v({
      openness: 0.12,
      mode: 0.92,
      initiative: 0.55,
      temporality: 0.25,
      delegation: 0.15,
      expertise: 0.1,
      stake: 0.95,
      trust: 0.9,
      attention: 0.65,
      cardinality: 0.25,
      precision: 0.7,
      formStability: 0.95,
    }),
  },
];

export const principles = [
  {
    title: "Язык на входе, структура на выходе",
    body: "Человек за пять секунд произносит намерение, которое в фильтрах заняло бы двенадцать полей. Прочитать абзац вместо таблицы — наоборот, медленнее. Поэтому чат почти никогда не должен быть постоянной поверхностью результата.",
  },
  {
    title: "Коммит остаётся кнопкой",
    body: "Естественный язык хорошо собирает действие и плохо подтверждает его. Предпросмотр, дифф и отдельная кнопка — не осторожность ради осторожности, а единственный надёжный протокол «я подтверждаю ровно это».",
  },
  {
    title: "Ретрофит — поле на существующем экране",
    body: "В интранете почти везде уже есть таблица, форма или каталог. Отдельное окно чата добавляет навигацию вместо того, чтобы её снимать. Механика встраивается в тот экран, на котором человек и так работает.",
  },
  {
    title: "Сначала паттерн, потом механика",
    body: "Два экрана «про деньги» или «про таблицу» могут требовать противоположных решений. Диагноз ставится по осям — открытость, веерность, ставка, форма результата — а не по названию продукта.",
  },
  {
    title: "Если узкое место не намерение — не трогать",
    body: "Подпись документа, живое согласование, точное позиционирование не ускоряются формулировкой. Языковая механика там добавляет шаг. Ускоряйте доставку, напоминание и сбор фактуры, а не ввод.",
  },
];
