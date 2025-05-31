import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSuitcase, FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../images/Logo.png';
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton
} from '@clerk/clerk-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Helper for NavLink active styles
  const navLinkClass = ({ isActive }) =>
    `font-bold drop-shadow-lg px-3 py-1 rounded-lg transition-all duration-200
    ${isActive ? 'bg-pink-400 text-white shadow-lg shadow-pink-200/60' : 'text-black hover:bg-pink-100 hover:shadow-pink-200/60'}`;

  return (
    <header className="py-4 px-6 flex items-center justify-between shadow-none font-playful bg-transparent absolute top-0 left-0 w-full z-50">
      <div className="flex items-center font-playful">
        <Link to="/">
          <img src={Logo} alt="Tripy Logo" className="w-20 h-20 border-2 border-white rounded-full mb-2" />
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-black text-2xl"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop navigation */}
      <nav className={`md:flex gap-8 items-center font-semibold text-lg ${menuOpen ? 'block' : 'hidden md:block'}`}>
        <NavLink to="/" className={navLinkClass}>HOME</NavLink>
        <NavLink to="/about" className={navLinkClass}>ABOUT US</NavLink>
        <NavLink to="/tours" className={navLinkClass}>TOURS</NavLink>
        <NavLink to="/packages" className={navLinkClass}>PACKAGES</NavLink>
        <NavLink to="/blogs" className={navLinkClass}>BLOGS</NavLink>
        <NavLink to="/help-support" className={navLinkClass}>HELP & SUPPORT</NavLink>
        <div className="border-t border-white/20 pt-4 mt-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton afterSignInUrl="/" mode="modal">
              <button className="flex items-center gap-2 hover:bg-pink-100 p-2 rounded-lg text-black font-bold drop-shadow-lg focus:bg-pink-400 focus:text-white focus:shadow-lg focus:shadow-pink-200/60 active:bg-pink-400 active:text-white active:shadow-lg active:shadow-pink-200/60 transition-all">LOGIN</button>
            </SignInButton>
            <SignUpButton afterSignUpUrl="/profile" mode="modal">
              <button className="flex items-center gap-2 hover:bg-pink-100 p-2 rounded-lg text-black font-bold drop-shadow-lg focus:bg-pink-400 focus:text-white focus:shadow-lg focus:shadow-pink-200/60 active:bg-pink-400 active:text-white active:shadow-lg active:shadow-pink-200/60 transition-all">SIGN UP</button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 p-4 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Link to="/">
                <img src={Logo} alt="Tripy Logo" className="w-12 h-12 border-2 border-white rounded-full" />
              </Link>
            </div>
            <button onClick={toggleMenu} className="text-black text-2xl">
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 text-lg font-bold">
            <NavLink 
              to="/" 
              className={navLinkClass}
              onClick={toggleMenu}
            >
              HOME
            </NavLink>
            <NavLink 
              to="/about" 
              className={navLinkClass}
              onClick={toggleMenu}
            >
              ABOUT US
            </NavLink>
            <NavLink 
              to="/tours" 
              className={navLinkClass}
              onClick={toggleMenu}
            >
              TOURS
            </NavLink>
            <NavLink 
              to="/packages" 
              className={navLinkClass}
              onClick={toggleMenu}
            >
              PACKAGES
            </NavLink>
            <NavLink 
              to="/blogs" 
              className={navLinkClass}
              onClick={toggleMenu}
            >
              BLOGS
            </NavLink>
            <NavLink 
              to="/help-support" 
              className={navLinkClass}
              onClick={toggleMenu}
            >
              HELP & SUPPORT
            </NavLink>

            <div className="border-t border-white/20 pt-4 mt-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton afterSignInUrl="/" mode="modal">
                  <button className="flex items-center gap-2 hover:bg-pink-100 p-2 rounded-lg text-black font-bold drop-shadow-lg focus:bg-pink-400 focus:text-white focus:shadow-lg focus:shadow-pink-200/60 active:bg-pink-400 active:text-white active:shadow-lg active:shadow-pink-200/60 transition-all">LOGIN</button>
                </SignInButton>
                <SignUpButton afterSignUpUrl="/profile" mode="modal">
                  <button className="flex items-center gap-2 hover:bg-pink-100 p-2 rounded-lg text-black font-bold drop-shadow-lg focus:bg-pink-400 focus:text-white focus:shadow-lg focus:shadow-pink-200/60 active:bg-pink-400 active:text-white active:shadow-lg active:shadow-pink-200/60 transition-all">SIGN UP</button>
                </SignUpButton>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 
 
