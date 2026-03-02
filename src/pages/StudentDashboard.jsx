import { useState, useEffect } from "react";
import Card from "../Component/Card";
import "../Component/Card";
import { getUserFromToken } from "../utils/getUserFromToken"
import axios from "axios";
import Loader from "../Component/Loader";
export default function StudentDashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doubts, setDoubts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [deleteloading, setDeleteLoading] = useState(false);


  const user = getUserFromToken();

  const userId = user?.userId;
  const role = user?.role;
  console.log(userId)
  console.log(user.name)



  const token = localStorage.getItem("token");



  useEffect(() => {
    const fetchDoubts = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const res = await axios.get("https://student-doubt-portal-backend.onrender.com/doubts", {
          headers: { Authorization: `Bearer ${token}` },
        });


        const myDoubts = res.data.filter(d => d.studentId === userId);
        setDoubts(myDoubts);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
      finally{
        setLoading(false)
      }
    };

    fetchDoubts();
  }, [token, userId]);



  const handlePostDoubt = async () => {
    if (!title || !description || !token) return;

    setLoading(true)
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
    finally{

      setLoading(false)
    }
  };

  async function handleDelete(doubtId) {
   
    try {
     
      setDeleteLoading(true)
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
    finally{
      setDeleteLoading(false)
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
            {loading ? <Loader/> : "Post Doubt"}
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

        {doubts <= 0 ? <h1>No Doubts</h1> : loading ? <Loader/> : ""}
      {doubts.map((d) => (
        <Card
          key={d._id}
          title={d.title}
          subtitle="Your doubt"
          doubtId={d._id}
          role={role}
          status={d.status}
          deleteloader={deleteloading}
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