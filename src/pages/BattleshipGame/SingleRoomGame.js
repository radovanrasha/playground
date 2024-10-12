import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";

const SingleRoomBattleship = () => {
  const { id } = useParams();
  const socket = useSocket();
  const [board, setBoard] = useState(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill())
  );
  const opponentBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill());

  //position h for horizontal and v for vertical
  const [myBoats, setMyBoats] = useState([
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
  ]);
  const [rerender, setReRender] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoomBattleship", id, localStorage.getItem("player"));

      const handleUnload = () => {
        socket.emit("gameCanceledBattleship", id);
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [socket]);

  const handleSelectBoat = (item, index) => {
    let boatsTemp = myBoats;
    boatsTemp[index] = { ...item, position: item.position === "h" ? "v" : "h" };

    console.log(boatsTemp);

    setMyBoats(boatsTemp);

    setReRender(!rerender);
  };

  const handleDragStart = (event, boat) => {
    event.dataTransfer.setData("boat", JSON.stringify(boat));
  };

  const placeBoatOnBoard = (boatData, rowIndex, colIndex) => {
    const newBoard = board.map((row) => row.slice());
    const boat = JSON.parse(boatData);

    if (
      (boat.position === "h" && colIndex + boat.size > 10) ||
      (boat.position === "v" && rowIndex + boat.size > 10)
    ) {
      return;
    }

    if (boat.placed && boat.rowIndex !== null && boat.colIndex !== null) {
      for (let i = 0; i < boat.size; i++) {
        if (boat.position === "h") {
          newBoard[boat.rowIndex][boat.colIndex + i] = null;
        } else {
          newBoard[boat.rowIndex + i][boat.colIndex] = null;
        }
      }
    }

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
  };

  const handleDrop = (event, rowIndex, colIndex) => {
    event.preventDefault();
    const boat = event.dataTransfer.getData("boat");

    if (boat !== undefined) {
      placeBoatOnBoard(boat, rowIndex, colIndex);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="battleship-online-container">
      <div>
        {myBoats.map((item, index) => {
          return (
            !item.placed && (
              <div
                key={index}
                draggable
                onDragStart={(event) => handleDragStart(event, item)}
                onClick={() => handleSelectBoat(item, index)}
                style={{
                  width: item.position === "h" ? `${item.size * 50}px` : "50px",
                  height:
                    item.position === "v" ? `${item.size * 50}px` : "50px",
                  border: "1px solid grey",
                  backgroundColor: "rgb(82, 82, 185)",
                  marginBottom: "5px",
                }}
              ></div>
            )
          );
        })}
      </div>

      <div className="battleship-boards">
        <div className="battleship-board">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="battleship-cell"
                  onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                  style={{
                    backgroundColor:
                      cell && cell.size
                        ? "rgb(82, 82, 185)"
                        : "rgb(53, 53, 129)",
                  }}
                >
                  {/* {cell?.id} */}
                </div>
              );
            })
          )}
        </div>
        <div className="battleship-board">
          {opponentBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="battleship-cell">
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
      <button>Start game</button>
    </div>
  );
};

export default SingleRoomBattleship;
