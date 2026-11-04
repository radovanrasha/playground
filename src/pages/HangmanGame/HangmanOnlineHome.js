import React, { useState, useEffect } from "react";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";
import { useSocket } from "../../SocketContext";

const HangmanOnlineHome = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState([]);
  const [typeOfGame, setTypeOfGame] = useState("create-room");
  const onChangeTypeOfGame = (type) => {
    setTypeOfGame(type);
  };

  useEffect(() => {
    if (socket) {
      socket.emit("getFreeRoomsHangman");
      socket.on("freeRoomsHangman", (roomsArr) => {
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
    </div>
  );
};

export default HangmanOnlineHome;
