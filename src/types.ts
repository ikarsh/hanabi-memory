export const CARD_NUMBERS = [1, 2, 3, 4, 5];
export const CARD_COLORS = ['blue', 'yellow', 'green', 'white', 'red'];

export type CardNumber = typeof CARD_NUMBERS[number];
export type CardColor = typeof CARD_COLORS[number];

export const numberToIndex = (n: CardNumber) => CARD_NUMBERS.indexOf(n);
export const colorToIndex = (color: CardColor) => CARD_COLORS.indexOf(color);


export type Direction = 'left' | 'right';

export type Card = {
  id: string;
  numberPossibilities: Array<boolean>;
  colorPossibilities: Array<boolean>;
}

export type CompleteGameState = {
  history: Card[][];
  markedCards: Set<number>;
}


export type GameAction = 
  | { type: 'MARK_CARD'; payload: number }
  | { type: 'SUBMIT_NUMBER'; payload: CardNumber }
  | { type: 'SUBMIT_COLOR'; payload: CardColor }
  | { type: 'DISCARD_CARD'; payload: number }
  | { type: 'UNDO' };

// Constants
export const CARD_AMOUNT = 4;
export const SLIDE_DIRECTION: Direction = 'left';
export const DEFAULT_COLOR = '#d3d3d3';
export const IMPOSSIBLE_SYMBOL = '✕';
export const COLOR_MAP: Readonly<Record<CardColor, string>> = {
  blue: '#3333ff', // 0000ff
  yellow: '#ffff00',
  green: '#00ff00',
  white: '#ffffff',
  red: '#ff0000'
};