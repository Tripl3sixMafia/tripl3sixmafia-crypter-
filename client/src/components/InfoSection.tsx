import React from "react";

export default function InfoSection() {
  return (
    <div className="mt-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Why Choose DlinqntShield?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-purple-500 text-3xl mb-5 flex justify-center">
              <i className="fas fa-random"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 text-center">Name & Property Mangling</h3>
            <p className="text-gray-300 text-center">
              Replaces meaningful identifiers with random characters, making it extremely difficult to understand the code's purpose and structure.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-purple-500 text-3xl mb-5 flex justify-center">
              <i className="fas fa-lock"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 text-center">Advanced String Encryption</h3>
            <p className="text-gray-300 text-center">
              Encrypts string literals in your code to prevent reverse engineers from finding sensitive information or understanding program flow.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-purple-500 text-3xl mb-5 flex justify-center">
              <i className="fas fa-project-diagram"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 text-center">Control Flow Flattening</h3>
            <p className="text-gray-300 text-center">
              Restructures your code's execution path, making it virtually impossible to follow the logic or create accurate decompilations.
            </p>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-8 rounded-xl border border-purple-800/50">
          <div className="flex flex-col md:flex-row items-center">
            <div className="text-purple-400 text-4xl mr-6 hidden md:block">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Protection Beyond Obfuscation</h3>
              <p className="text-gray-300">
                While obfuscation significantly increases the difficulty of reverse engineering, we recommend combining it with other security measures for mission-critical applications. Our enterprise solutions offer additional protections like anti-tampering, secure licensing, and runtime application self-protection.
              </p>
              
              <div className="mt-4">
                <a href="#" className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium">
                  Learn more about our enterprise security solutions
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
