import { Card, CardNumber, CardColor, CompleteGameState, GameAction, CARD_NUMBERS, CARD_COLORS, numberToIndex, colorToIndex, getCardAmount, getSlideDirection } from './types';

const createEmptyCard = (): Card => ({
  id: Math.random().toString(36).substring(7),
  numberPossibilities: new Array(5).fill(true),
  colorPossibilities: new Array(5).fill(true),
});


export const initialState: CompleteGameState = {
  history: [Array(getCardAmount()).fill(null).map(createEmptyCard)],
  markedCards: new Set<number>(),
};

export function gameReducer(state: CompleteGameState, action: GameAction): CompleteGameState {

  console.log('action', action);
  console.log('state', state);

  switch(action.type) {
    case 'MARK_CARD': {
      const newMarked = new Set(state.markedCards);
      if (newMarked.has(action.payload)) {
        newMarked.delete(action.payload);
      } else {
        newMarked.add(action.payload);
      }
      return {...state, markedCards: newMarked};
    }

    case 'SUBMIT_NUMBER': {
      let cards: Card[] = structuredClone(state.history.at(-1)!);
      const numberIdx = numberToIndex(action.payload);

      cards.forEach((card, i) => {
        if (state.markedCards.has(i)) {
          card.numberPossibilities.fill(false);
          card.numberPossibilities[numberIdx] = true;
        } else {
          card.numberPossibilities[numberIdx] = false;
        }
      });
      
      return {
        history: [...state.history, cards],
        markedCards: new Set(),
      };
    }

    case 'SUBMIT_COLOR': {
      let cards: Card[] = structuredClone(state.history.at(-1)!);
      const colorIdx = colorToIndex(action.payload);

      cards.forEach((card, i) => {
        if (state.markedCards.has(i)) {
          card.colorPossibilities.fill(false);
          card.colorPossibilities[colorIdx] = true;
        } else {
          card.colorPossibilities[colorIdx] = false;
        }
      });
      
      return {
        history: [...state.history, cards],
        markedCards: new Set(),
      };
    }

    case 'DISCARD_CARD': {
      let cards: Card[] = structuredClone(state.history.at(-1)!);
      cards = cards.filter((_, i) => i !== action.payload);

      // if (getSlideDirection() === 'left') {
      cards.push(createEmptyCard());
      // } else {
        // cards.unshift(createEmptyCard());
      // }

      return {
        history: [...state.history, cards],
        markedCards: new Set(),
      };
    }
    //   const newCards = [...state.cards];
    //   newCards[action.payload].isExiting = true;
    //   return {...state, cards: newCards};
    // }

    // case 'FINISH_DISCARD': {
    //   const finalCards = state.cards.filter((_, i) => i !== action.payload);
    //   finalCards.push(createEmptyCard());
    //   return {...state, cards: finalCards};
    // }

    case 'UNDO': {
      console.log('UNDO');
      console.log(state.history);

      if (state.history.length === 1) return state;

      return {
        history: state.history.slice(0, -1),
        markedCards: new Set(),
      }

      // const prevCardStates = state.history[state.history.length - 1];
      // return {
      //   cards: prevCardStates.map((cardState, i) => ({
      //       ...cardState,
      //       isEntering: false,
      //       isExiting: false
      //     })),
      //   markedCards: new Set(),
      //   history: state.history.slice(0, -1)
      // };
    }

    default:
      return state;
  }
}