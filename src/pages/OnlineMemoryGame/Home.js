import React, { useState, useEffect } from "react";
import { Button } from "antd";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";
import { io } from "socket.io-client";

const MemoryOnlineHome = () => {
  const [typeOfGame, setTypeOfGame] = useState("create-room");
  // const socket = io("localhost:3007");
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
          <Rooms />
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
