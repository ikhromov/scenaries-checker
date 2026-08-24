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
  | "generation";

export interface AxisDef {
  id: AxisId;
  name: string;
  hint: string;
  poles: [string, string];
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
    hint: "Понять состояние или изменить его",
    poles: ["оценка · разобраться в данных", "исполнение · изменить данные"],
  },
};

export const spectrumAxes: AxisDef[] = [
  {
    id: "initiative",
    name: "Инициатива",
    hint: "Пришёл сам или система дёрнула дедлайном",
    poles: ["pull · прихожу сам", "push · дёргает система"],
  },
  {
    id: "temporality",
    name: "Темпоральность",
    hint: "Можно ли подготовить заранее, пока человека нет",
    poles: ["синхронно", "фоново"],
  },
  {
    id: "delegation",
    name: "Уровень делегирования",
    hint: "Делаю руками или задаю правило для многих",
    poles: ["делаю сам", "задаю правила"],
  },
  {
    id: "expertise",
    name: "Экспертиза и частота",
    hint: "Раз в год вслепую или каждый день на автомате",
    poles: ["раз в год вслепую", "каждый день"],
  },
  {
    id: "stake",
    name: "Ставка и обратимость",
    hint: "Что будет, если модель ошибётся и это уйдёт дальше",
    poles: ["обратимо и дёшево", "необратимо и дорого"],
  },
  {
    id: "trust",
    name: "Чувствительность данных",
    hint: "Персданные, оклады, конфликт интересов сторон",
    poles: ["нейтральные данные", "деньги и персданные"],
  },
  {
    id: "attention",
    name: "Режим внимания",
    hint: "Фон рабочего дня или срыв текущей задачи",
    poles: ["периферийное", "прерывающее"],
  },
  {
    id: "cardinality",
    name: "Веерность",
    hint: "Один объект или одно и то же по сотне подчинённых",
    poles: ["один объект", "сотня объектов"],
  },
  {
    id: "precision",
    name: "Единица управления",
    hint: "Язык описывает намерение и плохо — точные значения",
    poles: ["намерение", "точные значения"],
  },
  {
    id: "formStability",
    name: "Форма результата",
    hint: "Ответ можно прочитать текстом или он обязан быть таблицей",
    poles: ["свободный текст", "таблица или форма"],
  },
];

export const zones: Record<ZoneId, { title: string; gloss: string; color: string }> = {
  observation: {
    title: "OBSERVATION",
    gloss: "вопросы известны заранее",
    color: "oklch(0.70 0.13 248)",
  },
  exploration: {
    title: "EXPLORATION",
    gloss: "вопрос рождается по ходу",
    color: "oklch(0.78 0.12 190)",
  },
  transaction: {
    title: "TRANSACTION",
    gloss: "конечный набор действий",
    color: "oklch(0.70 0.15 315)",
  },
  generation: {
    title: "GENERATION",
    gloss: "результат ничем не ограничен",
    color: "oklch(0.80 0.14 72)",
  },
};

export function zoneOf(values: AxisValues): ZoneId {
  if (values.mode < 0.5)
    return values.openness < 0.5 ? "observation" : "exploration";
  return values.openness < 0.5 ? "transaction" : "generation";
}

/** The coordinates that actually characterise a scenario — those furthest from neutral. */
export function extremeAxes(values: AxisValues, count = 4) {
  return spectrumAxes
    .map((axis) => {
      const value = values[axis.id];
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

/** Where two patterns disagree most — usually why one mechanic fits and the other does not. */
export function divergentAxes(a: AxisValues, b: AxisValues, count = 3) {
  return spectrumAxes
    .map((axis) => ({ axis, delta: Math.abs(a[axis.id] - b[axis.id]) }))
    .sort((x, y) => y.delta - x.delta)
    .slice(0, count);
}
