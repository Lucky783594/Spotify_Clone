import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";

const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    eqGains,
    eqBands,
    spatialMode,
    togglePlay,
    playNext,
    playPrev,
    seek,
    changeVolume,
    setEqBand,
    resetEq,
    setSpatial,
  } = usePlayer();

  const [showEq, setShowEq] = useState(false);

  if (!currentSong) {
    return (
      <div className="player-bar player-bar-empty">
        <span className="player-empty-text">No song playing — pick something from the home page</span>
      </div>
    );
  }

  return (
    <div className="player-bar">
      <div className="player-now-playing">
        <img
          src={currentSong.coverUrl || "https://placehold.co/56x56/1f1f1f/fff?text=FP"}
          alt={currentSong.title}
          className="player-cover"
        />
        <div className="player-track-info">
          <span className="player-track-title">{currentSong.title}</span>
          <span className="player-track-artist">{currentSong.artist}</span>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="player-ctrl-btn" onClick={playPrev} title="Previous">
            ⏮
          </button>
          <button className="player-play-btn" onClick={togglePlay} title="Play/Pause">
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="player-ctrl-btn" onClick={playNext} title="Next">
            ⏭
          </button>
        </div>
        <div className="player-progress-row">
          <span className="player-time">{formatTime(progress)}</span>
          <input
            type="range"
            className="player-progress-bar"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-extra">
        <div className="spatial-buttons">
          <button
            className={`spatial-btn ${spatialMode === "off" ? "active" : ""}`}
            onClick={() => setSpatial("off")}
          >
            Normal
          </button>
          <button
            className={`spatial-btn ${spatialMode === "8d" ? "active" : ""}`}
            onClick={() => setSpatial("8d")}
          >
            8D
          </button>
          <button
            className={`spatial-btn ${spatialMode === "16d" ? "active" : ""}`}
            onClick={() => setSpatial("16d")}
          >
            16D
          </button>
        </div>

        <button className="eq-toggle-btn" onClick={() => setShowEq((s) => !s)}>
          🎛 EQ
        </button>

        <div className="volume-row">
          <span className="vol-icon">🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="volume-bar"
          />
        </div>
      </div>

      {showEq && (
        <div className="eq-panel">
          <div className="eq-panel-header">
            <span>Equalizer</span>
            <button className="eq-reset-btn" onClick={resetEq}>
              Reset
            </button>
            <button className="eq-close-btn" onClick={() => setShowEq(false)}>
              ✕
            </button>
          </div>
          <div className="eq-bands">
            {eqBands.map((freq, i) => (
              <div className="eq-band" key={freq}>
                <input
                  type="range"
                  className="eq-slider"
                  min={-12}
                  max={12}
                  step={1}
                  value={eqGains[i]}
                  orient="vertical"
                  onChange={(e) => setEqBand(i, Number(e.target.value))}
                />
                <span className="eq-band-label">
                  {freq < 1000 ? `${freq}Hz` : `${freq / 1000}kHz`}
                </span>
                <span className="eq-band-value">{eqGains[i]}dB</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
