export type AxisId =
  | "openness"
  | "mode"
  | "initiative"
  | "temporality"
  | "delegation"
  | "expertise"
  | "stake"
  | "trust"
  | "attention"
  | "cardinality"
  | "precision"
  | "formStability";

export type AxisValues = Record<AxisId, number>;

export type ZoneId =
  | "observation"
  | "exploration"
  | "transaction"
  | "generation"
  | "meta";

export interface AxisDef {
  id: AxisId;
  name: string;
  hint: string;
  poles: [string, string];
}

export interface Zone {
  id: ZoneId;
  title: string;
  gloss: string;
  color: string;
}

export interface Archetype {
  id: string;
  name: string;
  taskClass: string;
  blurb: string;
  /** Rendered on the navigation frame instead of inside the plot. */
  meta?: boolean;
  label: { anchor: "start" | "end"; dx: number; dy: number };
  values: AxisValues;
}

/** The two axes that form the plane. Everything else is a spectrum. */
export const planeAxes: { x: AxisDef; y: AxisDef } = {
  x: {
    id: "openness",
    name: "Пространство вариантов",
    hint: "Известен ли заранее набор вопросов и действий",
    poles: ["закрытое", "открытое"],
  },
  y: {
    id: "mode",
    name: "Что делает пользователь",
    hint: "Два «залива» Нормана: понять мир или изменить его",
    poles: ["оценка · строю модель мира", "исполнение · меняю мир"],
  },
};

/** Axes the plane does not capture — the actual answer to «каких осей не хватает». */
export const spectrumAxes: AxisDef[] = [
  {
    id: "initiative",
    name: "Инициатива",
    hint: "Дашборд и мониторинг — одна задача, разные продукты",
    poles: ["pull · начинаю я", "push · начинает система"],
  },
  {
    id: "temporality",
    name: "Темпоральность",
    hint: "Фоновое исполнение требует уведомления и приёмки",
    poles: ["синхронно", "фоново"],
  },
  {
    id: "delegation",
    name: "Уровень делегирования",
    hint: "Лестница, по которой ИИ двигает людей вверх",
    poles: ["делаю сам", "задаю правила"],
  },
  {
    id: "expertise",
    name: "Экспертиза и частота",
    hint: "Объясняет большинство споров о том, «что лучше»",
    poles: ["новичок раз в год", "профи каждый день"],
  },
  {
    id: "stake",
    name: "Ставка и обратимость",
    hint: "Не свойство класса задачи, а своя координата",
    poles: ["обратимо и дёшево", "необратимо и дорого"],
  },
  {
    id: "trust",
    name: "Доверие к контрагенту",
    hint: "Состязательный режим требует отдельного слоя защиты",
    poles: ["детерминированно", "состязательно"],
  },
  {
    id: "attention",
    name: "Режим внимания",
    hint: "Настенный борд и пейджер — одна задача, разная громкость",
    poles: ["периферийное", "прерывающее"],
  },
  {
    id: "cardinality",
    name: "Кардинальность",
    hint: "Определяет примитивы согласованности, права, присутствие",
    poles: ["один человек", "много агентов"],
  },
  {
    id: "precision",
    name: "Единица управления",
    hint: "Язык хорошо описывает намерение и плохо — координаты",
    poles: ["намерение", "координаты"],
  },
  {
    id: "formStability",
    name: "Форма вывода",
    hint: "Сравнимость требует устойчивой структуры",
    poles: ["свободный текст", "жёсткая структура"],
  },
];

export const zones: Record<ZoneId, Zone> = {
  observation: {
    id: "observation",
    title: "OBSERVATION",
    gloss: "вопросы известны заранее",
    color: "oklch(0.70 0.13 248)",
  },
  exploration: {
    id: "exploration",
    title: "EXPLORATION",
    gloss: "вопрос рождается по ходу",
    color: "oklch(0.78 0.12 190)",
  },
  transaction: {
    id: "transaction",
    title: "TRANSACTION",
    gloss: "конечный набор действий",
    color: "oklch(0.70 0.15 315)",
  },
  generation: {
    id: "generation",
    title: "GENERATION",
    gloss: "результат ничем не ограничен",
    color: "oklch(0.80 0.14 72)",
  },
  meta: {
    id: "meta",
    title: "NAVIGATION",
    gloss: "мета-слой над всей плоскостью",
    color: "oklch(0.72 0.02 260)",
  },
};

