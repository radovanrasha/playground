import React, { useState, useEffect } from "react";
import { Button } from "antd";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";
import { useSocket } from "../../SocketContext";
import { io } from "socket.io-client";

const MemoryOnlineHome = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState([]);
  const [typeOfGame, setTypeOfGame] = useState("create-room");
  const onChangeTypeOfGame = (type) => {
    setTypeOfGame(type);
  };

  useEffect(() => {
    // if (!socket.connected) {
    //   socket.connect();
    // }
    // return () => {
    //   socket.disconnect();
    //   console.log("Socket disconnected");
    // };
    if (socket) {
      socket.emit("getFreeRooms");
      socket.on("freeRooms", (roomsArr) => {
        setRooms(roomsArr);
      });
    }
  }, []);

  return (
    <div className="memory-online-container">
      {typeOfGame !== "home" && (
        <Button
          className="join-after-button"
          onClick={() =>
            onChangeTypeOfGame(
              typeOfGame === "create-room" ? "join-room" : "create-room"
            )
          }
        >
          {typeOfGame === "create-room" ? "Join room ?" : "Create room?"}
        </Button>
      )}
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

      {/* <SingleRoom /> */}
    </div>
  );
};

export default MemoryOnlineHome;
