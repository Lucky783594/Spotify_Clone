import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    artist: "",
    description: "",
    genre: "",
    duration: "",
  });
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const fetchSongs = async () => {
    try {
      const { data } = await api.get("/songs");
      setSongs(data);
    } catch (err) {
      setError("Could not load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!songFile) {
      setError("Please select an audio file");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("song", songFile);
    if (coverFile) formData.append("cover", coverFile);

    setUploading(true);
    try {
      await api.post("/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Song uploaded successfully");
      setForm({ title: "", artist: "", description: "", genre: "", duration: "" });
      setSongFile(null);
      setCoverFile(null);
      e.target.reset();
      fetchSongs();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this song?")) return;
    try {
      await api.delete(`/songs/${id}`);
      setSongs((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Admin Panel</h1>

      {error && <p className="page-info error">{error}</p>}
      {message && <p className="page-info success">{message}</p>}

      <div className="admin-upload-card">
        <h2>Upload New Song</h2>
        <form onSubmit={handleUpload} className="admin-upload-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Artist *</label>
              <input
                type="text"
                name="artist"
                value={form.artist}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Genre</label>
              <input
                type="text"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                placeholder="e.g. Pop, Lo-fi, Rock"
              />
            </div>
            <div className="admin-form-group">
              <label>Duration (seconds)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Audio File (mp3/wav) *</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setSongFile(e.target.files[0])}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
              />
            </div>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Song"}
          </button>
        </form>
      </div>

      <h2 className="page-subtitle">All Songs ({songs.length})</h2>

      {loading && <p className="page-info">Loading...</p>}

      <div className="admin-songs-table">
        {songs.map((song) => (
          <div className="admin-song-row" key={song._id}>
            <img
              src={song.coverUrl || "https://placehold.co/48x48/1f1f1f/fff?text=FP"}
              alt={song.title}
              className="admin-song-cover"
            />
            <div className="admin-song-info">
              <span className="admin-song-title">{song.title}</span>
              <span className="admin-song-artist">{song.artist}</span>
            </div>
            <span className="admin-song-genre">{song.genre || "—"}</span>
            <span className="admin-song-plays">{song.plays} plays</span>
            <button className="admin-delete-btn" onClick={() => handleDelete(song._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
