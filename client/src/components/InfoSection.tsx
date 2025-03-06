import React from "react";

export default function InfoSection() {
  return (
    <div className="mt-20 px-4 mb-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gradient bg-gradient-to-r from-purple-400 to-pink-500">
          Why Choose DlinqntShield?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/60 transition-all duration-300 transform hover:-translate-y-2 shadow-xl card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl pointer-events-none"></div>
            <div className="w-18 h-18 mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 flex items-center justify-center mb-6 shadow-glow">
              <i className="fas fa-random text-gradient bg-gradient-to-r from-purple-400 to-pink-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Name & Property Mangling</h3>
            <p className="text-gray-300 text-center">
              Replaces meaningful identifiers with random characters, making it extremely difficult to understand the code's purpose and structure.
            </p>
          </div>
          
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/60 transition-all duration-300 transform hover:-translate-y-2 shadow-xl card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl pointer-events-none"></div>
            <div className="w-18 h-18 mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 flex items-center justify-center mb-6 shadow-glow">
              <i className="fas fa-lock text-gradient bg-gradient-to-r from-purple-400 to-pink-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Advanced String Encryption</h3>
            <p className="text-gray-300 text-center">
              Encrypts string literals in your code to prevent reverse engineers from finding sensitive information or understanding program flow.
            </p>
          </div>
          
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/60 transition-all duration-300 transform hover:-translate-y-2 shadow-xl card-hover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl pointer-events-none"></div>
            <div className="w-18 h-18 mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 flex items-center justify-center mb-6 shadow-glow">
              <i className="fas fa-project-diagram text-gradient bg-gradient-to-r from-purple-400 to-pink-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Control Flow Flattening</h3>
            <p className="text-gray-300 text-center">
              Restructures your code's execution path, making it virtually impossible to follow the logic or create accurate decompilations.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-7 border border-gray-700/50 hover:border-purple-500/60 transition-all duration-300 shadow-lg card-hover relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center mr-5 mb-2 shadow-glow">
                <i className="fas fa-code text-gradient bg-gradient-to-r from-purple-400 to-pink-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Multiple Language Support</h3>
                <p className="text-gray-300 text-sm">
                  Our engine supports JavaScript, Python, Java, PHP, and C# with language-specific optimization techniques for maximum protection.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-7 border border-gray-700/50 hover:border-purple-500/60 transition-all duration-300 shadow-lg card-hover relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center mr-5 mb-2 shadow-glow">
                <i className="fas fa-bolt text-gradient bg-gradient-to-r from-purple-400 to-pink-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Browser-Based Processing</h3>
                <p className="text-gray-300 text-sm">
                  All code obfuscation happens directly in your browser, ensuring your source code never leaves your machine and your IP remains protected.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-10 rounded-xl border border-purple-800/30 shadow-xl animated-border-gradient-slow">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-900/70 to-purple-800/70 flex items-center justify-center mr-8 mb-6 md:mb-0 shadow-glow border border-purple-700/30">
              <i className="fas fa-shield-alt text-gradient bg-gradient-to-r from-purple-400 to-pink-400 text-4xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Protection Beyond Obfuscation</h3>
              <p className="text-gray-300 leading-relaxed">
                While obfuscation significantly increases the difficulty of reverse engineering, we recommend combining it with other security measures for mission-critical applications. Our enterprise solutions offer additional protections like anti-tampering, secure licensing, and runtime application self-protection.
              </p>
              
              <div className="mt-6">
                <a href="#" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-glow-sm hover:shadow-glow-md">
                  Learn about enterprise solutions
                  <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
