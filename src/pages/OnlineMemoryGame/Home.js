import React, { useState } from "react";
import { Button } from "antd";
import CreateRoom from "./CreateRoom";
import Rooms from "./Rooms";
import SingleRoom from "./SingleRoomGame";

const MemoryOnlineHome = () => {
  const [typeOfGame, setTypeOfGame] = useState("home");

  const onChangeTypeOfGame = (type) => {
    setTypeOfGame(type);
  };

  return (
    <div className="memory-online-container">
      {/* {typeOfGame === "home" && (
        <div className="home-content">
          <div className="join-options">
            <Button onClick={() => onChangeTypeOfGame("join-room")}>
              Join room
            </Button>
            <Button onClick={() => onChangeTypeOfGame("create-room")}>
              Create room
            </Button>
          </div>
        </div>
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
      )} */}

      <SingleRoom />
    </div>
  );
};

export default MemoryOnlineHome;
