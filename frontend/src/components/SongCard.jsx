import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function SongCard({ song, songList }) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { user, setUser } = useAuth();

  const isCurrent = currentSong?._id === song._id;
  const isLiked = user?.likedSongs?.some((s) =>
    typeof s === "string" ? s === song._id : s._id === song._id
  );

  const handlePlay = () => {
    playSong(song, songList || [song]);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to like songs");
    try {
      const { data } = await api.post(`/songs/${song._id}/like`);
      setUser((prev) => ({ ...prev, likedSongs: data.likedSongs }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`song-card ${isCurrent ? "song-card-active" : ""}`} onClick={handlePlay}>
      <div className="song-card-img-wrap">
        <img
          src={song.coverUrl || "https://placehold.co/200x200/1f1f1f/fff?text=FP"}
          alt={song.title}
          className="song-card-img"
        />
        <button className="song-card-play-btn" title="Play">
          {isCurrent && isPlaying ? "⏸" : "▶"}
        </button>
      </div>
      <div className="song-card-title">{song.title}</div>
      <div className="song-card-artist">{song.artist}</div>
      {song.description && <div className="song-card-desc">{song.description}</div>}
      <button
        className={`song-card-like-btn ${isLiked ? "liked" : ""}`}
        onClick={handleLike}
        title="Like"
      >
        {isLiked ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
