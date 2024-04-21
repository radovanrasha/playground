import React, { useState, useEffect } from "react";
import Axios from "axios";
import { message, notification, Button } from "antd";
import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const socket = io("localhost:3007");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("getFreeRooms");

    socket.on("freeRooms", (roomsArr) => {
      setRooms(roomsArr);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="free-rooms-container">
      {rooms &&
        rooms.length > 0 &&
        rooms.map((item, index) => {
          return (
            <div key={item._id} className="freeroom-row">
              <p>{item.title}</p>
              <Button>JOIN ROOM</Button>
            </div>
          );
        })}
    </div>
  );
};

export default Rooms;
