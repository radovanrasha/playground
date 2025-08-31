import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import { useNavigate } from "react-router-dom";
import hangmanPng0 from "./assets/hangman0.png";
import hangmanPng1 from "./assets/hangman1.png";
import hangmanPng2 from "./assets/hangman2.png";
import hangmanPng3 from "./assets/hangman3.png";
import hangmanPng4 from "./assets/hangman4.png";
import hangmanPng5 from "./assets/hangman5.png";
import hangmanPng6 from "./assets/hangman6.png";
import { Button, Input, Modal, notification } from "antd";
import Keyboard from "./components/Keyboard";

const SingleRoomHangman = () => {
  const { id } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const hangmanImagesDict = {
    missed0: hangmanPng0,
    missed1: hangmanPng1,
    missed2: hangmanPng2,
    missed3: hangmanPng3,
    missed4: hangmanPng4,
    missed5: hangmanPng5,
    missed6: hangmanPng6,
  };

  const [gameData, setGameData] = useState({});
  const [hangmanImageShowed, setHangmanImageShowed] = useState({});
  const [isTermSetter, setIsTermSetter] = useState(false);
  const [isTermChosen, setIsTermChosen] = useState(false);
  const [enteredTerm, setEnteredTerm] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [maskedTerm, setMaskedTerm] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoomHangman", id, localStorage.getItem("player"));

      socket.on("gameInfoHangman", (data) => {
        setGameData(data);

        if (data.game.status === "finished") {
          setShowGameModal(true);
        }

        const numOfMissed =
          data?.game?.rounds[data?.game?.rounds.length - 1].missed;

        const maskedTerm =
          data?.game?.rounds[data?.game?.rounds.length - 1].maskedTerm;

        setMaskedTerm(maskedTerm);

        setIncorrectGuesses(
          data?.game?.rounds[data?.game?.rounds.length - 1].incorrectGuesses
        );

        setIsTermSetter(
          data?.game?.rounds[data?.game?.rounds.length - 1].termSetter ===
            localStorage.getItem("player")
        );

        setIsTermChosen(
          data?.game?.rounds[data?.game?.rounds.length - 1].term.length > 0
        );

        setGuessedLetters(
          data?.game?.rounds[data?.game?.rounds.length - 1].guesses
        );

        setHangmanImageShowed(hangmanImagesDict[`missed${numOfMissed}`]);
      });

      const handleUnload = () => {
        socket.emit("gameCanceledHangman", id);
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [socket]);

  const handleConfirmTerm = () => {
    const regex = /^[\p{L} ]+$/u;
    const trimmedTerm = enteredTerm.trim();

    if (trimmedTerm === "") {
      notification.warning({
        message: "Please enter a term.",
      });
      return;
    }

    if (!regex.test(trimmedTerm)) {
      notification.warning({
        message: "A term can only contain letters and spaces.",
      });
      return;
    }

    socket.emit(
      "enteredTermHangman",
      id,
      localStorage.getItem("player"),
      trimmedTerm
    );
  };

  const handleGuess = (letter) => {
    socket.emit(
      "handleGuessHangman",
      id,
      localStorage.getItem("player"),
      letter
    );
  };

  return (
    <div className="memory-online-container">
      <div className="single-room-container">
        <div className="turn-row">
          <p>
            {!isTermChosen &&
              (isTermSetter
                ? "Choose the term"
                : "Opponent is chosing the term")}
          </p>
          <p>
            {isTermChosen &&
              (isTermSetter
                ? "Opponent is guessing the term"
                : "Guess the term")}
          </p>
        </div>
        <div className="score-row">
          <div className="one-score">
            <p>First player score: </p>
            <p>{gameData?.game?.playerOneScore}</p>
          </div>
          <div className="one-score">
            <p>Second player score: </p>
            <p>{gameData?.game?.playerTwoScore}</p>
          </div>
        </div>

        {!isTermChosen && isTermSetter && (
          <div>
            <label>Enter the term</label>
            <Input
              value={enteredTerm}
              onChange={(e) => {
                setEnteredTerm(e.target.value);
              }}
            ></Input>
            <Button
              onClick={() => {
                handleConfirmTerm();
              }}
            >
              Confirm
            </Button>
          </div>
        )}

        <img className="hangman-image" src={hangmanImageShowed}></img>

        {!isTermSetter && isTermChosen && (
          <div className="masked-term">
            {maskedTerm &&
              maskedTerm.length > 0 &&
              maskedTerm.map((item, index) => (
                <span key={index}>{`${item}`}</span>
              ))}
          </div>
        )}

        <div className="incorrect-guesses">
          <p>Incorrect guesses:</p>
          {incorrectGuesses &&
            incorrectGuesses.length > 0 &&
            incorrectGuesses.map((item, index) => {
              return <span>{item}</span>;
            })}
        </div>

        {!isTermSetter && isTermChosen && (
          <Keyboard
            onLetterClick={handleGuess}
            guessedLetters={guessedLetters}
          />
        )}
      </div>

      {gameData?.game?.status === "initialized" && (
        <div className="overlay-waiting">
          <div className="loader"></div>
          <div className="loader-text">Waiting for second player...</div>
        </div>
      )}
      <Modal
        footer={[]}
        onCancel={() => {
          setShowGameModal(false);
          navigate(`/hangman-multiplayer`);
        }}
        open={showGameModal}
      >
        <div>Game finished!</div>
        <p>
          {gameData?.game?.playerOneScore > gameData?.game?.playerTwoScore
            ? `Player one won ${gameData?.game?.playerOneScore} : ${gameData?.game?.playerTwoScore}`
            : `Player two won ${gameData?.game?.playerTwoScore} : ${gameData?.game?.playerOneScore}`}
        </p>
      </Modal>
    </div>
  );
};

export default SingleRoomHangman;
