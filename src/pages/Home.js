import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const Home = () => {
  return (
    <div className="home-container">
      <Link to="/memory-sologame">
        <Button className="memory-type-button">Solo Memory Game</Button>
      </Link>
    </div>
  );
};

export default Home;
