import { useEffect, useState } from "react";
import api from "../api/axios";
import SongCard from "../components/SongCard";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await api.get("/songs");
        setSongs(data);
      } catch (err) {
        setError("Could not load songs. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Trending songs</h1>

      {loading && <p className="page-info">Loading...</p>}
      {error && <p className="page-info error">{error}</p>}
      {!loading && !error && songs.length === 0 && (
        <p className="page-info">No songs uploaded yet. Admin can upload from the Admin Panel.</p>
      )}

      <div className="song-grid">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} songList={songs} />
        ))}
      </div>
    </div>
  );
}
