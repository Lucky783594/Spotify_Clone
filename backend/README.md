# Fear Player - Backend

Node.js + Express + MongoDB (Mongoose) backend with:
- Signup/Login with email OTP verification (via Resend.com)
- Forgot/Reset password via OTP
- JWT authentication
- Song CRUD (admin only upload/edit/delete, audio + cover image stored on Cloudinary)
- Like songs, play count
- Admin panel APIs

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - **MONGO_URI** - from MongoDB Atlas (free tier) or local MongoDB
   - **JWT_SECRET** - any random long string
   - **RESEND_API_KEY** - sign up at https://resend.com (free tier), get API key
   - **EMAIL_FROM** - e.g. `Fear Player <onboarding@resend.dev>` (Resend's default test sender, works without domain verification)
   - **CLOUDINARY_*** - sign up at https://cloudinary.com (free tier, 25GB storage) for storing song audio + cover images
   - **ADMIN_EMAIL** - whichever email you signup with first using this email will automatically get `admin` role

3. Run: `npm run dev` (uses nodemon) or `npm start`

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Auth (`/api/auth`)
- `POST /signup` - { name, email, password } -> sends OTP
- `POST /verify-otp` - { email, otp } -> verifies, returns JWT
- `POST /resend-otp` - { email }
- `POST /login` - { email, password } -> returns JWT
- `POST /forgot-password` - { email } -> sends OTP
- `POST /reset-password` - { email, otp, newPassword }

### Songs (`/api/songs`)
- `GET /` - list all songs (query: ?search=&genre=)
- `GET /:id` - single song
- `POST /:id/play` - increment play count
- `POST /:id/like` - (auth) like/unlike song
- `POST /` - (admin) upload song - multipart form: `song` (audio file), `cover` (image), title, artist, description, genre, duration
- `PUT /:id` - (admin) update song details
- `DELETE /:id` - (admin) delete song

### Users (`/api/users`)
- `GET /me` - (auth) current user profile + liked songs
- `GET /` - (admin) list all users

## Notes
- First user who signs up with the email matching `ADMIN_EMAIL` in `.env` automatically gets `admin` role.
- Audio files stored on Cloudinary under `fearplayer/songs`, covers under `fearplayer/covers`.
