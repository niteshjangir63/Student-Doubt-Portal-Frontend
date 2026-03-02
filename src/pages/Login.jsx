import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";
import Loader from "../Component/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true)
      const res = await axios.post(
        "https://student-doubt-portal-backend.onrender.com/auth/login",
        { email, password }
      );


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      navigate(`/${res.data.user.role}`);
    } catch (e) {
      alert(e.response?.data?.message || "Login failed");
    }
    finally{

      setLoading(false)
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Student Doubt Portal</h2>
        <p className="sub">Login to continue</p>

        <input placeholder="Email" type="email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <button disabled={!email || !password} onClick={handleLogin}>{loading ? <Loader/> : "Login"}</button>
        <span>Don't have an Account ? <Link to={"/register"}>Register</Link></span>
        <br />
        <span>Forgot you password ? <Link to={"/forgot"}>forgot</Link></span>
      </div>
    </div>
  );
}