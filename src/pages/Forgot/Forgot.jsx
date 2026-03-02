import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Login.css";
import Loader from "../../Component/Loader";
import FlashMessage from "../../Component/FlashMessage";
export default function Forgot() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSend, setIsSend] = useState(false);
  const [loading, setLoading] = useState(false);
  
  

  const navigate = useNavigate();
  console.log(isSend)

  const handleForgot = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://student-doubt-portal-backend.onrender.com/send-otp", { email });
      if (res.data.success) {

        alert("OTP sent successfully");
        setIsSend(true);

      }

    } catch (e) {
      alert(e.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };



  const handleVerify = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://student-doubt-portal-backend.onrender.com/verify-otp", {
        email,
        otp,
      });
      alert("OTP verified");
      const resetToken = res.data.resetToken;
      navigate("/reset-password", {

        state: { resetToken }
      });
    } catch (e) {
      alert(e.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <FlashMessage/>
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isSend ? "Verify OTP" : "Forgot Password"}</h2>

        {!isSend ? (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {!isSend ? (
          <button
            type="button"
            onClick={handleForgot}
            disabled={loading}
          >
            {loading ? <Loader/> : "Send OTP"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? <Loader/> : "Verify OTP"}
          </button>
        )}

        <br />
        <Link to="/">Back to login</Link>
      </div>
    </div>
    </>
  );
}