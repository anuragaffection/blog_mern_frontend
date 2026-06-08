import React from 'react'
import { Bio } from '../constant/bio'
import { skills } from '../constant/skills'
import { FiGithub, FiLinkedin, FiFileText } from 'react-icons/fi';

function AboutDeveloper() {
    return (
        <div className="text-zinc-300">
            <header className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">{Bio.name}</h2>
                
                {/* Roles badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                    {Bio.roles.map((role, index) => (
                        <span key={index} className="rounded-full bg-zinc-800/80 px-3 py-1 text-xs font-semibold text-zinc-300 border border-zinc-800">
                            {role}
                        </span>
                    ))}
                </div>

                <p className="text-sm leading-relaxed text-zinc-400 max-w-2xl mb-4">{Bio.description}</p>
                
                {/* Links */}
                <div className="flex items-center justify-center sm:justify-start gap-4">
                    <a href={Bio.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                        <FiFileText /> Resume
                    </a>
                    <a href={Bio.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                        <FiGithub /> GitHub
                    </a>
                    <a href={Bio.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                        <FiLinkedin /> LinkedIn
                    </a>
                </div>
            </header>

            {/* Displaying skills */}
            <div className="border-t border-zinc-800/60 pt-6 space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">Core Competencies</h3>
                {skills.map((skillSet) => (
                    <div key={skillSet.id} className="bg-zinc-900/10 border border-zinc-800/40 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-zinc-200 mb-3">{skillSet.title}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {skillSet.skill.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-2.5 bg-zinc-950/40 border border-zinc-900 rounded-lg p-2 hover:border-zinc-850 hover:bg-zinc-900/10 transition-colors">
                                    <img src={skill.image} alt={skill.name} className="w-6 h-6 object-contain filter brightness-90 group-hover:brightness-100 transition-all" />
                                    <span className="text-xs font-medium text-zinc-300">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutDeveloper