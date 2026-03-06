import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, TrendingUp, Users, CheckCircle2, Factory, Star, Quote, ChevronLeft, ChevronRight, Leaf, HeadphonesIcon, Award, Pickaxe, Droplets, ScrollText, HardHat, Sprout, FlaskConical, MessageSquare, ShieldCheck, RefreshCw, Truck, Building2, BookOpen } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Markdown from 'react-markdown';
import { trackEvent, cn, getSafeTimestamp, getProductImageUrl } from '@/src/lib/utils';
import { Product, Testimonial } from '@/src/types';

const AnimatedStat = ({ value }: { value: string }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    if (isInView && target !== null) {
      let startTimestamp: number;
      const duration = 2000; // 2 seconds
      let animationFrameId: number;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * target));
        
        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      
      animationFrameId = window.requestAnimationFrame(step);
      
      return () => {
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isInView, target]);

  if (target === null) return <span ref={ref}>{value}</span>;

  return <span ref={ref}>{count}{suffix}</span>;
};

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Halo! Saya asisten AI dari PT Indeks Industri. Ada yang bisa saya bantu terkait kebutuhan material atau pengelolaan limbah Anda?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const productsScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: 'left' | 'right') => {
    if (productsScrollRef.current) {
      const scrollAmount = 400; // Approximate card width + gap
      productsScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    trackEvent('page_view', '/');
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)));
    
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data));
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center overflow-hidden pt-28 pb-32 lg:pt-32 lg:pb-16">
        {/* Industrial Background with Blue Overlay */}
        <div className="absolute inset-0 bg-blue-950">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://picsum.photos/seed/industrial-plant-heavy/1920/1080?grayscale" 
            alt="Industrial Background" 
            className="w-full h-full object-cover object-[75%_center] mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/85 to-indigo-950/95" />
          
          {/* Animated Particles/Glow */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"
          />
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
              x: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          {/* Content (Text) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-blue-400/30 text-blue-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md bg-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              <ShieldCheck size={14} className="text-blue-400" />
              <span>Supplier Material Industri Terpercaya</span>
            </motion.div>
            
            <h1 className="text-[40px] sm:text-[52px] lg:text-[72px] font-black text-white leading-[1.05] mb-6 tracking-tighter drop-shadow-2xl">
              Standar Baru dalam<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200">Supply Kapur Industri</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-blue-100/90 mb-8 leading-relaxed max-w-[600px] font-medium drop-shadow">
              PT Indeks Industri Indonesia menyediakan Quicklime (CaO), Hydrated Lime (CaOH₂), dan Calcium Carbonate berkualitas tinggi dengan supply stabil, kontrol kualitas ketat, dan dukungan penuh.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link 
                to="/kontak#request-quote" 
                className="bg-blue-600 text-white px-8 py-4 rounded-none font-black text-base hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Request Quote <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="https://wa.me/6282119723498" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', '/')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-none font-black text-base hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Hubungi WhatsApp
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 max-w-2xl">
              {[
                { icon: <Factory size={16} />, text: 'Kapasitas 5000+ Ton/Bulan' },
                { icon: <ShieldCheck size={16} />, text: 'Quality Control Ketat (COA)' },
                { icon: <Truck size={16} />, text: 'Pengiriman Seluruh Indonesia' },
                { icon: <Building2 size={16} />, text: 'Dipercaya Industri Nasional' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                  className="flex items-center gap-3 text-white group cursor-default"
                >
                  <div className="w-10 h-10 rounded-none bg-blue-800/50 flex items-center justify-center shrink-0 border border-blue-400/20 group-hover:bg-blue-600 transition-colors shadow-inner">
                    <div className="text-blue-200 group-hover:text-white transition-colors">{item.icon}</div>
                  </div>
                  <span className="text-sm font-semibold leading-snug opacity-90 group-hover:opacity-100 transition-opacity">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Stats Card (Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="hidden lg:block absolute bottom-0 right-0 max-w-[800px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-none p-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-l border-white/20 dark:border-slate-700/50 z-20 transition-colors"
        >
          <div className="grid grid-cols-4 gap-8">
            {[
              { label: 'Kapasitas Produksi', value: '600+', unit: 'Ton/Bulan' },
              { label: 'Klien Industri', value: '200+', unit: 'Perusahaan' },
              { label: 'Pengalaman', value: '15+', unit: 'Tahun' },
              { label: 'Layanan', value: '24/7', unit: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center relative group">
                {i !== 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-200 dark:bg-slate-800" />}
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"><AnimatedStat value={stat.value} /></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 transition-colors">{stat.label}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest transition-colors">{stat.unit}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mobile Stats Section */}
      <section className="lg:hidden py-10 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Kapasitas Produksi', value: '600+', unit: 'Ton/Bulan' },
              { label: 'Klien Industri', value: '200+', unit: 'Perusahaan' },
              { label: 'Pengalaman', value: '15+', unit: 'Tahun' },
              { label: 'Layanan', value: '24/7', unit: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-slate-50 dark:bg-slate-900 p-4 rounded-none border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 transition-colors"><AnimatedStat value={stat.value} /></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">{stat.label}</div>
                <div className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest transition-colors mt-1">{stat.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Profile / About Us Section */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image/Visual Side */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] md:aspect-square rounded-none overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/company-profile/800/1000?grayscale" 
                  alt="Fasilitas Pabrik PT Indeks Industri Indonesia" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-8 -right-8 md:bottom-12 md:-right-12 bg-blue-600 dark:bg-blue-800 p-8 rounded-none shadow-xl hidden sm:block transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-none flex items-center justify-center backdrop-blur-sm">
                    <Shield className="text-white" size={28} />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white mb-1">100%</div>
                    <div className="text-blue-100 text-xs font-bold uppercase tracking-widest">Kualitas Terjamin</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors">
                <Users size={14} />
                <span>Tentang Perusahaan</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] transition-colors">
                Mitra Strategis untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Pertumbuhan Industri</span> Anda
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                PT Indeks Industri Indonesia bukan sekadar pemasok material. Kami adalah mitra yang memahami bahwa kualitas bahan baku dan efisiensi pengelolaan limbah adalah kunci keberhasilan operasional pabrik Anda.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 transition-colors">
                    <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Kualitas Konsisten</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Spesifikasi teknis yang presisi untuk setiap batch pengiriman.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-none bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 transition-colors">
                    <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Solusi Berkelanjutan</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Layanan pemusnahan limbah non-B3 yang ramah lingkungan.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  to="/tentang-kami" 
                  className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  Pelajari Lebih Lanjut Tentang Kami 
                  <span className="w-8 h-8 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-24 bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900 relative overflow-hidden transition-colors border-t border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400 dark:bg-blue-600 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400 dark:bg-indigo-600 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
              <Factory size={14} />
              <span>Sektor Industri</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6 transition-colors">
              Dipercaya Berbagai Sektor Industri di Seluruh Indonesia
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              Produk kapur industri kami mendukung operasional berbagai sektor vital, dengan kualitas konsisten, supply stabil, dan standar industri yang ketat.
            </p>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
            
            {/* Left Grid (Cards) */}
            <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Pickaxe size={24} />,
                  title: 'Pertambangan',
                  desc: 'Digunakan untuk stabilisasi pH, pengolahan mineral, dan proses ekstraksi logam secara efisien.'
                },
                {
                  icon: <Droplets size={24} />,
                  title: 'Pengolahan Air',
                  desc: 'Solusi ideal untuk netralisasi air limbah, penyesuaian pH, dan proses water treatment industri.'
                },
                {
                  icon: <FlaskConical size={24} />,
                  title: 'Manufaktur Kimia',
                  desc: 'Bahan baku penting dalam produksi berbagai senyawa kimia dan proses manufaktur lanjutan.'
                },
                {
                  icon: <ScrollText size={24} />,
                  title: 'Kertas & Pulp',
                  desc: 'Mendukung proses produksi pulp, pemutihan, dan peningkatan kualitas produk akhir.'
                },
                {
                  icon: <HardHat size={24} />,
                  title: 'Konstruksi',
                  desc: 'Digunakan dalam stabilisasi tanah, pengolahan material konstruksi, dan aplikasi teknik sipil.'
                },
                {
                  icon: <Sprout size={24} />,
                  title: 'Pertanian',
                  desc: 'Membantu meningkatkan kualitas tanah dan efisiensi pertumbuhan dalam aplikasi agrikultur.'
                }
              ].map((industry, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
                >
                  <div className="w-12 h-12 rounded-none bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                    <div className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300">
                      {industry.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 transition-colors">{industry.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    {industry.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 xl:col-span-4 hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-none overflow-hidden shadow-xl h-full min-h-[500px] group"
              >
                <img 
                  src="https://picsum.photos/seed/factory/800/1000?grayscale" 
                  alt="Fasilitas Industri" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-lg">
                    <ShieldCheck size={14} />
                    <span>Solusi Terpercaya untuk Industri</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <RefreshCw size={20} />, text: 'Supply Stabil dan Konsisten' },
              { icon: <ShieldCheck size={20} />, text: 'Standar Quality Control Ketat' },
              { icon: <Truck size={20} />, text: 'Distribusi ke Seluruh Indonesia' },
              { icon: <Building2 size={20} />, text: 'Dipercaya Berbagai Industri' },
            ].map((trust, i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-none border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-blue-600 dark:text-blue-400 shrink-0">
                  {trust.icon}
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{trust.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/kontak" 
              className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-none font-bold text-sm hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2 group"
            >
              Konsultasikan Kebutuhan Industri Anda
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/produk" 
              className="w-full sm:w-auto bg-transparent text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-8 py-4 rounded-none font-bold text-sm hover:border-slate-900 dark:hover:border-white transition-all flex items-center justify-center gap-2"
            >
              Lihat Produk Kami
            </Link>
          </div>

        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 transition-colors">Katalog Produk</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Produk Unggulan Kami</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 transition-colors">Kami menyediakan material industri dengan spesifikasi teknis tinggi untuk menjamin hasil produksi yang maksimal.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 mr-4">
                <button onClick={() => scrollProducts('left')} className="p-3 rounded-none border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-slate-600 text-slate-400 dark:text-slate-500 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => scrollProducts('right')} className="p-3 rounded-none border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-slate-600 text-slate-400 dark:text-slate-500 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
              <Link to="/produk" className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Lihat Semua Produk <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div 
            ref={productsScrollRef}
            className="grid grid-cols-2 lg:flex lg:flex-row lg:overflow-x-auto lg:snap-x lg:snap-mandatory gap-3 md:gap-8 lg:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-950 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group lg:min-w-[350px] lg:w-[400px] lg:shrink-0 lg:snap-start flex flex-col h-full"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={getProductImageUrl(product.image_url, product.updated_at, product.created_at)} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1 md:gap-2">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-0.5 md:px-3 md:py-1 rounded-none text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-white shadow-sm transition-colors">
                      {product.category}
                    </span>
                    {product.label && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-none text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {product.label}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 hidden lg:flex flex-col gap-2">
                    <span className="bg-emerald-500/90 backdrop-blur text-white px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <CheckCircle2 size={12} /> Ready Stock
                    </span>
                  </div>
                </div>
                <div className="p-3 md:p-8 flex flex-col flex-1">
                  <h4 className="text-sm md:text-xl font-black text-slate-900 dark:text-white mb-1 md:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 md:line-clamp-none">{product.name}</h4>
                  <div className="hidden lg:flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-medium transition-colors">(4.9/5)</span>
                  </div>
                  <p className="hidden md:block text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed transition-colors">
                    {product.description}
                  </p>
                  <div className="space-y-1 md:space-y-2 mb-4 md:mb-8 mt-auto">
                    <div className="flex flex-col md:flex-row md:justify-between text-[10px] md:text-xs border-b border-slate-50 dark:border-slate-800/50 pb-1 md:pb-2 transition-colors">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Supply</span>
                      <span className="text-slate-900 dark:text-blue-400 font-black transition-colors">{product.capacity}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between text-[10px] md:text-xs border-b border-slate-50 dark:border-slate-800/50 pb-1 md:pb-2 transition-colors">
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Min. Order</span>
                      <span className="text-slate-900 dark:text-white font-bold transition-colors">{product.min_order}</span>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2">
                    <Link 
                      to={`/produk/${product.slug}`}
                      className="w-full py-2 md:py-3 rounded-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-[10px] md:text-sm flex items-center justify-center gap-2 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-white transition-all flex-1"
                    >
                      Detail <ArrowRight size={14} className="hidden md:block" />
                    </Link>
                    <a 
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden lg:flex w-full py-3 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all flex-1"
                    >
                      Tanya Harga
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Center Spill Section */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 dark:bg-blue-900/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl shadow-blue-600/20">
                <BookOpen size={14} />
                <span>Knowledge Center</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase mb-8">
                PUSAT <span className="text-blue-600">PENGETAHUAN</span> <br />
                & WAWASAN INDUSTRI
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                Kami percaya bahwa edukasi adalah kunci efisiensi. Temukan artikel mendalam, panduan teknis, dan analisis pasar terbaru seputar industri kapur dan mineral.
              </p>
              
              <div className="space-y-6 mb-12">
                {[
                  { title: 'Artikel Informatif', desc: 'Wawasan mendalam tentang aplikasi kapur di berbagai sektor industri.' },
                  { title: 'Panduan Teknis', desc: 'Edukasi penggunaan material yang tepat untuk hasil maksimal.' },
                  { title: 'Update Industri', desc: 'Berita dan tren terbaru dalam dunia mineral dan manufaktur.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-none bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/knowledge" 
                className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group shadow-2xl"
              >
                Eksplorasi Pengetahuan <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Visual Grid for Knowledge Spill */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden group relative">
                    <img 
                      src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600" 
                      alt="Water Treatment" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Water Treatment</div>
                      <div className="text-xs font-black text-white uppercase tracking-tighter leading-tight">Pentingnya Kapur dalam Pengolahan Air</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-blue-600 p-8 flex flex-col justify-end">
                    <TrendingUp size={32} className="text-white mb-4" />
                    <div className="text-2xl font-black text-white tracking-tighter leading-none uppercase">15+ ARTIKEL BERLIAN</div>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square bg-slate-900 p-8 flex flex-col justify-between border border-slate-800">
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Update Terbaru</div>
                    <div className="text-xl font-black text-white tracking-tighter leading-tight uppercase">WAWASAN INDUSTRI PALING RELEVAN</div>
                  </div>
                  <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden group relative">
                    <img 
                      src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600" 
                      alt="Steel Industry" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Metallurgy</div>
                      <div className="text-xs font-black text-white uppercase tracking-tighter leading-tight">Peran Kapur dalam Industri Baja</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 hidden md:block">
                <div className="text-3xl font-black text-blue-600 tracking-tighter mb-1">FREE</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akses Edukasi</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Left Side: Sticky Header */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                <Shield size={14} />
                <span>Keunggulan Kami</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-tight transition-colors">
                Standar Baru dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Suplai Industri</span>
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 transition-colors">
                Kami tidak sekadar menjual produk, melainkan memberikan solusi komprehensif. Dari kualitas material hingga ketepatan pengiriman, setiap aspek layanan kami dirancang untuk memastikan efisiensi dan keberhasilan operasional bisnis Anda.
              </p>
              <Link 
                to="/tentang-kami" 
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3.5 rounded-none font-bold text-sm hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-blue-500/25 group w-fit"
              >
                Pelajari Lebih Lanjut 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Side: Feature Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {[
                  {
                    icon: <Shield className="text-blue-600 dark:text-blue-400" size={28} strokeWidth={1.5} />,
                    title: 'Kualitas Terjamin',
                    desc: 'Setiap produk melalui quality control ketat dan dilengkapi COA (Certificate of Analysis).',
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-100 dark:border-blue-800/50'
                  },
                  {
                    icon: <Zap className="text-emerald-600 dark:text-emerald-400" size={28} strokeWidth={1.5} />,
                    title: 'Pengiriman Cepat',
                    desc: 'Sistem logistik terintegrasi memastikan pengiriman tepat waktu ke seluruh Indonesia.',
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    border: 'border-emerald-100 dark:border-emerald-800/50'
                  },
                  {
                    icon: <TrendingUp className="text-orange-600 dark:text-orange-400" size={28} strokeWidth={1.5} />,
                    title: 'Harga Kompetitif',
                    desc: 'Skema kerjasama jangka panjang yang transparan dan saling menguntungkan.',
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    border: 'border-orange-100 dark:border-orange-800/50'
                  },
                  {
                    icon: <Leaf className="text-green-600 dark:text-green-400" size={28} strokeWidth={1.5} />,
                    title: 'Ramah Lingkungan',
                    desc: 'Pengelolaan limbah non-B3 yang sesuai standar regulasi dan berwawasan lingkungan.',
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-100 dark:border-green-800/50'
                  },
                  {
                    icon: <HeadphonesIcon className="text-purple-600 dark:text-purple-400" size={28} strokeWidth={1.5} />,
                    title: 'Layanan 24/7',
                    desc: 'Tim support siap melayani dan memberikan konsultasi teknis kapanpun dibutuhkan.',
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    border: 'border-purple-100 dark:border-purple-800/50'
                  },
                  {
                    icon: <Award className="text-amber-600 dark:text-amber-400" size={28} strokeWidth={1.5} />,
                    title: 'Berpengalaman',
                    desc: 'Lebih dari 15 tahun dipercaya oleh ratusan perusahaan manufaktur nasional.',
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-100 dark:border-amber-800/50'
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-start text-left p-8 rounded-none bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className={cn("w-14 h-14 rounded-none flex items-center justify-center mb-6 transition-colors duration-300 border", item.bg, item.border)}>
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 dark:bg-blue-600 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 dark:bg-blue-600 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 transition-colors">Testimoni Pelanggan</h2>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Apa Kata Mereka Tentang Kami?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4 transition-colors">Kepercayaan pelanggan adalah prioritas utama kami dalam menyediakan solusi industri terbaik.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                {/* Chat Bubble / Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-none shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all relative mb-6 flex-1">
                  <Quote className="absolute top-6 right-6 text-blue-100 dark:text-slate-800" size={40} />
                  <div className="flex items-center gap-1 mb-6 relative z-10">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star 
                        key={starIndex} 
                        size={16} 
                        className={cn(starIndex < testimonial.rating ? "text-orange-400 fill-orange-400" : "text-slate-200 dark:text-slate-700")} 
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 font-medium">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 px-2">
                  {testimonial.photo_url ? (
                    <img 
                      src={testimonial.photo_url} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-none object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-slate-900 dark:text-white font-bold text-sm transition-colors">{testimonial.name}</div>
                    <div className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest transition-colors">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section id="ai-assistant" className="py-24 pb-32 md:pb-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-950 rounded-none p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-16 items-center transition-colors">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
                <Zap size={14} />
                <span>AI Industrial Consultant</span>
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">Tanya Asisten AI Kami</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors">
                Dapatkan saran teknis instan mengenai penggunaan Hydrated Lime, Quicklime, atau solusi pengelolaan limbah untuk industri Anda.
              </p>
              <div className="space-y-4">
                {['Rekomendasi produk untuk water treatment?', 'Perbedaan quicklime vs hydrated lime?', 'Bagaimana cara pemesanan?', 'Hitung kebutuhan kapur untuk 1000 liter air'].map((q, i) => (
                  <button 
                    key={i}
                    onClick={async () => {
                      if (isTyping) return;
                      const query = q;
                      const newHistory = [...chatHistory, { role: 'user', text: query }];
                      setChatHistory(newHistory);
                      setIsTyping(true);
                      
                      try {
                        const { getIndustrialAdvice } = await import('@/src/services/geminiService');
                        const advice = await getIndustrialAdvice(query, newHistory.slice(0, -1));
                        setChatHistory([...newHistory, { role: 'model', text: advice }]);
                      } catch (error) {
                        setChatHistory([...newHistory, { role: 'model', text: 'Maaf, terjadi kesalahan. Silakan coba lagi.' }]);
                      } finally {
                        setIsTyping(false);
                      }
                    }}
                    className="block w-full text-left px-6 py-3 rounded-none bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-100 dark:hover:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTyping}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-900 dark:bg-slate-900 rounded-none p-6 shadow-2xl relative overflow-hidden flex flex-col h-[500px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-none -mr-16 -mt-16" />
                <div className="relative z-10 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-none flex items-center justify-center">
                      <Zap className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Indeks AI Consultant</div>
                      <div className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Online & Ready</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                >
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-none text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700 prose prose-invert prose-sm max-w-none'
                      }`}>
                        {msg.role === 'user' ? msg.text : <Markdown>{msg.text}</Markdown>}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 border border-slate-700 p-4 rounded-none flex gap-2 items-center">
                        <div className="w-2 h-2 bg-slate-500 rounded-none animate-bounce" />
                        <div className="w-2 h-2 bg-slate-500 rounded-none animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-slate-500 rounded-none animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements.namedItem('query') as HTMLInputElement);
                    if (!input.value.trim()) return;
                    
                    const query = input.value;
                    input.value = '';
                    
                    const newHistory = [...chatHistory, { role: 'user', text: query }];
                    setChatHistory(newHistory);
                    setIsTyping(true);
                    
                    try {
                      const { getIndustrialAdvice } = await import('@/src/services/geminiService');
                      const advice = await getIndustrialAdvice(query, newHistory.slice(0, -1));
                      setChatHistory([...newHistory, { role: 'model', text: advice }]);
                    } catch (error) {
                      setChatHistory([...newHistory, { role: 'model', text: 'Maaf, terjadi kesalahan. Silakan coba lagi.' }]);
                    } finally {
                      setIsTyping(false);
                    }
                  }}
                  className="flex gap-2 relative z-10 flex-shrink-0"
                >
                  <input 
                    id="ai-input"
                    name="query"
                    type="text" 
                    placeholder="Ketik pertanyaan teknis..." 
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-none px-5 py-4 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    disabled={isTyping}
                    className="bg-blue-600 text-white p-4 rounded-none hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POWERFUL CTA SECTION - REDESIGNED */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 dark:bg-blue-950 rounded-none p-8 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden text-center"
          >
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest">
                <Zap size={16} className="text-blue-400" />
                <span>Mulai Transformasi Bisnis Anda</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                Siap Meningkatkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Efisiensi Industri</span> Anda?
              </h2>
              
              <p className="text-lg md:text-xl text-blue-100/70 leading-relaxed max-w-2xl mx-auto">
                Jangan biarkan inefisiensi material menghambat produksi Anda. Konsultasikan kebutuhan pabrik Anda bersama tim ahli kami dan dapatkan solusi supply chain yang andal.
              </p>

              {/* Refined Button Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  to="/kontak#request-quote" 
                  className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-none font-black text-base hover:bg-blue-50/50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  Minta Penawaran <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a 
                  href="https://wa.me/6282119723498" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-none font-black text-base hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} /> WhatsApp
                </a>

                <Link 
                  to="/kontak#request-sample" 
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-none font-black text-base hover:bg-white/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <FlaskConical size={18} /> Request Sample
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-blue-200/60">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Respon Cepat 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200/60">
                  <ShieldCheck size={18} className="text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Jaminan Kualitas COA</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200/60">
                  <TrendingUp size={18} className="text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Harga Pabrik Terbaik</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
