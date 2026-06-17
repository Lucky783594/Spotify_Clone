import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import PlayerBar from "./PlayerBar";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="nav">
        <div className="spotify-logo">
          <Link to="/" className="logo-link">
            <span className="fear-logo-text">⚡ Fear Player</span>
          </Link>
        </div>

        <div className="home-search-input-library-container">
          <div className="home-search-input-library-box">
            <Link to="/" className="home-btn-box">
              <svg viewBox="0 0 24 24" width="24" className="fill-icon">
                <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732z" />
              </svg>
            </Link>
            <Link to="/search" className="search-shortcut">
              <svg viewBox="0 0 24 24" width="22" className="fill-icon">
                <path d="M10.533 1.27a9.27 9.27 0 1 0 5.907 16.42l4.353 4.353a1 1 0 0 0 1.414-1.414l-4.344-4.343a9.27 9.27 0 0 0-7.33-14.93zm0 2a7.27 7.27 0 1 1 0 14.54 7.27 7.27 0 0 1 0-14.54z" />
              </svg>
              <span>What do you want to play?</span>
            </Link>
          </div>
        </div>

        <div className="premium-btn-download-btn-others-container">
          {user ? (
            <div className="signup-login-btns">
              {user.role === "admin" && (
                <Link to="/admin" className="signup-btn">
                  Admin Panel
                </Link>
              )}
              <Link to="/liked" className="signup-btn">
                Liked Songs
              </Link>
              <span className="signup-btn">Hi, {user.name}</span>
              <button className="login-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="signup-login-btns">
              <Link to="/signup" className="signup-btn">
                Sign up
              </Link>
              <Link to="/login" className="login-btn">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="box">
        <Sidebar />
        <div className="main">
          <Outlet />
        </div>
      </div>

      <PlayerBar />
    </div>
  );
}
