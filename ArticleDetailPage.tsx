import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User, Share2, Bookmark, Clock, BookOpen, ArrowRight, Copy, Check, X } from 'lucide-react';
import Markdown from 'react-markdown';
import { Article } from '@/src/types';
import { trackEvent, cn } from '@/src/lib/utils';

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
      checkFavoriteStatus();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem('indeks_favorites') || '[]');
    setIsFavorited(favorites.includes(slug));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('indeks_favorites') || '[]');
    let newFavorites;
    if (favorites.includes(slug)) {
      newFavorites = favorites.filter((s: string) => s !== slug);
      setIsFavorited(false);
    } else {
      newFavorites = [...favorites, slug];
      setIsFavorited(true);
      trackEvent('article_favorite', slug || '');
    }
    localStorage.setItem('indeks_favorites', JSON.stringify(newFavorites));
  };

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: article?.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        trackEvent('article_share_native', slug || '');
      } catch (err) {
        console.log('Share cancelled or failed', err);
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    trackEvent('article_share_copy', slug || '');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${article?.title}\n\nBaca selengkapnya di: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    trackEvent('article_share_whatsapp', slug || '');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    trackEvent('article_share_linkedin', slug || '');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.title || '')}`, '_blank');
    trackEvent('article_share_twitter', slug || '');
  };

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        trackEvent('article_view', slug || '');
        
        // Fetch related articles (excluding current)
        const allResponse = await fetch('/api/articles');
        if (allResponse.ok) {
          const allData = await allResponse.json();
          setRelatedArticles(allData.filter((a: Article) => a.slug !== slug).slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/industri" className="text-blue-600 font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Kembali ke Industri
        </Link>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image_url,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "PT Indeks Industri Indonesia",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/favicon.ico`
      }
    },
    "datePublished": article.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  const keywords = `${article.category}, Industri Kapur, PT Indeks Industri Indonesia, ${article.title.split(' ').join(', ')}`;

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors font-sans selection:bg-blue-500 selection:text-white">
      <Helmet>
        <title>{`${article.title} | Knowledge Center - PT Indeks Industri Indonesia`}</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image_url} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={article.title} />
        <meta property="twitter:description" content={article.excerpt} />
        <meta property="twitter:image" content={article.image_url} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Editorial Hero Header */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/industri" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Wawasan Industri
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6">
              {article.category}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-8 uppercase">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-none flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Penulis</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{article.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-none flex items-center justify-center text-slate-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diterbitkan</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-none flex items-center justify-center text-slate-400">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Baca</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">5 Menit</div>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 relative">
                <button 
                  onClick={handleShare}
                  className="p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-400 hover:text-blue-600"
                  title="Bagikan"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={toggleFavorite}
                  className={cn(
                    "p-3 border transition-colors",
                    isFavorited 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                  title={isFavorited ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                >
                  <Bookmark size={18} fill={isFavorited ? "currentColor" : "none"} />
                </button>

                {/* Custom Share Menu Dropdown */}
                <AnimatePresence>
                  {showShareMenu && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowShareMenu(false)}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bagikan Artikel</span>
                          <button onClick={() => setShowShareMenu(false)} className="text-slate-400 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={shareToWhatsApp}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                              <Share2 size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">WhatsApp</span>
                          </button>
                          <button 
                            onClick={shareToLinkedIn}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-blue-500/10 text-blue-500 flex items-center justify-center">
                              <Share2 size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn</span>
                          </button>
                          <button 
                            onClick={shareToTwitter}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white flex items-center justify-center">
                              <Share2 size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Twitter (X)</span>
                          </button>
                          <button 
                            onClick={copyToClipboard}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {copied ? 'Tersalin!' : 'Salin Tautan'}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-[21/9] overflow-hidden relative shadow-2xl"
        >
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/10" />
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Sidebar - Sticky Info */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-32 space-y-12">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Topik Terkait</h4>
                <div className="flex flex-wrap gap-2">
                  {['Industri', 'Kapur', 'Edukasi', 'Kimia', 'Lingkungan'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-600 text-white">
                <BookOpen size={24} className="mb-4" />
                <h4 className="font-black text-sm uppercase tracking-widest mb-2">Butuh Konsultasi?</h4>
                <p className="text-xs text-blue-100 mb-6 leading-relaxed">Dapatkan solusi teknis terbaik untuk kebutuhan industri Anda langsung dari ahlinya.</p>
                <Link to="/kontak" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
                  Hubungi Kami <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg prose-strong:text-slate-900 dark:prose-strong:text-white prose-img:shadow-xl">
              <Markdown>{article.content}</Markdown>
            </div>

            {/* Article Footer */}
            <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bagikan Artikel</div>
                <div className="flex gap-4">
                  <button onClick={shareToWhatsApp} className="text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">WhatsApp</button>
                  <button onClick={shareToLinkedIn} className="text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">LinkedIn</button>
                  <button onClick={shareToTwitter} className="text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">Twitter</button>
                  <button onClick={copyToClipboard} className="text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">
                    {copied ? 'Tersalin!' : 'Salin Tautan'}
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar - Related Articles */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Artikel Lainnya</h4>
              <div className="space-y-10">
                {relatedArticles.map(rel => (
                  <Link key={rel.id} to={`/artikel/${rel.slug}`} className="group block">
                    <div className="aspect-video overflow-hidden mb-4">
                      <img 
                        src={rel.image_url} 
                        alt={rel.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{rel.category}</div>
                    <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                      {rel.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6">DAPATKAN WAWASAN TERBARU</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Berlangganan buletin kami untuk mendapatkan update industri dan edukasi material langsung ke email Anda.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email Bisnis Anda..." 
              className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
            />
            <button className="px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
              Berlangganan
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
