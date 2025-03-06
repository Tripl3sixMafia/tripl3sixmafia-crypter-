import React from "react";

export default function InfoSection() {
  return (
    <div className="mt-16 px-4 mb-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-gradient bg-gradient-to-r from-purple-400 to-pink-500">
          Why Choose DlinqntShield?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg card-hover">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-5">
              <i className="fas fa-random text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 text-center">Name & Property Mangling</h3>
            <p className="text-gray-300 text-center">
              Replaces meaningful identifiers with random characters, making it extremely difficult to understand the code's purpose and structure.
            </p>
          </div>
          
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg card-hover">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-5">
              <i className="fas fa-lock text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 text-center">Advanced String Encryption</h3>
            <p className="text-gray-300 text-center">
              Encrypts string literals in your code to prevent reverse engineers from finding sensitive information or understanding program flow.
            </p>
          </div>
          
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg card-hover">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-5">
              <i className="fas fa-project-diagram text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 text-center">Control Flow Flattening</h3>
            <p className="text-gray-300 text-center">
              Restructures your code's execution path, making it virtually impossible to follow the logic or create accurate decompilations.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 card-hover">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center mr-4">
                <i className="fas fa-code text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Multiple Language Support</h3>
                <p className="text-gray-300 text-sm">
                  Our engine supports JavaScript, Python, Java, PHP, and C# with language-specific optimization techniques.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 card-hover">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center mr-4">
                <i className="fas fa-bolt text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Browser-Based Processing</h3>
                <p className="text-gray-300 text-sm">
                  All code obfuscation happens directly in your browser, ensuring your source code never leaves your machine.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-8 rounded-xl border border-purple-800/50 shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center mr-6 mb-4 md:mb-0">
              <i className="fas fa-shield-alt text-gradient bg-gradient-to-r from-purple-400 to-pink-400 text-3xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Protection Beyond Obfuscation</h3>
              <p className="text-gray-300">
                While obfuscation significantly increases the difficulty of reverse engineering, we recommend combining it with other security measures for mission-critical applications. Our enterprise solutions offer additional protections like anti-tampering, secure licensing, and runtime application self-protection.
              </p>
              
              <div className="mt-5">
                <a href="#" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-md text-sm transition-all">
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
