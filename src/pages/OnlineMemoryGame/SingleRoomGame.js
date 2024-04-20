import React, { useState, useEffect, useRef } from "react";

import { io } from "socket.io-client";

const cardImages = [
  { src: "../../card-images/imageone.png", id: 0, matched: false },
  { src: "../../card-images/imagetwo.png", id: 0, matched: false },
  { src: "../../card-images/imagethree.png", id: 0, matched: false },
  { src: "../../card-images/imagefour.png", id: 0, matched: false },
  { src: "../../card-images/imagefive.png", id: 0, matched: false },
  { src: "../../card-images/imagesix.png", id: 0, matched: false },
  { src: "../../card-images/imageseven.png", id: 0, matched: false },
  { src: "../../card-images/imageeight.png", id: 0, matched: false },
];

const SingleRoom = () => {
  const socket = io("localhost:3007");

  const [cardsArray, setCardsArray] = useState(cardImages);
  const [choiceOne, setChoiceOne] = useState();
  const [choiceTwo, setChoiceTwo] = useState();
  const [disabled, setDisabled] = useState(false);
  const [revealedCard, setRevealedCard] = useState();
  const [clickedCard, setClickedCard] = useState();

  console.log("revealedCard", revealedCard);

  const hasMountedRef = useRef(false);

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
    socket.emit("revealCard", index);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      compareCards();
    }
  }, [choiceTwo]);

  const compareCards = () => {
    console.log("test");

    // setTimeout(() => {
    //   resetTurn();
    // }, 600);
  };

  const divsArray = Array.from({ length: 16 }, (_, index) => index + 1);

  return (
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
  );
};

export default SingleRoom;
