import React from "react";
import { Link } from "react-router-dom";
import memorybanner from "../assets/memory.png";
import battleshipbanner from "../assets/battleship.jpg";

const Home = () => {
  return (
    <div className="home-container">
      <Link to="/memory" className="memory-type-link">
        <img
          className="game-banner-home image-slide"
          src={memorybanner}
          alt="Profile"
        />
        <button className="memory-type-button button-slide">
          <span>Memory game</span>
        </button>
      </Link>
      <Link to="/battleship" className="memory-type-link">
        <img
          className="game-banner-home image-slide"
          src={battleshipbanner}
          alt="Profile"
        />
        <button className="memory-type-button button-slide">
          <span>Battleship game</span>
        </button>
      </Link>
    </div>
  );
};

export default Home;
