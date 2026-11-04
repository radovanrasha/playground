import React from "react";
import { Link } from "react-router-dom";
import memorybanner from "../assets/memory.png";
import battleshipbanner from "../assets/battleship.jpg";
// Hangman is disabled until the game is finished
// import hangmanbanner from "../assets/hangmanbanner.png";

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
      {/* Hangman is disabled until the game is finished
      <Link to="/hangman" className="memory-type-link">
        <img
          className="game-banner-home image-slide"
          src={hangmanbanner}
          alt="Profile"
        />
        <button className="memory-type-button button-slide">
          <span>Hangman</span>
        </button>
      </Link>
      */}
    </div>
  );
};

export default Home;
