import React, { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${scrolled ? 'bg-gray-900/90' : 'bg-gray-900/70'} backdrop-blur-sm shadow-lg border-b border-gray-800/50 sticky top-0 z-50 transition-all duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-9 w-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md flex items-center justify-center text-white mr-2 shadow-glow">
                <i className="fas fa-shield-alt"></i>
              </div>
              <Link href="/">
                <span className="font-bold text-xl text-white cursor-pointer">
                  Dlinqnt<span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-500">Shield</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <div className="border-b-2 border-purple-500 px-1 pt-1">
                <Link href="/">
                  <span className="text-white text-sm font-medium cursor-pointer">Obfuscator</span>
                </Link>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-purple-500/60 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">Documentation</span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-purple-500/60 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">API</span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-purple-500/60 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">Examples</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <a href="#" className="text-gray-300 hover:text-white mr-5 text-sm font-medium">Log In</a>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-glow-sm hover:shadow-glow-md">
              <i className="fas fa-rocket mr-2"></i> Go Pro
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 border-t border-gray-800/50 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <div className="bg-gray-800/70 text-white block px-3 py-2 rounded-lg text-base font-medium">
                <i className="fas fa-shield-alt mr-2 text-purple-400"></i> Obfuscator
              </div>
            </Link>
            <a href="#" className="text-gray-300 hover:bg-gray-800/50 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <i className="fas fa-book mr-2 text-gray-400"></i> Documentation
            </a>
            <a href="#" className="text-gray-300 hover:bg-gray-800/50 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <i className="fas fa-code mr-2 text-gray-400"></i> API
            </a>
            <a href="#" className="text-gray-300 hover:bg-gray-800/50 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <i className="fas fa-laptop-code mr-2 text-gray-400"></i> Examples
            </a>
            <a href="#" className="text-gray-300 hover:bg-gray-800/50 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <i className="fas fa-sign-in-alt mr-2 text-gray-400"></i> Log In
            </a>
            <div className="pt-2">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2.5 px-4 rounded-lg text-base transition-all duration-200 shadow-glow-sm">
                <i className="fas fa-rocket mr-2"></i> Go Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
