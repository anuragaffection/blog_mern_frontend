import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import context from '../context/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const auth = useContext(context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const api = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        email,
        password
      }, {
        headers: {
          "Content-Type": "application/json"
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

      auth.setIsAuthenticated(true);

      setTimeout(() => {
        navigate('/profile')
      }, 1000);

    } catch (error) {
      toast.error(error.response.data.message, {
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
    }
  }

  return (
    <>
      <div className="min-h-[85vh] bg-zinc-950 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-400">
              Sign in to your account to manage your stories.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="exampleInputEmail"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1"
              >
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 h-12"
                id="exampleInputEmail"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="exampleInputPassword"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1"
              >
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 h-12"
                id="exampleInputPassword"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] h-12 flex items-center justify-center mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-zinc-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
