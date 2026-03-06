import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, MessageSquare, LogOut, Search, CheckCircle2, Clock, Trash2, ExternalLink, Users, Phone, BarChart3, FileText, Send, Plus, X, Download, Mail, Menu, MapPin, Settings, TrendingUp, ArrowUpRight, ArrowDownRight, Truck, Calendar, Edit2, Save, Edit, Home, Bell, ChevronRight, Filter, MoreVertical, Layers, Check, Eye, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { AdminStats, Inquiry, Product, Quotation, SampleRequest, Customer } from '@/src/types';
import { format, subDays, startOfDay } from 'date-fns';
import { cn, getSafeTimestamp, getProductImageUrl } from '@/src/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export // --- Sub-components ---

const StatsCard = ({ label, value, icon, color, trend, trendUp }: { label: string, value: string | number, icon: React.ReactNode, color: string, trend: string, trendUp: boolean }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-none border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={cn(
        "w-14 h-14 rounded-none flex items-center justify-center transition-all duration-500 group-hover:rotate-6",
        color === 'blue' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
        color === 'indigo' ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" :
        color === 'emerald' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
        "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
      )}>
        {icon}
      </div>
      <div className={cn(
        "flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-none",
        trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
      )}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">{label}</div>
    <div className="text-4xl font-black text-slate-900 tracking-tight">{value}</div>
  </motion.div>
);

const InquiryRow = ({ inquiry, selected, onSelect, onStatusUpdate, onCreateQuote, onDelete }: { 
  inquiry: Inquiry, 
  selected: boolean, 
  onSelect: (checked: boolean) => void, 
  onStatusUpdate: (id: number, status: string) => void,
  onCreateQuote: (inquiry: Inquiry) => void,
  onDelete: (id: number) => void
}) => (
  <tr className="hover:bg-slate-50/80 transition-all group border-b border-slate-50 last:border-0">
    <td className="px-8 py-8">
      <input 
        type="checkbox" 
        checked={selected}
        onChange={(e) => onSelect(e.target.checked)}
        className="rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 w-6 h-6 transition-all cursor-pointer"
      />
    </td>
    <td className="px-8 py-8">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-none bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
          {inquiry.name.charAt(0)}
        </div>
        <div>
          <div className="font-black text-slate-900 text-base tracking-tight">{inquiry.name}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{inquiry.company}</div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-none border border-blue-100/50">{inquiry.whatsapp}</span>
            <button 
              onClick={() => {
                const msg = `Halo ${inquiry.name} dari ${inquiry.company}, saya Admin PT Indeks Industri Indonesia ingin menindaklanjuti permintaan Anda mengenai ${inquiry.product_name}.`;
                window.open(`https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
              title="Follow up via WhatsApp"
            >
              <Phone size={14} />
            </button>
          </div>
        </div>
      </div>
    </td>
    <td className="px-8 py-8">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 text-slate-700 text-xs font-black border border-slate-200/50">
        <Package size={16} className="text-slate-400" />
        {inquiry.product_name}
      </div>
      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-3 ml-1">
        Quantity: <span className="text-slate-900">{inquiry.quantity || '-'}</span>
      </div>
    </td>
    <td className="px-8 py-8">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-blue-500" />
        <span className="text-xs font-black text-slate-700 tracking-tight">{inquiry.location}</span>
      </div>
      <div className="text-[11px] text-slate-500 max-w-xs line-clamp-2 font-bold bg-slate-50/80 p-3 rounded-none border border-slate-100 leading-relaxed italic" title={inquiry.notes}>
        "{inquiry.notes}"
      </div>
    </td>
    <td className="px-8 py-8">
      <div className="relative">
        <select 
          value={inquiry.status}
          onChange={(e) => onStatusUpdate(inquiry.id, e.target.value)}
          className={cn(
            "appearance-none text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border-none focus:ring-0 cursor-pointer transition-all w-36 text-center shadow-sm",
            inquiry.status === 'new' ? "bg-blue-50 text-blue-600" : 
            inquiry.status === 'contacted' ? "bg-orange-50 text-orange-600" : 
            "bg-emerald-50 text-emerald-600"
          )}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="deal">Deal</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <ChevronRight size={14} className="rotate-90" />
        </div>
      </div>
    </td>
    <td className="px-8 py-8 text-right">
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => onCreateQuote(inquiry)}
          className="flex items-center gap-2 px-5 py-3 rounded-none bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={16} /> Create Quote
        </button>
        <div className="relative group/actions">
          <button className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-90">
            <MoreVertical size={20} />
          </button>
          <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-3 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-50 scale-95 group-hover/actions:scale-100 origin-top-right">
            <button 
              onClick={() => {
                const text = `INQUIRY DETAILS\nName: ${inquiry.name}\nCompany: ${inquiry.company}\nProduct: ${inquiry.product_name}\nNotes: ${inquiry.notes}\nWhatsApp: ${inquiry.whatsapp}`;
                navigator.clipboard.writeText(text);
                alert('Copied to clipboard');
              }}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
            >
              <FileText size={18} className="text-blue-500" /> Copy Details
            </button>
            <button 
              onClick={() => onDelete(inquiry.id)}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} /> Delete Inquiry
            </button>
          </div>
        </div>
      </div>
    </td>
  </tr>
);

const SampleRow = ({ req, editing, editData, onEdit, onSave, onCancel, onUpdateData, onUpdateStatus, onDelete }: {
  req: SampleRequest,
  editing: boolean,
  editData: Partial<SampleRequest>,
  onEdit: (req: SampleRequest) => void,
  onSave: (id: number) => void,
  onCancel: () => void,
  onUpdateData: (data: Partial<SampleRequest>) => void,
  onUpdateStatus: (id: number, status: string) => void,
  onDelete: (id: number) => void
}) => (
  <tr className="hover:bg-slate-50/80 transition-all group border-b border-slate-50 last:border-0">
    <td className="px-8 py-8">
      <div className="font-black text-slate-900 text-sm tracking-tight">{format(new Date(getSafeTimestamp(req.created_at)), 'dd MMM yyyy')}</div>
      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{format(new Date(getSafeTimestamp(req.created_at)), 'HH:mm')}</div>
    </td>
    <td className="px-8 py-8">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
          {req.pic_name.charAt(0)}
        </div>
        <div>
          <div className="font-black text-slate-900 text-base tracking-tight">{req.pic_name}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{req.company}</div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-none border border-blue-100/50">{req.whatsapp}</span>
            <button 
              onClick={() => {
                const msg = `Halo Bapak/Ibu ${req.pic_name} dari ${req.company}, saya Admin PT Indeks Industri Indonesia ingin menindaklanjuti permintaan sample Anda untuk produk ${req.product}.`;
                window.open(`https://wa.me/${req.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
            >
              <Phone size={14} />
            </button>
          </div>
        </div>
      </div>
    </td>
    <td className="px-8 py-8">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 text-slate-700 text-xs font-black border border-slate-200/50">
        <Package size={16} className="text-slate-400" />
        {req.product}
      </div>
      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-3 ml-1">
        Volume: <span className="text-slate-900">{req.monthly_volume} Ton/Bln</span>
      </div>
    </td>
    <td className="px-8 py-8">
      {editing ? (
        <div className="space-y-4 min-w-[300px] animate-in fade-in duration-300">
          <textarea 
            className="w-full text-xs font-bold p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"
            value={editData.address || req.address}
            onChange={(e) => onUpdateData({ ...editData, address: e.target.value })}
            rows={2}
            placeholder="Shipping address..."
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="text"
              placeholder="Shipping Date"
              className="w-full text-[10px] font-black p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none"
              value={editData.shipping_date || req.shipping_date || ''}
              onChange={(e) => onUpdateData({ ...editData, shipping_date: e.target.value })}
            />
            <input 
              type="text"
              placeholder="Tracking No."
              className="w-full text-[10px] font-black p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none"
              value={editData.tracking_number || req.tracking_number || ''}
              onChange={(e) => onUpdateData({ ...editData, tracking_number: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-[300px]">
          <div className="text-xs text-slate-500 line-clamp-2 font-bold bg-slate-50/80 p-3 rounded-2xl border border-slate-100 mb-3 leading-relaxed" title={req.address}>
            {req.address}
          </div>
          <div className="flex flex-wrap gap-2">
            {req.shipping_date && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
                <Calendar size={12} /> {req.shipping_date}
              </span>
            )}
            {req.tracking_number && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200/50">
                <Truck size={12} /> {req.tracking_number}
              </span>
            )}
          </div>
        </div>
      )}
    </td>
    <td className="px-8 py-8">
      <div className="relative">
        <select 
          value={editing ? (editData.status || req.status) : req.status}
          onChange={(e) => {
            if (editing) {
              onUpdateData({ ...editData, status: e.target.value as any });
            } else {
              onUpdateStatus(req.id, e.target.value);
            }
          }}
          className={cn(
            "appearance-none text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border-none focus:ring-0 cursor-pointer transition-all w-36 text-center shadow-sm",
            req.status === 'new' ? "bg-blue-50 text-blue-600" : 
            req.status === 'contacted' ? "bg-orange-50 text-orange-600" : 
            req.status === 'sent' ? "bg-indigo-50 text-indigo-600" :
            "bg-emerald-50 text-emerald-600"
          )}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <ChevronRight size={14} className="rotate-90" />
        </div>
      </div>
    </td>
    <td className="px-8 py-8 text-right">
      <div className="flex justify-end gap-3">
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => onSave(req.id)} className="p-3 rounded-none bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-90">
              <Check size={20} />
            </button>
            <button onClick={onCancel} className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-90">
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => onEdit(req)}
              className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={() => onDelete(req.id)}
              className="p-3 rounded-2xl bg-slate-100 text-red-500 hover:bg-red-600 hover:text-white transition-all active:scale-90"
            >
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
);

const ProductCard = ({ product, onEdit, onDelete }: { product: Product, onEdit: (p: Product) => void, onDelete: (id: number) => void }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white rounded-none border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 flex flex-col h-full"
  >
    <div className="aspect-[4/3] relative overflow-hidden">
      <img 
        src={getProductImageUrl(product.image_url, product.updated_at, product.created_at)} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 gap-3">
        <button 
          onClick={() => onEdit(product)}
          className="flex-1 py-3 rounded-xl bg-white text-slate-900 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg"
        >
          Edit Product
        </button>
        <button 
          onClick={() => onDelete(product.id)}
          className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
          {product.category}
        </span>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h4 className="font-black text-slate-900 text-lg tracking-tight mb-2 line-clamp-1">{product.name}</h4>
      <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6 flex-1">{product.description}</p>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</div>
          <div className="text-xs font-black text-slate-700">{product.capacity || '-'}</div>
        </div>
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Min Order</div>
          <div className="text-xs font-black text-slate-700">{product.min_order || '-'}</div>
        </div>
      </div>
      
      <button 
        onClick={() => onEdit(product)}
        className="w-full mt-6 py-3 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest md:hidden active:bg-slate-100 transition-all"
      >
        Edit Details
      </button>
    </div>
  </motion.div>
);

const QuotationRow = ({ quotation, onStatusUpdate, onView, onEdit, onDelete }: {
  quotation: Quotation,
  onStatusUpdate: (id: number, status: string) => void,
  onView: (q: Quotation) => void,
  onEdit: (q: Quotation) => void,
  onDelete: (id: number) => void
}) => (
  <tr className="hover:bg-slate-50/80 transition-all group border-b border-slate-50 last:border-0">
    <td className="px-8 py-8">
      <div className="font-black text-slate-900 text-sm tracking-tight">{quotation.quotation_number}</div>
      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{format(new Date(getSafeTimestamp(quotation.created_at)), 'dd MMM yyyy')}</div>
    </td>
    <td className="px-8 py-8">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
          <FileText size={24} />
        </div>
        <div>
          <div className="font-black text-slate-900 text-base tracking-tight">{quotation.company}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">PIC: {quotation.buyer_name}</div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] text-slate-500 font-black bg-slate-100 px-3 py-1 rounded-none border border-slate-200/50">{quotation.whatsapp}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="px-8 py-8">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 text-slate-700 text-xs font-black border border-slate-200/50">
        <Package size={16} className="text-slate-400" />
        {quotation.product_name}
      </div>
      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-3 ml-1">
        Qty: <span className="text-slate-900">{quotation.quantity}</span>
      </div>
    </td>
    <td className="px-8 py-8">
      <div className="text-lg font-black text-blue-600 tracking-tight">Rp {(quotation.grand_total || 0).toLocaleString()}</div>
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{quotation.tax_type} Included</div>
    </td>
    <td className="px-8 py-8">
      <div className="relative">
        <select 
          value={quotation.status}
          onChange={(e) => onStatusUpdate(quotation.id, e.target.value)}
          className={cn(
            "appearance-none text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border-none focus:ring-0 cursor-pointer transition-all w-36 text-center shadow-sm",
            quotation.status === 'Won' ? "bg-emerald-50 text-emerald-600" : 
            quotation.status === 'Lost' ? "bg-red-50 text-red-600" : 
            "bg-blue-50 text-blue-600"
          )}
        >
          <option value="Sent">Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <ChevronRight size={14} className="rotate-90" />
        </div>
      </div>
    </td>
    <td className="px-8 py-8 text-right">
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => onView(quotation)}
          className="flex items-center gap-2 px-5 py-3 rounded-none bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <Eye size={16} /> Preview
        </button>
        <div className="relative group/actions">
          <button className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-90">
            <MoreVertical size={20} />
          </button>
          <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-3 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-50 scale-95 group-hover/actions:scale-100 origin-top-right">
            <button 
              onClick={() => onEdit(quotation)}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Edit size={18} className="text-blue-500" /> Edit Quote
            </button>
            <button 
              onClick={() => onDelete(quotation.id)}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} /> Delete Quote
            </button>
          </div>
        </div>
      </div>
    </td>
  </tr>
);

