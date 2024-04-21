import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { io } from "socket.io-client";

const SingleRoom = () => {
  const socket = io("localhost:3007");
  const { id } = useParams();

  // const [cardsArray, setCardsArray] = useState(cardImages);
  // const [choiceOne, setChoiceOne] = useState();
  // const [choiceTwo, setChoiceTwo] = useState();
  // const [disabled, setDisabled] = useState(false);
  // const [clickedCard, setClickedCard] = useState();
  const [revealedCard, setRevealedCard] = useState();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("revealedCard", (data) => {
      console.log("REVEAL CARD", data);
      setRevealedCard(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSelect = (index) => {
    socket.emit("revealCard", { index, id });
  };

  // useEffect(() => {
  //   if (choiceOne && choiceTwo) {
  //     compareCards();
  //   }
  // }, [choiceTwo]);

  // const compareCards = () => {
  //   console.log("test");

  //   // setTimeout(() => {
  //   //   resetTurn();
  //   // }, 600);
  // };

  const divsArray = Array.from({ length: 16 }, (_, index) => index + 1);

  return (
    <div className="memory-online-container">
      <div className="single-room-container">
        <div className="card-grid">
          {divsArray.map((num, index) => (
            <div key={num} className="box" onClick={() => handleSelect(index)}>
              {revealedCard && index === revealedCard.index ? (
                <img src={`/card-images/${revealedCard.src}.png`} />
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
