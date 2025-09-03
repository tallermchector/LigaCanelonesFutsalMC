
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Settings, PenSquare, Tv, LayoutDashboard, ChevronDown, Shield } from 'lucide-react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Partidos', href: '/partidos' },
  { name: 'Noticias', href: '/noticias' },
  { name: 'Resumen', href: '/resumen' },
]

const adminLinks = [
    { href: '/gestion', label: 'Gestión de Partidos', icon: <PenSquare /> },
    { href: '/controles', label: 'Control de Partidos', icon: <Settings /> },
    { href: '/banner', label: 'Marcador en Vivo', icon: <Tv /> },
    { href: '/cancha', label: 'Pizarra Táctica', icon: <LayoutDashboard /> },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Image src="/logofu.png" alt="Liga Futsal Logo" width={32} height={32} />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-red-700 group-hover:via-red-600 group-hover:to-red-700 transition-all duration-300">
                  Liga Canaria Futsal
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Pasión por el Futsal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 transition-all duration-300 group rounded-lg hover:bg-red-50/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-4">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {adminLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen
              ? 'max-h-96 opacity-100 pb-4'
              : 'max-h-0 opacity-0 pb-0'
          }`}
        >
          <div className="space-y-2 px-2 pt-4">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 transform hover:translate-x-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                  transition: `all 0.3s ease-in-out ${index * 100}ms`
                }}
              >
                {item.name}
              </Link>
            ))}
             <div className="mt-4 border-t pt-4">
                {adminLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
