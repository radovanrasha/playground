import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketContext";

const SingleRoomBattleship = () => {
  const { id } = useParams();
  const socket = useSocket();
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill());
  const opponentBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill());

  //position h for horizontal and v for vertical
  const [myBoats, setMyBoats] = useState([
    { size: 2, position: "h", selected: false, placed: false },
    { size: 3, position: "v", selected: false, placed: false },
    { size: 3, position: "h", selected: false, placed: false },
    { size: 4, position: "h", selected: false, placed: false },
    { size: 5, position: "h", selected: false, placed: false },
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

  return (
    <div className="battleship-online-container">
      <div>
        {myBoats.map((item, index) => {
          return (
            <div
              onClick={() => {
                handleSelectBoat(item, index);
              }}
              style={{
                width: item.position === "h" ? `${item.size * 50}px` : "50px",
                height: item.position === "v" ? `${item.size * 50}px` : "50px",
                border: "1px solid grey",
                backgroundColor: "rgb(82, 82, 185)",
                marginBottom: "5px",
              }}
            ></div>
          );
        })}
      </div>
      <div className="battleship-boards">
        <div className="battleship-board">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="battleship-cell">
                {cell}
              </div>
            ))
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
