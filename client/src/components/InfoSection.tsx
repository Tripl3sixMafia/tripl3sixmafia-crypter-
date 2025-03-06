import React from "react";

export default function InfoSection() {
  return (
    <div className="mt-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How Code Obfuscation Protects Your Software</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-secondary rounded-lg p-6">
            <div className="text-accent text-2xl mb-4">
              <i className="fas fa-random"></i>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Name Mangling</h3>
            <p className="text-gray-400 text-sm">
              Replaces meaningful variable and function names with random characters, making it extremely difficult for humans to understand the code's purpose.
            </p>
          </div>
          
          <div className="bg-secondary rounded-lg p-6">
            <div className="text-accent text-2xl mb-4">
              <i className="fas fa-lock"></i>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">String Encryption</h3>
            <p className="text-gray-400 text-sm">
              Encrypts string literals in your code, preventing attackers from finding sensitive information or understanding program flow by analyzing text.
            </p>
          </div>
          
          <div className="bg-secondary rounded-lg p-6">
            <div className="text-accent text-2xl mb-4">
              <i className="fas fa-project-diagram"></i>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Control Flow Obfuscation</h3>
            <p className="text-gray-400 text-sm">
              Restructures the control flow of your code, making it nearly impossible to follow the execution path and understand the program's logic.
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-400 mb-6">
            Remember: While obfuscation significantly increases the difficulty of reverse engineering, it cannot make your code 100% secure. <br />
            For critical applications, combine obfuscation with other security measures.
          </p>
          
          <a href="#" className="inline-flex items-center text-accent hover:text-accent/80">
            Learn more about code security best practices
            <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
