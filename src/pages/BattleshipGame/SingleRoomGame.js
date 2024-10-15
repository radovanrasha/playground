import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";

const SingleRoomBattleship = () => {
  const { id } = useParams();
  const socket = useSocket();
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

  const [opponentBoard, setOpponentBoard] = useState([]);

  const [myBoats, setMyBoats] = useState(initialBoats);
  const [rerender, setReRender] = useState(false);
  const [allBoatsPlaced, setAllBoatsPlaced] = useState(false);
  const [statusOfGame, setStatusOfGame] = useState("initialized");
  const [player, setPlayer] = useState(localStorage.getItem("player"));
  const [nextTurn, setNextTurn] = useState(false);
  const [pointerNone, setPointerNone] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoomBattleship", id, localStorage.getItem("player"));

      socket.on("gameInfoBattleship", (data) => {
        // console.log(data?.game?.status);
        setNextTurn(data.game.nextTurn);

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

          if (data.game.firstPlayerBoard) {
            setBoard(data.game.firstPlayerBoard);
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

          if (data.game.secondPlayerBoard) {
            setBoard(data.game.secondPlayerBoard);
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

  return (
    <div className="battleship-online-container">
      {statusOfGame === "ongoing" && (
        <label className="battleship-blue-info">
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
        {showActionButtons && (
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
                  onClick={() => handleCellClick(cell)}
                >
                  {/* {cell?.id} */}
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
      <div className="boats-box">
        {!allBoatsPlaced &&
          myBoats.map((item, index) => {
            return (
              !item.placed && (
                <div
                  key={index}
                  draggable
                  onDragStart={(event) => handleDragStart(event, item)}
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
    </div>
  );
};

export default SingleRoomBattleship;
