import React from "react";
import { MapPin, Car, Users, Star, ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Map Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="rgb(251, 146, 60)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Location Pins */}
        <div className="absolute top-1/4 left-1/3 transform animate-bounce">
          <div className="relative">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-orange-500"></div>
          </div>
        </div>

        <div className="absolute top-2/3 right-1/3 transform animate-bounce delay-300">
          <div className="relative">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-pink-500"></div>
          </div>
        </div>

        {/* Route Line */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg width="300" height="200" className="opacity-30">
            <path
              d="M 50 100 Q 150 50 250 100"
              stroke="rgb(251, 146, 60)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Floating Cars */}
        <div className="absolute top-1/2 left-1/5 transform animate-pulse">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
            <Car className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 transform animate-pulse delay-700">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <Car className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between min-h-screen">
        <div className="lg:w-1/2 text-center lg:text-left space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium backdrop-blur-sm">
            <Star className="w-4 h-4 mr-2 fill-current" />
            #1 Ride Booking Platform
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Share the
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                ride
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Experience the future of urban mobility with our secure
              ride-sharing platform for companies and universities. Connect,
              travel, and save together.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center lg:text-left">
              <div className="text-2xl md:text-3xl font-bold text-white">
                50K+
              </div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl md:text-3xl font-bold text-white">
                1M+
              </div>
              <div className="text-gray-400 text-sm">Rides Completed</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl md:text-3xl font-bold text-white">
                4.9
              </div>
              <div className="text-gray-400 text-sm">User Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Elements */}
        <div className="lg:w-1/2 flex items-center justify-center mt-12 lg:mt-0">
          <div className="relative w-80 h-80 lg:w-96 lg:h-96">
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>

            {/* Orbiting Elements */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "20s" }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-orange-400" />
              </div>
            </div>

            <div
              className="absolute inset-0 animate-spin"
              style={{
                animationDuration: "15s",
                animationDirection: "reverse",
              }}
            >
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-pink-400" />
              </div>
            </div>

            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "25s" }}
            >
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-10 h-10 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div
              className="absolute inset-0 animate-spin"
              style={{
                animationDuration: "18s",
                animationDirection: "reverse",
              }}
            >
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-10 h-10 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="30%"
                  fill="none"
                  stroke="rgb(251, 146, 60)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgb(236, 72, 153)"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  className="animate-pulse delay-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 200" className="w-full h-20 md:h-32">
          <path
            d="M0,160 Q360,120 720,140 T1440,120 L1440,200 L0,200 Z"
            fill="rgb(15, 23, 42)"
            className="opacity-60"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
