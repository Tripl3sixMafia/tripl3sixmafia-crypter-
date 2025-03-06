import React from "react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900/60 pt-16 pb-8 border-t border-gray-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-5">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md flex items-center justify-center text-white mr-3 shadow-glow">
                <i className="fas fa-shield-alt"></i>
              </div>
              <span className="font-bold text-xl text-white">
                Dlinqnt<span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-500">Shield</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Our advanced code obfuscation technology helps developers protect their intellectual property
              and prevent unauthorized reverse engineering of their source code across multiple programming languages.
            </p>
            <div className="flex space-x-5 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-200">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-200">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-200">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg mb-5">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg mb-5">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <i className="fas fa-chevron-right text-xs text-purple-500 mr-2"></i>
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Dlinqnt<span className="text-purple-500">Shield</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
