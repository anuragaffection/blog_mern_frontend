import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ArticleApp from '../assets/articleApp.jpg'
import context from '../context/MyContext'
import { Social } from '../constant/social'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
    const auth = useContext(context);
    const location = useLocation();
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const navLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
            isActive ? 'text-violet-400' : 'text-zinc-400 hover:text-zinc-100'
        }`;
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl"
            />

            <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link to={'/'} className="flex items-center gap-3 group transition-opacity duration-200 hover:opacity-90">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-violet-500/20">
                            <img
                                className="h-full w-full object-cover"
                                src={ArticleApp}
                                alt="Logo"
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                            {Social.title}
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1 md:gap-4">
                        <Link to={'/'} onClick={scrollToTop} className={navLinkClass('/')}>
                            Home
                        </Link>
                        
                        {!auth.isAuthenticated && (
                            <>
                                <Link to={'/login'} onClick={scrollToTop} className={navLinkClass('/login')}>
                                    Login
                                </Link>
                                <Link 
                                    to={'/register'} 
                                    onClick={scrollToTop} 
                                    className="ml-2 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {auth.isAuthenticated && (
                            <>
                                <Link to={'/addblog'} onClick={scrollToTop} className={navLinkClass('/addblog')}>
                                    Add Blog
                                </Link>
                                <Link to={'/profile'} onClick={scrollToTop} className={navLinkClass('/profile')}>
                                    Profile
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Navbar