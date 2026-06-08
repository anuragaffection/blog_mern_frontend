import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import UserDetail from './UserDetail'
import context from '../context/MyContext';
import articleApp from '../assets/articleApp.jpg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

function MyBlogs() {
    const [blog, setBlog] = useState([]);
    const auth = useContext(context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            const api = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/myblogs`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            setBlog(api.data.data);
        }
        fetchBlog();
    }, []);

    const deleteBlog = async (id) => {
        try {
            const api = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
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

            // Update local state to immediately reflect deletion
            setBlog(prevBlogs => prevBlogs.filter(item => item._id !== id));

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete article", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const editBlog = async (id) => {
        auth.setId(id);
        navigate('/addblog')
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {blog.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-zinc-800/40 bg-zinc-900/10 p-8 text-center">
                    <span className="text-zinc-500 mb-2">You haven't written any articles yet</span>
                    <Link 
                        to="/addblog" 
                        className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                    >
                        Write your first article
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blog.map((data) => {
                        return (
                            <div 
                                key={data._id} 
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/10 hover:bg-zinc-900/20 p-5 transition-all duration-200 hover:border-zinc-700/50"
                            >
                                <div>
                                    {/* Image cover */}
                                    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-850/60 mb-4">
                                        <img
                                            src={data.imgUrl ? data.imgUrl : articleApp}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                                            alt={data.title}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 text-base font-bold text-zinc-100 line-clamp-1 group-hover:text-violet-400 transition-colors duration-200">
                                        {data.title}
                                    </h3>

                                    {/* Date */}
                                    <div className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500">
                                        <FiCalendar className="text-zinc-600" />
                                        {new Date(data.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>

                                    {/* Excerpt */}
                                    <p className="mb-5 text-sm leading-relaxed text-zinc-400 line-clamp-2">
                                        {data.description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto flex items-center gap-2 border-t border-zinc-800/40 pt-4">
                                    <Link
                                        to={"/viewblog"}
                                        onClick={() => {
                                            auth.setSingleBlog(data);
                                            scrollToTop();
                                        }}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold text-xs py-2.5 transition-all duration-200"
                                    >
                                        <FiEye /> View
                                    </Link>
                                    
                                    <button
                                        onClick={() => editBlog(data._id)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white font-semibold text-xs py-2.5 transition-all duration-200"
                                    >
                                        <FiEdit2 /> Edit
                                    </button>
                                    
                                    <button
                                        onClick={() => deleteBlog(data._id)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-semibold text-xs py-2.5 transition-all duration-200"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default MyBlogs