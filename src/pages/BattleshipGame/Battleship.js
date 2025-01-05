import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import banner from "../../assets/battleship.jpg";

const Memory = () => {
  return (
    <div className="memory-solo-container">
      <img className="game-banner" src={banner} alt="Profile" />
      <div className="memory-game-row">
        <Link to="/battleship-multiplayer" className="memory-type-link">
          <button className="memory-type-button">
            <span>Online multiplayer</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Memory;
