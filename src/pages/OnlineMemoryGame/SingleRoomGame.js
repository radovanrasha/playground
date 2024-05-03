import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import { useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Modal } from "antd";

const SingleRoom = () => {
  const { id } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const [choices, setChoices] = useState({
    cardOne: null,
    cardTwo: null,
  });
  const [turns, setTurns] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [waitingForPlayers, setWaitingForPlayers] = useState(true);
  const [gameData, setGameData] = useState({});
  const [cards, setCards] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);
  const { width, height } = useWindowSize();
  const [player, setPlayer] = useState(localStorage.getItem("player"));

  // console.log("gameData", gameData);

  // console.log("cards", cards);
  // console.log("choices", choices);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", id, localStorage.getItem("player"));

      socket.emit("getGameInfo", id);

      socket.on("gameInfo", (data) => {
        setGameData(data);
        setCards(data?.game?.cardsList);
        // console.log(data.game.nextTurn);
        if (data.game.nextTurn !== player) {
          setDisabled(true);
        } else {
          setDisabled(false);
        }

        if (data?.game?.status === "waiting") {
          setWaitingForPlayers(true);
        } else {
          setWaitingForPlayers(false);
        }

        if (data.game.status === "finished") {
          setShowGameModal(true);
        }
      });
    }
  }, [socket]);

  const handleSelect = (card, index) => {
    if (disabled) return;
    if (!choices.cardOne) {
      setChoices((prevState) => ({
        ...prevState,
        cardOne: { ...card, index: index },
      }));
      socket.emit("revealCard", { index, id, type: "firstCard" });
    } else {
      if (choices.cardOne.id !== card.id) {
        setDisabled(true);

        setChoices((prevState) => ({
          ...prevState,
          cardTwo: { ...card, index: index },
        }));
        socket.emit("revealCard", {
          index,
          id,
          type: "secondCard",
          cardOne: choices.cardOne,
        });

        setTimeout(() => {
          resetTurn();
        }, 600);
      }
    }
  };

  const resetTurn = () => {
    setChoices({
      cardOne: null,
      cardTwo: null,
    });
    socket.emit("restartTurn", { id });
    setTurns((prev) => prev + 1);
  };

  return (
    <div className="memory-online-container">
      <div className="single-room-container">
        <div className="score-row">
          <p>
            {(gameData?.game?.nextTurn === "playerOne" &&
              localStorage.getItem("player") === "playerOne") ||
            (gameData?.game?.nextTurn === "playerTwo" &&
              localStorage.getItem("player") === "playerTwo")
              ? "Your turn"
              : "Opponent turn"}
          </p>
        </div>
        <div className="score-row">
          <p>First player score: {gameData?.game?.playerOneScore}</p>
          <p>Second player score: {gameData?.game?.playerTwoScore}</p>
        </div>
        <div className="card-grid">
          {cards?.map((card, index) => (
            <div key={card._id} className="card">
              <div
                key={card.id}
                className={` ${
                  card.matched ||
                  choices?.cardOne?.index === index ||
                  choices?.cardTwo?.index === index ||
                  card.revealed
                    ? "flipped"
                    : ""
                }`}
                onClick={() => handleSelect(card, index)}
              >
                <img
                  src={`/card-images/${card.src}.png`}
                  className="front"
                  alt="card front"
                />
                <img
                  src={`/card-images/back.png`}
                  className="back"
                  alt="card back"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        footer={[]}
        onCancel={() => {
          setShowGameModal(false);
          navigate(`/memory-multiplayer`);
        }}
        open={showGameModal}
      >
        <div>Game finished!</div>
        <p>
          {gameData?.game?.playerOneScore > gameData?.game?.playerTwoScore
            ? `Player one won ${gameData?.game?.playerOneScore} : ${gameData?.game?.playerTwoScore}`
            : gameData?.game?.playerTwoScore > gameData?.game?.playerOneScore
            ? `Player two won ${gameData?.game?.playerTwoScore} : ${gameData?.game?.playerOneScore}`
            : `The game ended tie ${gameData?.game?.playerOneScore} : ${gameData?.game?.playerTwoScore}`}
        </p>
      </Modal>
      {showGameModal && (
        <ReactConfetti
          colors={["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]}
          recycle={false}
          numberOfPieces={400}
          width={width}
          height={height}
        />
      )}

      {waitingForPlayers && (
        <div className="overlay-waiting">
          <div className="loader"></div>
          <div className="loader-text">Waiting for second player...</div>
        </div>
      )}
    </div>
  );
};

export default SingleRoom;
