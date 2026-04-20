import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-full">
              <FileQuestion className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-4">
          404
        </h1>

        {/* Main Message */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved. 
          Don't worry, we can help you get back on track.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-sm text-gray-400 mb-4">
            You might find what you're looking for here:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/jobs"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm"
            >
              Browse Jobs
            </Link>
            <span className="text-gray-600 hidden sm:inline">•</span>
           
            <span className="text-gray-600 hidden sm:inline">•</span>
            <Link
              to="/about"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 opacity-30">
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
