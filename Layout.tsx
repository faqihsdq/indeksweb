import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Factory, ChevronRight, Home, Package, MessageSquare, User, Send, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from './ThemeProvider';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Produk', path: '/produk' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Industri', path: '/industri' },
    { name: 'Layanan Limbah', path: '/layanan-limbah' },
    { name: 'Kontak', path: '/kontak' },
  ];

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-navy-900 dark:bg-blue-600 rounded-none flex items-center justify-center transition-colors">
                <Factory className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight transition-colors">INDEKS INDUSTRI</span>
                <span className="text-[8px] md:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase transition-colors">Indonesia</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                  location.pathname === link.path ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={cycleTheme}
              className="p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
              title={`Current theme: ${theme}`}
            >
              {theme === 'light' && <Sun size={20} className="text-amber-500" />}
              {theme === 'dark' && <Moon size={20} className="text-blue-400" />}
              {theme === 'system' && <Monitor size={20} className="text-slate-500 dark:text-slate-400" />}
            </button>

            <Link
              to="/kontak#request-quote"
              className="bg-navy-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-none text-sm font-semibold hover:bg-navy-800 dark:hover:bg-blue-700 transition-all shadow-sm"
            >
              Request Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
              title={`Current theme: ${theme}`}
            >
              {theme === 'light' && <Sun size={20} className="text-amber-500" />}
              {theme === 'dark' && <Moon size={20} className="text-blue-400" />}
              {theme === 'system' && <Monitor size={20} className="text-slate-500 dark:text-slate-400" />}
            </button>
            <Link
              to="/kontak#request-quote"
              className="bg-navy-900 dark:bg-blue-600 text-white px-4 py-2 rounded-none text-xs font-semibold"
            >
              Quote
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top duration-300 transition-colors">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-none text-base font-medium transition-colors",
                  location.pathname === link.path ? "bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/kontak#request-quote"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-navy-900 dark:bg-blue-600 text-white px-3 py-3 rounded-none text-base font-semibold mt-4 transition-colors"
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};


export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/10 rounded-none flex items-center justify-center">
                <Factory className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">INDEKS INDUSTRI</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              PT Indeks Industri Indonesia adalah supplier terpercaya untuk Hydrated Lime, Quicklime, dan solusi limbah industri di Indonesia.
            </p>
            <div className="flex space-x-4">
              {/* Social icons could go here */}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Produk Utama</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/produk/hydrated-lime" className="hover:text-white transition-colors">Hydrated Lime</Link></li>
              <li><Link to="/produk/quicklime-cao" className="hover:text-white transition-colors">Quicklime (CaO)</Link></li>
              <li><Link to="/produk/kapur-tohor" className="hover:text-white transition-colors">Kapur Tohor</Link></li>
              <li><Link to="/layanan-limbah" className="hover:text-white transition-colors">Pemusnahan Limbah</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Perusahaan</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/industri" className="hover:text-white transition-colors">Industri Dilayani</Link></li>
              <li><Link to="/kontak" className="hover:text-white transition-colors">Kontak</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-blue-400 shrink-0" />
                <a href="tel:+6282119723498" className="hover:text-white transition-colors">+62 821 1972 3498</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-blue-400 shrink-0" />
                <a href="mailto:indeksindustri@gmail.com" className="hover:text-white transition-colors">indeksindustri@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 shrink-0" />
                <span className="text-slate-400">Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PT Indeks Industri Indonesia. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
