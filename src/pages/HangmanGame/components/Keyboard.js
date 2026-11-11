import "../styles/keyboard.css";

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Š", "Đ"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Č", "Ć", "Ž"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export const KEYBOARD_LETTERS = keyboardRows.flat();

// used keys show whether the letter was in the word (correct) or not (wrong)
const Keyboard = ({ onLetterClick, guesses = [], incorrect = [], disabled }) => {
  return (
    <div className={`keyboard-container ${disabled ? "is-disabled" : ""}`}>
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const isUsed = guesses.includes(key);
            const state = !isUsed ? "" : incorrect.includes(key) ? "wrong" : "correct";

            return (
              <button
                key={key}
                type="button"
                className={`keyboard-key ${state}`}
                onClick={() => onLetterClick(key)}
                disabled={isUsed || disabled}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
