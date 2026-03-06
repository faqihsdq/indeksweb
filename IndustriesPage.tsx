import React, { useEffect, useState } from 'react';
import { Droplets, Construction, Zap, Factory, Shovel, Trash2, ArrowRight, CheckCircle2, ShieldCheck, Truck, Microscope, Settings, BookOpen, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { trackEvent, cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { Article } from '@/src/types';

export const IndustriesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('page_view', '/industri');
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    {
      icon: <Droplets className="text-blue-500" size={32} />,
      title: 'WATER & WASTEWATER',
      subtitle: 'Environmental Solutions',
      desc: 'Optimasi pengolahan air bersih dan limbah cair industri dengan presisi kimia tinggi.',
      details: [
        'Netralisasi pH air limbah asam',
        'Koagulasi & Flokulasi partikel',
        'Presipitasi logam berat',
        'Penghilangan kesadahan air'
      ],
      products: ['Hydrated Lime', 'Caustic Soda', 'Zeolite'],
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800'
    },
    {
      icon: <Factory className="text-orange-500" size={32} />,
      title: 'STEEL & METALLURGY',
      subtitle: 'Heavy Industry Backbone',
      desc: 'Meningkatkan efisiensi pemurnian logam dan kualitas produk akhir baja.',
      details: [
        'Fluxing agent pemurnian baja',
        'Desulfurisasi logam cair',
        'Ekstraksi mineral tambang',
        'Pelapis cetakan casting'
      ],
      products: ['Quicklime (CaO)', 'Dolomite', 'Bentonite'],
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: 'POWER & ENERGY',
      subtitle: 'Emission Control',
      desc: 'Solusi kepatuhan lingkungan untuk pengurangan emisi gas buang pembangkit listrik.',
      details: [
        'Desulfurisasi Gas Buang (FGD)',
        'Penyerapan emisi SO2 & SO3',
        'Filtrasi udara industri',
        'Pengolahan abu batubara'
      ],
      products: ['Quicklime', 'Hydrated Lime', 'Coal'],
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800'
    },
    {
      icon: <Construction className="text-emerald-500" size={32} />,
      title: 'CONSTRUCTION',
      subtitle: 'Infrastructure Stability',
      desc: 'Memperkuat fondasi infrastruktur nasional dengan material stabilisasi tanah unggulan.',
      details: [
        'Stabilisasi tanah lunak',
        'Campuran aspal hot-mix',
        'Produksi bata ringan (AAC)',
        'Bahan perekat mortar'
      ],
      products: ['Quicklime', 'Calcium Carbonate', 'Silica Sand'],
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
    },
    {
      icon: <Shovel className="text-stone-500" size={32} />,
      title: 'AGRICULTURE',
      subtitle: 'Soil Productivity',
      desc: 'Meningkatkan hasil panen dengan memperbaiki struktur dan kesuburan tanah pertanian.',
      details: [
        'Netralisasi keasaman tanah',
        'Penyedia nutrisi Kalsium',
        'Peningkatan struktur tanah',
        'Bahan campuran pupuk'
      ],
      products: ['Dolomite', 'Calcium Carbonate', 'Zeolite'],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
    },
    {
      icon: <Trash2 className="text-red-500" size={32} />,
      title: 'WASTE MANAGEMENT',
      subtitle: 'Circular Economy',
      desc: 'Layanan pemusnahan limbah industri yang aman dan sesuai regulasi lingkungan.',
      details: [
        'Pemusnahan limbah non-B3',
        'Stabilisasi limbah beracun',
        'Pengolahan lumpur industri',
        'Waste-to-energy support'
      ],
      products: ['Waste Disposal Service', 'Hydrated Lime'],
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const stats = [
    { label: 'SEKTOR INDUSTRI', value: '12+', icon: <Factory size={20} /> },
    { label: 'KAPASITAS SUPPLY', value: '50K+', sub: 'Ton/Bulan', icon: <Truck size={20} /> },
    { label: 'PRODUK TERUJI', value: '100%', sub: 'Lab Verified', icon: <Microscope size={20} /> },
    { label: 'REACH NASIONAL', value: '24/7', sub: 'Support', icon: <Settings size={20} /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors">
      {/* Hero Section - Powerful & Industrial */}
      <section className="relative pt-32 pb-48 bg-slate-900 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-blue-400/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md bg-blue-900/10">
                <ShieldCheck size={14} />
                <span>Industrial Excellence</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase">
                SOLUSI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">STRATEGIS</span> <br />
                INDUSTRI
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium mb-10">
                Kami menyediakan material esensial dan layanan teknis untuk mendukung operasional sektor industri paling kritis di Indonesia.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('industry-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-blue-600 text-white font-black rounded-none hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm"
                >
                  Eksplorasi Sektor
                </button>
                <Link to="/kontak" className="px-10 py-5 border border-slate-700 text-white font-black rounded-none hover:bg-slate-800 transition-all uppercase tracking-widest text-sm">
                  Konsultasi Teknis
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square bg-slate-800 border border-slate-700 p-4 rounded-none">
                <img 
                  src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1000" 
                  alt="Industrial Plant" 
                  className="w-full h-full object-cover grayscale opacity-50 contrast-125"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-8 -left-8 bg-blue-600 p-10 rounded-none shadow-2xl">
                  <div className="text-5xl font-black text-white mb-1 tracking-tighter">24/7</div>
                  <div className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">Supply Reliability</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-none overflow-hidden">
          {stats.map((stat, i) => (
            <div key={i} className={cn(
              "p-8 md:p-10 flex flex-col items-center text-center transition-colors",
              i !== stats.length - 1 && "border-r border-slate-100 dark:border-slate-800"
            )}>
              <div className="text-blue-600 dark:text-blue-400 mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
              {stat.sub && <div className="text-[9px] font-bold text-blue-500/70 mt-1 uppercase">{stat.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Industry Grid */}
      <section id="industry-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Settings size={12} />
              <span>Sector Expertise</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              EKOSISTEM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">YANG KAMI DUKUNG</span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
            Kami mengintegrasikan material berkualitas tinggi dengan pemahaman teknis mendalam untuk setiap sektor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-slate-200 dark:border-slate-800">
          {industries.map((industry, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full"
            >
              {/* Image Header */}
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={industry.image} 
                  alt={industry.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors" />
                <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 p-3 rounded-none shadow-xl border border-slate-100 dark:border-slate-800">
                  {industry.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">{industry.subtitle}</div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase group-hover:text-blue-600 transition-colors">{industry.title}</h3>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                  {industry.desc}
                </p>

                <div className="space-y-3 mb-10 flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Key Applications:</div>
                  {industry.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {industry.products.map((prod, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter border border-slate-200 dark:border-slate-700">
                        {prod}
                      </span>
                    ))}
                  </div>
                  <Link to="/produk" className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Lihat Produk <ArrowRight size={16} className="text-blue-600" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industrial Solutions Section */}
      <section className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
                MENGAPA MITRA <br />
                <span className="text-blue-500">MEMILIH KAMI?</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: 'KUALITAS TERSTANDARISASI', desc: 'Setiap batch produk melalui pengujian laboratorium ketat untuk memastikan konsistensi spesifikasi teknis.' },
                  { title: 'LOGISTIK TERINTEGRASI', desc: 'Armada pengiriman mandiri dan mitra logistik handal untuk menjamin ketepatan waktu distribusi ke seluruh Indonesia.' },
                  { title: 'KONSULTASI TEKNIS', desc: 'Tim ahli kami siap membantu optimasi dosis dan aplikasi produk di fasilitas produksi Anda.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-none bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-500 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-slate-800 border border-slate-700 rounded-none overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1000" 
                  alt="Industrial Logistics" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-8 bg-blue-600/90 backdrop-blur-sm text-white text-center rounded-none shadow-2xl">
                    <div className="text-4xl font-black mb-1 tracking-tighter">50,000+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Ton Kapasitas Bulanan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Standards Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Microscope size={12} />
              <span>Quality Assurance</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6">STANDAR TEKNIS KAMI</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Kami memastikan setiap produk memenuhi standar industri internasional untuk menjamin performa optimal di fasilitas Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'ASTM INTERNATIONAL', 
                desc: 'Kepatuhan penuh terhadap standar ASTM untuk kapur industri dan material konstruksi.',
                icon: <ShieldCheck className="text-blue-500" size={32} />
              },
              { 
                title: 'ISO 9001:2015', 
                desc: 'Sistem manajemen kualitas yang tersertifikasi untuk menjamin konsistensi layanan dan produk.',
                icon: <CheckCircle2 className="text-emerald-500" size={32} />
              },
              { 
                title: 'SNI (STANDAR NASIONAL)', 
                desc: 'Memenuhi seluruh regulasi teknis Standar Nasional Indonesia untuk keamanan dan performa.',
                icon: <Settings className="text-orange-500" size={32} />
              }
            ].map((std, i) => (
              <div key={i} className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none hover:border-blue-500 transition-colors group">
                <div className="mb-6">{std.icon}</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">{std.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wawasan Industri Section - News/Editorial Style */}
      <section className="py-32 bg-white dark:bg-slate-950 transition-colors border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <BookOpen size={12} />
                <span>Knowledge Center</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                WAWASAN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">INDUSTRI & EDUKASI</span>
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed italic">
              "Edukasi adalah kunci efisiensi operasional yang berkelanjutan."
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 mb-4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 w-3/4 mb-2" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {articles.slice(0, 3).map((article, i) => (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col h-full"
                >
                  <Link to={`/artikel/${article.slug}`} className="block overflow-hidden mb-6 relative aspect-[16/10]">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">
                        {article.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      {article.author}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    <Link to={`/artikel/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 font-medium line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link 
                      to={`/artikel/${article.slug}`} 
                      className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
                    >
                      Baca Selengkapnya <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-20 text-center">
            <Link 
              to="/knowledge" 
              className="inline-flex items-center gap-4 px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group shadow-2xl"
            >
              Eksplorasi Semua Pengetahuan <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Bold & Direct */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="bg-blue-600 p-12 md:p-24 text-center text-white relative overflow-hidden rounded-none shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none">
              SIAP MENGOPTIMALKAN <br />
              PRODUKSI ANDA?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Hubungi tim teknis kami untuk mendiskusikan bagaimana produk dan layanan kami dapat memberikan nilai tambah bagi operasional industri Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/kontak" className="px-12 py-6 bg-white text-blue-600 font-black text-lg rounded-none hover:bg-slate-100 transition-all shadow-xl uppercase tracking-widest">
                Konsultasi Sekarang
              </Link>
              <Link to="/produk" className="px-12 py-6 border-2 border-white text-white font-black text-lg rounded-none hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest">
                Katalog Produk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
