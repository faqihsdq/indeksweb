import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Package, Zap, Star, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent, cn, getSafeTimestamp, getProductImageUrl } from '@/src/lib/utils';
import { Product } from '@/src/types';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  useEffect(() => {
    trackEvent('page_view', '/produk');
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'Semua Kategori' || 
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['Semua Kategori', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="bg-[#F0F3F7] dark:bg-slate-950 min-h-screen pb-24 transition-colors">
      {/* Marketplace Banner / Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-blue-900 py-12 md:py-20 transition-colors duration-500">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-white/[0.02] bg-[center_top_-1px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <Zap size={12} className="text-yellow-300" />
                <span>Official Industrial Supplier</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter"
              >
                Katalog Produk <span className="text-blue-200">Terlengkap</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-blue-100 text-sm md:text-lg opacity-90 mb-8"
              >
                Dapatkan material industri kualitas premium dengan harga pabrik langsung. Pengiriman aman ke seluruh wilayah Indonesia dengan kapasitas supply hingga 10.000+ Ton/Bulan.
              </motion.p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link to="/kontak#request-quote" className="px-6 py-3 bg-white text-blue-700 font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg">
                  Minta Penawaran Cepat
                </Link>
                <button className="px-6 py-3 border border-white/30 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                  Download Katalog PDF
                </button>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                { icon: <ShieldCheck className="text-emerald-400" />, title: 'QC Terjamin', desc: 'Sertifikat COA' },
                { icon: <Truck className="text-blue-300" />, title: 'Logistik Aman', desc: 'Armada Sendiri' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-none border border-white/10 w-40">
                  <div className="mb-2">{item.icon}</div>
                  <div className="text-white font-bold text-xs">{item.title}</div>
                  <div className="text-blue-200 text-[10px]">{item.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-12 relative z-20">
        {/* Search & Filter Bar - Marketplace Style */}
        <div className="bg-white dark:bg-slate-900 rounded-none shadow-xl border border-slate-100 dark:border-slate-800 p-1.5 md:p-3 mb-6 md:mb-8 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-1.5 md:gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari kapur, batubara, atau layanan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 rounded-none border border-transparent bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-sm font-medium outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 md:py-4 rounded-none bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border border-transparent focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors appearance-none text-sm outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Chips / Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 shrink-0">Populer:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-none text-xs font-bold whitespace-nowrap transition-all border",
                selectedCategory === cat 
                  ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-md shadow-blue-600/20" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-none aspect-[3/4] animate-pulse transition-colors" />
            ))}
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-slate-900 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group flex flex-col h-full relative border-b-4 border-b-transparent hover:border-b-blue-600"
                    >
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={getProductImageUrl(product.image_url, product.updated_at, product.created_at)} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Marketplace Labels */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                          {product.label && (
                            <div className={cn(
                              "px-2 py-1 rounded-none text-[9px] font-black uppercase tracking-tighter shadow-sm flex items-center gap-1",
                              product.label === 'Best Seller' ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : 
                              product.label === 'New Arrival' ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" :
                              "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                            )}>
                              {product.label === 'Best Seller' && <Star size={10} fill="currentColor" />}
                              {product.label}
                            </div>
                          )}
                          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-none text-[9px] font-bold uppercase tracking-tighter text-brand-solid dark:text-white shadow-sm">
                            {product.category}
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-2.5 md:p-5 flex flex-col flex-1">
                        <h4 className="text-[10px] md:text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-brand-solid transition-colors min-h-[1.8rem] md:min-h-[3rem] leading-tight md:leading-normal">
                          {product.name}
                        </h4>
                        
                        {/* Industrial Price/Badge (Marketplace Style) */}
                        <div className="mt-1 mb-2.5 flex items-start justify-between gap-1">
                          <div>
                            <div className="text-blue-600 dark:text-blue-400 font-black text-[9px] md:text-sm uppercase tracking-tighter md:tracking-normal">
                              Harga Pabrik
                            </div>
                            <div className="flex items-center gap-0.5 md:gap-1 mt-0.5">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className="text-yellow-400 fill-yellow-400 md:w-2.5 md:h-2.5" />)}
                              </div>
                              <span className="text-[8px] md:text-[10px] text-slate-400 font-bold">(1rb+)</span>
                            </div>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 md:px-2 md:py-1 text-[7px] md:text-[9px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-0.5 shrink-0">
                            <ShieldCheck size={8} className="md:w-2.5 md:h-2.5" /> Ready
                          </div>
                        </div>

                        {/* Specs Summary */}
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-2 md:p-3 mb-3 mt-auto border border-slate-100 dark:border-slate-800/50">
                          <div className="space-y-1.5 md:space-y-2">
                            <div className="flex items-start justify-between text-[8px] md:text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 md:pb-2">
                              <span className="flex items-center gap-1 mt-0.5 shrink-0 font-bold uppercase tracking-widest"><Zap size={8} className="text-blue-500 dark:text-blue-400 md:w-2.5 md:h-2.5" /> Spek</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300 text-right line-clamp-1 md:line-clamp-2">{product.specs}</span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] md:text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 md:pb-2">
                              <span className="flex items-center gap-1 font-bold uppercase tracking-widest"><Package size={8} className="text-blue-500 dark:text-blue-400 md:w-2.5 md:h-2.5" /> Supply</span>
                              <span className="font-black text-blue-600 dark:text-blue-400">{product.capacity}</span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] md:text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 md:pb-2">
                              <span className="flex items-center gap-1 font-bold uppercase tracking-widest"><Truck size={8} className="text-blue-500 dark:text-blue-400 md:w-2.5 md:h-2.5" /> Min</span>
                              <span className="font-black text-slate-800 dark:text-slate-200">{product.min_order}</span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] md:text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1 font-bold uppercase tracking-widest"><ShieldCheck size={8} className="text-blue-500 dark:text-blue-400 md:w-2.5 md:h-2.5" /> QC</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">COA Ready</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-auto">
                          <Link 
                            to={`/produk/${product.slug}`}
                            className="py-1.5 md:py-2 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-[9px] md:text-[10px] flex items-center justify-center hover:bg-slate-200 transition-all"
                          >
                            Detail
                          </Link>
                          <Link 
                            to="/kontak#request-quote"
                            className="py-1.5 md:py-2 rounded-none bg-blue-600 text-white font-bold text-[9px] md:text-[10px] flex items-center justify-center hover:opacity-90 transition-all shadow-sm shadow-blue-600/20"
                          >
                            Beli
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center bg-white dark:bg-slate-900 rounded-none border border-slate-100 dark:border-slate-800"
              >
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-none flex items-center justify-center mx-auto mb-6">
                  <Search size={40} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Produk Tidak Ditemukan</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                  Maaf, kami tidak menemukan produk yang cocok dengan kata kunci "{searchQuery}".
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('Semua Kategori'); }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-none font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Reset Pencarian
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Bottom Trust Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="text-blue-600" size={32} />, title: 'Quality Assurance', desc: 'Setiap pengiriman disertai COA (Certificate of Analysis) resmi dari laboratorium independen untuk menjamin kemurnian material.' },
            { icon: <Truck className="text-blue-600" size={32} />, title: 'Logistik Terintegrasi', desc: 'Dukungan armada logistik mandiri (Dump Truck & Tronton) untuk memastikan jadwal pengiriman tepat waktu ke lokasi Anda.' },
            { icon: <Zap className="text-blue-600" size={32} />, title: 'Kapasitas Skala Besar', desc: 'Kapasitas produksi ribuan ton per bulan menjamin stabilitas supply material untuk operasional jangka panjang pabrik Anda.' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-none border border-slate-100 dark:border-slate-800 transition-colors border-l-4 border-l-blue-600">
              <div className="mb-4">{item.icon}</div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Ordering Guide Section */}
        <div className="mt-20 bg-slate-900 text-white p-8 md:p-16 rounded-none border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase">Prosedur Pemesanan Industri</h2>
              <p className="text-slate-400 font-medium">Langkah mudah untuk mendapatkan supply material berkualitas tinggi bagi perusahaan Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Inquiry', desc: 'Hubungi kami via WhatsApp atau Form Quote dengan detail spek & volume.' },
                { step: '02', title: 'Quotation', desc: 'Tim sales kami akan mengirimkan penawaran harga resmi (Quotation) dalam 1x24 jam.' },
                { step: '03', title: 'PO & Payment', desc: 'Penerbitan Purchase Order (PO) dan penyelesaian administrasi pembayaran.' },
                { step: '04', title: 'Delivery', desc: 'Pengiriman material ke lokasi sesuai jadwal yang telah disepakati.' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-black text-white/10 mb-4">{item.step}</div>
                  <h4 className="text-lg font-bold mb-2 text-blue-400">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section for Industrial Buyers */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase">Pertanyaan Umum (FAQ)</h2>
            <div className="space-y-4">
              {[
                { q: 'Apakah harga sudah termasuk ongkos kirim?', a: 'Harga kami bersifat fleksibel (FOB/CNF). Kami dapat menyertakan ongkos kirim ke lokasi Anda menggunakan armada logistik kami.' },
                { q: 'Berapa lama waktu pengiriman (Lead Time)?', a: 'Untuk wilayah Jababeka & sekitarnya, pengiriman dilakukan dalam 1-2 hari kerja setelah PO diterima.' },
                { q: 'Apakah bisa meminta sampel produk?', a: 'Ya, kami menyediakan sampel gratis untuk pengujian laboratorium perusahaan Anda. Silakan hubungi tim teknis kami.' },
                { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami menerima pembayaran via Transfer Bank (CBD/TOP) sesuai dengan kesepakatan kontrak kerjasama.' },
              ].map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 transition-colors">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" /> {faq.q}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-slate-900 p-8 md:p-12 border border-blue-100 dark:border-slate-800 flex flex-col justify-center transition-colors">
            <h3 className="text-2xl font-black text-blue-900 dark:text-blue-400 mb-6 tracking-tight uppercase">Butuh Bantuan Teknis?</h3>
            <p className="text-blue-800/70 dark:text-slate-400 mb-8 font-medium leading-relaxed">
              Tim ahli kami siap membantu Anda menentukan spesifikasi material yang paling tepat untuk proses industri Anda guna meningkatkan efisiensi dan menekan biaya produksi.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-blue-900 dark:text-slate-300 font-bold">
                <ShieldCheck className="text-blue-600 dark:text-blue-400" />
                <span>Konsultasi Dosis & Aplikasi</span>
              </div>
              <div className="flex items-center gap-4 text-blue-900 dark:text-slate-300 font-bold">
                <Package className="text-blue-600 dark:text-blue-400" />
                <span>Custom Packaging (Sack/Jumbo Bag)</span>
              </div>
              <div className="flex items-center gap-4 text-blue-900 dark:text-slate-300 font-bold">
                <Truck className="text-blue-600 dark:text-blue-400" />
                <span>Penjadwalan Supply Kontrak</span>
              </div>
            </div>
            <Link to="/kontak" className="mt-10 inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
              Hubungi Tim Teknis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
