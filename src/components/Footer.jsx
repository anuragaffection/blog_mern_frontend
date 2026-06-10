import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Social } from '../constant/social';
import {
  FaYoutube,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook
} from 'react-icons/fa'

function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const footerNavLinkClass = `text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200 cursor-pointer`;

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-500 py-10 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Headline */}
        <div className="text-center md:text-left">
          <Link to="/" onClick={scrollToTop} className="font-bold text-zinc-300 text-base block hover:text-white transition-colors">
            {Social.title}
          </Link>
          <span className="text-xs text-zinc-500 mt-1 block">{Social.name}</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className={footerNavLinkClass} onClick={scrollToTop}>Home</span>
          <Link to="/about" className={footerNavLinkClass}>About</Link>
          <Link to="/contact" className={footerNavLinkClass}>Contact</Link>
          <Link to="/privacy" className={footerNavLinkClass}>Privacy</Link>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-7xl my-6 border-t border-zinc-900" />

      {/* Bottom Social & Copyright */}
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Socials */}
        <div className="flex items-center gap-4">
          <a className="text-zinc-500 hover:text-zinc-100 text-lg transition-colors" href={Social.github} target='_blank' rel="noreferrer"><FaGithub /></a>
          <a className="text-zinc-500 hover:text-zinc-100 text-lg transition-colors" href={Social.linkedin} target='_blank' rel="noreferrer"><FaLinkedin /></a>
          <a className="text-zinc-500 hover:text-zinc-100 text-lg transition-colors" href={Social.youtube} target='_blank' rel="noreferrer"><FaYoutube /></a>
          <a className="text-zinc-500 hover:text-zinc-100 text-lg transition-colors" href={Social.twitter} target='_blank' rel="noreferrer"><FaTwitter /></a>
          <a className="text-zinc-500 hover:text-zinc-100 text-lg transition-colors" href={Social.facebook} target='_blank' rel="noreferrer"><FaFacebook /></a>
          <a className="text-zinc-500 hover:text-zinc-100 text-lg transition-colors" href={Social.instagram} target='_blank' rel="noreferrer"><FaInstagram /></a>
        </div>

        {/* Copyright text */}
        <p className="text-xs text-zinc-600 text-center sm:text-right">
          &copy; {new Date().getFullYear()} {Social.title}. All rights reserved. A Family of Love & Affection.
        </p>
      </div>
    </footer>
  )
}

export default Footer