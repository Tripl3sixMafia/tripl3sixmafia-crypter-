import React from "react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-purple-500 text-xl mr-2">
                <i className="fas fa-shield-alt"></i>
              </span>
              <span className="font-bold text-xl text-white">
                Dlinqnt<span className="text-purple-500">Shield</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Our industry-leading code obfuscation technology helps developers protect their intellectual property
              and prevent reverse engineering of their code.
            </p>
            <div className="flex space-x-5 mb-6">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition duration-150">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition duration-150">
                <i className="fab fa-github text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition duration-150">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition duration-150">
                <i className="fab fa-discord text-lg"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Community Forum</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Tutorials</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition duration-150">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Dlinqnt<span className="text-purple-500">Shield</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
