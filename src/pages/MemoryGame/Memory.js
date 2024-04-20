import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Memory = () => {
  return (
    <div className="memory-solo-container">
      <Link to="/memory-sologame">
        <Button className="memory-type-button">Solo</Button>
      </Link>
      <p> - Coming soon - </p>
      <Button className="memory-type-button-disabled" disabled>
        Local multiplayer
      </Button>

      <Link to="/memory-multiplayer">
        <Button className="memory-type-button"> Online multiplayer</Button>
      </Link>
    </div>
  );
};

export default Memory;
