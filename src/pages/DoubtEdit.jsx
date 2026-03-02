import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../Component/Card";
import "./TeacherAnswerPage.css";

export default function DoubtEdit() {
  const { doubtId } = useParams(); 
  const navigate = useNavigate();
 
  const token = localStorage.getItem("token");
   const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doubts, setDoubts] = useState(null);

  useEffect(() => {
    const fetchDoubt = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`https://student-doubt-portal-backend.onrender.com/doubts/${doubtId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubts(res.data);
        setTitle(res.data.title)
        setDescription(res.data.description || "");
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchDoubt();
  }, [doubtId, token]);

  const handleSubmitAnswer = async () => {
    
    if (!title || !description || !token) return;

    try {
      const res = await axios.put(
        `https://student-doubt-portal-backend.onrender.com/doubts/edit/${doubtId}`,
        { title: title ,description:description},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDoubts(res.data.doubt);
      alert("doubt edited successfully!");
      navigate("/student"); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error Editing");
    }
  };

  if (!doubts) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>{doubts.title || "This is Doubt Title"}</h2>
      <Card
              title="Edit Your Doubt"
              subtitle="Your question will be visible to teachers"
              footer={
                <button onClick={handleSubmitAnswer}  disabled={!title || !description}>
                  Post Doubt
                </button>
              }
            >
              <input
                value={title}
                placeholder="Doubt title"
                onChange={(e) => setTitle(e.target.value)}
              />
      
              <textarea
                value={description}
                placeholder="Describe your doubt"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Card>
    </div>
  );
}