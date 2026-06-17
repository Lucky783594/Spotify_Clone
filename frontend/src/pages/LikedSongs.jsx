import { useAuth } from "../context/AuthContext";
import SongCard from "../components/SongCard";

export default function LikedSongs() {
  const { user } = useAuth();
  const liked = user?.likedSongs?.filter((s) => typeof s === "object") || [];

  return (
    <div className="page">
      <h1 className="page-title">Liked Songs</h1>

      {liked.length === 0 && <p className="page-info">You haven't liked any songs yet.</p>}

      <div className="song-grid">
        {liked.map((song) => (
          <SongCard key={song._id} song={song} songList={liked} />
        ))}
      </div>
    </div>
  );
}
