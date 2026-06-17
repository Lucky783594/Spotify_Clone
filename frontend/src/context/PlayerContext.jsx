import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const PlayerContext = createContext(null);

// Equalizer bands (Hz)
const EQ_BANDS = [60, 170, 350, 1000, 3500, 10000];

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const eqFiltersRef = useRef([]);
  const pannerRef = useRef(null);
  const panIntervalRef = useRef(null);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [eqGains, setEqGains] = useState(EQ_BANDS.map(() => 0));
  const [spatialMode, setSpatialMode] = useState("off"); // off | 8d | 16d

  // Initialize Web Audio graph once
  const initAudioGraph = useCallback(() => {
    if (audioCtxRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);

    // Build EQ filter chain
    const filters = EQ_BANDS.map((freq) => {
      const filter = ctx.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });

    // Stereo panner for 8D/16D effect
    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;

    // Chain: source -> eq1 -> eq2 ... -> panner -> destination
    let node = source;
    filters.forEach((f) => {
      node.connect(f);
      node = f;
    });
    node.connect(panner);
    panner.connect(ctx.destination);

    audioCtxRef.current = ctx;
    sourceNodeRef.current = source;
    eqFiltersRef.current = filters;
    pannerRef.current = panner;
  }, []);

  // Play a song (object with fileUrl, title, artist, coverUrl, _id)
  const playSong = useCallback(
    (song, songQueue = null) => {
      initAudioGraph();
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const audio = audioRef.current;
      if (currentSong?._id !== song._id) {
        audio.src = song.fileUrl;
        audio.crossOrigin = "anonymous";
        setCurrentSong(song);
        // record play count
        api.post(`/songs/${song._id}/play`).catch(() => {});
      }

      if (songQueue) {
        setQueue(songQueue);
        const idx = songQueue.findIndex((s) => s._id === song._id);
        setCurrentIndex(idx);
      }

      audio.play();
      setIsPlaying(true);
    },
    [currentSong, initAudioGraph]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex]);
  }, [queue, currentIndex, playSong]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex]);
  }, [queue, currentIndex, playSong]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const changeVolume = useCallback((v) => {
    audioRef.current.volume = v;
    setVolume(v);
  }, []);

  // Equalizer band update
  const setEqBand = useCallback((index, gain) => {
    setEqGains((prev) => {
      const updated = [...prev];
      updated[index] = gain;
      return updated;
    });
    if (eqFiltersRef.current[index]) {
      eqFiltersRef.current[index].gain.value = gain;
    }
  }, []);

  const resetEq = useCallback(() => {
    setEqGains(EQ_BANDS.map(() => 0));
    eqFiltersRef.current.forEach((f) => (f.gain.value = 0));
  }, []);

  // 8D / 16D spatial audio - rotates stereo pan in a sine wave loop
  const setSpatial = useCallback((mode) => {
    setSpatialMode(mode);

    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current);
      panIntervalRef.current = null;
    }

    if (!pannerRef.current) return;

    if (mode === "off") {
      pannerRef.current.pan.value = 0;
      return;
    }

    // 8D = slower full rotation (~10s), 16D = faster (~5s)
    const periodMs = mode === "16d" ? 5000 : 10000;
    const stepMs = 50;
    let t = 0;

    panIntervalRef.current = setInterval(() => {
      t += stepMs;
      const angle = (t / periodMs) * 2 * Math.PI;
      const panValue = Math.sin(angle); // -1 (left) to 1 (right)
      if (pannerRef.current) {
        pannerRef.current.pan.value = panValue;
      }
    }, stepMs);
  }, []);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => playNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [playNext]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (panIntervalRef.current) clearInterval(panIntervalRef.current);
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        eqGains,
        eqBands: EQ_BANDS,
        spatialMode,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        seek,
        changeVolume,
        setEqBand,
        resetEq,
        setSpatial,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
