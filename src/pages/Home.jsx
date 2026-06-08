import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import UserDetail from '../components/UserDetail';
import articleApp from '../assets/articleApp.jpg'
import context from '../context/MyContext';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

const Home = () => {
  const [blog, setBlog] = useState([]);
  const accessingBlog = useContext(context);

  useEffect(() => {
    const fetchBlog = async () => {
      const api = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/allblogs`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      setBlog(api.data.data)
    }

    fetchBlog();
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Explore Ideas & Stories
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-400 md:text-lg">
            A minimalist space for thinkers, creators, and developers to share knowledge and inspire others.
          </p>
        </div>

        {/* Blog Grid */}
        {blog.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-zinc-800/40 bg-zinc-900/20 p-8 text-center">
            <span className="text-zinc-500 mb-2">No articles found</span>
            <p className="text-sm text-zinc-600">Be the first to publish an article by logging in!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blog.map((data) => {
              return (
                <article 
                  key={data._id} 
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/30 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/50 hover:bg-zinc-900/40 hover:shadow-[0_12px_30px_-15px_rgba(124,58,237,0.15)]"
                >
                  {/* Image wrapper */}
                  <div className="relative h-52 w-full overflow-hidden border-b border-zinc-800/60 bg-zinc-950">
                    <img
                      src={data.imgUrl ? data.imgUrl : articleApp}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={data.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Metadata */}
                    <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-zinc-600" />
                        {new Date(data.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-zinc-400">
                        <FiUser className="text-zinc-600" />
                        <UserDetail id={data.user} />
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 text-lg font-bold text-zinc-100 transition-colors duration-200 line-clamp-2 group-hover:text-violet-400">
                      {data.title}
                    </h2>

                    {/* Description excerpt */}
                    <p className="mb-6 text-sm leading-relaxed text-zinc-400 line-clamp-3">
                      {data.description}
                    </p>

                    {/* Action */}
                    <div className="mt-auto">
                      <Link
                        to={"/viewblog"}
                        onClick={() => {
                          accessingBlog.setSingleBlog(data);
                          scrollToTop();
                        }}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-violet-400 transition-colors duration-200 group-hover:text-violet-300"
                      >
                        Read Article
                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home