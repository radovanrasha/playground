import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";

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

  console.log("cards", cards);

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
      });
    }
  }, [socket]);

  const handleSelect = (card, index) => {
    if (!choices.cardOne) {
      setChoices((prevState) => ({
        ...prevState,
        cardOne: card,
      }));
      socket.emit("revealCard", { index, id, type: "firstCard" });
    } else {
      if (choices.cardOne.id !== card.id) {
        setChoices((prevState) => ({
          ...prevState,
          cardTwo: card,
        }));
        socket.emit("revealCard", {
          index,
          id,
          type: "secondCard",
          cardOne: choices.cardOne,
        });
      }
    }
  };

  const compareCards = () => {
    setDisabled(true);
    if (
      choices.cardOne.id !== choices.cardTwo.id &&
      choices.cardOne.src === choices.cardTwo.src
    ) {
      let arr = cards;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].src === choices.cardOne.src) {
          arr[i].matched = true;
        }
      }
      setCards(arr);
    }
    setTimeout(() => {
      resetTurn();
    }, 600);
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
    setDisabled(false);
  };

  return (
    <div className="memory-online-container">
      <div className="single-room-container">
        <div className="card-grid">
          {cards?.map((card, index) => (
            <div
              key={card.id}
              className="box"
              onClick={() => handleSelect(card, index)}
            >
              {card.matched ? (
                <img src={`/card-images/${card.src}.png`} />
              ) : (
                <img src={`/card-images/back.png`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleRoom;
