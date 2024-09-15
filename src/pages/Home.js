import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <Link to="/memory">
        <button className="memory-type-button">Memory game</button>
      </Link>
    </div>
  );
};

export default Home;
