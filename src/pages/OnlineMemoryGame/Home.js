import React, { useState } from "react";
import { Button } from "antd";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";
import SingleRoom from "./SingleRoomGame";

const MemoryOnlineHome = () => {
  const [typeOfGame, setTypeOfGame] = useState("create-room");

  const onChangeTypeOfGame = (type) => {
    setTypeOfGame(type);
  };

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
