import React, { useEffect } from 'react';
import { Shield, Factory, Globe, ShieldCheck, ArrowRight, MessageSquare, Truck, Briefcase, ChevronRight, Target, Users, Zap, Award, Leaf, CheckCircle2, BarChart3, Microscope, HardHat, Building2, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { trackEvent, cn } from '@/src/lib/utils';

export const AboutPage = () => {
  useEffect(() => {
    trackEvent('page_view', '/tentang-kami');
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* SECTION 1 — HERO: Editorial / Magazine Style */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/industrial-complex/1920/1080?grayscale" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 rounded-none bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
                <div className="w-2 h-2 rounded-none bg-blue-500 animate-pulse"></div>
                <span>ESTABLISHED SINCE 2009</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                Building <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Industrial</span> <br />
                Legacy.
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl font-light">
                PT Indeks Industri Indonesia bukan sekadar produsen kapur. Kami adalah arsitek solusi material yang menggerakkan roda industri nasional dengan presisi dan integritas.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-white">15+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Years of <br/>Excellence</div>
                </div>
                <div className="w-px h-12 bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-white">500+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Industrial <br/>Partners</div>
                </div>
                <div className="w-px h-12 bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-white">24/7</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Supply Chain <br/>Reliability</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-10 bottom-20 hidden lg:block">
          <div className="writing-mode-vertical text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] rotate-180">
            PT INDEKS INDUSTRI INDONESIA — ABOUT US
          </div>
        </div>
      </section>

      {/* SECTION 2 — KEUNGGULAN PERUSAHAAN: Split Layout */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-sm font-bold text-brand-solid uppercase tracking-[0.3em] mb-4">Company Advantages</h2>
                <h3 className="text-4xl md:text-5xl font-black text-brand-solid dark:text-white leading-tight tracking-tight">
                  Mengapa Pemimpin Industri Memilih Kami?
                </h3>
              </div>
              
              <div className="space-y-8">
                {[
                  { 
                    title: 'Skala Produksi Masif', 
                    desc: 'Fasilitas produksi kami dirancang untuk memenuhi kebutuhan volume tinggi tanpa mengorbankan kecepatan pengiriman.',
                    icon: <Factory size={24} />
                  },
                  { 
                    title: 'Kustomisasi Spesifikasi', 
                    desc: 'Kami memahami setiap proses kimia berbeda. Kami menyediakan kapur dengan reaktivitas dan ukuran partikel yang disesuaikan.',
                    icon: <Target size={24} />
                  },
                  { 
                    title: 'Logistik Terintegrasi', 
                    desc: 'Armada mandiri dan jaringan logistik luas menjamin material sampai di silo Anda tepat waktu, setiap saat.',
                    icon: <Truck size={24} />
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-none overflow-hidden shadow-2xl rotate-3 scale-95 group hover:rotate-0 hover:scale-100 transition-all duration-700">
                <img 
                  src="https://picsum.photos/seed/industrial-tech/1000/1000" 
                  alt="Industrial Technology" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gradient/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — KEUNGGULAN PRODUK: Bento Grid Style */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Product Excellence</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Standar Mutu Tanpa Kompromi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-white dark:bg-slate-950 p-10 rounded-none border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-none bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                  <Microscope size={24} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Kemurnian CaO Tinggi</h4>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                  Produk kapur kami memiliki kadar kalsium oksida (CaO) yang konsisten di atas rata-rata pasar, memastikan efisiensi reaksi maksimal untuk proses industri Anda.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 text-sm font-bold text-blue-600">
                <span>LAB TESTED EVERY BATCH</span>
                <ArrowRight size={16} />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 p-10 rounded-none text-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-none bg-white/10 flex items-center justify-center text-blue-400 mb-6">
                  <BarChart3 size={24} />
                </div>
                <h4 className="text-2xl font-bold mb-4">Konsistensi Ukuran</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Distribusi ukuran partikel yang seragam untuk mencegah penyumbatan pada sistem dosing pabrik Anda.
                </p>
              </div>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-blue-600 p-10 rounded-none text-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-none bg-white/20 flex items-center justify-center text-white mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-2xl font-bold mb-4">Rendah Impuritas</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Kandungan silika dan magnesium yang sangat rendah untuk menjaga integritas peralatan produksi Anda.
                </p>
              </div>
            </motion.div>

            {/* Medium Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-white dark:bg-slate-950 p-10 rounded-none border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-10 items-center"
            >
              <div className="flex-1">
                <div className="w-12 h-12 rounded-none bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-6">
                  <Package size={24} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Packaging Premium</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Opsi kemasan mulai dari Bulk (Curah), Jumbo Bag 1 Ton, hingga 50kg dengan lapisan anti-lembab untuk menjaga kualitas kapur selama penyimpanan.
                </p>
              </div>
              <div className="w-full md:w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-none overflow-hidden">
                <img src="https://picsum.photos/seed/packaging/400/400" alt="Packaging" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SERTIFIKASI: High Trust Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/3">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Certifications</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight mb-6">Kepatuhan Terhadap Standar Global</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Operasional kami diaudit secara berkala untuk memastikan kepatuhan terhadap standar internasional dalam manajemen mutu, lingkungan, dan keselamatan kerja.
              </p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { title: 'ISO 9001:2015', label: 'Quality Management', color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'ISO 14001:2015', label: 'Environmental Management', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'ISO 45001:2018', label: 'Health & Safety', color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((cert, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-none border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center group hover:border-blue-500 transition-all"
                >
                  <div className={cn("w-20 h-20 mx-auto rounded-none flex items-center justify-center mb-6", cert.bg)}>
                    <ShieldCheck size={32} className={cert.color} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{cert.title}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cert.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — LAYANAN TERINTEGRASI: Modern List */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-[0.3em] mb-4">Integrated Services</h2>
              <h3 className="text-5xl font-black leading-tight tracking-tighter mb-8">Lebih Dari Sekadar <br/>Suplai Material.</h3>
              <p className="text-xl text-slate-400 font-light leading-relaxed mb-12">
                Kami menyediakan ekosistem layanan yang mendukung efisiensi operasional pabrik Anda dari hulu ke hilir.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: 'Konsultasi Teknis Aplikasi Produk', icon: <Microscope size={20} /> },
                  { title: 'Manajemen Logistik & Supply Chain', icon: <Truck size={20} /> },
                  { title: 'Solusi Pengelolaan Limbah Industri', icon: <Leaf size={20} /> },
                  { title: 'Optimasi Proses Kimia Industri', icon: <Zap size={20} /> },
                ].map((service, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group"
                  >
                    <div className="text-blue-400 group-hover:scale-110 transition-transform">{service.icon}</div>
                    <span className="font-bold text-slate-200">{service.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full"></div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-4">
                  <div className="h-64 rounded-none bg-slate-800 overflow-hidden">
                    <img src="https://picsum.photos/seed/service1/400/600" alt="Service" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="h-48 rounded-none bg-blue-600 flex items-center justify-center p-8 text-center">
                    <div className="text-2xl font-black">SOLUSI <br/>TERPADU</div>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="h-48 rounded-none bg-slate-700 overflow-hidden">
                    <img src="https://picsum.photos/seed/service2/400/400" alt="Service" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="h-64 rounded-none bg-slate-800 overflow-hidden">
                    <img src="https://picsum.photos/seed/service3/400/600" alt="Service" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TEAM & EXPERTISE */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Digerakkan Oleh Para Ahli</h3>
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              Kombinasi pengalaman lapangan dan inovasi teknologi.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Engineering', icon: <HardHat size={32} />, count: '20+' },
              { label: 'Quality Control', icon: <Shield size={32} />, count: '15+' },
              { label: 'Logistics', icon: <Truck size={32} />, count: '50+' },
              { label: 'Customer Success', icon: <Users size={32} />, count: '10+' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center group hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all"
              >
                <div className="text-blue-600 mb-6 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">{item.count}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label} Experts</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — STRONG CTA */}
      <section className="py-24 px-6 lg:px-10 bg-slate-50 dark:bg-slate-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto bg-blue-600 rounded-none p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Ready to Scale <br/>Your Industry?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-light">
              Jadilah bagian dari ratusan perusahaan yang telah mengoptimalkan produksi mereka bersama PT Indeks Industri Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                to="/kontak" 
                className="px-10 py-5 bg-white text-blue-600 rounded-none font-black text-lg transition-all flex items-center gap-3 group shadow-xl hover:scale-105 active:scale-95"
              >
                HUBUNGI KAMI SEKARANG <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// Re-using the lucide icon for consistency
const Package = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16.5 9.4 7.55 4.24"></path>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.29 7 12 12 20.71 7"></polyline>
    <line x1="12" y1="22" x2="12" y2="12"></line>
  </svg>
);

export default AboutPage;

