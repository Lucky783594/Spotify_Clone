import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <div className="create-library-box">
        <div className="library">Your Library</div>
      </div>

      <div className="left-sidebar-divider"></div>

      <div className="playlists-container">
        <div className="plalist-box">
          <section className="playlist-text-btn-box">
            <div className="plalist-text-box">
              <span className="playlist-first-text">Liked Songs</span>
              <span className="playlist-second-text">
                {user ? "Your favorite tracks" : "Log in to like songs"}
              </span>
            </div>
            <div className="plalist-box-btn">
              <Link to="/liked" className="create-playlist-btn">
                <span>Open</span>
              </Link>
            </div>
          </section>

          {user?.role === "admin" && (
            <section className="playlist-text-btn-box">
              <div className="plalist-text-box">
                <div className="playlist-first-text">Admin Panel</div>
                <div className="playlist-second-text">
                  Upload &amp; manage songs
                </div>
              </div>
              <div className="plalist-box-btn">
                <Link to="/admin" className="create-playlist-btn">
                  <span>Open</span>
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="leftside-footer">
        <div className="legal-links-container">
          <div className="legal-links-box">
            <span className="ll">Legal</span>
            <span className="ll">Privacy Center</span>
            <span className="ll">Privacy Policy</span>
            <span className="ll">Cookies</span>
            <span className="ll">About Ads</span>
            <span className="ll">Accessibility</span>
          </div>
          <div className="left-sidebar-divider-leftside-footer"></div>
          <div className="language-btn-container">
            <button className="language-btn-box">
              <span>English</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
