import back from "./assets/back.png";

const SingleCard = ({ card, handleSelect, flipped, disabled }) => {
  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={require(`${card.src}`)} alt="card front" />
        <img
          className="back"
          onClick={() => {
            if (!disabled) {
              handleSelect(card);
            }
          }}
          src={back}
          alt="card back"
        />
      </div>
    </div>
  );
};

export default SingleCard;