export function zoneOf(a: Archetype): ZoneId {
  if (a.meta) return "meta";
  const { openness, mode } = a.values;
  if (mode < 0.5) return openness < 0.5 ? "observation" : "exploration";
  return openness < 0.5 ? "transaction" : "generation";
}

const v = (values: AxisValues) => values;

export const archetypes: Archetype[] = [
  {
    id: "dashboard",
    name: "Дашборд метрик",
    taskClass: "observation",
    blurb:
      "Ценен тем, что стабилен: тот же график в том же месте, аномалия ловится боковым зрением.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.14,
      mode: 0.12,
      initiative: 0.15,
      temporality: 0.15,
      delegation: 0.15,
      expertise: 0.6,
      stake: 0.1,
      trust: 0.1,
      attention: 0.25,
      cardinality: 0.35,
      precision: 0.2,
      formStability: 0.98,
    }),
  },
  {
    id: "pager",
    name: "Пейджер алертов",
    taskClass: "monitoring",
    blurb:
      "Должен работать, когда на него не смотрят. Push по своей природе, поэтому чат сюда не ложится вообще.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.06,
      mode: 0.32,
      initiative: 0.98,
      temporality: 0.2,
      delegation: 0.3,
      expertise: 0.85,
      stake: 0.6,
      trust: 0.2,
      attention: 1.0,
      cardinality: 0.4,
      precision: 0.15,
      formStability: 0.9,
    }),
  },
  {
    id: "feed",
    name: "Лента контента",
    taskClass: "consumption",
    blurb:
      "Задачи нет — есть режим. Метрика время, а не завершение, поэтому намерение и не формулируется словами.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.33,
      mode: 0.08,
      initiative: 0.7,
      temporality: 0.1,
      delegation: 0.05,
      expertise: 0.05,
      stake: 0.05,
      trust: 0.35,
      attention: 0.3,
      cardinality: 0.5,
      precision: 0.1,
      formStability: 0.85,
    }),
  },
  {
    id: "review",
    name: "Code review",
    taskClass: "verification",
    blurb:
      "Оценка чужого артефакта в состязательном по сути режиме. Диффу нужна жёсткая форма, объяснению — язык.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.46,
      mode: 0.25,
      initiative: 0.45,
      temporality: 0.6,
      delegation: 0.7,
      expertise: 0.85,
      stake: 0.55,
      trust: 0.4,
      attention: 0.4,
      cardinality: 0.6,
      precision: 0.5,
      formStability: 0.9,
    }),
  },
  {
    id: "diagnosis",
    name: "Разбор инцидента",
    taskClass: "diagnosis",
    blurb:
      "Цель причинная, а не описательная: вы проверяете гипотезы против системы, которая сопротивляется.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.7,
      mode: 0.31,
      initiative: 0.3,
      temporality: 0.15,
      delegation: 0.1,
      expertise: 0.9,
      stake: 0.5,
      trust: 0.25,
      attention: 0.8,
      cardinality: 0.55,
      precision: 0.35,
      formStability: 0.7,
    }),
  },
  {
    id: "sql",
    name: "SQL-консоль",
    taskClass: "exploration",
    blurb:
      "Лучший случай для языка на входе: пространство вопросов открытое, ошибка стоит переспроса. Но ответ обязан быть таблицей.",
    label: { anchor: "end", dx: -13, dy: 4 },
    values: v({
      openness: 0.9,
      mode: 0.13,
      initiative: 0.05,
      temporality: 0.2,
      delegation: 0.15,
      expertise: 0.85,
      stake: 0.1,
      trust: 0.1,
      attention: 0.2,
      cardinality: 0.15,
      precision: 0.25,
      formStability: 0.8,
    }),
  },
  {
    id: "supervision",
    name: "Надзор за агентом",
    taskClass: "supervision",
    blurb:
      "Класс, которого раньше не было. Человек — заказчик и приёмщик: очередь, прогресс, дифф, откат. Чат тут только первый шаг.",
    label: { anchor: "end", dx: -13, dy: 4 },
    values: v({
      openness: 0.8,
      mode: 0.56,
      initiative: 0.55,
      temporality: 0.9,
      delegation: 0.85,
      expertise: 0.7,
      stake: 0.6,
      trust: 0.75,
      attention: 0.45,
      cardinality: 0.9,
      precision: 0.3,
      formStability: 0.75,
    }),
  },
  {
    id: "assistant",
    name: "Чат-ассистент",
    taskClass: "generation",
    blurb:
      "Единственный случай, где чистый чат оправдан целиком: результат сам является текстом, а цена ошибки близка к нулю.",
    label: { anchor: "end", dx: -13, dy: 4 },
    values: v({
      openness: 0.93,
      mode: 0.75,
      initiative: 0.05,
      temporality: 0.15,
      delegation: 0.5,
      expertise: 0.3,
      stake: 0.15,
      trust: 0.6,
      attention: 0.35,
      cardinality: 0.2,
      precision: 0.15,
      formStability: 0.15,
    }),
  },
  {
    id: "editor",
    name: "Графический редактор",
    taskClass: "authoring",
    blurb:
      "Точность позиционирования и есть задача. Словами удобно задать инвариант, но не сдвинуть объект на три пикселя.",
    label: { anchor: "end", dx: -13, dy: 4 },
    values: v({
      openness: 0.71,
      mode: 0.9,
      initiative: 0.02,
      temporality: 0.05,
      delegation: 0.0,
      expertise: 0.9,
      stake: 0.15,
      trust: 0.05,
      attention: 0.15,
      cardinality: 0.35,
      precision: 0.98,
      formStability: 0.95,
    }),
  },
  {
    id: "capture",
    name: "Быстрая заметка",
    taskClass: "capture",
    blurb:
      "Единственная метрика — трение записи. Текстовая строка выигрывает, а разложить по полям может модель.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.66,
      mode: 0.66,
      initiative: 0.05,
      temporality: 0.35,
      delegation: 0.05,
      expertise: 0.35,
      stake: 0.05,
      trust: 0.05,
      attention: 0.5,
      cardinality: 0.1,
      precision: 0.05,
      formStability: 0.2,
    }),
  },
  {
    id: "permissions",
    name: "Настройка прав доступа",
    taskClass: "configuration",
    blurb:
      "Описать политику словами дешевле двенадцати экранов. Но модель должна выдать конфиг, а не выполнить действие.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.44,
      mode: 0.78,
      initiative: 0.1,
      temporality: 0.8,
      delegation: 1.0,
      expertise: 0.75,
      stake: 0.85,
      trust: 0.8,
      attention: 0.2,
      cardinality: 0.7,
      precision: 0.4,
      formStability: 0.6,
    }),
  },
  {
    id: "control",
    name: "Пульт реального времени",
    taskClass: "control",
    blurb:
      "Латентность здесь часть семантики. Ни один языковой интерфейс сюда не годится ни на входе, ни на выходе.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.25,
      mode: 0.93,
      initiative: 0.35,
      temporality: 0.0,
      delegation: 0.0,
      expertise: 0.95,
      stake: 0.95,
      trust: 0.15,
      attention: 0.9,
      cardinality: 0.3,
      precision: 0.95,
      formStability: 0.95,
    }),
  },
  {
    id: "payment",
    name: "Платёжная форма",
    taskClass: "transaction",
    blurb:
      "Язык — хороший компилятор намерения и плохой протокол коммита. Собрать транзакцию можно словами, подтвердить — кнопкой.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.08,
      mode: 0.85,
      initiative: 0.1,
      temporality: 0.05,
      delegation: 0.1,
      expertise: 0.1,
      stake: 0.95,
      trust: 0.85,
      attention: 0.6,
      cardinality: 0.25,
      precision: 0.6,
      formStability: 0.85,
    }),
  },
  {
    id: "triage",
    name: "Очередь модерации",
    taskClass: "triage",
    blurb:
      "Модель сортирует и обосновывает, человек подтверждает. Поверхность при этом не чат, а очередь с аннотациями.",
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.17,
      mode: 0.62,
      initiative: 0.6,
      temporality: 0.4,
      delegation: 0.5,
      expertise: 0.8,
      stake: 0.7,
      trust: 0.7,
      attention: 0.5,
      cardinality: 0.5,
      precision: 0.3,
      formStability: 0.85,
    }),
  },
  {
    id: "palette",
    name: "Палитра команд",
    taskClass: "navigation",
    blurb:
      "Навигация — не класс задач, а налог на размер продукта. Никто не хочет навигировать, поэтому язык съедает её первой.",
    meta: true,
    label: { anchor: "start", dx: 13, dy: 4 },
    values: v({
      openness: 0.75,
      mode: 0.45,
      initiative: 0.0,
      temporality: 0.0,
      delegation: 0.05,
      expertise: 0.9,
      stake: 0.2,
      trust: 0.05,
      attention: 0.25,
      cardinality: 0.05,
      precision: 0.1,
      formStability: 0.5,
    }),
  },
];

