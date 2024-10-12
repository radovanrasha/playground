import React, { useState, useEffect } from "react";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";
import { useSocket } from "../../SocketContext";

const BattleshipOnlineHome = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState([]);
  const [typeOfGame, setTypeOfGame] = useState("create-room");
  const onChangeTypeOfGame = (type) => {
    setTypeOfGame(type);
  };

  useEffect(() => {
    if (socket) {
      socket.emit("getFreeRoomsBattleship");
      socket.on("freeRoomsBattleship", (roomsArr) => {
        setRooms(roomsArr);
      });
    }
  }, []);

  return (
    <div className="memory-online-container">
      {typeOfGame === "join-room" && (
        <div className="rooms-content">
          <Rooms rooms={rooms} setRooms={setRooms} />
        </div>
      )}

      {typeOfGame === "create-room" && (
        <div className="create-room-content">
          <CreateRoom />
        </div>
      )}
      {typeOfGame !== "home" && (
        <button
          className="memory-type-button"
          onClick={() =>
            onChangeTypeOfGame(
              typeOfGame === "create-room" ? "join-room" : "create-room"
            )
          }
        >
          <span>
            {typeOfGame === "create-room" ? "Join room" : "Create room"}
          </span>
        </button>
      )}
    </div>
  );
};

export default BattleshipOnlineHome;
