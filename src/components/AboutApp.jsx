import React from 'react'

function AboutApp() {
    return (
        <div className="text-zinc-300">
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4">About Article App</h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                Welcome to Article App! A minimalist publishing platform designed for developers and creators to express ideas, document journeys, and share knowledge effortlessly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">Key Features</h3>
                    <ul className="space-y-2 text-sm text-zinc-300">
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
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">Technologies Used</h3>
                    <ul className="space-y-2 text-sm text-zinc-300">
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

            <div className="border-t border-zinc-800/60 pt-4 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between gap-2">
                <span>Continuously building and shipping updates to improve readability.</span>
                <span>Contact us: <a href="mailto:contact@articleapp.com" className="text-violet-400 hover:underline">contact@articleapp.com</a></span>
            </div>
        </div>
    )
}

export default AboutApp