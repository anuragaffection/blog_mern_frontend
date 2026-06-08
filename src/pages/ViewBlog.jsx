import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import context from '../context/MyContext'
import UserDetail from '../components/UserDetail';
import articleApp from '../assets/articleApp.jpg'
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';

function ViewBlog() {
  const accessingBlog = useContext(context);
  const blog = accessingBlog.singleBlog;

  // Handle empty or missing blog state gracefully
  if (!blog || !blog.title) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-zinc-500 mb-4">No article selected</span>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-6 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-850 transition-all duration-200"
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="mx-auto max-w-3xl px-6">
        {/* Navigation */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
          >
            <FiArrowLeft className="text-zinc-500" />
            Back to articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
            {blog.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 border-y border-zinc-800/60 py-4 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <FiCalendar className="text-zinc-600" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <FiUser className="text-zinc-600" />
              <UserDetail id={blog.user} />
            </span>
          </div>
        </header>

        {/* Article Featured Image */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <img
            src={blog.imgUrl ? blog.imgUrl : articleApp}
            className="h-auto max-h-[450px] w-full object-cover"
            alt={blog.title}
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-base md:text-lg leading-relaxed text-zinc-300 font-normal">
            {blog.description}
          </p>
        </article>
      </div>
    </div>
  )
}

export default ViewBlog