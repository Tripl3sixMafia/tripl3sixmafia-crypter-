import React, { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md flex items-center justify-center text-white mr-2 shadow-glow">
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
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-gray-600 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">Documentation</span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-gray-600 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">API</span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-gray-600 transition-colors duration-200">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">Examples</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <a href="#" className="text-gray-300 hover:text-white mr-4 text-sm">Log In</a>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-all duration-200 shadow-md hover:shadow-lg">
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
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <span className="text-white block px-3 py-2 rounded-md text-base font-medium">Obfuscator</span>
            </Link>
            <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Documentation</a>
            <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">API</a>
            <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Examples</a>
            <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log In</a>
          </div>
        </div>
      )}
    </nav>
  );
}
