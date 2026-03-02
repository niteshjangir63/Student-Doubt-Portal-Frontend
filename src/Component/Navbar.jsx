import { Link } from "react-router-dom";
import "./Navbar.css";
import { getUserFromToken } from "../utils/getUserFromToken"

export default function Navbar({ title, onLogout, onClear }) {
  const user = getUserFromToken();
  const role = user?.role;
  return (
    <nav className="mini-nav">
      <h3 className="mini-nav-title">Hi' {title.toUpperCase()}</h3>

      <div className="mini-nav-actions">

        {role === "teacher" && (
          <Link to="/teacher" className="mini-btn clear">
            All Doubts
          </Link>
        )}

        <button className="mini-btn logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}