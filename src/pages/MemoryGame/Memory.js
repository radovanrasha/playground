import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Memory = () => {
  return (
    <div className="memory-solo-container">
      <div className="memory-game-row">
        <Link to="/memory-sologame" className="memory-type-link">
          <button className="memory-type-button">
            <span>Solo memory game</span>
          </button>
        </Link>

        <Link to="/memory-multiplayer" className="memory-type-link">
          <button className="memory-type-button">
            <span>Online multiplayer</span>
          </button>
        </Link>
      </div>

      <label> - Coming soon - </label>
      <Button className="memory-type-button-disabled" disabled>
        Local multiplayer
      </Button>
    </div>
  );
};

export default Memory;
