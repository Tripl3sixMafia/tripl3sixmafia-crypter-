import React from "react";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="bg-secondary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-shield-alt text-accent text-2xl mr-2"></i>
              <Link href="/">
                <span className="font-bold text-xl text-white cursor-pointer">DlinqntShield</span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <a className="border-b-2 border-accent text-white px-1 pt-1 text-sm font-medium">Obfuscator</a>
              </Link>
              <a href="#" className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 px-1 pt-1 border-b-2 text-sm font-medium">Documentation</a>
              <a href="#" className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 px-1 pt-1 border-b-2 text-sm font-medium">API</a>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-md text-sm">
              <i className="fas fa-rocket mr-1"></i> Go Pro
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