// --- Main Component ---

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'samples' | 'products' | 'quotations' | 'customers' | 'analytics' | 'settings'>('overview');
  const [settings, setSettings] = useState<any>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateQuotation, setShowCreateQuotation] = useState<Inquiry | null>(null);
  const [viewQuotation, setViewQuotation] = useState<Quotation | null>(null);
  const [editQuotation, setEditQuotation] = useState<Quotation | null>(null);
  const [showProductModal, setShowProductModal] = useState<Product | 'new' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sampleStatusFilter, setSampleStatusFilter] = useState('all');
  const [selectedInquiries, setSelectedInquiries] = useState<number[]>([]);
  const [editingSample, setEditingSample] = useState<number | null>(null);
  const [sampleEditData, setSampleEditData] = useState<Partial<SampleRequest>>({});

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
      // Selalu ambil settings agar tersedia di semua tab (misal untuk tombol Lihat Spreadsheet)
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => setSettings(data));
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const handleUpdateSample = async (id: number, data: Partial<SampleRequest>) => {
    try {
      const res = await fetch(`/api/admin/sample-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        // If tracking number was updated or newly added, redirect to WhatsApp
        const oldReq = sampleRequests.find(r => r.id === id);
        if (data.tracking_number && data.tracking_number !== oldReq?.tracking_number) {
          if (oldReq) {
            const msg = `Halo Bapak/Ibu ${oldReq.pic_name} dari ${oldReq.company},\n\nKami ingin menginformasikan bahwa sample produk ${oldReq.product} telah kami kirimkan.\n\n🚚 *Detail Pengiriman:*\n- Tanggal: ${data.shipping_date || oldReq.shipping_date || '-'}\n- No. Resi: ${data.tracking_number}\n\nTerima kasih atas kepercayaan Anda.`;
            window.open(`https://wa.me/${oldReq.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
          }
        }
        fetchData();
        setEditingSample(null);
        setSampleEditData({});
      }
    } catch (error) {
      console.error('Failed to update sample request:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Settings saved successfully');
      }
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cacheBuster = `?t=${Date.now()}`;
      if (activeTab === 'overview') {
        const res = await fetch(`/api/admin/stats${cacheBuster}`);
        setStats(await res.json());
      } else if (activeTab === 'inquiries') {
        const res = await fetch(`/api/admin/inquiries${cacheBuster}`);
        setInquiries(await res.json());
      } else if (activeTab === 'samples') {
        const res = await fetch(`/api/admin/sample-requests${cacheBuster}`);
        setSampleRequests(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch(`/api/products${cacheBuster}`);
        const data = await res.json();
        console.log("Fetched products at", new Date().toLocaleTimeString(), data);
        setProducts(data);
      } else if (activeTab === 'quotations') {
        const res = await fetch(`/api/admin/quotations${cacheBuster}`);
        setQuotations(await res.json());
      } else if (activeTab === 'customers') {
        const res = await fetch(`/api/admin/customers${cacheBuster}`);
        setCustomers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    await fetch(`/api/admin/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleDeleteInquiry = async (id: number) => {
    if (confirm('Hapus inquiry ini secara permanen?')) {
      try {
        const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
        } else {
          alert('Gagal menghapus inquiry');
        }
      } catch (error) {
        alert('Terjadi kesalahan koneksi');
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Hapus produk ini?')) {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleQuotationStatusUpdate = async (id: number, status: string) => {
    await fetch(`/api/admin/quotations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleDeleteQuotation = async (id: number) => {
    if (confirm('Hapus quotation ini?')) {
      await fetch(`/api/admin/quotations/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (confirm('Hapus customer ini?')) {
      try {
        const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
        } else {
          alert('Gagal menghapus customer');
        }
      } catch (error) {
        alert('Terjadi kesalahan koneksi');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-10 rounded-none w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-none flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
              <LayoutDashboard className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-slate-500 mt-2">PT Indeks Industri Indonesia</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <input name="username" required type="text" className="w-full px-5 py-4 rounded-none bg-slate-800 border-none text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input name="password" required type="password" className="w-full px-5 py-4 rounded-none bg-slate-800 border-none text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-none font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-none flex items-center justify-center shadow-lg shadow-blue-600/20">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-none tracking-tight">INDEKS</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 bg-slate-100 rounded-xl text-slate-600 active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-slate-400 flex flex-col fixed inset-y-0 left-0 z-50 w-72 transition-all duration-500 ease-in-out md:translate-x-0 shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-slate-800/50 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-none flex items-center justify-center shadow-lg shadow-blue-600/20">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg leading-none tracking-tight">INDEKS</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Admin Portal</span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 md:hidden">
          <Link 
            to="/" 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition-all mb-4"
          >
            <Home size={18} /> Back to Website
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</div>
          {[
            { id: 'overview', icon: <BarChart3 size={20} />, label: 'Overview' },
            { id: 'inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: inquiries.filter(i => i.status === 'new').length },
            { id: 'samples', icon: <Layers size={20} />, label: 'Sample Requests', badge: sampleRequests.filter(s => s.status === 'new').length },
            { id: 'quotations', icon: <FileText size={20} />, label: 'Quotations' },
            { id: 'customers', icon: <Users size={20} />, label: 'Customers' },
            { id: 'products', icon: <Package size={20} />, label: 'Products' },
            { id: 'analytics', icon: <TrendingUp size={20} />, label: 'Analytics' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" 
                  : "hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3 z-10">
                <span className={cn(activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-blue-400 transition-colors")}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {item.badge && item.badge > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-black z-10",
                  activeTab === item.id ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                )}>
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
                />
              )}
            </button>
          ))}

          <div className="pt-8 pb-4">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">System</div>
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group",
                activeTab === 'settings' 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" 
                  : "hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <Settings size={20} className={cn(activeTab === 'settings' ? "text-white" : "text-slate-500 group-hover:text-blue-400 transition-colors")} />
              Settings
            </button>
          </div>
        </nav>

        <div className="p-6 space-y-3 border-t border-slate-800/50">
          <Link 
            to="/" 
            className="hidden md:flex w-full items-center gap-3 px-4 py-3 rounded-none text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Home size={20} /> Back to Website
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_token');
              setIsLoggedIn(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen bg-slate-50/50">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-12 py-5 justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="pl-12 pr-6 py-2.5 bg-slate-100 border-none rounded-none text-sm w-64 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-none transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-none border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-slate-900">Admin Indeks</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</span>
                </div>
                <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-600/20">
                  AI
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 flex-1 max-w-[1600px] mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <header>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Welcome back, here's what's happening today.</p>
                  </header>
                  <div className="flex items-center gap-3 bg-white p-1.5 rounded-none border border-slate-200 shadow-sm">
                    <button className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-none transition-all">Last 7 Days</button>
                    <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-none transition-all">Last 30 Days</button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatsCard 
                    label="Total Inquiries" 
                    value={stats.totalInquiries} 
                    icon={<MessageSquare size={24} />} 
                    color="blue" 
                    trend="+12%" 
                    trendUp={true} 
                  />
                  <StatsCard 
                    label="Active Quotations" 
                    value={stats.totalQuotations} 
                    icon={<FileText size={24} />} 
                    color="indigo" 
                    trend="+5%" 
                    trendUp={true} 
                  />
                  <StatsCard 
                    label="Deals Closed" 
                    value={stats.wonQuotations} 
                    icon={<CheckCircle2 size={24} />} 
                    color="emerald" 
                    trend="+18%" 
                    trendUp={true} 
                  />
                  <StatsCard 
                    label="Total Revenue" 
                    value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`} 
                    icon={<TrendingUp size={24} />} 
                    color="orange" 
                    trend="-2%" 
                    trendUp={false} 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Chart */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-none border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Inquiry Performance</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Daily interaction tracking</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600" />
                          <span className="text-[10px] font-black text-slate-500 uppercase">Inquiries</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-black text-slate-500 uppercase">Previous</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Mon', value: 4, prev: 3 },
                          { name: 'Tue', value: 7, prev: 5 },
                          { name: 'Wed', value: 5, prev: 6 },
                          { name: 'Thu', value: 9, prev: 4 },
                          { name: 'Fri', value: 12, prev: 8 },
                          { name: 'Sat', value: 8, prev: 10 },
                          { name: 'Sun', value: 15, prev: 7 },
                        ]}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                            itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="prev" stroke="#e2e8f0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                          <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-none border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-black text-slate-900 tracking-tight">Recent Inquiries</h3>
                      <button onClick={() => setActiveTab('inquiries')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                      {stats.recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="p-6 hover:bg-slate-50 transition-all group cursor-pointer">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {inquiry.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{inquiry.name}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{inquiry.company}</div>
                              </div>
                            </div>
                            <span className={cn(
                              "text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
                              inquiry.status === 'new' ? "bg-blue-50 text-blue-600" : 
                              inquiry.status === 'contacted' ? "bg-orange-50 text-orange-600" : 
                              "bg-emerald-50 text-emerald-600"
                            )}>
                              {inquiry.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Package size={12} className="text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-500">{inquiry.product_name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              <Clock size={12} />
                              {format(new Date(inquiry.created_at), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                      <button 
                        onClick={() => setActiveTab('inquiries')}
                        className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                      >
                        Manage All Inquiries
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Popular Products */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                      <h3 className="font-black text-slate-900 tracking-tight">Popular Products</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Most viewed items this month</p>
                    </div>
                    <div className="p-8 space-y-8">
                      {stats.popularProducts.map((product, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <div>
                              <span className="text-sm font-black text-slate-800">{product.name}</span>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Industrial Chemicals</div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-blue-600">{product.views}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Views</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(product.views / Math.max(...stats.popularProducts.map(p => p.views))) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8">
                    <h3 className="font-black text-slate-900 tracking-tight mb-8">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Add Product', icon: <Plus size={20} />, color: 'blue', action: () => setShowProductModal('new') },
                        { label: 'Create Quote', icon: <FileText size={20} />, color: 'indigo', action: () => setActiveTab('quotations') },
                        { label: 'Check Samples', icon: <Layers size={20} />, color: 'emerald', action: () => setActiveTab('samples') },
                        { label: 'System Settings', icon: <Settings size={20} />, color: 'slate', action: () => setActiveTab('settings') },
                      ].map((item, i) => (
                        <button 
                          key={i}
                          onClick={item.action}
                          className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-600/5 hover:border-blue-100 transition-all group"
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                            item.color === 'blue' ? "bg-blue-600 text-white" :
                            item.color === 'indigo' ? "bg-indigo-600 text-white" :
                            item.color === 'emerald' ? "bg-emerald-600 text-white" :
                            "bg-slate-600 text-white"
                          )}>
                            {item.icon}
                          </div>
                          <span className="text-xs font-black text-slate-700">{item.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-blue-600 rounded-3xl text-white relative overflow-hidden group cursor-pointer">
                      <div className="relative z-10">
                        <h4 className="font-black text-lg leading-tight">Need Help?</h4>
                        <p className="text-xs text-blue-100 mt-1 font-medium">Contact technical support for assistance with the dashboard.</p>
                        <button className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                          Contact Support
                        </button>
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <MessageSquare size={120} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inquiry Management</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage and follow up with potential customers.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search customer or company..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200">
                      <button 
                        onClick={() => setStatusFilter('all')}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          statusFilter === 'all' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setStatusFilter('new')}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          statusFilter === 'new' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        New
                      </button>
                    </div>
                  </div>
                </header>

                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-8 py-5 w-10">
                            <input 
                              type="checkbox" 
                              className="rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedInquiries(inquiries.map(i => i.id));
                                } else {
                                  setSelectedInquiries([]);
                                }
                              }}
                            />
                          </th>
                          <th className="px-8 py-5">Customer Profile</th>
                          <th className="px-8 py-5">Product Interest</th>
                          <th className="px-8 py-5">Location & Notes</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {inquiries
                          .filter(i => {
                            const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                i.company.toLowerCase().includes(searchQuery.toLowerCase());
                            const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
                            return matchesSearch && matchesStatus;
                          })
                          .map((inquiry) => (
                          <InquiryRow 
                            key={inquiry.id}
                            inquiry={inquiry}
                            selected={selectedInquiries.includes(inquiry.id)}
                            onSelect={(checked) => {
                              if (checked) {
                                setSelectedInquiries([...selectedInquiries, inquiry.id]);
                              } else {
                                setSelectedInquiries(selectedInquiries.filter(id => id !== inquiry.id));
                              }
                            }}
                            onStatusUpdate={handleStatusUpdate}
                            onCreateQuote={setShowCreateQuotation}
                            onDelete={handleDeleteInquiry}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {inquiries.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Search className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">No Inquiries Found</h3>
                      <p className="text-sm text-slate-400 mt-2 font-medium">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'samples' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sample Requests</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Track and manage product sample deliveries.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200">
                      <button 
                        onClick={() => setSampleStatusFilter('all')}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          sampleStatusFilter === 'all' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setSampleStatusFilter('new')}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          sampleStatusFilter === 'new' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        New
                      </button>
                    </div>
                    <button 
                      onClick={() => fetchData()}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                      title="Refresh Data"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      onClick={() => {/* Export Logic */}}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                    >
                      <Download size={16} /> Export CSV
                    </button>
                  </div>
                </header>

                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-8 py-5">Request Date</th>
                          <th className="px-8 py-5">Requester Info</th>
                          <th className="px-8 py-5">Product & Volume</th>
                          <th className="px-8 py-5">Shipping Details</th>
                          <th className="px-8 py-5">Delivery Status</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {sampleRequests
                          .filter(req => {
                            if (sampleStatusFilter === 'all') return true;
                            if (sampleStatusFilter === 'new') return req.status === 'new';
                            if (sampleStatusFilter === 'sent') return req.status === 'sent' || req.status === 'delivered';
                            if (sampleStatusFilter === 'pending') return req.status === 'contacted' || req.status === 'new';
                            return true;
                          })
                          .map((req) => (
                          <SampleRow 
                            key={req.id}
                            req={req}
                            editing={editingSample === req.id}
                            editData={sampleEditData}
                            onEdit={(r) => {
                              setEditingSample(r.id);
                              setSampleEditData({ ...r });
                            }}
                            onSave={() => handleUpdateSample(req.id, sampleEditData)}
                            onCancel={() => {
                              setEditingSample(null);
                              setSampleEditData({});
                            }}
                            onUpdateData={setSampleEditData}
                            onUpdateStatus={(id, status) => handleUpdateSample(id, { status: status as any })}
                            onDelete={async (id) => {
                              if (confirm('Hapus permintaan sample ini secara permanen?')) {
                                const res = await fetch(`/api/admin/sample-requests/${id}`, { method: 'DELETE' });
                                if (res.ok) fetchData();
                              }
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {sampleRequests.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Layers className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">No Sample Requests</h3>
                      <p className="text-sm text-slate-400 mt-2 font-medium">New requests will appear here automatically.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage your industrial product inventory.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => fetchData()}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      onClick={() => setShowProductModal('new')}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                      <Plus size={18} /> Add New Product
                    </button>
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onEdit={setShowProductModal}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quotations' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quotations</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage and track your business proposals.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => fetchData()}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      onClick={() => setActiveTab('inquiries')}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                      <Plus size={18} /> Create New Quote
                    </button>
                  </div>
                </header>

                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-8 py-5">Quote Info</th>
                          <th className="px-8 py-5">Customer</th>
                          <th className="px-8 py-5">Product & Qty</th>
                          <th className="px-8 py-5">Total Amount</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {quotations.map((q) => (
                          <QuotationRow 
                            key={q.id}
                            quotation={q}
                            onStatusUpdate={handleQuotationStatusUpdate}
                            onView={setViewQuotation}
                            onEdit={setEditQuotation}
                            onDelete={handleDeleteQuotation}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {quotations.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">No Quotations Yet</h3>
                      <p className="text-sm text-slate-400 mt-2 font-medium">Create your first quote from the inquiries tab.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Database</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage your verified business partners and clients.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3.5 rounded-none bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                      <Download size={16} /> Export CSV
                    </button>
                  </div>
                </header>

                <div className="bg-white rounded-none border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PIC Name</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NPWP</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {customers.length > 0 ? customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-slate-50/80 transition-all group">
                            <td className="px-8 py-8">
                              <div className="font-black text-slate-900 text-base tracking-tight">{customer.company_name}</div>
                              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 line-clamp-1 max-w-xs">{customer.address}</div>
                            </td>
                            <td className="px-8 py-8">
                              <div className="font-black text-slate-700 text-sm">{customer.pic_name || '-'}</div>
                            </td>
                            <td className="px-8 py-8">
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-slate-900">{customer.whatsapp}</div>
                                <div className="text-[10px] text-slate-400 font-bold">{customer.email}</div>
                              </div>
                            </td>
                            <td className="px-8 py-8">
                              <div className="text-xs font-mono text-slate-500">{customer.npwp || '-'}</div>
                            </td>
                            <td className="px-8 py-8 text-right">
                              <div className="flex justify-end gap-3">
                                <button 
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="p-3 rounded-none bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-none flex items-center justify-center text-slate-300">
                                  <Users size={32} />
                                </div>
                                <div>
                                  <p className="text-slate-900 font-black text-lg">No customers found</p>
                                  <p className="text-slate-500 text-sm font-medium">Customers are automatically added when you create quotations.</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
                <header>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Insights</h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Detailed performance metrics and business trends.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Inquiry Trends</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Last 7 Days Performance</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <ArrowUpRight size={14} /> +12.5%
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Mon', value: 4 },
                          { name: 'Tue', value: 7 },
                          { name: 'Wed', value: 5 },
                          { name: 'Thu', value: 9 },
                          { name: 'Fri', value: 12 },
                          { name: 'Sat', value: 8 },
                          { name: 'Sun', value: 15 },
                        ]}>
                          <defs>
                            <linearGradient id="colorValueAnalytic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} 
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValueAnalytic)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-none border border-slate-200/60 shadow-sm">
                    <div className="mb-10">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Product Interest</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Leads by Category</p>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Chemicals', value: 45 },
                          { name: 'Services', value: 30 },
                          { name: 'Logistics', value: 15 },
                          { name: 'Others', value: 10 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} 
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                          />
                          <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                            {[0, 1, 2, 3].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#2563eb', '#0ea5e9', '#6366f1', '#94a3b8'][index % 4]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                    { label: 'Avg. Response Time', value: '1.2 Hours', trend: '-15% faster', color: 'blue' },
                    { label: 'Conversion Rate', value: '24.8%', trend: '+2.4%', color: 'emerald' },
                    { label: 'Lead Quality Score', value: '8.4/10', trend: '+0.5', color: 'indigo' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-none border border-slate-200/60 shadow-sm group hover:border-blue-600/20 transition-all duration-500">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                      <div className="text-4xl font-black text-slate-900 tracking-tight mb-4">{stat.value}</div>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-widest",
                        stat.trend.includes('+') || stat.trend.includes('faster') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {stat.trend.includes('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
                <header>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Website Settings</h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Configure your website's core information and integrations.</p>
                </header>

                <form onSubmit={handleSaveSettings} className="space-y-8">
                  <div className="bg-white rounded-none border border-slate-200/60 shadow-sm p-8 md:p-10 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Settings size={20} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">General Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Website Name</label>
                        <input 
                          type="text" 
                          value={settings.site_name || ''}
                          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Hours</label>
                        <input 
                          type="text" 
                          value={settings.office_hours || ''}
                          onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp Contact (62...)</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            value={settings.contact_whatsapp || ''}
                            onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Contact</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="email" 
                            value={settings.contact_email || ''}
                            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Office Address</label>
                      <textarea 
                        rows={3}
                        value={settings.contact_address || ''}
                        onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-8 md:p-10 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Layers size={20} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Integrations</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Google Sheets URL</label>
                        <input 
                          type="url" 
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          value={settings.google_sheets_url || ''}
                          onChange={(e) => setSettings({ ...settings, google_sheets_url: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700"
                        />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">
                          Link to your main data spreadsheet for quick access.
                        </p>
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Webhook URL (Apps Script)</label>
                        <input 
                          type="url" 
                          placeholder="https://script.google.com/macros/s/.../exec"
                          value={settings.google_sheets_webhook || ''}
                          onChange={(e) => setSettings({ ...settings, google_sheets_webhook: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700"
                        />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">
                          Automatic synchronization endpoint for new requests.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95 flex items-center gap-3"
                    >
                      {isSavingSettings ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
        </div>
      </main>

      {/* Create Quotation Modal */}
      <AnimatePresence>
        {showCreateQuotation && (
          <CreateQuotationModal 
            inquiry={showCreateQuotation} 
            onClose={() => setShowCreateQuotation(null)} 
            onSuccess={() => {
              setShowCreateQuotation(null);
              setActiveTab('quotations');
              fetchData();
            }}
          />
        )}
        
        {editQuotation && (
          <CreateQuotationModal 
            initialQuotation={editQuotation} 
            onClose={() => setEditQuotation(null)} 
            onSuccess={() => {
              setEditQuotation(null);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>

      {/* View Quotation Modal */}
      <AnimatePresence>
        {viewQuotation && (
          <ViewQuotationModal 
            quotation={viewQuotation} 
            onClose={() => setViewQuotation(null)} 
          />
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <ProductModal 
            product={showProductModal === 'new' ? null : showProductModal}
            onClose={() => setShowProductModal(null)}
            onSuccess={() => {
              setShowProductModal(null);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductModal = ({ product, onClose, onSuccess }: { product: Product | null, onClose: () => void, onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || '');

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(imageUrl);
    }
  }, [imageFile, imageUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.imageUrl;
        } else {
          throw new Error('Gagal mengupload gambar');
        }
      }

      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      data.image_url = finalImageUrl;
      
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) onSuccess();
      else alert('Gagal menyimpan produk');
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col"
      >
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{product ? 'Edit Product' : 'Add New Product'}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Product Catalog Management</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Name</label>
                <input 
                  name="name" 
                  defaultValue={product?.name} 
                  required 
                  placeholder="e.g. Industrial Grade Methanol"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Slug (URL Identifier)</label>
                <input 
                  name="slug" 
                  defaultValue={product?.slug} 
                  required 
                  placeholder="e.g. industrial-methanol"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                  <input 
                    name="category" 
                    defaultValue={product?.category} 
                    required 
                    placeholder="e.g. Chemicals"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Label (Badge)</label>
                  <input 
                    name="label" 
                    defaultValue={product?.label || ''} 
                    placeholder="e.g. Best Seller"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Short Description</label>
                <textarea 
                  name="description" 
                  defaultValue={product?.description} 
                  required 
                  rows={4} 
                  placeholder="Briefly describe the product..."
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 resize-none" 
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Media</label>
                <div className="relative group">
                  <div className="aspect-video rounded-[2rem] bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-blue-600/30 transition-all flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <Plus className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Image</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Or Image URL</label>
                  <input 
                    name="image_url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..." 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-600 text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Supply Capacity</label>
                  <input 
                    name="capacity" 
                    defaultValue={product?.capacity} 
                    required 
                    placeholder="e.g. 500 Tons/Month"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Min. Order</label>
                  <input 
                    name="min_order" 
                    defaultValue={product?.min_order} 
                    required 
                    placeholder="e.g. 10 Tons"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Specifications</label>
                <input 
                  name="specs" 
                  defaultValue={product?.specs} 
                  required 
                  placeholder="e.g. Purity 99.9%, Colorless, Liquid"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Processing...' : (product ? 'Update Product' : 'Save Product')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CreateQuotationModal = ({ inquiry, onClose, onSuccess, initialQuotation }: { inquiry?: Inquiry, onClose: () => void, onSuccess: () => void, initialQuotation?: Quotation }) => {
  const [loading, setLoading] = useState(false);
  const [unitPrice, setUnitPrice] = useState(initialQuotation?.unit_price || 0);
  const [qty, setQty] = useState(parseInt(initialQuotation?.quantity || inquiry?.quantity || '1') || 1);
  const [taxType, setTaxType] = useState<'PPN' | 'Non-PPN'>(initialQuotation?.tax_type || 'Non-PPN');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCompany, setSelectedCompany] = useState(initialQuotation?.company || inquiry?.company || '');
  const [buyerName, setBuyerName] = useState(initialQuotation?.buyer_name || inquiry?.name || '');
  const [buyerAddress, setBuyerAddress] = useState(initialQuotation?.buyer_address || '');
  const [whatsapp, setWhatsapp] = useState(initialQuotation?.whatsapp || inquiry?.whatsapp || '');
  const [email, setEmail] = useState(initialQuotation?.email || inquiry?.email || '');
  const [npwp, setNpwp] = useState(initialQuotation?.npwp || '');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(console.error);
  }, []);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCompany(value);
    
    // Auto-fill if customer exists
    const customer = customers.find(c => c.company_name.toLowerCase() === value.toLowerCase());
    if (customer) {
      setBuyerName(customer.pic_name || '');
      setBuyerAddress(customer.address || '');
      setWhatsapp(customer.whatsapp || '');
      setEmail(customer.email || '');
      setNpwp(customer.npwp || '');
    }
  };

  const totalPrice = unitPrice * qty;
  const taxAmount = taxType === 'PPN' ? totalPrice * 0.11 : 0;
  const grandTotal = totalPrice + taxAmount;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      inquiry_id: inquiry?.id,
      buyer_name: formData.get('buyer_name'),
      company: formData.get('company'),
      buyer_address: formData.get('buyer_address'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      product_name: formData.get('product_name'),
      quantity: formData.get('quantity'),
      unit_price: parseFloat(formData.get('unit_price') as string),
      total_price: totalPrice,
      tax_type: taxType,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      po_number: formData.get('po_number'),
      npwp: formData.get('npwp'),
      lead_time: formData.get('lead_time'),
      payment_terms: formData.get('payment_terms'),
      delivery_terms: formData.get('delivery_terms'),
      notes: formData.get('notes'),
    };

    try {
      const url = initialQuotation ? `/api/admin/quotations/${initialQuotation.id}` : '/api/admin/quotations';
      const method = initialQuotation ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) onSuccess();
    } catch (err) {
      alert('Failed to save quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col"
      >
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{initialQuotation ? 'Edit Quotation' : 'Create New Quotation'}</h3>
            <div className="flex items-center gap-2 mt-1">
              {inquiry && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">Inquiry #{inquiry.id}</span>}
              {initialQuotation && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{initialQuotation.quotation_number}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto flex-1 space-y-12 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Buyer Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User size={16} />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Buyer Information</h4>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Company Name</label>
                  <input 
                    name="company" 
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    list="company-list"
                    required 
                    placeholder="Search or enter company..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                  />
                  <datalist id="company-list">
                    {customers.map(c => <option key={c.id} value={c.company_name} />)}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">PIC Name</label>
                  <input 
                    name="buyer_name" 
                    value={buyerName} 
                    onChange={e => setBuyerName(e.target.value)} 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Company Address</label>
                  <textarea 
                    name="buyer_address" 
                    value={buyerAddress} 
                    onChange={e => setBuyerAddress(e.target.value)} 
                    rows={3} 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 resize-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
                    <input name="whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                    <input name="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">PO Number (Optional)</label>
                    <input name="po_number" defaultValue={initialQuotation?.po_number} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">NPWP (Optional)</label>
                    <input name="npwp" value={npwp} onChange={e => setNpwp(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product & Terms */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Pricing & Terms</h4>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Name</label>
                  <input name="product_name" defaultValue={initialQuotation?.product_name || inquiry?.product_name} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity</label>
                    <input 
                      name="quantity" 
                      defaultValue={initialQuotation?.quantity || inquiry?.quantity} 
                      onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                      required 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Unit Price (IDR)</label>
                    <input 
                      name="unit_price" 
                      type="number" 
                      defaultValue={unitPrice}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      required 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" 
                    />
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Configuration</label>
                    <div className="flex p-1 bg-white rounded-xl border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => setTaxType('Non-PPN')}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                          taxType === 'Non-PPN' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Non PPN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTaxType('PPN')}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                          taxType === 'PPN' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        PPN 11%
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                      <span className="text-slate-900">Rp {(totalPrice || 0).toLocaleString()}</span>
                    </div>
                    {taxType === 'PPN' && (
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400 uppercase tracking-widest">PPN 11%</span>
                        <span className="text-blue-600">Rp {(taxAmount || 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg pt-4 border-t border-slate-200">
                      <span className="font-black text-slate-900 tracking-tight">Grand Total</span>
                      <span className="font-black text-blue-600 tracking-tight">Rp {(grandTotal || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Time</label>
                    <input name="lead_time" defaultValue={initialQuotation?.lead_time} placeholder="e.g. 3-5 Working Days" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Payment Terms</label>
                    <input name="payment_terms" defaultValue={initialQuotation?.payment_terms} placeholder="e.g. 50% DP, 50% COD" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Delivery Terms</label>
                <input name="delivery_terms" defaultValue={initialQuotation?.delivery_terms} placeholder="e.g. Franco Jakarta" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Notes / Special Instructions</label>
                <textarea name="notes" defaultValue={initialQuotation?.notes} rows={2} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 resize-none" />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Processing...' : (initialQuotation ? 'Update Quotation' : 'Generate Quotation')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ViewQuotationModal = ({ quotation, onClose }: { quotation: Quotation, onClose: () => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('quotation-doc');
    if (!element) return;

    try {
      setIsGenerating(true);
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Format filename: Invoice_001_INV_I3.PPN_III_2026.pdf
      const safeFilename = `Invoice_${quotation.quotation_number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      // Try to save directly
      pdf.save(safeFilename);
      
      // Fallback for iframe sandboxes: open in new tab
      try {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = safeFilename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) {
        console.error('Fallback download failed', e);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print if PDF generation fails
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendWA = () => {
    const text = `Halo ${quotation.buyer_name}, berikut quotation resmi dari PT Indeks Industri Indonesia untuk produk ${quotation.product_name}. No: ${quotation.quotation_number}`;
    window.open(`https://wa.me/${quotation.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Quotation ${quotation.quotation_number} - PT Indeks Industri Indonesia`);
    const body = encodeURIComponent(`Halo ${quotation.buyer_name},\n\nTerlampir adalah penawaran harga resmi kami untuk produk ${quotation.product_name}.\n\nNomor Quotation: ${quotation.quotation_number}\nTotal: Rp ${(quotation.grand_total || 0).toLocaleString()}\n\nTerima kasih.`);
    window.location.href = `mailto:${quotation.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-md overflow-y-auto custom-scrollbar"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        className="bg-white rounded-[3rem] w-full max-w-5xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Quotation Preview</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest",
                  quotation.status === 'Won' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {quotation.status}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quotation.quotation_number}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleSendEmail} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
              <Mail size={16} /> Email
            </button>
            <button onClick={handleSendWA} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95">
              <Send size={16} /> WhatsApp
            </button>
            <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-70 active:scale-95">
              <Download size={16} /> {isGenerating ? 'Saving...' : 'Download PDF'}
            </button>
            <button onClick={onClose} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 rounded-2xl transition-all active:scale-90">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Quotation Document */}
        <div className="p-0 bg-white font-sans" id="quotation-doc">
          <div className="bg-blue-600 text-white p-10 flex justify-between items-end">
            <div className="flex items-center gap-6">
              <div className="w-32 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-2.5 h-8 bg-blue-600 rounded-sm"></div>)}
                  </div>
                  <span className="text-[7px] font-black text-blue-600 leading-none mt-1 uppercase tracking-tighter">PT INDEKS INDUSTRI INDONESIA</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black tracking-widest mb-6">INVOICE</h1>
              <div className="grid grid-cols-2 gap-x-10 text-xs font-bold uppercase tracking-widest opacity-90">
                <div className="text-left">NO INVOICE</div>
                <div className="text-left">: {quotation.quotation_number}</div>
                <div className="text-left">INVOICE DATE</div>
                <div className="text-left">: {format(new Date(getSafeTimestamp(quotation.created_at)), 'dd MMM yyyy')}</div>
                <div className="text-left">PERIODE</div>
                <div className="text-left">: {format(new Date(getSafeTimestamp(quotation.created_at)), 'MMMM yyyy')}</div>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 border-b border-blue-100 pb-2">From</div>
                <div className="font-black text-slate-900 text-sm mb-3">PT INDEKS INDUSTRI INDONESIA</div>
                <div className="space-y-2 text-[11px] font-bold text-slate-500 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">Address</span>
                    <span className="text-slate-700">Jl. Cikampek-Padalarang, Kp. Wadon, RT001/RW009, Tenjolaut, Kec. Cikalong Wetan, Kab. Bandung Barat, Jabar 40556</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">Phone</span>
                    <span className="text-slate-700">022-69720024</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">Email</span>
                    <span className="text-blue-600 underline">indeksindustri@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 border-b border-blue-100 pb-2">Bill To</div>
                <div className="font-black text-slate-900 text-sm mb-3">{quotation.company}</div>
                <div className="space-y-2 text-[11px] font-bold text-slate-500 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">Address</span>
                    <span className="text-slate-700">{quotation.buyer_address || '-'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">PIC</span>
                    <span className="text-slate-700">{quotation.buyer_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">Contact</span>
                    <span className="text-slate-700">{quotation.whatsapp}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 uppercase tracking-widest opacity-60">PO No</span>
                    <span className="text-slate-700">{quotation.po_number || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5 w-16 text-center">No</th>
                    <th className="px-8 py-5">Description</th>
                    <th className="px-8 py-5 w-24 text-center">Qty</th>
                    <th className="px-8 py-5 w-40 text-right">Unit Price</th>
                    <th className="px-8 py-5 w-40 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="align-top">
                    <td className="px-8 py-8 text-center font-black text-slate-400">01</td>
                    <td className="px-8 py-8">
                      <div className="font-black text-slate-900 text-sm mb-2">{quotation.product_name}</div>
                      <div className="text-xs font-bold text-slate-400 leading-relaxed whitespace-pre-line">{quotation.notes || 'Industrial Grade Quality Standard'}</div>
                    </td>
                    <td className="px-8 py-8 text-center font-black text-slate-900">{quotation.quantity}</td>
                    <td className="px-8 py-8 text-right font-black text-slate-900">Rp {(quotation.unit_price || 0).toLocaleString()}</td>
                    <td className="px-8 py-8 text-right font-black text-blue-600">Rp {(quotation.total_price || 0).toLocaleString()}</td>
                  </tr>
                  {/* Fillers */}
                  {[1,2].map(i => (
                    <tr key={i} className="h-16">
                      <td colSpan={5}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-80 space-y-4 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-slate-900">Rp {(quotation.total_price || 0).toLocaleString()}</span>
                </div>
                {quotation.tax_type === 'PPN' && (
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">PPN 11%</span>
                    <span className="text-blue-600">Rp {(quotation.tax_amount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                  <span className="text-xl font-black text-blue-600 tracking-tight">Rp {(quotation.grand_total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 pt-10">
              <div className="space-y-6">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">Payment Details</div>
                <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Bank</span>
                    <span className="text-slate-900">Bank Mandiri</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Account Name</span>
                    <span className="text-slate-900">PT Indeks Industri Indonesia</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Account Number</span>
                    <span className="text-blue-600">131-00-1234567-8</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center text-center space-y-10">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</div>
                  <div className="h-24 flex items-center justify-center">
                    {/* Placeholder for signature */}
                    <div className="w-32 h-16 border-b-2 border-slate-200 border-dashed"></div>
                  </div>
                  <div className="font-black text-slate-900 text-sm uppercase tracking-widest">Management</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white p-6 text-center text-[9px] font-black uppercase tracking-[0.3em]">
            Thank you for your business with PT Indeks Industri Indonesia
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
