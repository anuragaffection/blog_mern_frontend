import React from 'react'

function Contact() {
    return (
        <div className="text-zinc-300">
            <header className="mb-6 text-center sm:text-left">
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Get in Touch</h2>
                <p className="text-sm text-zinc-400">Feel free to reach out to us for any queries, bug reports, or feedback.</p>
            </header>

            <form className="space-y-4 max-w-xl" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Your Name</label>
                        <input 
                            className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200" 
                            type="text" 
                            placeholder="John Doe" 
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Your Email</label>
                        <input 
                            className="bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200" 
                            type="email" 
                            placeholder="you@example.com" 
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Message</label>
                    <textarea
                        className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 min-h-[120px] resize-y"
                        rows={4}
                        placeholder="Write your message here..."
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white text-sm transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center justify-center"
                >
                    Send Message
                </button>
            </form>
        </div>
    )
}

export default Contact