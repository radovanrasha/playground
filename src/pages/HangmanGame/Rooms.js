import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";

// the room list itself is kept up to date by HangmanOnlineHome
const Rooms = ({ rooms }) => {
  const socket = useSocket();

  const navigate = useNavigate();

  // the game page joins the room; this only picks the role
  const onJoinRoom = (id) => {
    localStorage.setItem("player", "playerTwo");

    navigate(`/hangman-multiplayer/${id}`);
  };

  // refresh when switching to the list
  useEffect(() => {
    if (socket) socket.emit("getFreeRoomsHangman");
  }, [socket]);

  return (
    <div className="free-rooms-container">
      {rooms && rooms.length > 0 ? (
        rooms.map((item, index) => {
          return (
            <div key={item._id} className="freeroom-row">
              <p>{item.title}</p>
              <button
                className="memory-type-button"
                onClick={() => {
                  onJoinRoom(item._id);
                }}
              >
                <span>JOIN ROOM</span>
              </button>
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
