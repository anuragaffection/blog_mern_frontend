import React from 'react'

function About() {
    return (
        <div className="min-h-screen bg-zinc-950 py-16 px-6">
            <div className="mx-auto max-w-3xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-zinc-300">
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">About Article App</h1>
                <p className="mb-8 text-base leading-relaxed text-zinc-400">
                    Welcome to Article App! A minimalist publishing platform designed for developers and creators to express ideas, document journeys, and share knowledge effortlessly.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 pb-2 border-b border-zinc-800/60">Key Features</h3>
                        <ul className="space-y-3 text-sm text-zinc-300">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-2" />
                                <span>Publish and share your favorite articles</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-2" />
                                <span>Explore and read stories written by other creators</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-2" />
                                <span>Create, edit, and delete your articles from a personal dashboard</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-2" />
                                <span>Distraction-free, minimal reading interfaces</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 pb-2 border-b border-zinc-800/60">Technologies Used</h3>
                        <ul className="space-y-3 text-sm text-zinc-300">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2" />
                                <span><strong>Frontend:</strong> React, Tailwind CSS, Axios, Vite</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2" />
                                <span><strong>Backend:</strong> Node.js, Express, MongoDB, Mongoose</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2" />
                                <span><strong>State Management:</strong> React Context API</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-850 pt-6 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between gap-2">
                    <span>Continuously building and shipping updates to improve readability.</span>
                </div>
            </div>
        </div>
    )
}

export default About
