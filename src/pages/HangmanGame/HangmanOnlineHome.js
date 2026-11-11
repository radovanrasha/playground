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

  // the socket connects after the first render, so wait for it
  useEffect(() => {
    if (!socket) return;

    const onFreeRooms = (roomsArr) => setRooms(roomsArr);

    socket.on("freeRoomsHangman", onFreeRooms);
    socket.emit("getFreeRoomsHangman");

    return () => socket.off("freeRoomsHangman", onFreeRooms);
  }, [socket]);

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
