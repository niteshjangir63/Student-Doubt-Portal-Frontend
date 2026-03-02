import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Component/Card";
import "./TeacherDashboard.css";
import { getUserFromToken } from "../utils/getUserFromToken";
import { Link } from "react-router-dom";
import Loader from "../Component/Loader";

export default function TeacherDashboard() {
  const [doubts, setDoubts] = useState([]);
  const user = getUserFromToken();
  const userId = user?.userId;
  const role = user?.role;
  const token = localStorage.getItem("token"); 
   const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoubts = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const res = await axios.get("https://student-doubt-portal-backend.onrender.com/doubts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoubts(res.data); 
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
      finally{
        setLoading(false);
      }
    };

    fetchDoubts();
  }, [token, userId]);

  return (
    <div className="page">
      {doubts <= 0 ? <p>Fetching Doubts <Loader/></p> : <h2>Student Doubts</h2>}

      {doubts.map(doubt => (
        <Link style={{textDecoration:"none"}} key={doubt._id} to={`/doubts/${doubt._id}`} >
        <Card
          
          title={doubt.title}
          subtitle={`Asked by: ${doubt.studentName}`}
          status={doubt.status}
          doubtId={doubt._id}
          role={role}
          children={<p>{doubt.description}</p>}
          footer={<span>{doubt.answer || "Awaiting answer"}</span>
        }
        />
        </Link>
      ))}
    </div>
  );
}