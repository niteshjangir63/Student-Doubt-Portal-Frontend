import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import ProtectedRoute from './Component/ProtectedRoute'
import Page404 from './pages/Page404'
import Unauthorized from './Component/Unauthorized'
import PublicRoute from './Component/PublicRoute'
import Navbar from './Component/Navbar'
import TeacherAnswerPage from './pages/TeacherAnswerPage'
import Forgot from './pages/Forgot/Forgot'
import UpdatePassword from './pages/UpdatePassword'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DoubtEdit from './pages/DoubtEdit'
import { getUserFromToken } from './utils/getUserFromToken'



function App() {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const user = getUserFromToken();
  const userName = user?.name;
  function logout(){

    localStorage.clear();
    navigate("/")

  }

  return (
    <>
    
      {token && <Navbar title={userName} onLogout={logout} />}
      <Routes>


        <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot" element={<PublicRoute><Forgot /></PublicRoute>} />
        <Route path='/reset-password' element={<UpdatePassword />} />

        <Route path='/student' element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path='/teacher' element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
        <Route path='/doubts/:doubtId' element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherAnswerPage /></ProtectedRoute>} />
        <Route path='/edit/:doubtId' element={<DoubtEdit />} />
        <Route path='*' element={<Page404 />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        
      </Routes>
    </>
  )
}

export default App
