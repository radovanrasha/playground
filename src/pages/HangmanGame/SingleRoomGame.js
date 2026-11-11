import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useSocket } from "../../SocketContext";
import Keyboard, { KEYBOARD_LETTERS } from "./components/Keyboard";
import HangmanDrawing, { MAX_MISSES } from "./components/HangmanDrawing";

const WINNING_SCORE = 3;
// same rule as the server: letters from the keyboard and spaces
const TERM_REGEX = /^[A-ZČĆŽŠĐ ]+$/;

// splits the masked term into words so a word never breaks across lines
const toWords = (chars = []) =>
  chars.reduce(
    (words, char) => {
      if (char === " ") words.push([]);
      else words[words.length - 1].push(char);
      return words;
    },
    [[]]
  );

// tiles are sized in CSS from the longest word, so long words still fit
const MaskedWord = ({ chars }) => {
  const words = toWords(chars);
  const longest = Math.max(...words.map((word) => word.length), 1);

  return (
    <div className="hm-word" style={{ "--longest": longest }}>
      {words.map((word, wordIndex) => (
        <div className="hm-word-part" key={wordIndex}>
          {word.map((char, index) => (
            <span
              key={index}
              className={`hm-letter ${char !== "_" ? "revealed" : ""}`}
            >
              {char !== "_" ? char : ""}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const SingleRoomHangman = () => {
  const { id } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const { width, height } = useWindowSize();

  // read once on mount: two tabs of one browser share localStorage
  const [player] = useState(() => {
    const queryPlayer = new URLSearchParams(location.search).get("player");
    if (queryPlayer) localStorage.setItem("player", queryPlayer);
    return queryPlayer || localStorage.getItem("player");
  });

  const [game, setGame] = useState(null);
  const [enteredTerm, setEnteredTerm] = useState("");
  const [termError, setTermError] = useState("");
  // the setter's own word, shown to them while the opponent guesses
  const [myTerm, setMyTerm] = useState("");

  useEffect(() => {
    if (!socket) return;

    const onGameInfo = (data) => setGame(data.game);
    const onError = (message) => setTermError(message);
    const handleUnload = () => socket.emit("gameCanceledHangman", id);

    socket.on("gameInfoHangman", onGameInfo);
    socket.on("hangmanError", onError);
    socket.emit("joinRoomHangman", id, player);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      socket.off("gameInfoHangman", onGameInfo);
      socket.off("hangmanError", onError);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [socket, id, player]);

  const rounds = game?.rounds || [];
  const round = rounds[rounds.length - 1];
  const lastEnded = [...rounds].reverse().find((r) => r.status === "ended");
  const status = game?.status;
  const isSetter = round?.termSetter === player;
  const myScore =
    player === "playerOne" ? game?.playerOneScore : game?.playerTwoScore;
  const opponentScore =
    player === "playerOne" ? game?.playerTwoScore : game?.playerOneScore;
  const canGuess =
    status === "ongoing" && round?.status === "in_progress" && !isSetter;
  const guesses = round?.guesses || [];

  // a new round starts with an empty form
  useEffect(() => {
    setEnteredTerm("");
    setTermError("");
    setMyTerm("");
  }, [round?.roundNumber]);

  const handleGuess = (letter) => {
    if (!canGuess || guesses.includes(letter)) return;
    socket.emit("handleGuessHangman", id, player, letter);
  };

  // the guesser can also type letters on a physical keyboard
  useEffect(() => {
    if (!canGuess) return;

    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const letter = event.key.toUpperCase();
      if (KEYBOARD_LETTERS.includes(letter)) handleGuess(letter);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const handleConfirmTerm = (event) => {
    event.preventDefault();
    const term = enteredTerm.trim().replace(/\s+/g, " ").toUpperCase();

    if (term.length < 2) {
      setTermError("The word needs at least 2 letters.");
      return;
    }
    if (term.length > 30) {
      setTermError("Keep it to 30 characters or less.");
      return;
    }
    if (!TERM_REGEX.test(term)) {
      setTermError("Use only letters from the keyboard and spaces.");
      return;
    }

    setTermError("");
    setMyTerm(term);
    socket.emit("enteredTermHangman", id, player, term);
  };

  const leaveGame = () => {
    if (status === "initialized" || status === "ongoing") {
      socket.emit("gameCanceledHangman", id);
    }
    navigate("/hangman-multiplayer");
  };

  const statusText = (() => {
    if (round?.status === "choosing_term") {
      return isSetter ? "Your turn: choose a word" : "Opponent is choosing a word";
    }
    return isSetter ? "Opponent is guessing your word" : "Guess the word";
  })();

  // what happened in the round that just ended, from this player's view
  const lastRoundText = (() => {
    if (!lastEnded) return null;
    const wasSetter = lastEnded.termSetter === player;
    if (lastEnded.result === "guessed") {
      return wasSetter ? "Opponent guessed your word" : "You guessed it!";
    }
    return wasSetter ? "Opponent got hanged" : "You got hanged";
  })();
  const lastRoundWon =
    lastEnded &&
    (lastEnded.result === "guessed") !== (lastEnded.termSetter === player);

  const iWon = status === "finished" && myScore > opponentScore;
  const livesLeft = MAX_MISSES - (round?.missed || 0);

  return (
    <div className="hm-page">
      <div className="hm-topbar">
        <button type="button" className="hm-leave" onClick={leaveGame}>
          ← Leave
        </button>
        {round && (
          <span className="hm-round">
            Round {round.roundNumber} · first to {WINNING_SCORE}
          </span>
        )}
      </div>

      <div className="hm-scoreboard">
        <div className={`hm-player ${isSetter ? "" : "is-guessing"}`}>
          <span className="hm-player-name">You</span>
          <span className="hm-player-role">
            {isSetter ? "Word setter" : "Guesser"}
          </span>
          <span className="hm-score">{myScore ?? 0}</span>
        </div>
        <span className="hm-vs">vs</span>
        <div className={`hm-player ${isSetter ? "is-guessing" : ""}`}>
          <span className="hm-player-name">Opponent</span>
          <span className="hm-player-role">
            {isSetter ? "Guesser" : "Word setter"}
          </span>
          <span className="hm-score">{opponentScore ?? 0}</span>
        </div>
      </div>

      {status === "ongoing" && round && (
        <>
          <div className={`hm-status ${canGuess ? "is-active" : ""}`}>
            {statusText}
          </div>

          {round.status === "choosing_term" && lastEnded && (
            <div
              className={`hm-round-result ${lastRoundWon ? "won" : "lost"}`}
            >
              {lastEnded.result === "hanged" && (
                <HangmanDrawing missed={MAX_MISSES} />
              )}
              <strong>{lastRoundText}</strong>
              <span>
                The word was <b>{lastEnded.term.join("")}</b>
              </span>
            </div>
          )}

          {round.status === "choosing_term" &&
            (isSetter ? (
              <form className="hm-card hm-term-form" onSubmit={handleConfirmTerm}>
                <label htmlFor="hm-term">Pick a word for your opponent</label>
                <p className="hm-hint">
                  Letters from the keyboard and spaces, up to 30 characters.
                </p>
                <div className="hm-term-row">
                  <input
                    id="hm-term"
                    className="hm-input"
                    autoComplete="off"
                    autoFocus
                    maxLength={30}
                    value={enteredTerm}
                    onChange={(event) => setEnteredTerm(event.target.value)}
                    placeholder="e.g. BEOGRAD"
                  />
                  <button type="submit" className="hm-button">
                    Start round
                  </button>
                </div>
                {termError && <p className="hm-error">{termError}</p>}
              </form>
            ) : (
              <div className="hm-card hm-waiting">
                <span className="hm-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <p>Your opponent is picking a word for you.</p>
              </div>
            ))}

          {round.status === "in_progress" && (
            <>
              <div className="hm-card hm-board">
                <HangmanDrawing missed={round.missed} />
                <div className="hm-board-side">
                  <div className="hm-lives" aria-label={`${livesLeft} tries left`}>
                    {Array.from({ length: MAX_MISSES }, (_, index) => (
                      <span
                        key={index}
                        className={index < livesLeft ? "full" : ""}
                      />
                    ))}
                    <em>
                      {livesLeft} {livesLeft === 1 ? "try" : "tries"} left
                    </em>
                  </div>
                  <MaskedWord chars={round.maskedTerm} />
                  {isSetter && myTerm && (
                    <p className="hm-your-word">
                      Your word: <b>{myTerm}</b>
                    </p>
                  )}
                  <div className="hm-wrong">
                    <span className="hm-label">Wrong letters</span>
                    <div className="hm-chips">
                      {round.incorrectGuesses.length > 0 ? (
                        round.incorrectGuesses.map((letter) => (
                          <span key={letter} className="hm-chip">
                            {letter}
                          </span>
                        ))
                      ) : (
                        <span className="hm-none">none yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Keyboard
                onLetterClick={handleGuess}
                guesses={guesses}
                incorrect={round.incorrectGuesses}
                disabled={!canGuess}
              />
            </>
          )}
        </>
      )}

      {status === "initialized" && (
        <div className="hm-overlay">
          <div className="hm-card hm-dialog">
            <div className="loader"></div>
            <h2>Waiting for the second player</h2>
            {game?.title && <p className="hm-hint">Room: {game.title}</p>}
            {game?.qrcode && (
              <>
                <img className="hm-qr" src={game.qrcode} alt="QR code to join" />
                <p className="hm-hint">Scan the QR code to join from a phone</p>
              </>
            )}
            <button type="button" className="hm-button ghost" onClick={leaveGame}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {status === "canceled" && (
        <div className="hm-overlay">
          <div className="hm-card hm-dialog">
            <h2>Game over</h2>
            <p>The other player left the game.</p>
            <button
              type="button"
              className="hm-button"
              onClick={() => navigate("/hangman-multiplayer")}
            >
              Back to rooms
            </button>
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="hm-overlay">
          <div className={`hm-card hm-dialog ${iWon ? "won" : "lost"}`}>
            <h2>{iWon ? "You won!" : "You lost"}</h2>
            <p className="hm-final-score">
              {myScore} : {opponentScore}
            </p>
            {lastEnded && (
              <p className="hm-hint">
                Last word: <b>{lastEnded.term.join("")}</b>
              </p>
            )}
            <button
              type="button"
              className="hm-button"
              onClick={() => navigate("/hangman-multiplayer")}
            >
              New game
            </button>
          </div>
        </div>
      )}

      {iWon && (
        <ReactConfetti
          colors={["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]}
          recycle={false}
          numberOfPieces={400}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default SingleRoomHangman;
