import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherAnswerPage.css";

export default function TeacherAnswerPage() {
  const { doubtId } = useParams(); 
  const navigate = useNavigate();
  const [doubt, setDoubt] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoubt = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`https://student-doubt-portal-backend.onrender.com/doubts/${doubtId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubt(res.data);
        setAnswerText(res.data.answer || "");
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchDoubt();
  }, [doubtId, token]);

  const handleSubmitAnswer = async () => {
    if (!answerText || !token) return;

    try {
      const res = await axios.put(
        `https://student-doubt-portal-backend.onrender.com/doubts/${doubtId}`,
        { answer: answerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDoubt(res.data.doubt);
      alert("Answer submitted successfully!");
      navigate("/teacher"); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error submitting answer");
    }
  };

  if (!doubt) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>{doubt.title}</h2>
      <p><strong>Asked by:</strong> {doubt.studentName}</p>
      <p>{doubt.description}</p>
      <p><strong>Status:</strong> {doubt.status}</p>

      <textarea
        placeholder="Write your answer here..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        
      />

      <button onClick={handleSubmitAnswer} disabled={!answerText}style={{ marginTop: "10px" }}>
        Submit Answer
      </button>
    </div>
  );
}