import React, { useState, useEffect, useRef } from "react";

import { io } from "socket.io-client";

const cardImages = [
  { src: "./assets/imageone.png", id: 0, matched: false },
  { src: "./assets/imagetwo.png", id: 0, matched: false },
  { src: "./assets/imagethree.png", id: 0, matched: false },
  { src: "./assets/imagefour.png", id: 0, matched: false },
  { src: "./assets/imagefive.png", id: 0, matched: false },
  { src: "./assets/imagesix.png", id: 0, matched: false },
  { src: "./assets/imageseven.png", id: 0, matched: false },
  { src: "./assets/imageeight.png", id: 0, matched: false },
];

const SingleRoom = () => {
  const socket = io("localhost:3007");

  const [cardsArray, setCardsArray] = useState(cardImages);
  const [choiceOne, setChoiceOne] = useState();
  const [choiceTwo, setChoiceTwo] = useState();
  const [disabled, setDisabled] = useState(false);
  const [revealedCard, setRevealedCard] = useState("");
  const [clickedCard, setClickedCard] = useState("");

  console.log("revealedCard", revealedCard);

  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("otkriveno", (data) => {
      console.log("REVEAL CARD", data);
      // setRevealedCard(data.src);
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
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleRoom;
