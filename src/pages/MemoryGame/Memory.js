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
      <Button className="memory-type-button-disabled" disabled>
        Online multiplayer
      </Button>
    </div>
  );
};

export default Memory;
