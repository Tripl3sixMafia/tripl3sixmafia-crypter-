import React from "react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <i className="fas fa-shield-alt text-accent text-2xl mr-2"></i>
            <Link href="/">
              <span className="font-bold text-white cursor-pointer">DlinqntShield</span>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="flex justify-center md:justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:justify-between text-sm text-gray-400">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p className="mt-4 md:mt-0 text-center md:text-right">
            &copy; {new Date().getFullYear()} DlinqntShield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
