import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <Link to="/memory" className="memory-type-link">
        <button className="memory-type-button">
          <span>Memory game</span>
        </button>
      </Link>
    </div>
  );
};

export default Home;
