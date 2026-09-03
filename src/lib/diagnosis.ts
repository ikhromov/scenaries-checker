import type { Pattern } from "./patterns";

/**
 * Single-scenario diagnosis. Scores are read by the dashboard formulas
 * in mechanics.ts — do not invent a parallel ranking here.
 */
export const diagnosis: Pattern = {
  id: "stage-invite",
  name: "Приглашение на этап",
  tell: "Кандидат закрыл этап. Рекрутеру нужно собрать авто-фидбек, выбрать свободные слоты следующего интервью и отправить приглашение — пока воронка не остыла.",
  principle:
    "Вердикт, заметки интервьюеров и окна календарей уже лежат в системах. Язык собирает черновик письма и раскладывает приглашение по полям формы; слоты остаются выбором из календаря, а отправка кандидату — отдельной кнопкой. К открытию карточки пакет должен быть готов, а не надиктовываться в чате.",
  surface: "form",
  label: { anchor: "start", dx: 12, dy: 4 },
  values: {
    openness: 0.33,
    mode: 0.87,
    initiative: 0.74,
    temporality: 0.81,
    delegation: 0.46,
    expertise: 0.83,
    stake: 0.57,
    trust: 0.71,
    attention: 0.48,
    cardinality: 0.16,
    precision: 0.34,
    formStability: 0.77,
  },
};
