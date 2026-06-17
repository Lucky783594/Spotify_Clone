# Fear Player - Frontend

React + Vite frontend (Spotify-style clone branded "Fear Player").

## Features
- Spotify-style dark UI, fully mobile responsive
- Signup / Login with email OTP verification (Resend)
- Forgot / Reset password via OTP
- Browse, search, like songs
- Music player with:
  - Play/pause/next/prev, seek, volume
  - 6-band Equalizer (Web Audio API)
  - 8D and 16D spatial audio effect (auto stereo panning)
- Admin Panel (visible only to admin user):
  - Upload songs (audio file + cover image + title/artist/description/genre)
  - Delete songs
  - View play counts

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL
   (default: `http://localhost:5000/api`)
3. `npm run dev` — runs on `http://localhost:5173`

## Notes
- Make sure the backend (`fearplayer-backend`) is running first.
- The first user that signs up with the email set as `ADMIN_EMAIL` in the
  backend `.env` automatically becomes admin and can access `/admin`.
- 8D/16D effect works by continuously rotating stereo panning using the
  Web Audio API `StereoPannerNode` — best experienced with headphones.
- Equalizer uses 6 `BiquadFilterNode`s (peaking filters) at 60Hz, 170Hz,
  350Hz, 1kHz, 3.5kHz, 10kHz, each adjustable -12dB to +12dB.
