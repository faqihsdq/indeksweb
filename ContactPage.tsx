import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, FlaskConical, Building2, User, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '@/src/lib/utils';

export const ContactPage = () => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    subject: 'Permintaan Penawaran Harga',
    message: ''
  });

  const [sampleForm, setSampleForm] = useState({
    picName: '',
    company: '',
    position: '',
    email: '',
    whatsapp: '',
    product: 'Quicklime (CaO)',
    monthlyVolume: '',
    address: '',
    notes: ''
  });
  const [isSampleSubmitting, setIsSampleSubmitting] = useState(false);
  const [isSampleSuccess, setIsSampleSuccess] = useState(false);

  useEffect(() => {
    trackEvent('page_view', '/kontak');
  }, []);

  useEffect(() => {
    // Handle hash scrolling
    if (location.hash === '#request-sample') {
      setTimeout(() => {
        const element = document.getElementById('request-sample');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } else if (location.hash === '#request-quote') {
      setTimeout(() => {
        const element = document.getElementById('request-quote');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location.hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          whatsapp: formData.whatsapp,
          product_name: formData.subject,
          notes: formData.message,
          location: 'Contact Page Form'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          company: '',
          email: '',
          whatsapp: '',
          subject: 'Permintaan Penawaran Harga',
          message: ''
        });
        
        // Track event
        trackEvent('form_submission', '/kontak');
        
        // Optional: Redirect to WhatsApp after success
        const whatsappMsg = `Halo PT Indeks Industri Indonesia,\n\nSaya ${formData.name} dari ${formData.company}.\n\nSubjek: ${formData.subject}\nPesan: ${formData.message}\n\nMohon informasi lebih lanjut. Terima kasih.`;
        const encodedMsg = encodeURIComponent(whatsappMsg);
        setTimeout(() => {
          window.open(`https://wa.me/6282119723498?text=${encodedMsg}`, '_blank');
        }, 2000);
      } else {
        alert('Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Maaf, terjadi kesalahan koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSampleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSampleSubmitting(true);
    
    try {
      const response = await fetch('/api/sample-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleForm)
      });

      if (response.ok) {
        setIsSampleSuccess(true);
        trackEvent('sample_request', '/kontak');
        
        // Format the WhatsApp message as a receipt/confirmation
        const whatsappMsg = `*FORM PERMINTAAN SAMPLE PRODUK*\n\nHalo PT Indeks Industri Indonesia,\nSaya telah mengisi form permintaan sample di website dengan detail berikut:\n\n*Data PIC*\nNama: ${sampleForm.picName}\nPerusahaan: ${sampleForm.company}\nJabatan: ${sampleForm.position}\nEmail: ${sampleForm.email}\nWhatsApp: ${sampleForm.whatsapp}\n\n*Detail Kebutuhan*\nProduk: ${sampleForm.product}\nEstimasi Kebutuhan: ${sampleForm.monthlyVolume} Ton/Bulan\n\n*Alamat Pengiriman*\n${sampleForm.address}\n\n*Catatan*\n${sampleForm.notes || '-'}\n\nMohon informasi selanjutnya terkait pengiriman sample ini. Terima kasih.`;
        
        const encodedMsg = encodeURIComponent(whatsappMsg);
        setTimeout(() => {
          window.open(`https://wa.me/6282119723498?text=${encodedMsg}`, '_blank');
        }, 2000);
      } else {
        alert('Maaf, terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Maaf, terjadi kesalahan koneksi.');
    } finally {
      setIsSampleSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      {/* Header */}
      <section className="bg-slate-900 dark:bg-slate-950 pt-32 pb-48 relative overflow-hidden border-b border-slate-800 transition-colors">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-none -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-blue-400/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md bg-blue-900/10"
          >
            <Building2 size={14} />
            <span>Industrial Support</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight"
          >
            HUBUNGI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">KAMI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed transition-colors font-medium"
          >
            Konsultasikan kebutuhan material industri Anda dengan tim ahli kami. Kami siap memberikan solusi teknis dan penawaran harga terbaik untuk operasional bisnis Anda.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-none shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-6 transition-all hover:border-blue-500 group">
              <div className="w-14 h-14 rounded-none bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 transition-colors border border-blue-100 dark:border-blue-800 group-hover:bg-blue-600 group-hover:text-white">
                <Phone className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white mb-2 transition-colors uppercase tracking-widest text-xs">Telepon / WhatsApp</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 transition-colors leading-relaxed">Respon cepat via chat atau telepon untuk pertanyaan mendesak.</p>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/6282119723498" className="text-blue-600 dark:text-blue-400 font-black text-sm hover:underline flex items-center gap-2 transition-colors">
                    <MessageSquare size={16} /> WhatsApp Support
                  </a>
                  <a href="tel:+6282119723498" className="text-slate-900 dark:text-white font-black text-sm hover:underline flex items-center gap-2 transition-colors">
                    <Phone size={16} /> +62 821 1972 3498
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-none shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-6 transition-all hover:border-emerald-500 group">
              <div className="w-14 h-14 rounded-none bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 transition-colors border border-emerald-100 dark:border-emerald-800 group-hover:bg-emerald-600 group-hover:text-white">
                <Mail className="text-emerald-600 dark:text-emerald-400 group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white mb-2 transition-colors uppercase tracking-widest text-xs">Email Korespondensi</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 transition-colors leading-relaxed">Kirimkan dokumen penawaran atau kerjasama resmi.</p>
                <a href="mailto:indeksindustri@gmail.com" className="text-emerald-600 dark:text-emerald-400 font-black text-sm hover:underline transition-colors">indeksindustri@gmail.com</a>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-none shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-6 transition-all hover:border-orange-500 group">
              <div className="w-14 h-14 rounded-none bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 transition-colors border border-orange-100 dark:border-orange-800 group-hover:bg-orange-600 group-hover:text-white">
                <MapPin className="text-orange-600 dark:text-orange-400 group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white mb-2 transition-colors uppercase tracking-widest text-xs">Lokasi Kantor</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 transition-colors leading-relaxed">Kunjungi kantor operasional kami di wilayah strategis.</p>
                <p className="text-slate-900 dark:text-white font-black text-sm transition-colors">Jakarta, Indonesia</p>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-none shadow-xl text-white transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-none -mr-16 -mt-16" />
              <div className="flex items-center gap-3 mb-8">
                <Clock className="text-blue-400" size={20} />
                <h3 className="font-black uppercase tracking-widest text-sm">Jam Operasional</h3>
              </div>
              <div className="space-y-4 text-sm text-slate-400 dark:text-slate-300 transition-colors">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span>Senin - Jumat</span>
                  <span className="text-white font-bold">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span>Sabtu</span>
                  <span className="text-white font-bold">08:00 - 12:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Minggu</span>
                  <span className="text-red-400 font-bold uppercase tracking-tighter">Tutup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div id="request-quote" className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 md:p-16 rounded-none shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            
            {/* Quick Link to Sample Form */}
            <div className="mb-16 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 transition-colors border border-blue-200 dark:border-blue-800">
                  <FlaskConical className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-xl transition-colors tracking-tight uppercase">Uji Kualitas Material?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors mt-1">Dapatkan sample produk gratis untuk fasilitas industri Anda.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const element = document.getElementById('request-sample');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-black rounded-none transition-all whitespace-nowrap shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1"
              >
                REQUEST SAMPLE SEKARANG
              </button>
            </div>

            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Send size={12} />
                <span>Direct Inquiry</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter transition-colors uppercase">Kirim Pesan Langsung</h2>
              <p className="text-slate-500 dark:text-slate-400 transition-colors text-lg">Gunakan formulir di bawah ini untuk pertanyaan umum atau permintaan kerjasama strategis.</p>
            </div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10" 
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama Anda"
                        className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors">Nama Perusahaan</label>
                      <input 
                        type="text" 
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nama perusahaan Anda"
                        className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors">Alamat Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@perusahaan.com"
                        className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors">Nomor WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="08..."
                        className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors">Subjek Pesan</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-6 py-5 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold"
                    >
                      <option>Permintaan Penawaran Harga</option>
                      <option>Konsultasi Teknis Produk</option>
                      <option>Layanan Pemusnahan Limbah</option>
                      <option>Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] transition-colors">Pesan Anda</label>
                    <textarea 
                      rows={6} 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan detail kebutuhan Anda secara spesifik..."
                      className="w-full px-6 py-5 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-medium"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-slate-900 dark:bg-blue-600 text-white px-16 py-6 rounded-none font-black text-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-600/20 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                        MENGIRIM...
                      </>
                    ) : (
                      <>KIRIM PESAN SEKARANG <Send size={20} /></>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-24 h-24 bg-emerald-500 rounded-none flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">Pesan Terkirim!</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                      Terima kasih telah menghubungi kami. Data Anda telah tersimpan. <br />
                      <span className="font-bold text-blue-600">Membuka WhatsApp untuk konsultasi instan...</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-sm hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Request Sample Section */}
      <section id="request-sample" className="py-32 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-colors">
              <FlaskConical size={14} />
              <span>Material Testing</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter transition-colors uppercase">
              FORM PERMINTAAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">SAMPLE PRODUK</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto transition-colors font-medium">
              Kami memahami pentingnya pengujian material sebelum produksi massal. Isi formulir di bawah ini secara mendetail untuk mendapatkan sample produk gratis ke fasilitas industri Anda.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-8 md:p-16 rounded-none shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
            
            <AnimatePresence mode="wait">
              {!isSampleSuccess ? (
                <motion.form 
                  key="sample-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-16 relative z-10" 
                  onSubmit={handleSampleSubmit}
                >
                  {/* Section: Data PIC */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                      <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-none">
                        <User size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Data Penanggung Jawab (PIC)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Lengkap PIC *</label>
                        <input 
                          type="text" required value={sampleForm.picName} onChange={(e) => setSampleForm({ ...sampleForm, picName: e.target.value })}
                          placeholder="Nama penanggung jawab"
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jabatan *</label>
                        <input 
                          type="text" required value={sampleForm.position} onChange={(e) => setSampleForm({ ...sampleForm, position: e.target.value })}
                          placeholder="Contoh: Purchasing Manager / R&D"
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alamat Email *</label>
                        <input 
                          type="email" required value={sampleForm.email} onChange={(e) => setSampleForm({ ...sampleForm, email: e.target.value })}
                          placeholder="email@perusahaan.com"
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nomor WhatsApp *</label>
                        <input 
                          type="tel" required value={sampleForm.whatsapp} onChange={(e) => setSampleForm({ ...sampleForm, whatsapp: e.target.value })}
                          placeholder="08..."
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Detail Kebutuhan */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                      <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-none">
                        <Building2 size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Detail Kebutuhan Industri</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Perusahaan *</label>
                        <input 
                          type="text" required value={sampleForm.company} onChange={(e) => setSampleForm({ ...sampleForm, company: e.target.value })}
                          placeholder="PT / CV ..."
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Produk yang Diminta *</label>
                        <select 
                          value={sampleForm.product} onChange={(e) => setSampleForm({ ...sampleForm, product: e.target.value })}
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold"
                        >
                          <option>Quicklime (CaO)</option>
                          <option>Hydrated Lime (CaOH₂)</option>
                          <option>Calcium Carbonate (CaCO₃)</option>
                          <option>Lainnya (Tulis di catatan)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimasi Kebutuhan Bulanan (Ton) *</label>
                        <input 
                          type="number" required value={sampleForm.monthlyVolume} onChange={(e) => setSampleForm({ ...sampleForm, monthlyVolume: e.target.value })}
                          placeholder="Contoh: 100" min="1"
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Pengiriman */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                      <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-none">
                        <Truck size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Informasi Pengiriman</h3>
                    </div>
                    <div className="space-y-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alamat Pengiriman Lengkap *</label>
                        <textarea 
                          rows={4} required value={sampleForm.address} onChange={(e) => setSampleForm({ ...sampleForm, address: e.target.value })}
                          placeholder="Nama Jalan, Gedung/Pabrik, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-medium"
                        ></textarea>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Catatan Tambahan (Opsional)</label>
                        <textarea 
                          rows={3} value={sampleForm.notes} onChange={(e) => setSampleForm({ ...sampleForm, notes: e.target.value })}
                          placeholder="Spesifikasi khusus yang dibutuhkan, instruksi pengiriman, dll."
                          className="w-full px-6 py-4 rounded-none bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-medium"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSampleSubmitting}
                      className="w-full md:w-auto bg-blue-600 text-white px-16 py-6 rounded-none font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                      {isSampleSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                          MEMPROSES...
                        </>
                      ) : (
                        <>KIRIM PERMINTAAN SAMPLE <Send size={20} /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-24 space-y-10 relative z-10"
                >
                  <div className="w-32 h-32 bg-emerald-500 rounded-none flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                    <CheckCircle2 size={64} className="text-white" />
                  </div>
                  <div className="max-w-xl mx-auto">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase">Permintaan Diterima!</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed mb-10 font-medium">
                      Terima kasih atas ketertarikan Anda. Tim kami akan segera memproses permintaan sample produk Anda dan menghubungi via WhatsApp untuk konfirmasi pengiriman.
                    </p>
                    <button 
                      onClick={() => setIsSampleSuccess(false)}
                      className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-sm hover:underline"
                    >
                      Kirim permintaan baru
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};
