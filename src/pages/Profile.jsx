import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import context from '../context/MyContext';
import axios from 'axios';
import MyBlogs from '../components/MyBlogs';
import { FiMail, FiLogOut, FiUser } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const auth = useContext(context)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const api = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getmyprofile`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });
      auth.setUser(api.data.user)
      auth.setIsAuthenticated(true);
    }
    fetchUser();
  }, [])

  const logout = async () => {
    const api = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    toast.success(api.data.message, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    auth.setIsAuthenticated(false);

    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  // Get first letter of username for avatar placeholder
  const avatarLetter = auth.user.name ? auth.user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Profile Header Card */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-sm p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-3xl font-extrabold text-white shadow-lg shadow-violet-500/20">
              {avatarLetter}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                {auth.user.name}
              </h1>
              <p className="text-sm text-zinc-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                <FiMail className="text-zinc-600" />
                {auth.user.email}
              </p>
            </div>
          </div>

          <div>
            {auth.isAuthenticated && (
              <button 
                onClick={logout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-850 hover:border-red-500/30 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 font-semibold text-sm transition-all duration-200"
              >
                <FiLogOut />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Content Divider */}
        <div className="mb-8 border-b border-zinc-800/60 pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Your Articles
          </h2>
        </div>

        {/* List of My Blogs */}
        <div>
          <MyBlogs />
        </div>
      </div>
    </div>
  )
}

export default Profile