import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setResending(true);

    try {
      const { data } = await api.post("/auth/resend-otp", { email });
      setMessage(data.message || "OTP resent");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="fear-logo-text auth-logo">⚡ Fear Player</h1>
        <h2 className="auth-title">Verify your email</h2>
        <p className="auth-subtext">
          We've sent a 6-digit OTP to <strong>{email || "your email"}</strong>. Enter it below to
          continue.
        </p>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <form onSubmit={handleVerify} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />

          <label>OTP Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="6-digit code"
            maxLength={6}
            inputMode="numeric"
          />

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button className="auth-link-btn" onClick={handleResend} disabled={resending}>
          {resending ? "Resending..." : "Resend OTP"}
        </button>

        <p className="auth-footer-text">
          <Link to="/login" className="auth-link-bold">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
