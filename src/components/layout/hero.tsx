
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Original Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://ext.same-assets.com/1940688566/2595479893.jpeg')`,
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) scale(1.1)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-red-900/85"></div>
        </div>

        {/* Animated Geometric Elements */}
        <div className="absolute inset-0">
          {/* Animated Gradient Orbs */}
          <div
            className="absolute w-96 h-96 bg-gradient-to-br from-red-500/30 to-orange-500/20 rounded-full blur-3xl animate-pulse"
            style={{
              left: `${30 + mousePosition.x * 0.1}%`,
              top: `${20 + mousePosition.y * 0.1}%`,
              animationDuration: '4s'
            }}
          />
          <div
            className="absolute w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/30 rounded-full blur-3xl animate-pulse"
            style={{
              right: `${20 + mousePosition.x * 0.05}%`,
              bottom: `${30 + mousePosition.y * 0.05}%`,
              animationDuration: '6s',
              animationDelay: '2s'
            }}
          />

          {/* Geometric Lines */}
          <div className="absolute top-1/4 left-1/4 w-64 h-1 bg-gradient-to-r from-red-500/50 to-transparent transform rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-1 bg-gradient-to-l from-blue-500/50 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative pt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-center justify-center text-center">
          <div className="max-w-5xl">
            {/* Main Title with Animation */}
            <div className="relative">
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight transition-all duration-1500 ease-out ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  La Pasión del
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animate-pulse">
                  Futsal
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  en Canelones
                </span>
              </h1>

              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20 blur-3xl animate-pulse"></div>
            </div>

            {/* Subtitle with Delay Animation */}
            <p
              className={`mt-8 text-xl md:text-2xl leading-relaxed text-gray-200 max-w-4xl mx-auto font-light transition-all duration-1500 ease-out ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los
              amantes del fútbol sala en la región.
            </p>

            {/* Enhanced Action Buttons */}
            <div
              className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1500 ease-out ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <Link
                href="/partidos"
                className="group relative px-8 py-4 text-lg font-bold text-white rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-red-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <span className="relative z-10 flex items-center gap-2">
                  ⚽ Ver Partidos
                </span>
              </Link>

              <Link
                href="/posiciones"
                className="group relative px-8 py-4 text-lg font-bold text-gray-900 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-white/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-gray-100/90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  🏆 Ver Posiciones
                </span>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div
              className={`mt-16 flex flex-col items-center transition-all duration-1500 ease-out ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <p className="text-gray-400 text-sm font-medium mb-4">Descubre más</p>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
