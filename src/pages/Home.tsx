import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Sparkles, ArrowRight, Code, Palette, Zap } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsLoading(true);
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/builder', { state: { prompt } });
    }
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Smart Code Generation",
      description: "AI-powered code creation with modern best practices"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Professional layouts with responsive design systems"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Preview",
      description: "See your changes in real-time as we build"
    }
  ];

  const examples = [
    "Create a modern portfolio website for a graphic designer",
    "Build a landing page for a SaaS product with pricing tiers",
    "Design a restaurant website with menu and reservation system",
    "Create a blog platform with dark mode support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Enhanced 3D Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs with 3D movement */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-float-slow" style={{
          animation: 'float-diagonal 20s ease-in-out infinite, pulse 4s ease-in-out infinite alternate'
        }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-float-reverse" style={{
          animation: 'float-reverse 25s ease-in-out infinite, pulse 3s ease-in-out infinite alternate'
        }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" style={{
          animation: 'rotate-slow 30s linear infinite, scale-pulse 8s ease-in-out infinite alternate'
        }} />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/40 rotate-45" style={{
          animation: 'float-up 15s ease-in-out infinite, rotate-360 10s linear infinite'
        }} />
        <div className="absolute top-40 right-32 w-6 h-6 bg-indigo-400/40 rounded-full" style={{
          animation: 'float-down 18s ease-in-out infinite, pulse 2s ease-in-out infinite alternate'
        }} />
        <div className="absolute bottom-32 left-40 w-3 h-12 bg-gradient-to-b from-blue-300/30 to-transparent" style={{
          animation: 'float-horizontal 12s ease-in-out infinite, fade-in-out 4s ease-in-out infinite alternate'
        }} />
        <div className="absolute bottom-20 right-20 w-8 h-8 border-2 border-indigo-300/30 rotate-12" style={{
          animation: 'float-diagonal 20s ease-in-out infinite reverse, rotate-reverse 15s linear infinite'
        }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 60s linear infinite'
          }} />
        </div>
      </div>

      <div className="relative max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" style={{
                animation: 'float-gentle 4s ease-in-out infinite alternate, glow-pulse 3s ease-in-out infinite alternate'
              }}>
                <Wand2 className="w-10 h-10 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <div className="absolute -top-2 -right-2 transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1">
                <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" style={{
                  animation: 'sparkle 2s ease-in-out infinite, float-tiny 3s ease-in-out infinite alternate'
                }} />
              </div>
              {/* Additional floating sparkles */}
              <div className="absolute -bottom-1 -left-1 opacity-70">
                <Sparkles className="w-3 h-3 text-blue-500" style={{
                  animation: 'sparkle 1.5s ease-in-out infinite 0.5s, float-tiny 2.5s ease-in-out infinite alternate 0.3s'
                }} />
              </div>
              <div className="absolute top-0 right-4 opacity-60">
                <Sparkles className="w-4 h-4 text-indigo-500" style={{
                  animation: 'sparkle 2.5s ease-in-out infinite 1s, float-tiny 3.5s ease-in-out infinite alternate 0.7s'
                }} />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-800 bg-clip-text text-transparent mb-6" style={{
            animation: 'text-glow 4s ease-in-out infinite alternate, slide-up 0.8s ease-out'
          }}>
            WebGenie AI
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Transform your ideas into stunning websites with the power of artificial intelligence. 
            Just describe your vision, and we'll build it step by step.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 group cursor-pointer"
                style={{
                  animation: `float-gentle ${3 + index}s ease-in-out infinite alternate, fade-in 0.5s ease-out ${index * 0.2}s both`
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 text-white">
                  <div className="transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-gray-800 font-semibold mb-2 group-hover:text-blue-700 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500" style={{
          animation: 'slide-up 1s ease-out 0.3s both'
        }}>
          {/* Form Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-indigo-400/5" style={{
              animation: 'shimmer 3s ease-in-out infinite'
            }} />
            <div className="relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Describe Your Vision</h2>
              <p className="text-gray-600">Tell us about the website you want to create, and we'll handle the rest</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build... Be specific about features, style, and functionality you need."
                className="w-full h-40 p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg leading-relaxed"
                maxLength={1000}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500 font-medium">
                {prompt.length}/1000
              </div>
            </div>

            {/* Example Prompts */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-semibold">Need inspiration? Try one of these:</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-sm text-gray-600 hover:text-blue-700 transition-all duration-200 group"
                  >
                    <span className="block truncate group-hover:text-blue-600">"{example}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center text-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Generate Website Plan
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Powered by advanced AI technology</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg shadow-md">
            <div className="text-3xl font-bold text-gray-800 mb-2">10k+</div>
            <div className="text-sm text-gray-600 font-medium">Websites Created</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg shadow-md">
            <div className="text-3xl font-bold text-gray-800 mb-2">99%</div>
            <div className="text-sm text-gray-600 font-medium">Success Rate</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg shadow-md">
            <div className="text-3xl font-bold text-gray-800 mb-2">&lt; 5min</div>
            <div className="text-sm text-gray-600 font-medium">Average Build Time</div>
          </div>
        </div>
      </div>

      {/* Enhanced 3D CSS Animations */}
      <style jsx>{`
        @keyframes float-diagonal {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          25% { 
            transform: translate(30px, -20px) scale(1.1); 
          }
          50% { 
            transform: translate(-20px, -30px) scale(0.9); 
          }
          75% { 
            transform: translate(-30px, 20px) scale(1.05); 
          }
        }

        @keyframes float-reverse {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translate(-40px, 30px) rotate(120deg) scale(1.1); 
          }
          66% { 
            transform: translate(20px, -25px) rotate(240deg) scale(0.95); 
          }
        }

        @keyframes rotate-slow {
          from { 
            transform: translate(-50%, -50%) rotate(0deg) scale(1); 
          }
          to { 
            transform: translate(-50%, -50%) rotate(360deg) scale(1); 
          }
        }

        @keyframes scale-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2); 
          }
        }

        @keyframes float-up {
          0%, 100% { 
            transform: translateY(0px) rotate(45deg) scale(1); 
          }
          50% { 
            transform: translateY(-20px) rotate(225deg) scale(1.2); 
          }
        }

        @keyframes float-down {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(15px) scale(0.8); 
          }
        }

        @keyframes float-horizontal {
          0%, 100% { 
            transform: translateX(0px) scaleY(1); 
          }
          50% { 
            transform: translateX(25px) scaleY(1.3); 
          }
        }

        @keyframes rotate-360 {
          from { 
            transform: rotate(45deg); 
          }
          to { 
            transform: rotate(405deg); 
          }
        }

        @keyframes rotate-reverse {
          from { 
            transform: rotate(12deg); 
          }
          to { 
            transform: rotate(-348deg); 
          }
        }

        @keyframes fade-in-out {
          0%, 100% { 
            opacity: 0.2; 
          }
          50% { 
            opacity: 0.8; 
          }
        }

        @keyframes grid-move {
          0% { 
            transform: translate(0, 0); 
          }
          100% { 
            transform: translate(50px, 50px); 
          }
        }

        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }

        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(99, 102, 241, 0.2); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(99, 102, 241, 0.4); 
          }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
        }

        @keyframes float-tiny {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-5px); 
          }
        }

        @keyframes text-glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.3); 
          }
          50% { 
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(99, 102, 241, 0.4); 
          }
        }

        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes shimmer {
          0% { 
            transform: translateX(-100%); 
          }
          100% { 
            transform: translateX(100%); 
          }
        }
      `}</style>
    </div>
  );
}