import { useState, useEffect } from "react";
import Card from "../Component/Card";
import "../Component/Card";
import { getUserFromToken } from "../utils/getUserFromToken"
import axios from "axios";
export default function StudentDashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doubts, setDoubts] = useState([]);


  const user = getUserFromToken();

  const userId = user?.userId;
  const role = user?.role;
  console.log(userId)
  console.log(user.name)



  const token = localStorage.getItem("token");



  useEffect(() => {
    const fetchDoubts = async () => {
      if (!token) return;

      try {
        const res = await axios.get("https://student-doubt-portal-backend.onrender.com/doubts", {
          headers: { Authorization: `Bearer ${token}` },
        });


        const myDoubts = res.data.filter(d => d.studentId === userId);
        setDoubts(myDoubts);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchDoubts();
  }, [token, userId]);



  const handlePostDoubt = async () => {
    if (!title || !description || !token) return;

    try {
      const res = await axios.post(
        "https://student-doubt-portal-backend.onrender.com/doubts",
        {
          title,
          description,
          studentId: userId,
          studentName: user?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);


      setDoubts([res.data.doubt, ...doubts]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating doubt");
    }
  };

  async function handleDelete(doubtId) {
   
    try {
      await axios.delete(
        `https://student-doubt-portal-backend.onrender.com/doubts/delete/${doubtId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDoubts((prevDoubts) =>
        prevDoubts.filter((doubt) => doubt._id !== doubtId)
      );

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error deleting doubt");
    }
  }




  return (
    <div className="page">
      <h2>Student Dashboard</h2>


      <Card
        title="Ask a Doubt"
        subtitle="Your question will be visible to teachers"
        footer={
          <button onClick={handlePostDoubt} disabled={!title || !description}>
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

        {doubts <= 0 ? <h1>No Doubts</h1> : " "}
      {doubts.map((d) => (
        <Card
          key={d._id}
          title={d.title}
          subtitle="Your doubt"
          doubtId={d._id}
          role={role}
          status={d.status}
          handleDelete={handleDelete}
        >

          <p className="doubtCard">{d.description}</p>

          <span className="answer">
            {d.answer || "Awaiting answer"}
          </span>

        </Card>
      ))}
    </div>
  );
}