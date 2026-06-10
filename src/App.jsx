import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddBlog from './pages/AddBlog'
import Profile from './pages/Profile'
import ViewBlog from './pages/ViewBlog'
import About from './pages/About'
import Privacy from './pages/Privacy'
import ContactPage from './pages/ContactPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import context from './context/MyContext'

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(context);

  useEffect(() => {
    const protectedRoutes = ['/profile', '/addblog'];
    if (protectedRoutes.includes(location.pathname) && !auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, location.pathname, navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viewblog" element={<ViewBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addblog" element={<AddBlog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App