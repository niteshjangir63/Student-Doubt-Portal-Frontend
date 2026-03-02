import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Component/Loader";

import "./Register.css";

export default function Register() {
     const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });

    const register = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://student-doubt-portal-backend.onrender.com/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful!");
            window.location = "/"; 
        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account</h2>

                <input placeholder="Name" type="text" onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />

                <select onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                <button disabled={!form.name || !form.email || !form.password} onClick={register}>{loading ? <Loader/> : "Register"}</button>
                 <span>Don't have an Account ? <Link to={"/"}>Login</Link></span>
            </div>
        </div>
    );
}