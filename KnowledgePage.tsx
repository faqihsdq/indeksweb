import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  TrendingUp,
  Newspaper,
  Tag
} from 'lucide-react';
import { Article } from '../types';
import { cn } from '../lib/utils';

export const KnowledgePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [categories, setCategories] = useState<string[]>(['Semua']);

  useEffect(() => {
    fetchArticles();
    window.scrollTo(0, 0);
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setFilteredArticles(data);
        
        // Extract unique categories
        const cats = ['Semua', ...new Set(data.map((a: Article) => a.category))] as string[];
        setCategories(cats);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = articles;
    
    if (selectedCategory !== 'Semua') {
      result = result.filter(a => a.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.excerpt.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredArticles(result);
  }, [searchQuery, selectedCategory, articles]);

  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors font-sans selection:bg-blue-500 selection:text-white">
      <Helmet>
        <title>Knowledge Center | Wawasan Industri & Edukasi Kapur - PT Indeks Industri Indonesia</title>
        <meta name="description" content="Pusat pengetahuan industri kapur Indonesia. Temukan artikel teknis, panduan aplikasi, dan berita industri terbaru untuk optimasi operasional Anda." />
        <meta name="keywords" content="Knowledge Center, Industri Kapur, Edukasi Mineral, Water Treatment, Agriculture, Steel Industry, PT Indeks Industri Indonesia" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="Knowledge Center | PT Indeks Industri Indonesia" />
        <meta property="og:description" content="Pusat pengetahuan industri kapur Indonesia. Temukan artikel teknis dan panduan aplikasi terbaru." />
        <meta property="og:image" content={articles[0]?.image_url} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content="Knowledge Center | PT Indeks Industri Indonesia" />
        <meta property="twitter:description" content="Pusat pengetahuan industri kapur Indonesia. Temukan artikel teknis dan panduan aplikasi terbaru." />
        <meta property="twitter:image" content={articles[0]?.image_url} />
      </Helmet>

      {/* Hero Section - Featured Article */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                  <TrendingUp size={12} /> Terpopuler
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-8 uppercase">
                  {featuredArticle?.title}
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                  {featuredArticle?.excerpt}
                </p>
                <div className="flex items-center gap-6 mb-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{featuredArticle?.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">5 Maret 2026</span>
                  </div>
                </div>
                <Link 
                  to={`/artikel/${featuredArticle?.slug}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest hover:gap-5 transition-all group"
                >
                  Baca Selengkapnya <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="aspect-[4/3] overflow-hidden shadow-2xl relative group"
              >
                <img 
                  src={featuredArticle?.image_url} 
                  alt={featuredArticle?.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply group-hover:opacity-0 transition-opacity" />
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-slate-200 dark:border-slate-800 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Sidebar / Quick Access */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-12 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Newspaper size={20} className="text-blue-600" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Topik Hangat Pekan Ini</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingArticles.map((item, idx) => (
              <Link 
                key={item.id} 
                to={`/artikel/${item.slug}`}
                className="group flex gap-4 items-start"
              >
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 group-hover:text-blue-600 transition-colors leading-none">
                  0{idx + 1}
                </span>
                <div>
                  <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{item.category}</div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Filterable Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === cat 
                      ? "bg-blue-600 text-white" 
                      : "bg-transparent text-slate-400 hover:text-blue-600"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Cari Wawasan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-blue-600 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  layout
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link to={`/artikel/${article.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden mb-6">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1"><Calendar size={12} /> 5 Mar 2026</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> 5 Min</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white group-hover:gap-4 transition-all">
                      Baca Selengkapnya <ChevronRight size={14} className="text-blue-600" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredArticles.length === 0 && (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Tidak Ada Hasil</h3>
              <p className="text-slate-500">Coba gunakan kata kunci lain atau reset filter.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('Semua');}}
                className="mt-8 text-blue-600 font-black text-[10px] uppercase tracking-widest border-b-2 border-blue-600 pb-1"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <BookOpen size={14} /> Knowledge Subscription
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-8">
              JANGAN LEWATKAN <br />
              <span className="text-blue-600">WAWASAN BERHARGA</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Dapatkan kurasi artikel teknis, analisis pasar, dan update industri kapur langsung di kotak masuk Anda setiap minggu.
            </p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Bisnis Anda..." 
                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:border-blue-600 focus:bg-white/10 transition-all"
              />
              <button className="px-12 py-5 bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                Berlangganan Sekarang
              </button>
            </form>
            <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              *Kami menghargai privasi Anda. Tidak ada spam, hanya ilmu bermanfaat.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Meta */}
      <section className="py-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigasi Cepat:</div>
              <div className="flex gap-6">
                {['Terbaru', 'Populer', 'Arsip', 'Panduan'].map(item => (
                  <button key={item} className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-blue-600 transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ikuti Kami:</span>
              <div className="flex gap-3">
                {['LN', 'TW', 'IG'].map(social => (
                  <button key={social} className="w-8 h-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all">
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
