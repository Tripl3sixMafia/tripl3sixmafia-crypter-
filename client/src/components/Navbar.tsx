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
                  TRIPL3SIXMAFIA<span className="text-gradient bg-gradient-to-r from-red-600 to-red-400">CRYPTER</span>
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
            <button 
              onClick={() => window.open('https://www.paypal.com/donate?business=tripl3sixmafia@gmail.com', '_blank')}
              className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-glow-sm hover:shadow-glow-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.084-.03.114a.804.804 0 0 1-.794.679h-2.776a.483.483 0 0 1-.477-.558l.922-5.832-.02.124a.804.804 0 0 1 .793-.681h1.662a7.132 7.132 0 0 0 7.118-6.161c.26-1.659-.03-2.94-.88-3.877-.037-.042-.072-.085-.108-.127a5.748 5.748 0 0 0-.973-.784c.46.709.697 1.61.602 2.722m-9.709 1.391c.077-.47.154-.94.232-.139a6.089 6.089 0 0 1 2.82-2.208 9.542 9.542 0 0 1 3.105-.471h.365c.196 0 .387.012.574.034a4.551 4.551 0 0 1 1.989.615c-.587-3.26-3.387-4.393-6.917-4.393h-2.79a.804.804 0 0 0-.794.68l-2.85 18.05a.483.483 0 0 0 .477.558h3.12l.781-4.975z"/>
              </svg>
              Donate
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
              <button 
                onClick={() => window.open('https://www.paypal.com/donate?business=tripl3sixmafia@gmail.com', '_blank')}
                className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-medium py-2.5 px-4 rounded-lg text-base transition-all duration-200 shadow-glow-sm flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.084-.03.114a.804.804 0 0 1-.794.679h-2.776a.483.483 0 0 1-.477-.558l.922-5.832-.02.124a.804.804 0 0 1 .793-.681h1.662a7.132 7.132 0 0 0 7.118-6.161c.26-1.659-.03-2.94-.88-3.877-.037-.042-.072-.085-.108-.127a5.748 5.748 0 0 0-.973-.784c.46.709.697 1.61.602 2.722m-9.709 1.391c.077-.47.154-.94.232-.139a6.089 6.089 0 0 1 2.82-2.208 9.542 9.542 0 0 1 3.105-.471h.365c.196 0 .387.012.574.034a4.551 4.551 0 0 1 1.989.615c-.587-3.26-3.387-4.393-6.917-4.393h-2.79a.804.804 0 0 0-.794.68l-2.85 18.05a.483.483 0 0 0 .477.558h3.12l.781-4.975z"/>
                </svg>
                Donate with PayPal
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
