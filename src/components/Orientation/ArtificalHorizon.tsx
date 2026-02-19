import "./ArtificialHorizon.css";

interface Props {
  pitch: number;
  roll: number;
}


const DEGREE_SPACING = 8; 

const ArtificialHorizon = ({ pitch, roll }: Props) => {
  const clampedPitch = Math.max(-45, Math.min(45, pitch));
  const clampedRoll = Math.max(-60, Math.min(60, roll));


  const pitchMarks = [-30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30];

  return (
    <div className="horizon-container">
      <div
        className="horizon-world"
        style={{
          transform: `
            translateY(${clampedPitch * DEGREE_SPACING}px)
            rotate(${clampedRoll}deg)`
        }}
      >
        <div className="sky" />
        <div className="ground" />

        {pitchMarks.map((deg) => (
          <div
            key={deg}
            className="pitch-mark"
            style={{
              top: `calc(50% - ${deg * DEGREE_SPACING}px)`
            }}
          >
            <div className="pitch-line" />
            <span className="pitch-label left">{Math.abs(deg)}</span>
            <span className="pitch-label right">{Math.abs(deg)}</span>
          </div>
        ))}
      </div>

      <div className="horizon-overlay">
        <div className="center-line" />
        <div className="center-pitch">{roll.toFixed(1)}°</div>
        <div className="center-pitch2">{roll.toFixed(1)}°</div>
      </div>
    </div>
  );
};

export default ArtificialHorizon;
