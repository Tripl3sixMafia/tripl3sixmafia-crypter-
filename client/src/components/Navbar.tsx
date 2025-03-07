import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shield, User, Zap, Menu, X, Code, BookOpen, Database } from "lucide-react";

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
    <nav className={`${scrolled ? 'bg-black/90' : 'bg-black/70'} backdrop-blur-sm shadow-lg border-b border-red-900/20 sticky top-0 z-50 transition-all duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-9 w-9 bg-gradient-to-br from-red-900 to-red-700 rounded-md flex items-center justify-center text-white mr-2 shadow-glow">
                <Shield className="h-5 w-5" />
              </div>
              <Link href="/">
                <span className="font-bold text-xl text-white cursor-pointer">
                  DLINQNT<span className="text-gradient bg-gradient-to-r from-red-600 to-red-400">SHIELD</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <div className="border-b-2 border-red-600 px-1 pt-1">
                <Link href="/">
                  <span className="text-white text-sm font-medium cursor-pointer">Protection</span>
                </Link>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-red-600/60 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">
                  <BookOpen className="h-4 w-4 inline mr-1" /> Documentation
                </span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-red-600/60 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">
                  <Code className="h-4 w-4 inline mr-1" /> API
                </span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-red-600/60 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">
                  <Database className="h-4 w-4 inline mr-1" /> Enterprise
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <a href="#" className="text-gray-300 hover:text-white mr-5 text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-1" /> Log In
              </a>
            </div>
            <button className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-glow-sm hover:shadow-glow-md flex items-center">
              <Zap className="h-4 w-4 mr-1.5" /> Upgrade to Pro
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? 
                  <X className="h-6 w-6" /> : 
                  <Menu className="h-6 w-6" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-red-900/20 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <div className="bg-red-900/20 text-white block px-3 py-2 rounded-lg text-base font-medium">
                <Shield className="h-4 w-4 inline mr-2 text-red-500" /> Protection
              </div>
            </Link>
            <a href="#" className="text-gray-300 hover:bg-red-900/10 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <BookOpen className="h-4 w-4 inline mr-2 text-gray-400" /> Documentation
            </a>
            <a href="#" className="text-gray-300 hover:bg-red-900/10 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <Code className="h-4 w-4 inline mr-2 text-gray-400" /> API
            </a>
            <a href="#" className="text-gray-300 hover:bg-red-900/10 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <Database className="h-4 w-4 inline mr-2 text-gray-400" /> Enterprise
            </a>
            <a href="#" className="text-gray-300 hover:bg-red-900/10 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
              <User className="h-4 w-4 inline mr-2 text-gray-400" /> Log In
            </a>
            <div className="pt-2">
              <button className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-medium py-2.5 px-4 rounded-lg text-base transition-all duration-200 shadow-glow-sm flex items-center justify-center">
                <Zap className="h-4 w-4 mr-2" /> Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
