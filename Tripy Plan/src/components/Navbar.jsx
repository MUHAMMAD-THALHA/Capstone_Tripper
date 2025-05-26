import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaSuitcase, FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../images/Logo.png';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-pink py-4 px-6 flex items-center justify-between rounded-b-2xl shadow-md font-playful">
      <div className="flex items-center gap-2 font-playful">
        <img src={Logo} alt="Tripy Logo" className="w-20 h-20 border-2 border-white rounded-full mb-2" />
        <Link to="/" className="text-3xl font-bold font-playful">Tripy</Link>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white text-2xl"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop navigation */}
      <nav className={`md:flex gap-8 items-center font-semibold text-lg ${menuOpen ? 'block' : 'hidden md:block'}`}>
        <Link to="/" className="hover:text-darkpink">HOME</Link>
        <Link to="/about" className="hover:text-darkpink">ABOUT US</Link>
        <Link to="/tours" className="hover:text-darkpink">TOURS</Link>
        <Link to="/packages" className="hover:text-darkpink">PACKAGES</Link>
        <Link to="/blogs" className="hover:text-darkpink">BLOGS</Link>
        <Link to="/help-support" className="hover:text-darkpink">HELP & SUPPORT</Link>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in" className="flex items-center gap-1 hover:text-darkpink">
            <FaSignInAlt /> LOGIN
          </Link>
        </SignedOut>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-pink z-50 p-4 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Tripy Logo" className="w-12 h-12 border-2 border-white rounded-full" />
              <span className="text-2xl font-bold">Tripy</span>
            </div>
            <button onClick={toggleMenu} className="text-white text-2xl">
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 text-lg font-bold">
            <Link 
              to="/" 
              className="hover:bg-white/20 p-2 rounded-lg"
              onClick={toggleMenu}
            >
              HOME
            </Link>
            <Link 
              to="/about" 
              className="hover:bg-white/20 p-2 rounded-lg"
              onClick={toggleMenu}
            >
              ABOUT US
            </Link>
            <Link 
              to="/tours" 
              className="hover:bg-white/20 p-2 rounded-lg"
              onClick={toggleMenu}
            >
              TOURS
            </Link>
            <Link 
              to="/packages" 
              className="hover:bg-white/20 p-2 rounded-lg"
              onClick={toggleMenu}
            >
              PACKAGES
            </Link>
            <Link 
              to="/blogs" 
              className="hover:bg-white/20 p-2 rounded-lg"
              onClick={toggleMenu}
            >
              BLOGS
            </Link>
            <Link 
              to="/help-support" 
              className="hover:bg-white/20 p-2 rounded-lg"
              onClick={toggleMenu}
            >
              HELP & SUPPORT
            </Link>

            <div className="border-t border-white/20 pt-4 mt-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/sign-in" />
              </SignedIn>
              <SignedOut>
                <Link 
                  to="/sign-in" 
                  className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg"
                  onClick={toggleMenu}
                >
                  <FaSignInAlt /> LOGIN
                </Link>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 
 