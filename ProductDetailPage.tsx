import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, MessageSquare, Phone, ShieldCheck, Truck, Star, Info, Package, Zap, ChevronRight, Share2, Heart, ArrowRight, Wifi, MapPin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent, cn, getSafeTimestamp, getProductImageUrl } from '@/src/lib/utils';
import { Product } from '@/src/types';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetch(`/api/products/${slug}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setActiveImage(data.image_url);
          setLoading(false);
          trackEvent('page_view', `/produk/${slug}`, data.id);
        })
        .catch(() => navigate('/produk'));

      fetch(`/api/products/${slug}/related`)
        .then(res => res.json())
        .then(data => setRelatedProducts(data))
        .catch(err => console.error('Error fetching related products:', err));
    }
  }, [slug, navigate]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#F0F3F7] dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Memuat Detail Produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F3F7] dark:bg-slate-950 min-h-screen pb-24 transition-colors">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/produk" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Produk</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 dark:text-slate-200 truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Gallery (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-none overflow-hidden border border-white dark:border-slate-800 shadow-lg relative bg-white dark:bg-slate-900 transition-colors"
              >
                <img 
                  key={activeImage}
                  src={getProductImageUrl(activeImage, product.updated_at, product.created_at)} 
                  alt={product.name} 
                  className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Labels on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.label && (
                    <span className={cn(
                      "px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-tighter shadow-lg flex items-center gap-1",
                      product.label === 'Best Seller' ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : 
                      product.label === 'New Arrival' ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" :
                      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                    )}>
                      {product.label}
                    </span>
                  )}
                </div>

                {/* Action Buttons on Image */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-10 h-10 rounded-none bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : ""} />
                  </button>
                  <button className="w-10 h-10 rounded-none bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                <div 
                  onClick={() => setActiveImage(product.image_url)}
                  className={cn(
                    "aspect-square rounded-none bg-white dark:bg-slate-900 overflow-hidden cursor-pointer transition-all border-2",
                    activeImage === product.image_url ? "border-blue-600 shadow-md" : "border-transparent hover:border-blue-400"
                  )}
                >
                  <img 
                    src={getProductImageUrl(product.image_url, product.updated_at, product.created_at)} 
                    alt={`${product.name} Main`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                {/* Removed random thumbnails that were confusing the user */}
              </div>
            </div>
          </div>

          {/* Middle Column: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-none border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">{product.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">4.9</span>
                  <span className="text-xs text-slate-400 font-medium">(120+ Terjual)</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight transition-colors">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 dark:bg-slate-800/50 rounded-none border border-blue-100 dark:border-slate-700/50 transition-colors">
                <Zap size={24} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-black text-lg">Harga Pabrik Langsung</div>
                  <div className="text-xs text-blue-500/70 dark:text-blue-400/50 font-bold">Hubungi kami untuk penawaran volume besar</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={16} className="text-blue-600" /> Deskripsi Produk
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-none bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Kapasitas Supply</div>
                    <div className="text-sm md:text-base font-bold text-slate-900 dark:text-white">{product.capacity}</div>
                  </div>
                  <div className="p-4 rounded-none bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Minimum Order</div>
                    <div className="text-sm md:text-base font-bold text-slate-900 dark:text-white">{product.min_order}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-none border border-slate-100 dark:border-slate-800 transition-colors">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" /> Spesifikasi Teknis
              </h3>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-none p-6 border border-slate-100 dark:border-slate-800 transition-colors">
                <p className="text-slate-700 dark:text-slate-300 font-mono text-xs md:text-sm whitespace-pre-line leading-relaxed">
                  {product.specs}
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-none bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all font-bold text-xs">
                  <Download size={16} /> Download COA
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-none bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all font-bold text-xs">
                  <Download size={16} /> Download MSDS
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Box (Marketplace Style) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-none shadow-xl border border-blue-100 dark:border-slate-800 transition-colors">
                <h3 className="font-black text-slate-900 dark:text-white mb-6">Atur Pesanan</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>Quality Control Terjamin</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Truck size={18} className="text-blue-500" />
                    <span>Pengiriman Seluruh Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Package size={18} className="text-orange-500" />
                    <span>Stok Selalu Tersedia</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setShowQuoteForm(true)}
                    className="w-full bg-blue-600 text-white py-4 rounded-none font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    Minta Penawaran <ArrowRight size={18} />
                  </button>
                  <a 
                    href={`https://wa.me/6282119723498?text=Halo Indeks Industri, saya tertarik dengan produk ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 text-white py-4 rounded-none font-black text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} /> Chat WhatsApp
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                    <span>Butuh Bantuan?</span>
                  </div>
                  <a href="tel:+6282119723498" className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-sm">
                    <Phone size={16} /> +62 821 1972 3498
                  </a>
                </div>
              </div>
              
              {/* Supplier Contact Card */}
              <div className="mt-6 bg-white dark:bg-slate-900 rounded-none overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg transition-colors">
                <div className="bg-slate-600 dark:bg-slate-800/80 px-5 py-3">
                  <h3 className="text-white font-bold text-sm tracking-tight">Kontak Supplier / Penjual</h3>
                </div>
                
                <div className="p-5 space-y-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-none border border-slate-100 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-950 p-2 shrink-0">
                      <div className="w-full h-full bg-blue-50 dark:bg-blue-900/40 rounded-none flex items-center justify-center">
                        <Package size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm leading-tight">PT. Indeks Industri Indonesia</h4>
                      <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-bold text-[10px]">
                        <Wifi size={12} className="rotate-45" />
                        <span>Online 0 Menit Lalu</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-none bg-emerald-500 text-white text-[9px] font-black uppercase tracking-tighter">
                      <CheckCircle2 size={10} />
                      <span>Verified Supplier</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-tighter border border-slate-200 dark:border-slate-700">
                      <Zap size={10} className="fill-blue-500 text-blue-500" />
                      <span>100 %</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                    Status Pajak: <span className="text-slate-700 dark:text-slate-200">Pengusaha Tidak Kena Pajak</span>
                  </div>

                  <div className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <MapPin size={18} className="shrink-0 text-slate-400" />
                    <p className="text-[10px] leading-relaxed font-medium">
                      Jl. Cikampek-Padalarang Kp. Wadon RT.001/RW009, Tenjolaut, Kec. Cikalong Wetan, Kabupaten Bandung Barat, Jawa Barat 40556 Wangunjaya, Cikalong Wetan, Kab. Bandung Barat, Jawa Barat
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <a href="tel:+6282119723498" className="flex flex-col items-center gap-2 p-3 rounded-none border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                      <div className="w-8 h-8 rounded-none bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <Phone size={16} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400">Telepon</span>
                    </a>
                    <a 
                      href={`https://wa.me/6282119723498?text=Halo Indeks Industri, saya tertarik dengan produk ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-none border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-none bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <MessageSquare size={16} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400">WhatsApp</span>
                    </a>
                    <button 
                      onClick={() => setShowQuoteForm(true)}
                      className="flex flex-col items-center gap-2 p-3 rounded-none border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-none bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Mail size={16} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400">Pesan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Produk Terkait</h2>
              <p className="text-slate-500 text-sm mt-1">Mungkin Anda juga membutuhkan ini</p>
            </div>
            <Link to="/produk" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <Link 
                key={p.id} 
                to={`/produk/${p.slug}`}
                className="bg-white dark:bg-slate-900 rounded-none border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={getProductImageUrl(p.image_url, p.updated_at, p.created_at)} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{p.name}</h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.category}</span>
                    <ArrowRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quote Modal */}
      <AnimatePresence>
        {showQuoteForm && (
          <QuoteModal 
            product={product} 
            onClose={() => setShowQuoteForm(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const QuoteModal = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    quantity: '',
    location: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {
      ...formData,
      product_id: product.id,
      product_name: product.name,
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSubmitted(true);
        trackEvent('form_submission', `/produk/${product.slug}`);
        
        // WhatsApp Redirect Logic (Same as Contact Page)
        const whatsappMsg = `*REQUEST QUOTE - WEBSITE*\n\nHalo PT Indeks Industri Indonesia,\nSaya tertarik untuk memesan produk berikut:\n\n*Produk:* ${product.name}\n*Nama:* ${formData.name}\n*Perusahaan:* ${formData.company}\n*Kebutuhan:* ${formData.quantity}\n*Lokasi:* ${formData.location}\n*Catatan:* ${formData.notes || '-'}\n\nMohon kirimkan penawaran harga terbaik. Terima kasih.`;
        const encodedMsg = encodeURIComponent(whatsappMsg);
        
        setTimeout(() => {
          window.open(`https://wa.me/6282119723498?text=${encodedMsg}`, '_blank');
        }, 2500);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      alert('Gagal mengirim permintaan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-none w-full max-w-4xl overflow-hidden shadow-2xl transition-colors flex flex-col md:flex-row min-h-[500px]"
      >
        {submitted ? (
          <div className="flex-1 p-12 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-8"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Permintaan Terkirim!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md">
              Terima kasih telah menghubungi PT Indeks Industri Indonesia. <br />
              <span className="font-bold text-blue-600 dark:text-blue-400">Membuka WhatsApp untuk konfirmasi instan...</span>
            </p>
            <button 
              onClick={onClose}
              className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-12 py-4 rounded-none font-black hover:opacity-90 transition-all"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Info */}
            <div className="bg-[#0F172A] dark:bg-slate-950 p-10 md:p-12 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 dark:bg-blue-500/5 blur-[80px] rounded-full" />
              
              <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight leading-tight">Request Quote</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm lg:text-base mb-8 leading-relaxed">
                  Dapatkan penawaran harga terbaik untuk produk <br />
                  <span className="text-white font-black text-lg lg:text-xl block mt-2">{product.name}</span>
                </p>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-blue-400" />
                  </div>
                  <div className="text-xs lg:text-sm font-black uppercase tracking-widest">Kualitas Terjamin</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center shrink-0">
                    <Truck size={20} className="text-blue-400" />
                  </div>
                  <div className="text-xs lg:text-sm font-black uppercase tracking-widest">Pengiriman Nasional</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <form onSubmit={handleSubmit} className="p-10 md:p-12 md:w-3/5 max-h-[90vh] overflow-y-auto no-scrollbar bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                  <input 
                    name="name" required type="text" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Perusahaan</label>
                  <input 
                    name="company" required type="text" 
                    value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</label>
                  <input 
                    name="whatsapp" required type="tel" placeholder="08..." 
                    value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                  <input 
                    name="email" required type="email" 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Kebutuhan</label>
                  <input 
                    name="quantity" required type="text" placeholder="Contoh: 20 Ton" 
                    value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi Pengiriman</label>
                  <input 
                    name="location" required type="text" placeholder="Kota / Provinsi" 
                    value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan Tambahan</label>
                <textarea 
                  name="notes" rows={3} 
                  value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-5 py-4 rounded-none bg-slate-50 dark:bg-slate-950 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none resize-none"
                ></textarea>
              </div>
              
              <div className="flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 rounded-none font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all text-sm"
                >
                  Batal
                </button>
                <button 
                  disabled={loading}
                  type="submit"
                  className="px-10 py-4 bg-blue-600 text-white rounded-none font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Permintaan'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
