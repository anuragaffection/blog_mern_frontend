import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import context from '../context/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiArrowLeft, FiEdit3, FiImage, FiFileText } from 'react-icons/fi';

function AddBlog() {
  const auth = useContext(context);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!auth.id) return;
      const api = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/blog/${auth.id}`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      setTitle(api.data.data.title)
      setDescription(api.data.data.description)
      setImgUrl(api.data.data.imgUrl);
    }

    fetchBlog();
  }, [auth.id])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.id) {
      try {
        const api = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/new`, {
          title,
          description,
          imgUrl
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

    } else {
      try {
        const api = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${auth.id}`, {
          title,
          description,
          imgUrl
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

        auth.setId("");

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
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-6">
      <div className="mx-auto max-w-2xl">
        {/* Back navigation */}
        <button
          onClick={() => {
            auth.setId("");
            navigate('/profile');
          }}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
        >
          <FiArrowLeft /> Back to Profile
        </button>

        {/* Form Container */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-2">
              <FiEdit3 className="text-violet-500" />
              {auth.id ? 'Edit Your Article' : 'Write a New Story'}
            </h1>
            <p className="text-sm text-zinc-400">
              {auth.id ? 'Modify your content and save changes.' : 'Share your knowledge, ideas, and experiences with the world.'}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="titleText" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
                Article Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 h-12 text-base"
                id="titleText"
                placeholder="Enter a catchy title..."
                required
              />
            </div>

            {/* Image URL Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="imageUrl" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
                Featured Image URL
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-600"><FiImage /></span>
                <input
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  type="url"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 h-12 text-sm"
                  id="imageUrl"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-2">
              <label htmlFor="descriptionText" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
                Article Body
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="descriptionText"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 text-base leading-relaxed resize-y min-h-[250px]"
                  placeholder="Start writing here..."
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] h-12 flex items-center justify-center gap-2"
              >
                <FiFileText />
                {auth.id ? 'Save Updates' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBlog