import "../styles/keyboard.css";

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Š", "Đ"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Č", "Ć", "Ž"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const Keyboard = ({ onLetterClick, guessedLetters }) => {
  return (
    <div className="keyboard-container">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const isGuessed = guessedLetters.includes(key);
            return (
              <button
                key={key}
                className="keyboard-key"
                onClick={() => onLetterClick(key)}
                disabled={isGuessed}
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
