import React, { useState, useEffect } from "react";
import { Input, Button, Radio } from "antd";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const colors2 = ["#40e495", "#30dd8a", "#2bb673"];

const CreateRoom = () => {
  const socket = io("localhost:3007");

  const [data, setData] = useState({
    title: "",
    password: "",
  });

  const [roomType, setRoomType] = useState("public");

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("roomCreated", (data) => {
      console.log("datadatadata", data);
      navigate(`/memory-multiplayer/${data.roomId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
    socket.emit("createRoom", data);
    localStorage.setItem("player", "firstPlayer");
  };

  return (
    <div className="create-room-container">
      <div className="type-options">
        <h1>Create room</h1>
        <Radio.Group
          onChange={onRadioChange}
          value={roomType}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
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
            type="submit"
            style={{
              background: `linear-gradient(135deg, ${colors2.join(", ")})`,
              color: "#fff",
            }}
            onClick={(e) => submitForm(e)}
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