export interface Verdict {
  id: string;
  name: string;
  desc: string;
  drivers: string;
  compute: (values: AxisValues) => number;
}

/**
 * Verdicts are derived from axis positions rather than authored per archetype —
 * that is the whole point of treating an interface as a vector, not a bucket.
 */
export const verdicts: Verdict[] = [
  {
    id: "langIn",
    name: "Язык на входе",
    desc: "выгодно ли выражать намерение словами",
    drivers: "пространство вариантов, единица управления, инициатива, внимание",
    compute: (a) =>
      0.4 * a.openness +
      0.3 * (1 - a.precision) +
      0.2 * (1 - a.initiative) +
      0.1 * (1 - a.attention),
  },
  {
    id: "langOut",
    name: "Язык на выходе",
    desc: "выгодно ли получать результат текстом",
    drivers: "форма вывода, инициатива, режим внимания",
    compute: (a) =>
      0.75 * (1 - a.formStability) +
      0.15 * (1 - a.initiative) +
      0.1 * (1 - a.attention),
  },
  {
    id: "autoCommit",
    name: "Коммит без человека",
    desc: "можно ли отдать модели само действие",
    drivers: "ставка и обратимость, доверие, единица управления",
    compute: (a) =>
      0.55 * (1 - a.stake) + 0.3 * (1 - a.trust) + 0.15 * (1 - a.precision),
  },
];

