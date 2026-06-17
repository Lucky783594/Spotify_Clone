import { useState } from "react";
import api from "../api/axios";
import SongCard from "../components/SongCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/songs?search=${encodeURIComponent(value)}`);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Search</h1>
      <input
        type="text"
        className="search-page-input"
        placeholder="Search for songs or artists..."
        value={query}
        onChange={handleSearch}
        autoFocus
      />

      {loading && <p className="page-info">Searching...</p>}
      {!loading && query && results.length === 0 && (
        <p className="page-info">No results for "{query}"</p>
      )}

      <div className="song-grid">
        {results.map((song) => (
          <SongCard key={song._id} song={song} songList={results} />
        ))}
      </div>
    </div>
  );
}
