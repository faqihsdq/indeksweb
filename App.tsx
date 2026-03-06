import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WasteServicePage } from './pages/WasteServicePage';
import { IndustriesPage } from './pages/IndustriesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Package, MessageSquare, Send, Phone } from 'lucide-react';
import { cn } from './lib/utils';
import { ThemeProvider } from './components/ThemeProvider';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    
    {/* Mobile Bottom Navigation */}
    <BottomNav />
    
    {/* WhatsApp Floating Button */}
    <WhatsAppFAB />
  </div>
);

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Produk', path: '/produk', icon: Package },
    { name: 'AI Chat', path: '/#ai-assistant', icon: MessageSquare },
    { name: 'Kontak', path: '/kontak', icon: Send },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path.startsWith('/#') && location.hash === item.path.substring(1));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 transition-all",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Icon size={20} className={cn(isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const WhatsAppFAB = () => {
  return (
    <a 
      href="https://wa.me/6282119723498" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-110 transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100 dark:border-slate-700">
        Tanya Sales via WA
      </div>
      <Phone size={24} className="fill-white" />
    </a>
  );
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="indeks-theme">
      <Router>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/produk" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/produk/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/tentang-kami" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/kontak" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/industri" element={<PublicLayout><IndustriesPage /></PublicLayout>} />
            <Route path="/layanan-limbah" element={<PublicLayout><WasteServicePage /></PublicLayout>} />
            <Route path="/artikel/:slug" element={<PublicLayout><ArticleDetailPage /></PublicLayout>} />
            <Route path="/knowledge" element={<PublicLayout><KnowledgePage /></PublicLayout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}
