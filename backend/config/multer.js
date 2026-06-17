const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Storage for audio files (songs)
const songStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fearplayer/songs",
    resource_type: "video", // cloudinary stores audio under 'video' resource type
    allowed_formats: ["mp3", "wav", "m4a", "ogg", "flac"],
  },
});

// Storage for cover images
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fearplayer/covers",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadSong = multer({ storage: songStorage });
const uploadCover = multer({ storage: coverStorage });

// Combined upload for song + cover in one form (admin upload form)
const uploadFields = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      if (file.fieldname === "cover") {
        return {
          folder: "fearplayer/covers",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        };
      }
      return {
        folder: "fearplayer/songs",
        resource_type: "video",
        allowed_formats: ["mp3", "wav", "m4a", "ogg", "flac"],
      };
    },
  }),
});

module.exports = { uploadSong, uploadCover, uploadFields };
