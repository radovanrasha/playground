import React, { useState, useEffect } from "react";
import { Input, Button, Radio, Tooltip, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useSocket } from "../../SocketContext";

const CreateRoom = () => {
  const socket = useSocket();
  const [data, setData] = useState({
    title: "",
    password: "",
  });
  const [roomType, setRoomType] = useState("public");
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("roomCreatedBattleship", (data) => {
        navigate(`/battleship-multiplayer/${data.roomId}`);
      });
    }
  }, [socket]);

  const onInputChange = (e, type) => {
    const { value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [type]: value,
    }));
  };

  const onRadioChange = (e) => {
    setRoomType(e.target.value);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (data.title === "" || !data.title) {
      notification.error({
        message: "Room name is required!",
        duration: 2,
      });

      return;
    }

    socket.emit("createRoomBattleship", data);

    localStorage.setItem("player", "playerOne");
  };

  return (
    <div className="create-room-container">
      <div className="tooltip-info">
        <Tooltip
          placement="left"
          title="Create a room by giving it a name and share this name with your friend. Your friend can then join the room by clicking the Join button next to the room name on Join page. Once you're both in the room, the game will begin!"
        >
          <InfoCircleOutlined className="hoverable-icon" />
        </Tooltip>
      </div>
      <div className="type-options">
        <h1>CREATE ROOM</h1>
        <Radio.Group
          className="create-room-radio"
          onChange={onRadioChange}
          value={roomType}
        >
          <Radio value="public">Public</Radio>
          <Radio value="private">Private</Radio>
        </Radio.Group>
      </div>

      <div className="create-room-options">
        <form onSubmit={(e) => submitForm(e)}>
          <div className="input-group">
            <label>Title</label>
            <Input
              value={data.title}
              onChange={(e) => {
                onInputChange(e, "title");
              }}
            ></Input>
          </div>

          <div className="input-group">
            <label>Password</label>
            <Input
              value={data.password}
              onChange={(e) => {
                onInputChange(e, "password");
              }}
              disabled={roomType !== "private"}
            ></Input>
          </div>

          <Button
            style={{ width: "100%" }}
            className="memory-type-button create-room-button"
            type="submit"
            onClick={(e) => submitForm(e)}
          >
            <span>Create</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
