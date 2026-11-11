export const MAX_MISSES = 6;

// body parts in the order they appear, one per wrong guess
const PARTS = [
  <circle key="head" cx="140" cy="62" r="17" pathLength="1" />,
  <line key="body" x1="140" y1="79" x2="140" y2="135" pathLength="1" />,
  <line key="left-arm" x1="140" y1="95" x2="116" y2="118" pathLength="1" />,
  <line key="right-arm" x1="140" y1="95" x2="164" y2="118" pathLength="1" />,
  <line key="left-leg" x1="140" y1="135" x2="118" y2="170" pathLength="1" />,
  <line key="right-leg" x1="140" y1="135" x2="162" y2="170" pathLength="1" />,
];

// The gallows is drawn with currentColor so it follows the theme; every new
// part strokes itself in (pathLength=1 lets CSS animate any shape the same way).
const HangmanDrawing = ({ missed = 0 }) => {
  const hanged = missed >= MAX_MISSES;

  return (
    <svg
      className={`hm-drawing ${hanged ? "hanged" : ""}`}
      viewBox="0 0 200 220"
      role="img"
      aria-label={`${missed} of ${MAX_MISSES} wrong guesses`}
    >
      <g className="hm-gallows">
        <line x1="20" y1="208" x2="120" y2="208" />
        <line x1="50" y1="208" x2="50" y2="20" />
        <line x1="50" y1="20" x2="140" y2="20" />
        <line x1="50" y1="52" x2="82" y2="20" />
        <line x1="140" y1="20" x2="140" y2="45" />
      </g>
      <g className="hm-parts">
        {PARTS.slice(0, missed).map((part) => (
          <g key={part.key} className="hm-part">
            {part}
          </g>
        ))}
      </g>
      {/* eyes come with the head and turn into X's when the figure is hanged */}
      {missed > 0 && !hanged && (
        <g className="hm-part hm-eyes">
          <circle cx="134" cy="59" r="1.6" pathLength="1" />
          <circle cx="146" cy="59" r="1.6" pathLength="1" />
        </g>
      )}
      {hanged && (
        <g className="hm-face">
          <line x1="132" y1="56" x2="137" y2="61" />
          <line x1="137" y1="56" x2="132" y2="61" />
          <line x1="143" y1="56" x2="148" y2="61" />
          <line x1="148" y1="56" x2="143" y2="61" />
        </g>
      )}
    </svg>
  );
};

export default HangmanDrawing;
