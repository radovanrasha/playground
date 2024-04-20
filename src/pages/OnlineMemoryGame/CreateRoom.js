import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { io } from "socket.io-client";

const CreateRoom = () => {
  const socket = io("localhost:3007");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const [data, setData] = useState({
    title: "",
    password: "",
  });

  const onInputChange = (e, type) => {
    const { value } = e.target;

    setData((prevState) => ({
      ...prevState,
      [type]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    socket.emit("createRoom", data);
  };

  return (
    <div className="create-room-container">
      <h1>Create room</h1>
      <div className="create-room-options">
        {/* <form onSubmit={(e) => submitForm(e)}> */}
        <Input
          value={data.title}
          onChange={(e) => {
            onInputChange(e, "title");
          }}
        ></Input>
        <Input
          value={data.password}
          onChange={(e) => {
            onInputChange(e, "password");
          }}
        ></Input>
        <Button type="submit" onClick={(e) => submitForm(e)}>
          Create
        </Button>
        {/* </form> */}
      </div>
    </div>
  );
};

export default CreateRoom;
