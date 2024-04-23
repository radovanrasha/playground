import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Modal } from "antd";

const SingleRoom = () => {
  const { id } = useParams();
  const socket = useSocket();

  const [choices, setChoices] = useState({
    cardOne: null,
    cardTwo: null,
  });
  const [turns, setTurns] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [revealedCard, setRevealedCard] = useState();
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
      socket.emit("joinRoom", id);
      socket.on("revealedCard", (data) => {
        setRevealedCard(data);
      });

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

  const compareCards = () => {
    // setDisabled(true);
    // if (
    //   choices.cardOne.id !== choices.cardTwo.id &&
    //   choices.cardOne.src === choices.cardTwo.src
    // ) {
    //   let arr = cards;
    //   for (let i = 0; i < cards.length; i++) {
    //     if (cards[i].src === choices.cardOne.src) {
    //       arr[i].matched = true;
    //     }
    //   }
    //   setCards(arr);
    // }
    // setTimeout(() => {
    //   resetTurn();
    // }, 600);
  };

  useEffect(() => {
    if (choices.cardOne && choices.cardTwo) {
      compareCards();
    }
  }, [choices]);

  const resetTurn = () => {
    setChoices({
      cardOne: null,
      cardTwo: null,
    });
    setTurns((prev) => prev + 1);
    // setDisabled(false);
  };
  console.log(gameData);
  return (
    <div className="memory-online-container">
      <div className="single-room-container">
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
                  choices?.cardTwo?.index === index
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
        }}
        open={showGameModal}
      >
        <div>Game finished!</div>
        <p>
          {gameData.game.playerOneScore > gameData.game.playerTwoScore
            ? `Player one won ${gameData.game.playerOneScore} : ${gameData.game.playerTwoScore}`
            : gameData.game.playerTwoScore > gameData.game.playerOneScore
            ? `Player two won ${gameData.game.playerTwoOneScore}`
            : `The game ended tie ${gameData.game.playerOneScore} : ${gameData.game.playerTwoScore}`}
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
    </div>
  );
};

export default SingleRoom;
