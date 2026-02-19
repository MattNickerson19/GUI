import './RollDisplay.css';

interface RollHorizonProps {
  roll: number; // degrees
}

const RollHorizon = ({ roll }: RollHorizonProps) => {
  const clampedRoll = Math.max(-45, Math.min(45, roll));

  // Numbers around the circle every 20 degrees
  const numbers = [-60, -40, -20, 20, 40, 60]; // skip 0 since it's centerline

  return (
    <div className="roll-horizon-container">
      {/* Static background */}
      <div className="roll-horizon-sky" />
      <div className="roll-horizon-ground" />

      {/* Rotating center line */}
      <div
        className="roll-horizon-rotating"
        style={{ transform: `rotate(${clampedRoll}deg)` }}
      >
        <div className="roll-center-line" />
      </div>

      {/* Roll value at center */}
      <div className="roll-value-label">{clampedRoll.toFixed(1)}°</div>

      {/* Numbers around the circle */}
      {numbers.map((deg) => {
        const radius = 130; // distance from center in px
        return (
          <div
            key={deg}
            className="roll-number"
            style={{
              transform: `rotate(${deg}deg) translate(${radius}px) rotate(${-deg}deg)`
            }}
          >
            {Math.abs(deg)}
          </div>
        );
      })}
    </div>
  );
};

export default RollHorizon;



