import React, { useReducer } from 'react';
import { gameReducer, initialState } from './gameReducer';
import { CompleteGameState, GameAction, COLOR_MAP, DEFAULT_COLOR, CARD_NUMBERS, CARD_COLORS, IMPOSSIBLE_SYMBOL, Card, CardColor, CardNumber, numberToIndex, setCardAmount } from './types';
import './App.css';

const SettingsButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button 
        className="settings-button" 
        onClick={() => setIsOpen(true)}
      >
        ⚙️
      </button>
      {isOpen && (
        <div className="settings-overlay" onClick={() => setIsOpen(false)}>
          <div className="settings-content" onClick={e => e.stopPropagation()}>
            {[3,4,5].map(n => (
              <button 
                key={n}
                onClick={() => {
                  setCardAmount(n);
                  window.location.reload();
                }}
              >
                {n} Cards
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};



function getKnownValue<T>(possibilities: boolean[], values: T[]): T | null {
  const idx = possibilities.findIndex((x, i) => 
    x && possibilities.every((y, j) => i === j || !y));
  return idx === -1 ? null : values[idx];
}
const ReactCard: React.FC<{
  index: number,
  knownColor: CardColor | null,
  knownNumber: CardNumber | null,
  numberPossibilities: boolean[],
  colorPossibilities: boolean[],
  isMarked: boolean,
  onMark: () => void,
  canDiscard: boolean,
  onDiscard: () => void
}> = ({ index, knownColor, knownNumber, numberPossibilities, colorPossibilities, isMarked, onMark, canDiscard, onDiscard }) => (
  <div
    className={`card ${isMarked ? 'marked' : ''} `}
    style={{ backgroundColor: knownColor? COLOR_MAP[knownColor] : DEFAULT_COLOR }}
    onClick={onMark}
  >
    <button 
      className="discard-button" 
      onClick={(e) => { 
        if (canDiscard) {
          e.stopPropagation();
          onDiscard();
        }
      }}
    >
      ✕
    </button>
    <div className="card-content">
      <div className="number">{knownNumber || '\u00A0'}</div>
      <div className="grids">
        <div className="grid" style={{visibility: knownNumber ? 'hidden' : 'visible'}}>
          {CARD_NUMBERS.map((n, i) => (
            <div key={n} className={numberPossibilities[i] === false ? 'impossible' : ''}>
              {numberPossibilities[i] === false ? IMPOSSIBLE_SYMBOL : n}
            </div>
          ))}
        </div>
        <div className="grid" style={{visibility: knownColor ? 'hidden' : 'visible'}}>
          {CARD_COLORS.map((c, i) => (
            <div
              key={c}
              className={colorPossibilities[i] === false ? 'impossible' : ''}
              style={{ backgroundColor: COLOR_MAP[c] }}
            >
              {colorPossibilities[i] === false ? IMPOSSIBLE_SYMBOL : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)



function App() {
  const [state, dispatch] = useReducer<React.Reducer<CompleteGameState, GameAction>>(
    gameReducer, 
    initialState
  );

  const onDiscard = (index: number) => {
    dispatch({ type: 'DISCARD_CARD', payload: index });
    // setTimeout(() => {
    //   dispatch({ type: 'FINISH_DISCARD', payload: index });
    // }, 300);
  };

  return (
    <div className="game">
      <button 
        className="undo-button" 
        onClick={() => dispatch({ type: 'UNDO' })} 
        disabled={state.history.length === 1 || state.markedCards.size > 0}
      >
        ↺ Undo
      </button>
      <SettingsButton />
      {state.markedCards.size > 0 && (
        <div className="hint-tables">
          <div className="hint-table">
            <div className="grid">
              {CARD_NUMBERS.map((n, i) => {
                const impossible = Array.from(state.markedCards).some(idx => {
                  const card = state.history.at(-1)![idx];
                  return card.numberPossibilities[i] === false;
                });
                return (
                  <div 
                    key={n}
                    onClick={() => !impossible && dispatch({ type: 'SUBMIT_NUMBER', payload: n })}
                    className={impossible ? 'impossible' : ''}
                  >
                    {impossible ? IMPOSSIBLE_SYMBOL : n}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="hint-table">
            <h3>Select color:</h3>
            <div className="grid">
              {CARD_COLORS.map((c, i) => {
                const impossible = Array.from(state.markedCards).some(idx => {
                  const card = state.history.at(-1)![idx];
                  return card.colorPossibilities[i] === false;
                });
                return (
                  <div
                    key={c}
                    onClick={() => !impossible && dispatch({ type: 'SUBMIT_COLOR', payload: c })}
                    style={{ backgroundColor: COLOR_MAP[c] }}
                    className={impossible ? 'impossible' : ''}
                  >
                    {impossible ? IMPOSSIBLE_SYMBOL : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className="cards">
        {state.history.at(-1)!.map((card, i) => (
          <ReactCard
            key={card.id}
            index={i}
            numberPossibilities={card.numberPossibilities}
            colorPossibilities={card.colorPossibilities}
            knownNumber={getKnownValue(card.numberPossibilities, CARD_NUMBERS)}
            knownColor={getKnownValue(card.colorPossibilities, CARD_COLORS)}
            isMarked={state.markedCards.has(i)}
            onMark={() => dispatch({ type: 'MARK_CARD', payload: i })}
            onDiscard={() => onDiscard(i)}
            canDiscard={state.markedCards.size === 0}
          />
        ))}
      </div>
    </div>
  );
}

export default App;