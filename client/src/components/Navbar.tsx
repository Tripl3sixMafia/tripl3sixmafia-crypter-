import React from "react";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-purple-500 text-2xl mr-2">
                <i className="fas fa-shield-alt"></i>
              </span>
              <Link href="/">
                <span className="font-bold text-xl text-white cursor-pointer">
                  Dlinqnt<span className="text-purple-500">Shield</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <div className="border-b-2 border-purple-500 px-1 pt-1">
                <Link href="/">
                  <span className="text-white text-sm font-medium cursor-pointer">Obfuscator</span>
                </Link>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-gray-600">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">Documentation</span>
              </div>
              <div className="border-transparent border-b-2 px-1 pt-1 hover:border-gray-600">
                <span className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer">API</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-150">
              <i className="fas fa-rocket mr-1"></i> Go Pro
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
