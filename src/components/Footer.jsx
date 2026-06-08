import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AboutApp from './AboutApp';
import Contact from './Contact'
import PrivacyPolicy from './PrivacyPolicy';
import AboutDeveloper from './AboutDeveloper';
import { Social } from '../constant/social';
import {
  FaYoutube,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook
} from 'react-icons/fa'
import { FiX } from 'react-icons/fi';

function Footer() {
  const navigate = useNavigate();

  const [showSection, setShowSection] = useState({
    showAboutApp: false,
    showContact: false,
    showPolicy: false,
    showAboutDeveloper: false,
  });

  const scrollToTop = () => {
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setShowSection({
      showAboutApp: false,
      showContact: false,
      showPolicy: false,
      showAboutDeveloper: false,
    });
  };

  const toggleSection = (section) => {
    setShowSection((prevState) => ({
      ...prevState,
      showAboutApp: section === 'aboutApp' ? !prevState.showAboutApp : false,
      showContact: section === 'contact' ? !prevState.showContact : false,
      showPolicy: section === 'policy' ? !prevState.showPolicy : false,
      showAboutDeveloper: section === 'aboutDeveloper' ? !prevState.showAboutDeveloper : false,
    }));
  };

  const closeAllSections = () => {
    setShowSection({
      showAboutApp: false,
      showContact: false,
      showPolicy: false,
      showAboutDeveloper: false,
    });
  };

  const isAnySectionOpen = Object.values(showSection).some(Boolean);

  const footerNavLinkClass = (isOpen) => `text-sm font-medium transition-colors duration-200 cursor-pointer ${
    isOpen ? 'text-violet-400' : 'text-zinc-400 hover:text-zinc-100'
  }`;

  return (
    <>
      {/* Toggled Sections (Sandwiched elegant accordion) */}
      {isAnySectionOpen && (
        <div className="bg-zinc-950 px-6 py-6 border-t border-zinc-900">
          <div className="mx-auto max-w-4xl relative bg-zinc-900/20 border border-zinc-800/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            {/* Close Button */}
            <button 
              onClick={closeAllSections}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
              title="Close section"
            >
              <FiX className="text-base" />
            </button>

            <div>
              {showSection.showAboutApp && <AboutApp />}
              {showSection.showContact && <Contact />}
              {showSection.showPolicy && <PrivacyPolicy />}
              {showSection.showAboutDeveloper && <AboutDeveloper />}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Container */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-500 py-10 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Headline */}
          <div className="text-center md:text-left">
            <span className="font-bold text-zinc-300 text-base block">{Social.title}</span>
            <span className="text-xs text-zinc-500 mt-1 block">{Social.name}</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className={footerNavLinkClass(false)} onClick={scrollToTop}>Home</span>
            <span className={footerNavLinkClass(showSection.showAboutApp)} onClick={() => toggleSection('aboutApp')}>About</span>
            <span className={footerNavLinkClass(showSection.showContact)} onClick={() => toggleSection('contact')}>Contact</span>
            <span className={footerNavLinkClass(showSection.showPolicy)} onClick={() => toggleSection('policy')}>Privacy</span>
            <span className={footerNavLinkClass(showSection.showAboutDeveloper)} onClick={() => toggleSection('aboutDeveloper')}>Developer</span>
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
    </>
  )
}

export default Footer