/** The coordinates that actually characterise an archetype — the ones furthest from neutral. */
export function extremeAxes(a: Archetype, count = 4) {
  return spectrumAxes
    .map((axis) => {
      const value = a.values[axis.id];
      return {
        axis,
        value,
        distance: Math.abs(value - 0.5),
        pole: value >= 0.5 ? axis.poles[1] : axis.poles[0],
      };
    })
    .sort((x, y) => y.distance - x.distance)
    .slice(0, count);
}

/** Where two archetypes disagree most — usually the reason they feel like different products. */
export function divergentAxes(a: Archetype, b: Archetype, count = 3) {
  return spectrumAxes
    .map((axis) => ({
      axis,
      delta: Math.abs(a.values[axis.id] - b.values[axis.id]),
    }))
    .sort((x, y) => y.delta - x.delta)
    .slice(0, count);
}

export function verdictTone(value: number): {
  label: string;
  color: string;
} {
  if (value < 0.38)
    return { label: "низкая", color: "oklch(0.66 0.17 22)" };
  if (value < 0.62)
    return { label: "средняя", color: "oklch(0.79 0.14 78)" };
  return { label: "высокая", color: "oklch(0.75 0.15 155)" };
}

/** The other half of the taxonomy: task classes grouped by what actually changes. */
export const loci: { title: string; note: string; classes: string[] }[] = [
  {
    title: "Состояние мира",
    note: "разовое развёртывание — не то же, что настройка",
    classes: ["transaction", "control", "provisioning"],
  },
  {
    title: "Артефакт",
    note: "recovery — отдельный класс: человек входит в него в стрессе",
    classes: ["authoring", "generation", "capture", "recovery"],
  },
  {
    title: "Знание пользователя",
    note: "у sensemaking результат не материализуется вообще",
    classes: ["observation", "exploration", "sensemaking", "diagnosis", "learning"],
  },
  {
    title: "Будущее поведение",
    note: "у commitment трение полезно, а лёгкая отмена вредна",
    classes: ["configuration", "automation", "commitment"],
  },
  {
    title: "Другой человек",
    note: "handoff вырос, потому что контекст теперь принимает и агент",
    classes: ["communication", "approval", "persuasion", "handoff", "consent"],
  },
  {
    title: "Процесс работы",
    note: "waiting перестал быть спиннером и стал поверхностью",
    classes: ["navigation", "waiting", "supervision", "verification", "triage"],
  },
];
