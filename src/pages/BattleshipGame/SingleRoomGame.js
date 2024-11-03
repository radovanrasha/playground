import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useSocket } from "../../SocketContext";
import { Modal } from "antd";

const SingleRoomBattleship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const socket = useSocket();

  const [touching, setTouching] = useState(false);
  const [currentBoat, setCurrentBoat] = useState(null);
  const [touchCell, setTouchCell] = useState(null);

  const initialBoats = [
    {
      id: 0,
      size: 2,
      position: "h",
      selected: false,
      placed: false,
      rowIndex: null,
      colIndex: null,
    },
    {
      id: 1,
      size: 3,
      position: "h",
      selected: false,
      placed: false,
      rowIndex: null,
      colIndex: null,
    },
    {
      id: 2,
      size: 3,
      position: "h",
      selected: false,
      placed: false,
      rowIndex: null,
      colIndex: null,
    },
    {
      id: 3,
      size: 4,
      position: "h",
      selected: false,
      placed: false,
      rowIndex: null,
      colIndex: null,
    },
    {
      id: 4,
      size: 5,
      position: "h",
      selected: false,
      placed: false,
      rowIndex: null,
      colIndex: null,
    },
  ];
  const [board, setBoard] = useState([]);
  const [playerOneBoardRevealed, setPlayerOneBoardRevealed] = useState([]);
  const [playerTwoBoardRevealed, setPlayerTwoBoardRevealed] = useState([]);

  const [opponentBoard, setOpponentBoard] = useState([]);

  const [myBoats, setMyBoats] = useState(initialBoats);
  const [rerender, setReRender] = useState(false);
  const [allBoatsPlaced, setAllBoatsPlaced] = useState(false);
  const [statusOfGame, setStatusOfGame] = useState("initialized");
  const [player, setPlayer] = useState(localStorage.getItem("player"));
  const [nextTurn, setNextTurn] = useState(false);
  const [pointerNone, setPointerNone] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showFinishedGameModal, setShowFinishedGameModal] = useState(false);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoomBattleship", id, localStorage.getItem("player"));

      socket.on("gameInfoBattleship", (data) => {
        // console.log(data?.game?.status);
        setNextTurn(data.game.nextTurn);

        if (data.game.status === "finished") {
          setShowFinishedGameModal(true);
        }

        setPlayerTwoScore(data.game.secondPlayerScore);

        setPlayerOneScore(data.game.firstPlayerScore);

        if (player === "playerOne") {
          if (data.game.firstPlayerReady) {
            setShowActionButtons(false);
            setAllBoatsPlaced(true);
            setPointerNone(true);
          } else {
            setShowActionButtons(true);
            setAllBoatsPlaced(false);
            setPointerNone(false);
          }

          if (
            data.game.firstPlayerBoard &&
            ((data.game.firstPlayerReady && !data.game.secondPlayerReady) ||
              (!data.game.firstPlayerReady && !data.game.secondPlayerReady) ||
              (data.game.firstPlayerReady && data.game.secondPlayerReady))
          ) {
            setBoard(data.game.firstPlayerBoard);
            setPlayerOneBoardRevealed(data.game.firstPlayerBoardRevealed);
            setOpponentBoard(data.game.secondPlayerBoardRevealed);
            setReRender(!rerender);
          }
        } else if (player === "playerTwo") {
          if (data.game.secondPlayerReady) {
            setShowActionButtons(false);
            setAllBoatsPlaced(true);
            setPointerNone(true);
          } else {
            setShowActionButtons(true);
            setAllBoatsPlaced(false);
            setPointerNone(false);
          }

          if (
            data.game.secondPlayerBoard &&
            ((data.game.secondPlayerReady && !data.game.firstPlayerReady) ||
              (!data.game.secondPlayerReady && !data.game.firstPlayerReady) ||
              (data.game.firstPlayerReady && data.game.secondPlayerReady))
          ) {
            setBoard(data.game.secondPlayerBoard);
            setPlayerTwoBoardRevealed(data.game.secondPlayerBoardRevealed);
            setOpponentBoard(data.game.firstPlayerBoardRevealed);
            setReRender(!rerender);
          }
        }

        setStatusOfGame(data?.game?.status);
      });

      const handleUnload = () => {
        socket.emit("gameCanceledBattleship", id);
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [socket]);

  const handleCellClick = (cell) => {
    if (!cell || !cell.placed) return;
    const boat = myBoats.find((boat) => boat.id === cell.id);

    const newPosition = boat.position === "h" ? "v" : "h";
    const tempBoat = { ...boat, position: newPosition };

    placeBoatOnBoard(
      JSON.stringify(tempBoat),
      tempBoat.rowIndex,
      tempBoat.colIndex
    );
  };

  const handleSelectBoat = (item, index) => {
    let boatsTemp = [...myBoats];
    boatsTemp[index] = { ...item, position: item.position === "h" ? "v" : "h" };

    setMyBoats(boatsTemp);
    setReRender(!rerender);
  };

  const handleDragStart = (event, boat) => {
    event.dataTransfer.setData("boat", JSON.stringify(boat));
  };

  const removeBoatFromBoard = (boat) => {
    const newBoard = board.map((row) => row.slice());

    if (boat.placed && boat.rowIndex !== null && boat.colIndex !== null) {
      for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard[i].length; j++) {
          if (newBoard[i][j] && newBoard[i][j].id === boat.id) {
            newBoard[i][j] = undefined;
          }
        }
      }
    }

    setBoard(newBoard);
    return newBoard;
  };

  const placeBoatOnBoard = (boatData, rowIndex, colIndex) => {
    const boat = JSON.parse(boatData);
    const checkBoard = board;
    let checkFields = false; //check if fields are already occupied by other boat

    if (
      (boat.position === "h" && colIndex + boat.size > 10) ||
      (boat.position === "v" && rowIndex + boat.size > 10)
    ) {
      return;
    }

    for (let i = 0; i < boat.size; i++) {
      if (boat.position === "h") {
        if (
          checkBoard[rowIndex][colIndex + i] &&
          checkBoard[rowIndex][colIndex + i].id !== undefined &&
          checkBoard[rowIndex][colIndex + i].id !== null &&
          checkBoard[rowIndex][colIndex + i].id !== boat.id
        ) {
          checkFields = true;
        }
      } else {
        if (
          checkBoard[rowIndex + i][colIndex] &&
          checkBoard[rowIndex + i][colIndex].id !== undefined &&
          checkBoard[rowIndex + i][colIndex].id !== null &&
          checkBoard[rowIndex + i][colIndex].id !== boat.id
        ) {
          checkFields = true;
        }
      }
    }

    if (checkFields) {
      return;
    }

    const newBoard = removeBoatFromBoard(boat);

    for (let i = 0; i < boat.size; i++) {
      if (boat.position === "h") {
        newBoard[rowIndex][colIndex + i] = {
          ...boat,
          rowIndex,
          colIndex,
          placed: true,
        };
      } else {
        newBoard[rowIndex + i][colIndex] = {
          ...boat,
          rowIndex,
          colIndex,
          placed: true,
        };
      }
    }

    const updatedBoats = [...myBoats];
    updatedBoats[boat.id] = { ...boat, rowIndex, colIndex, placed: true };

    setBoard(newBoard);
    setMyBoats(updatedBoats);

    const allPlaced = updatedBoats.every((boat) => boat.placed);

    setAllBoatsPlaced(allPlaced);
  };

  const handleDrop = (event, rowIndex, colIndex) => {
    event.preventDefault();
    const boat = event.dataTransfer.getData("boat");

    if (boat) {
      placeBoatOnBoard(boat, rowIndex, colIndex);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const restartBoard = () => {
    setBoard(
      Array(10)
        .fill(null)
        .map(() => Array(10).fill())
    );
    setMyBoats(initialBoats);
    setAllBoatsPlaced(false);
  };

  const handleReadyButton = () => {
    socket.emit(
      "playerReadyBattleship",
      id,
      localStorage.getItem("player"),
      board
    );
  };

  const handlePlayerClickOnBoard = (rowIndex, colIndex) => {
    socket.emit("clickOnBoardBattleship", id, player, rowIndex, colIndex);
  };

  const handleTouchStart = (event, boat) => {
    event.preventDefault();
    setCurrentBoat(boat);
    setTouching(true);
  };

  const handleTouchMove = (event) => {
    if (!touching || !currentBoat) return;

    const touch = event.touches[0];
    const boardRect = document
      .querySelector(".battleship-board")
      .getBoundingClientRect();

    const columnWidth = boardRect.width / 10;
    const rowHeight = boardRect.height / 10;

    const rowIndex = Math.floor((touch.clientY - boardRect.top) / rowHeight);
    const colIndex = Math.floor((touch.clientX - boardRect.left) / columnWidth);

    if (rowIndex >= 0 && rowIndex < 10 && colIndex >= 0 && colIndex < 10) {
      setTouchCell({ rowIndex, colIndex });
    }
  };

  const handleTouchEnd = (event) => {
    if (touchCell && currentBoat) {
      placeBoatOnBoard(
        JSON.stringify(currentBoat),
        touchCell.rowIndex,
        touchCell.colIndex
      );
      setCurrentBoat(null);
      setTouchCell(null);
    }
    setTouching(false);
  };

  return (
    <div className="battleship-online-container">
      {statusOfGame === "ongoing" && (
        <label
          className={`battleship-blue-info ${
            nextTurn === player ? "your-turn pulse" : "opponent-turn pulse"
          }`}
        >
          {nextTurn === player ? "Your turn" : "Opponent turn"}
        </label>
      )}
      {statusOfGame === "waiting" && !allBoatsPlaced && (
        <label className="battleship-red-info">
          Please put all boats on the board
        </label>
      )}
      {statusOfGame === "waiting" && allBoatsPlaced && (
        <label className="battleship-red-info">
          Waiting for other player to place their boats
        </label>
      )}
      <div className="battleship-buttons-row">
        {showActionButtons && (
          <button onClick={restartBoard} className="ready-battleship-button">
            <span>Restart board</span>
          </button>
        )}
        {showActionButtons && allBoatsPlaced && (
          <button
            onClick={() => {
              handleReadyButton();
            }}
            className="ready-battleship-button"
          >
            <span>I'm ready</span>
          </button>
        )}
      </div>
      <div className="battleship-boards">
        <div
          className={`battleship-board ${pointerNone ? "pointer-none" : ""}`}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`battleship-cell ${
                    cell && cell.size ? "cell-with-boat" : "cell-without-boat"
                  }`}
                  onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                  draggable={cell && cell.placed}
                  onDragStart={(event) =>
                    cell && cell.placed && handleDragStart(event, cell)
                  }
                  onTouchStart={(event) =>
                    cell && cell.placed && handleTouchStart(event, cell)
                  }
                  onClick={() => handleCellClick(cell)}
                >
                  {player === "playerOne"
                    ? playerOneBoardRevealed[rowIndex][colIndex]
                    : playerTwoBoardRevealed[rowIndex][colIndex]}
                </div>
              );
            })
          )}
        </div>
        {statusOfGame !== "waiting" && statusOfGame !== "initialized" && (
          <div className="battleship-board">
            {opponentBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`battleship-cell ${
                    player !== nextTurn ? "pointer-none" : ""
                  }`}
                  onClick={() => {
                    handlePlayerClickOnBoard(rowIndex, colIndex);
                  }}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {!allBoatsPlaced && <label className="boats-title">Boats:</label>}
      <div
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="boats-box"
      >
        {!allBoatsPlaced &&
          myBoats.map((item, index) => {
            return (
              !item.placed && (
                <div
                  key={index}
                  draggable
                  onDragStart={(event) => handleDragStart(event, item)}
                  onTouchStart={(event) => handleTouchStart(event, item)}
                  onClick={() => handleSelectBoat(item, index)}
                  className={`${
                    item.position === "h" ? "horizontal-boat" : "vertical-boat"
                  } ${"boat-size-" + item.size}`}
                ></div>
              )
            );
          })}
      </div>
      {statusOfGame === "initialized" && (
        <div className="overlay-waiting">
          <div className="loader"></div>
          <div className="loader-text">Waiting for second player...</div>
        </div>
      )}

      <Modal
        footer={[]}
        onCancel={() => {
          setShowFinishedGameModal(false);
          navigate(`/battleship-multiplayer`);
        }}
        open={showFinishedGameModal}
      >
        <div>Game finished!</div>
        <p>
          {playerOneScore > playerTwoScore
            ? `Player one won ${playerOneScore} : ${playerTwoScore}`
            : playerTwoScore > playerOneScore
            ? `Player two won ${playerTwoScore} : ${playerOneScore}`
            : `The game ended tie ${playerOneScore} : ${playerTwoScore}`}
        </p>
      </Modal>

      {showFinishedGameModal && (
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

export default SingleRoomBattleship;
