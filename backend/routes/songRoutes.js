const express = require("express");
const Song = require("../models/Song");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadFields } = require("../config/multer");

const router = express.Router();

// ---------------- PUBLIC: Get all songs ----------------
router.get("/", async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
      ];
    }

    if (genre) {
      query.genre = genre;
    }

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- PUBLIC: Get single song ----------------
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- Increment play count ----------------
router.post("/:id/play", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json({ plays: song.plays });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- USER: Like / Unlike song ----------------
router.post("/:id/like", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const songId = req.params.id;

    const index = user.likedSongs.findIndex((id) => id.toString() === songId);
    let liked;

    if (index > -1) {
      user.likedSongs.splice(index, 1);
      liked = false;
    } else {
      user.likedSongs.push(songId);
      liked = true;
    }

    await user.save();
    res.json({ liked, likedSongs: user.likedSongs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- ADMIN: Upload song (with audio file + cover image) ----------------
router.post(
  "/",
  protect,
  adminOnly,
  uploadFields.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, artist, description, genre, duration } = req.body;

      if (!req.files || !req.files.song) {
        return res.status(400).json({ message: "Song audio file is required" });
      }

      const fileUrl = req.files.song[0].path; // cloudinary url
      const coverUrl = req.files.cover ? req.files.cover[0].path : "";

      const newSong = await Song.create({
        title,
        artist,
        description,
        genre,
        duration: duration || 0,
        fileUrl,
        coverUrl,
        uploadedBy: req.user._id,
      });

      res.status(201).json(newSong);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ---------------- ADMIN: Update song details ----------------
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, artist, description, genre } = req.body;

    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    song.title = title ?? song.title;
    song.artist = artist ?? song.artist;
    song.description = description ?? song.description;
    song.genre = genre ?? song.genre;

    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- ADMIN: Delete song ----------------
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    await song.deleteOne();
    res.json({ message: "Song deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
