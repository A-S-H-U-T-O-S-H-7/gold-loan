'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const learnLinks = [
    { href: '/blogs', label: 'Blogs', icon: '/blog.png' },
    { href: '/reviews', label: 'Reviews', icon: '/review.png' },
    { href: '/faqs', label: 'FAQs', icon: '/faq.png' },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  return (
    <>
      {/* Contact Info Bar */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>9999-589-229</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat: 9AM-6PM</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>200+ Branches</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-linear-to-r from-amber-50 via-white to-amber-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/atdlogo.png"
                  alt="ATD Money Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-amber-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  ATD Money
                </h1>
                <p className="text-xs text-gray-600">Your Gold, Our Promise</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-2 py-1 leading-6 font-medium text-lg text-gray-700 transition-all duration-300 group"
                >
                  <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-linear-to-r after:from-amber-500 after:to-amber-600 after:left-0 after:-bottom-1 group-hover:after:w-full after:transition-all after:duration-300">
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* Learn Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsLearnDropdownOpen(true)}
                onMouseLeave={() => setIsLearnDropdownOpen(false)}
              >
                <button className="flex items-center font-medium text-lg text-gray-700 px-2 py-1 group cursor-pointer">
                  <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-linear-to-r after:from-amber-500 after:to-amber-600 after:left-0 after:-bottom-1 group-hover:after:w-full after:transition-all after:duration-300">
                    Learn
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`ml-1 transition-transform duration-300 ${isLearnDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                <AnimatePresence>
                  {isLearnDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute top-12 left-0 bg-white rounded-lg shadow-lg p-4 min-w-48 border border-amber-100"
                    >
                      <div className="flex flex-col text-sm gap-1">
                        {learnLinks.map((link) => (
                          <Link 
                            key={link.href}
                            href={link.href}
                            className="flex gap-2 items-center text-gray-800 hover:bg-amber-50 px-3 py-2 rounded-md transition-colors duration-300"
                          >
                            <img src={link.icon} alt={link.label} className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                            <FaArrowRightLong className="ml-auto text-amber-600" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/apply"
                className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Apply Now
              </Link>
              
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 font-medium py-2 border-b border-gray-100 last:border-b-0 relative group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-linear-to-r after:from-amber-500 after:to-amber-600 after:left-0 after:-bottom-1 group-hover:after:w-full after:transition-all after:duration-300">
                      {link.label}
                    </span>
                  </Link>
                ))}

                {/* Mobile Learn Dropdown */}
                <div className="border-b border-gray-100 pb-3">
                  <button
                    className="flex justify-between items-center w-full text-gray-700 font-medium py-2"
                    onClick={() => setIsLearnDropdownOpen(!isLearnDropdownOpen)}
                  >
                    <span>Learn</span>
                    <ChevronDown 
                      size={20} 
                      className={`transition-transform duration-300 ${isLearnDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {isLearnDropdownOpen && (
                    <div className="pl-4 mt-3 space-y-3">
                      {learnLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 text-gray-600 hover:text-amber-600 transition-colors duration-300 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <img src={link.icon} alt={link.label} className="w-5 h-5" />
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Link
                    href="/apply"
                    className="block bg-linear-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-md transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Apply Now
                  </Link>
                  <Link
                    href="/book-visit"
                    className="block bg-linear-to-r from-yellow-500 to-amber-500 text-white px-4 py-3 rounded-lg font-semibold text-center hover:shadow-md transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book your visit
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}