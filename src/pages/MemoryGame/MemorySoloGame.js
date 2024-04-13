import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import SingleCard from "./SingleCard";
import Modal from "antd/es/modal/Modal";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

const Memory = () => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [choiceOne, setChoiceOne] = useState();
  const [choiceTwo, setChoiceTwo] = useState();
  const { width, height } = useWindowSize();
  const cardImages = [
    { src: "./assets/imageone.png", id: 0, matched: false },
    { src: "./assets/imagetwo.png", id: 0, matched: false },
    { src: "./assets/imagethree.png", id: 0, matched: false },
    { src: "./assets/imagefour.png", id: 0, matched: false },
    { src: "./assets/imagefive.png", id: 0, matched: false },
    { src: "./assets/imagesix.png", id: 0, matched: false },
  ];

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      compareCards();
    }
  }, [choiceTwo]);

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .map((item, index) => (item = { ...item, id: Math.random() * 1000 }))
      .sort((a, b) => a.id - b.id);

    setShuffledCards(shuffled);
  };

  const handleSelect = (card) => {
    if (!choiceOne) {
      setChoiceOne(card);
    } else {
      if (choiceOne.id !== card.id) {
        setChoiceTwo(card);
      }
    }
  };

  const compareCards = () => {
    setDisabled(true);
    if (choiceOne.id !== choiceTwo.id && choiceOne.src === choiceTwo.src) {
      let arr = shuffledCards;
      for (let i = 0; i < shuffledCards.length; i++) {
        if (shuffledCards[i].src === choiceOne.src) {
          arr[i].matched = true;
        }
      }
      setShuffledCards(arr);
      checkFinished(arr);
    }
    setTimeout(() => {
      resetTurn();
    }, 600);
  };

  const checkFinished = (arr) => {
    let finished = true;

    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].matched || arr[i].matched === false) {
        finished = false;
      }
    }

    if (finished && finished === true) {
      setCompletedModalVisible(true);
    }
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);
  };

  const restartGame = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    shuffleCards();
  };

  return (
    <div className="memory-solo-container">
      <div className="memory-info">
        <Button
          onClick={() => {
            restartGame();
          }}
        >
          New game
        </Button>
        <p className="turns">Turns: {turns}</p>
      </div>
      <div className="card-grid">
        {shuffledCards &&
          shuffledCards.length > 0 &&
          shuffledCards.map((item, index) => {
            return (
              <SingleCard
                key={item.id}
                card={item}
                handleSelect={handleSelect}
                flipped={
                  item === choiceOne || item === choiceTwo || item.matched
                }
                disabled={disabled}
              ></SingleCard>
            );
          })}
      </div>{" "}
      <Modal
        footer={[]}
        onCancel={() => {
          restartGame();
          setCompletedModalVisible(false);
        }}
        open={completedModalVisible}
      >
        <div>Congrats!</div>
        <p>You finished memory game in {turns} turns</p>
      </Modal>
      {completedModalVisible && (
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

export default Memory;
