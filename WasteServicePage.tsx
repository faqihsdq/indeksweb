import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Factory, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Shield, 
  BarChart3, 
  Package, 
  RotateCcw, 
  AlertCircle, 
  Trash2, 
  Truck, 
  Settings, 
  Flame, 
  History, 
  Warehouse, 
  Briefcase, 
  Award,
  Phone, 
  Mail, 
  MapPin,
  Check,
  TrendingUp,
  FileSearch,
  BoxSelect,
  Archive,
  PhoneCall,
  FileCheck,
  Link as LinkIcon,
  MessageSquare,
  Zap,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

export const WasteServicePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    trackEvent('page_view', '/layanan-limbah');
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Database
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          product_name: 'Layanan Pengelolaan Material Industri',
          status: 'new'
        }),
      });

      if (!response.ok) throw new Error('Failed to save inquiry');

      // 2. Track Event
      trackEvent('form_submission', '/layanan-limbah');

      // 3. Construct WhatsApp Message
      const message = `Halo PT Indeks Industri Indonesia, saya ingin konsultasi mengenai Pengelolaan Material Industri.\n\n` +
        `*Detail Pengirim:*\n` +
        `- Nama: ${formData.name}\n` +
        `- Perusahaan: ${formData.company}\n` +
        `- WhatsApp: ${formData.whatsapp}\n` +
        `- Email: ${formData.email}\n\n` +
        `*Detail Material:*\n${formData.notes}\n\n` +
        `Mohon informasi lebih lanjut. Terima kasih.`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/6282119723498?text=${encodedMessage}`;

      // 4. Redirect to WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      
      setIsSuccess(true);
      setFormData({ name: '', company: '', whatsapp: '', email: '', notes: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp langsung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors font-sans selection:bg-blue-500 selection:text-white">
      
      {/* SECTION 1 — HERO (Modern & Controlled) */}
      <section className="relative min-h-[85vh] flex items-center bg-brand-gradient overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-gradient/20 rounded-none blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-none blur-[100px]"
          />
        </div>

        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="Industrial Facility" 
            className="w-full h-full object-cover mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                <ShieldCheck size={14} />
                <span>LAYANAN INDUSTRI TERINTEGRASI</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-[1.2] mb-6 tracking-tight">
                Solusi Profesional <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Pengelolaan Material Industri</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed max-w-xl opacity-90">
                Kami membantu perusahaan mengelola produk tidak layak edar dan material sisa produksi melalui proses industri terintegrasi yang aman, terdokumentasi, dan terkontrol secara profesional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/kontak" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-none font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-brand-solid/20 flex items-center justify-center gap-2 group"
                >
                  Konsultasikan Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/kontak" 
                  className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-none font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Request Penawaran
                </Link>
              </div>
            </motion.div>

            {/* Right Visual (Modern App Style Card) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-none blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-none shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-none bg-red-500/50" />
                      <div className="w-3 h-3 rounded-none bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-none bg-emerald-500/50" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Status: Active</div>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { text: 'Proses Terverifikasi', icon: <CheckCircle2 className="text-emerald-400" size={18} />, sub: 'Audit-ready documentation' },
                      { text: 'Fasilitas Industri Aktif', icon: <Factory className="text-blue-400" size={18} />, sub: 'High-capacity kiln processing' },
                      { text: 'Dokumentasi Lengkap', icon: <FileText className="text-indigo-400" size={18} />, sub: 'Full chain of custody reports' }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default"
                      >
                        <div className="w-10 h-10 rounded-none bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">{item.text}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{item.sub}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-none border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Trusted by 200+ Industries</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM AWARENESS (Modern Bento Grid) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.span {...fadeInUp} className="text-brand-solid dark:text-blue-400 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Tantangan Industri</motion.span>
            <motion.h2 {...fadeInUp} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-solid dark:text-white tracking-tight mb-6">
              Mengapa Pengelolaan Material Sisa Memerlukan Solusi Profesional?
            </motion.h2>
            <motion.div {...fadeInUp} className="w-16 h-1 bg-blue-600 mx-auto rounded-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              {...fadeInUp}
              className="md:col-span-2 p-8 bg-white dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-8 items-center group hover:shadow-xl transition-all"
            >
              <div className="w-20 h-20 rounded-none bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800/30 group-hover:scale-110 transition-transform">
                <AlertCircle className="text-amber-500" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Risiko Keamanan & Reputasi Merek</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
                  Material afkir atau produk kadaluarsa yang tidak dimusnahkan secara total berisiko jatuh ke pasar gelap, membahayakan konsumen, dan merusak integritas merek perusahaan Anda secara permanen.
                </p>
              </div>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="p-8 bg-white dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-none bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30 group-hover:rotate-12 transition-transform">
                <TrendingUp className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Efisiensi Biaya Gudang</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Penumpukan material sisa di area produksi atau gudang meningkatkan biaya operasional dan menghambat fleksibilitas logistik.
                </p>
              </div>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-none bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30 group-hover:-rotate-12 transition-transform">
                <FileSearch className="text-emerald-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Kepatuhan Audit & Regulasi</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Perusahaan memerlukan bukti dokumentasi yang sah dan transparan untuk memenuhi standar audit internal maupun regulasi industri.
                </p>
              </div>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 p-8 bg-slate-900 text-white rounded-none border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-none blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="w-20 h-20 rounded-none bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-blue-600 transition-colors">
                <Shield className="text-blue-400 group-hover:text-white" size={32} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Solusi Pemusnahan Terjamin</h3>
                <p className="text-slate-400 leading-relaxed text-sm lg:text-base">
                  Kami memberikan jaminan bahwa setiap material yang kami kelola akan melalui proses pemusnahan total di fasilitas industri kami, memastikan tidak ada material yang kembali ke pasar.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SOLUSI INDEKS (Modern Feature Grid) */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-none blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Metodologi Kami</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 leading-tight">
                Pendekatan Terintegrasi <br />
                <span className="text-slate-500">untuk Hasil Maksimal</span>
              </h2>
              <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-xl opacity-80">
                Kami menggabungkan infrastruktur fisik yang masif dengan sistem pelaporan digital untuk memberikan layanan pengelolaan material yang tidak tertandingi.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Fasilitas Tungku Aktif', icon: <Flame size={24} />, color: 'text-orange-400' },
                { title: 'Kapasitas Skala Besar', icon: <Zap size={24} />, color: 'text-blue-400' },
                { title: 'Audit-Ready Reports', icon: <FileCheck size={24} />, color: 'text-emerald-400' },
                { title: 'Global Standards', icon: <Globe size={24} />, color: 'text-indigo-400' }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className={`${item.color} mb-4`}>{item.icon}</div>
                  <div className="font-bold text-sm tracking-tight">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Infrastruktur Nyata', 
                desc: 'Pengelolaan dilakukan langsung di fasilitas tungku industri kami yang beroperasi 24/7.',
                icon: <Factory size={28} />
              },
              { 
                title: 'Sistem Terstruktur', 
                desc: 'Setiap tahap dari pengambilan hingga pemusnahan mengikuti protokol SOP yang ketat.',
                icon: <Settings size={28} />
              },
              { 
                title: 'Transparansi Penuh', 
                desc: 'Klien mendapatkan akses dokumentasi visual dan laporan resmi untuk setiap batch.',
                icon: <BarChart3 size={28} />
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-none group hover:border-blue-500/50 transition-all"
              >
                <div className="w-14 h-14 rounded-none bg-blue-600/20 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm lg:text-base opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — MATERIAL SCOPE (Modern Grid) */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Cakupan Material yang Kami Tangani
            </h2>
            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 opacity-80">
              Layanan kami mencakup berbagai kategori material industri dengan metode penanganan yang disesuaikan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Produk Konsumen Kadaluarsa', icon: <Package size={24} />, desc: 'FMCG, makanan, kosmetik, dll.', tags: ['FMCG', 'Retail'] },
              { title: 'Material Afkir Produksi', icon: <Trash2 size={24} />, desc: 'Sisa bahan baku, produk cacat.', tags: ['Manufacturing', 'QC'] },
              { title: 'Overstock Tidak Layak', icon: <Archive size={24} />, desc: 'Barang stok lama, produk retur.', tags: ['Inventory', 'Logistics'] },
              { title: 'Kemasan & Label Rusak', icon: <BoxSelect size={24} />, desc: 'Karton, plastik, botol bermerek.', tags: ['Branding', 'Packaging'] }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -8 }}
                className="p-8 bg-slate-50 dark:bg-slate-900 rounded-none border border-slate-100 dark:border-slate-800 flex flex-col gap-6 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-none bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed opacity-80 mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, j) => (
                      <span key={j} className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compliance Trust Bar */}
          <div className="mt-16 p-8 rounded-none bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="flex items-center gap-2 font-bold text-slate-400 text-sm">
              <ShieldCheck size={20} /> ISO 14001
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-400 text-sm">
              <ShieldCheck size={20} /> ISO 9001
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-400 text-sm">
              <ShieldCheck size={20} /> AMDAL Certified
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-400 text-sm">
              <ShieldCheck size={20} /> K3 Compliance
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PROSES KERJA (Modern Timeline) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Workflow</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Alur Kerja yang Efisien & Terkendali
            </h2>
            <motion.div {...fadeInUp} className="w-16 h-1 bg-blue-600 mx-auto rounded-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            {/* Desktop Connection Arrows */}
            <div className="absolute top-1/2 left-0 w-full hidden lg:flex justify-around -translate-y-1/2 pointer-events-none opacity-20">
              {[1, 2, 3].map(i => (
                <ArrowRight key={i} size={40} className="text-blue-600" />
              ))}
            </div>
            
            {[
              { 
                title: 'Konsultasi & Verifikasi', 
                icon: <PhoneCall size={24} />,
                desc: 'Analisis jenis material dan volume pengelolaan.'
              },
              { 
                title: 'Logistik Terjadwal', 
                icon: <Truck size={24} />,
                desc: 'Pengangkutan aman dari lokasi Anda ke fasilitas kami.'
              },
              { 
                title: 'Proses Pemusnahan', 
                icon: <Flame size={24} />,
                desc: 'Pemusnahan total di fasilitas tungku industri aktif.'
              },
              { 
                title: 'Pelaporan Resmi', 
                icon: <FileCheck size={24} />,
                desc: 'Penerbitan dokumen bukti pemusnahan (Certificate of Destruction).'
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white dark:bg-slate-800 p-8 rounded-none border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all z-10"
              >
                <div className="w-12 h-12 rounded-none bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 font-bold">
                  {i + 1}
                </div>
                <div className="text-blue-600 dark:text-blue-400 mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed opacity-80">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CASE STUDY (Modern Card) */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-none overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-slate-800">
            <div className="lg:w-1/2 relative min-h-[300px]">
              <img 
                src="https://images.unsplash.com/photo-1530124566582-ab35837534dc?q=80&w=2070&auto=format&fit=crop" 
                alt="Industrial Process" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-900/30" />
              <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-none">
                <div className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">Verified Case</div>
                <div className="text-emerald-400 font-bold text-base">100% Destruction Rate</div>
              </div>
            </div>
            <div className="lg:w-1/2 p-10 sm:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
                <History size={16} />
                <span>Pengalaman Nyata</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Pengelolaan Produk Konsumen Skala Besar
              </h3>
              <p className="text-base lg:text-lg text-slate-400 leading-relaxed mb-8 opacity-90">
                Kami telah sukses menangani pemusnahan produk popok sekali pakai kadaluarsa dalam volume besar. Melalui integrasi tungku industri kami, material dimusnahkan secara total tanpa sisa, menjamin keamanan merek klien kami.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-none bg-white/5 border border-white/10">
                  <div className="text-blue-400 font-bold text-xl mb-1 tracking-tight">50+ Ton</div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Volume Managed</div>
                </div>
                <div className="p-4 rounded-none bg-white/5 border border-white/10">
                  <div className="text-emerald-400 font-bold text-xl mb-1 tracking-tight">Full Report</div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Documentation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — WHY US (Modern Icon Grid) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Keunggulan PT Indeks Industri Indonesia
            </h2>
            <motion.div {...fadeInUp} className="w-16 h-1 bg-blue-600 mx-auto rounded-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { title: 'Fasilitas Mandiri', icon: <Warehouse size={28} />, desc: 'Memiliki infrastruktur gudang dan fasilitas pengolahan sendiri.' },
              { title: 'Keahlian Teknis', icon: <Award size={28} />, desc: 'Lebih dari 15 tahun pengalaman dalam operasional industri berat.' },
              { title: 'Keamanan Data', icon: <Lock size={28} />, desc: 'Kerahasiaan informasi produk dan proses klien terjaga sepenuhnya.' },
              { title: 'Monitoring Real-time', icon: <Eye size={28} />, desc: 'Klien dapat memantau proses pengelolaan melalui dokumentasi berkala.' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-none bg-white dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <div className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors">{item.icon}</div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed px-4 opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Client Logos Placeholder */}
          <div className="pt-16 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Trusted by Leading Industries</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale">
              <div className="text-2xl font-black tracking-tighter text-slate-400">FMCG CORP</div>
              <div className="text-2xl font-black tracking-tighter text-slate-400">RETAIL GIANT</div>
              <div className="text-2xl font-black tracking-tighter text-slate-400">LOGISTICS PRO</div>
              <div className="text-2xl font-black tracking-tighter text-slate-400">MANUFACTURING CO</div>
              <div className="text-2xl font-black tracking-tighter text-slate-400">GLOBAL BRAND</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — INTEGRATION (Modern Split) */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-none overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1565034946487-077786996e27?q=80&w=2070&auto=format&fit=crop" 
                  alt="Industrial Kiln" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-[0.3em] block">Infrastruktur Terintegrasi</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Sinergi Operasional <br />
                <span className="text-slate-400">dengan Fasilitas Produksi</span>
              </h2>
              <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed opacity-90">
                Sebagai produsen kapur aktif berskala nasional, kami mengintegrasikan layanan pengelolaan material ke dalam ekosistem industri kami. Ini memberikan efisiensi biaya yang lebih baik bagi klien dan jaminan pemusnahan yang jauh lebih aman dibandingkan metode konvensional.
              </p>
              <div className="flex items-start gap-4 p-6 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-none bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Keunggulan Integrasi</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 opacity-80">Proses pemusnahan dilakukan di lokasi yang sama dengan fasilitas produksi utama kami.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* SECTION 9 — CTA (Modern App Style) */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-none blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-none overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
          >
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side: Content */}
              <div className="p-12 sm:p-20 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-8 w-fit">
                  <Zap size={12} fill="currentColor" />
                  <span>Fast Response Guaranteed</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                  Siap Mengoptimalkan <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Material Industri Anda?</span>
                </h2>
                
                <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed opacity-90">
                  Jangan biarkan material sisa menghambat operasional Anda. Konsultasikan dengan tim ahli kami untuk solusi pemusnahan yang aman, legal, dan profesional.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/kontak" 
                    className="bg-blue-600 text-white px-8 py-4 rounded-none font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
                  >
                    Mulai Konsultasi <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a 
                    href="https://wa.me/6282119723498" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white px-8 py-4 rounded-none font-bold text-base hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} /> Chat WhatsApp
                  </a>
                </div>
                
                <div className="mt-10 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-none border-2 border-slate-900 overflow-hidden bg-slate-800">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Expert" className="w-full h-full object-cover grayscale" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    <span className="text-white font-bold">Tim Ahli Kami</span> siap membantu <br /> Anda dalam 24 jam ke depan.
                  </div>
                </div>
              </div>

              {/* Right Side: Visual App Element */}
              <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 p-12 lg:p-20 flex items-center justify-center border-l border-white/5">
                <div className="relative w-full max-w-sm">
                  {/* Mock Form/Card */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-none shadow-3xl relative z-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-none bg-blue-600 flex items-center justify-center text-white shadow-lg">
                        <PhoneCall size={24} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg leading-tight">Request Call</div>
                        <div className="text-slate-500 text-xs">Expert Consultation</div>
                      </div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {!isSuccess ? (
                        <motion.form 
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4" 
                          onSubmit={handleSubmit}
                        >
                          <input 
                            type="text" 
                            required
                            placeholder="Nama Lengkap..." 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-12 rounded-none bg-white/5 border border-white/10 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              required
                              placeholder="Nama Perusahaan..." 
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full h-12 rounded-none bg-white/5 border border-white/10 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                            />
                            <input 
                              type="tel" 
                              required
                              placeholder="No. WhatsApp..." 
                              value={formData.whatsapp}
                              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                              className="w-full h-12 rounded-none bg-white/5 border border-white/10 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                            />
                          </div>
                          <input 
                            type="email" 
                            required
                            placeholder="Email Bisnis..." 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 rounded-none bg-white/5 border border-white/10 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                          />
                          <textarea 
                            required
                            placeholder="Detail Material (Jenis, Volume, Lokasi)..." 
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full h-24 rounded-none bg-white/5 border border-white/10 p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 resize-none"
                          ></textarea>
                          
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-none font-bold text-sm shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              'Kirim Permintaan & Konsultasi WA'
                            )}
                          </button>
                        </motion.form>
                      ) : (
                        <motion.div 
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12 space-y-6"
                        >
                          <div className="w-20 h-20 bg-emerald-500 rounded-none flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                            <Check size={40} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">Permintaan Terkirim!</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                              Data Anda telah tercatat di sistem kami. <br />
                              Membuka WhatsApp untuk konsultasi...
                            </p>
                          </div>
                          <button 
                            onClick={() => setIsSuccess(false)}
                            className="text-blue-400 text-xs font-bold hover:underline"
                          >
                            Kirim permintaan lain
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Floating Badges */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-none shadow-2xl border border-slate-100 dark:border-slate-700 z-20 hidden sm:block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Check size={16} />
                      </div>
                      <div className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Verified Security</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -left-6 bg-blue-600 p-4 rounded-none shadow-2xl z-20 hidden sm:block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-white font-bold text-sm tracking-tight">24/7 Support</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      </section>
    </div>
  );
};
