import React, { useState, useEffect } from "react";
import { Button } from "antd";

import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";

const Rooms = ({ rooms, setRooms }) => {
  const socket = useSocket();

  const navigate = useNavigate();

  const onJoinRoom = (id) => {
    localStorage.setItem("player", "playerTwo");

    socket.emit("joinRoom", id, "playerTwo");

    navigate(`/memory-multiplayer/${id}`);
  };

  useEffect(() => {
    if (socket) {
      socket.emit("getFreeRooms");
      socket.on("freeRooms", (roomsArr) => {
        setRooms(roomsArr);
      });
    }
  }, []);

  return (
    <div className="free-rooms-container">
      {rooms && rooms.length > 0 ? (
        rooms.map((item, index) => {
          return (
            <div key={item._id} className="freeroom-row">
              <p>{item.title}</p>
              <Button
                onClick={() => {
                  onJoinRoom(item._id);
                }}
              >
                JOIN ROOM
              </Button>
            </div>
          );
        })
      ) : (
        <div className="no-rooms-info">No available rooms.</div>
      )}
    </div>
  );
};

export default Rooms;
