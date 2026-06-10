import React from 'react'

function ContactPage() {
    return (
        <div className="min-h-screen bg-zinc-950 py-16 px-6">
            <div className="mx-auto max-w-2xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-zinc-300">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Get in Touch</h1>
                    <p className="text-sm text-zinc-400">Feel free to reach out to us for any queries, bug reports, or feedback.</p>
                </header>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Your Name</label>
                            <input 
                                className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 h-12" 
                                type="text" 
                                placeholder="John Doe" 
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Your Email</label>
                            <input 
                                className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 h-12" 
                                type="email" 
                                placeholder="you@example.com" 
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Message</label>
                        <textarea
                            className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 min-h-[160px] resize-y"
                            rows={6}
                            placeholder="Write your message here..."
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] h-12 flex items-center justify-center"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ContactPage
