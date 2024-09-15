import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Memory = () => {
  return (
    <div className="memory-solo-container">
      <div className="memory-game-row">
        <Link to="/memory-sologame">
          <button className="memory-type-button">Solo memory game</button>
        </Link>

        <Link to="/memory-multiplayer">
          <button className="memory-type-button"> Online multiplayer</button>
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
