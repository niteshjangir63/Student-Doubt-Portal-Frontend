import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Login.css";
import Loader from "../Component/Loader";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const resetToken = state?.resetToken;

  const handleUpdate = async () => {
    
    if (!resetToken) {
      alert("Invalid or expired reset link");
      navigate("/forgot");
      return;
    }

    if (!password || !confPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://student-doubt-portal-backend.onrender.com/update", {
        resetToken,
        newPassword: password,
      });

      alert("Password updated successfully");
      navigate("/");
    } catch (e) {
      alert(e.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Change Password</h2>

        {password && confPassword && password !== confPassword && (
          <span style={{ color: "red" }}>Passwords do not match</span>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? <Loader/> : "Update Password"}
        </button>

        <br />
        <Link to="/">Back to login</Link>
      </div>
    </div>
  );
}