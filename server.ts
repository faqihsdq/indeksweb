import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("indeks.db");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public", "uploads");
console.log("Upload directory path:", uploadDir);
if (!fs.existsSync(uploadDir)) {
  console.log("Creating upload directory...");
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log("Upload directory already exists.");
}

// Log contents of public for debugging
try {
  const publicContents = fs.readdirSync(path.join(__dirname, "public"));
  console.log("Public directory contents:", publicContents);
} catch (e) {
  console.log("Could not read public directory");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    specs TEXT,
    capacity TEXT,
    min_order TEXT,
    image_url TEXT,
    category TEXT,
    label TEXT,
    coa_url TEXT,
    msds_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add updated_at if it doesn't exist
try {
  db.prepare("ALTER TABLE products ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP").run();
  console.log("Added updated_at column to products table");
} catch (e) {
  // Column probably already exists
}

// Log current columns for debugging
const columns = db.prepare("PRAGMA table_info(products)").all();
console.log("Products table columns:", columns.map((c: any) => c.name).join(", "));

db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    whatsapp TEXT,
    email TEXT,
    product_id INTEGER,
    product_name TEXT,
    quantity TEXT,
    location TEXT,
    notes TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    page_path TEXT,
    product_id INTEGER,
    referrer TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_number TEXT UNIQUE NOT NULL,
    inquiry_id INTEGER,
    buyer_name TEXT NOT NULL,
    company TEXT,
    buyer_address TEXT,
    whatsapp TEXT,
    email TEXT,
    product_name TEXT,
    quantity TEXT,
    unit_price REAL,
    total_price REAL,
    tax_type TEXT DEFAULT 'Non-PPN',
    tax_amount REAL DEFAULT 0,
    grand_total REAL DEFAULT 0,
    po_number TEXT,
    npwp TEXT,
    lead_time TEXT,
    payment_terms TEXT,
    delivery_terms TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES inquiries(id)
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT UNIQUE NOT NULL,
    pic_name TEXT,
    address TEXT,
    npwp TEXT,
    whatsapp TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT,
    author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    photo_url TEXT,
    logo_url TEXT,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS sample_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pic_name TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT,
    email TEXT,
    whatsapp TEXT NOT NULL,
    product TEXT NOT NULL,
    monthly_volume TEXT,
    address TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'new',
    shipping_date TEXT,
    tracking_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add shipping_date and tracking_number if they don't exist
try {
  db.prepare("ALTER TABLE sample_requests ADD COLUMN shipping_date TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE sample_requests ADD COLUMN tracking_number TEXT").run();
} catch (e) {}

// Initialize default settings
const defaultSettings = [
  { key: 'site_name', value: 'PT Indeks Industri Indonesia' },
  { key: 'contact_whatsapp', value: '6282119723498' },
  { key: 'contact_email', value: 'info@indeksindustri.co.id' },
  { key: 'contact_address', value: 'Kawasan Industri Jababeka, Cikarang, Bekasi' },
  { key: 'office_hours', value: 'Senin - Jumat: 08:00 - 17:00' }
];

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
defaultSettings.forEach(s => insertSetting.run(s.key, s.value));

// Add label column to products if it doesn't exist (for existing DBs)
try {
  db.prepare("ALTER TABLE products ADD COLUMN label TEXT").run();
} catch (e) {
  // Column already exists or table doesn't exist yet (unlikely here)
}

// Migration: Add new columns to quotations if they don't exist
try { db.prepare("ALTER TABLE quotations ADD COLUMN tax_type TEXT DEFAULT 'Non-PPN'").run(); } catch (e) {}
try { db.prepare("ALTER TABLE quotations ADD COLUMN tax_amount REAL DEFAULT 0").run(); } catch (e) {}
try { db.prepare("ALTER TABLE quotations ADD COLUMN grand_total REAL DEFAULT 0").run(); } catch (e) {}
try { db.prepare("ALTER TABLE quotations ADD COLUMN po_number TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE quotations ADD COLUMN npwp TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE quotations ADD COLUMN buyer_address TEXT").run(); } catch (e) {}

// Helper to generate quotation number
function generateQuotationNumber(taxType: string = 'Non-PPN') {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const romanMonth = romanMonths[month - 1];
  
  const count = db.prepare("SELECT COUNT(*) as count FROM quotations").get() as { count: number };
  const nextNumber = (count.count + 1).toString().padStart(3, '0');
  
  const taxCode = taxType === 'PPN' ? 'PPN' : 'NP';
  return `${nextNumber}/INV/I3.${taxCode}/${romanMonth}/${year}`;
}

// Seed initial products if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, slug, description, specs, capacity, min_order, image_url, category, label)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    {
      name: "Hydrated Lime (Kapur Padam)",
      slug: "hydrated-lime",
      description: "Kapur padam berkualitas tinggi untuk pengolahan air, stabilisasi tanah, dan industri kimia.",
      specs: "Ca(OH)2 > 90%, Mesh 325, White Powder",
      capacity: "5000 Ton / Bulan",
      min_order: "10 Ton",
      image_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: "Best Seller"
    },
    {
      name: "Quicklime (CaO) High Grade",
      slug: "quicklime-cao",
      description: "Kapur tohor aktif dengan reaktivitas tinggi untuk industri baja dan pertambangan emas.",
      specs: "CaO > 85%, Active Lime, Lump/Powder",
      capacity: "3000 Ton / Bulan",
      min_order: "10 Ton",
      image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: "Best Seller"
    },
    {
      name: "Kapur Tohor (Lump Lime)",
      slug: "kapur-tohor-lump",
      description: "Kapur tohor bongkahan untuk kebutuhan fluxing di industri peleburan logam.",
      specs: "CaO > 80%, Lump Size 2-5cm",
      capacity: "2000 Ton / Bulan",
      min_order: "10 Ton",
      image_url: "https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: null
    },
    {
      name: "Kalsium Karbonat - Limestone (CaCO3)",
      slug: "calcium-carbonate",
      description: "Tepung kalsium karbonat berkualitas tinggi untuk berbagai aplikasi industri.",
      specs: "CaCO3 > 98%, Mesh 800-2000, Ultra White",
      capacity: "4000 Ton / Bulan",
      min_order: "5 Ton",
      image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: "New Arrival"
    },
    {
      name: "Dolomite Powder",
      slug: "dolomite-powder",
      description: "Pupuk dolomite untuk pertanian dan industri keramik.",
      specs: "MgO > 18%, CaO > 30%",
      capacity: "2500 Ton / Bulan",
      min_order: "10 Ton",
      image_url: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: null
    },
    {
      name: "Jasa Pemusnahan Limbah Non B3",
      slug: "waste-disposal",
      description: "Layanan pemusnahan limbah industri non-B3 secara profesional dan ramah lingkungan.",
      specs: "Non-B3 Industrial Waste Only",
      capacity: "Unlimited",
      min_order: "1 Truck",
      image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
      category: "Services",
      label: "Recommended"
    },
    {
      name: "Bentonite Clay",
      slug: "bentonite-clay",
      description: "Bentonite untuk kebutuhan pengeboran dan penjernihan minyak.",
      specs: "Sodium/Calcium Based, High Swelling",
      capacity: "1500 Ton / Bulan",
      min_order: "10 Ton",
      image_url: "https://images.unsplash.com/photo-1569560263444-5dfd1ee5028d?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: null
    },
    {
      name: "Zeolite Natural",
      slug: "zeolite-natural",
      description: "Zeolit alam untuk pengolahan limbah dan tambak udang.",
      specs: "CEC > 100 meq/100g",
      capacity: "1000 Ton / Bulan",
      min_order: "5 Ton",
      image_url: "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: null
    },
    {
      name: "Coal (Batubara) Low Calorie",
      slug: "coal-low-cal",
      description: "Batubara untuk kebutuhan boiler industri.",
      specs: "GAR 3800-4200",
      capacity: "10000 Ton / Bulan",
      min_order: "500 Ton",
      image_url: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&q=80&w=800",
      category: "Energy",
      label: null
    },
    {
      name: "Silica Sand (Pasir Silika)",
      slug: "silica-sand",
      description: "Pasir silika untuk water treatment dan sandblasting.",
      specs: "SiO2 > 98%, Various Mesh Sizes",
      capacity: "3000 Ton / Bulan",
      min_order: "10 Ton",
      image_url: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: "Best Seller"
    },
    {
      name: "Caustic Soda Flakes",
      slug: "caustic-soda",
      description: "Natrium Hidroksida untuk industri tekstil dan sabun.",
      specs: "NaOH 99%",
      capacity: "500 Ton / Bulan",
      min_order: "1 Ton",
      image_url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=800",
      category: "Chemicals",
      label: null
    }
  ];

  for (const p of initialProducts) {
    insertProduct.run(p.name, p.slug, p.description, p.specs, p.capacity, p.min_order, p.image_url, p.category, p.label);
  }
}

// One-time update to sync existing products with better images removed to prevent resetting user changes
/*
try {
  const betterImages = [
    { slug: 'hydrated-lime', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800' },
    { slug: 'quicklime-cao', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800' },
    { slug: 'kapur-tohor-lump', url: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=800' },
    { slug: 'calcium-carbonate', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
    { slug: 'dolomite-powder', url: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=800' },
    { slug: 'waste-disposal', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800' },
    { slug: 'bentonite-clay', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
    { slug: 'zeolite-natural', url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=800' },
    { slug: 'coal-low-cal', url: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&q=80&w=800' },
    { slug: 'silica-sand', url: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=800' },
    { slug: 'caustic-soda', url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=800' }
  ];

  const updateImg = db.prepare("UPDATE products SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?");
  for (const img of betterImages) {
    updateImg.run(img.url, img.slug);
  }
} catch (e) {
  console.log("Error updating existing product images", e);
}
*/

// Update capacities and min orders removed to prevent resetting user changes
/*
try {
  db.prepare("UPDATE products SET min_order = '5 Ton / Trip'").run();
  
  // Specific updates for requested products
  db.prepare("UPDATE products SET name = 'Hydrated Lime (Kapur Padam)', capacity = '750+ Ton / Bulan' WHERE slug = 'hydrated-lime'").run();
  db.prepare("UPDATE products SET name = 'CaOH2 (Industrial Grade)', capacity = '950+ Ton / Bulan' WHERE slug = 'quicklime-cao'").run();
  db.prepare("UPDATE products SET name = 'Kalsium Karbonat (CaCO3)', capacity = '5000 Ton / Bulan' WHERE slug = 'calcium-carbonate'").run();
  
  // Ensure other products also have the 5 ton min order
  db.prepare("UPDATE products SET min_order = '5 Ton / Trip'").run();
} catch (e) {
  console.log("Error updating product capacities", e);
}
*/

// Force update product names removed to prevent resetting user changes
/*
try {
  db.prepare("UPDATE products SET name = 'Hydrated Lime' WHERE slug = 'hydrated-lime'").run();
  db.prepare("UPDATE products SET name = 'Quicklime (CaO)' WHERE slug = 'quicklime-cao'").run();
  db.prepare("UPDATE products SET name = 'Kapur Padam (CaOH2)' WHERE slug = 'kapur-tohor-lump'").run();
  db.prepare("UPDATE products SET name = 'Kalsium Karbonat' WHERE slug = 'calcium-carbonate'").run();
} catch (e) {
  console.log("Error updating product names", e);
}
*/

// Seed testimonials if empty
const testimonialCount = db.prepare("SELECT COUNT(*) as count FROM testimonials").get() as { count: number };
if (testimonialCount.count === 0) {
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (name, company, quote, photo_url, logo_url, rating)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const initialTestimonials = [
    {
      name: "Budi Santoso",
      company: "PT Maju Terus Steel",
      quote: "Kualitas Hydrated Lime dari PT Indeks Industri sangat konsisten. Sangat membantu proses water treatment di pabrik kami.",
      photo_url: "https://picsum.photos/seed/person1/200/200",
      logo_url: "https://picsum.photos/seed/logo1/100/100",
      rating: 5
    },
    {
      name: "Siti Aminah",
      company: "CV Kimia Sejahtera",
      quote: "Layanan pengiriman tepat waktu dan respon admin sangat cepat. Sangat direkomendasikan untuk partner industri.",
      photo_url: "https://picsum.photos/seed/person2/200/200",
      logo_url: "https://picsum.photos/seed/logo2/100/100",
      rating: 5
    },
    {
      name: "Andi Wijaya",
      company: "PT Global Mining",
      quote: "Quicklime dengan reaktivitas tinggi. Sangat efisien untuk proses pemurnian logam kami.",
      photo_url: "https://picsum.photos/seed/person3/200/200",
      logo_url: "https://picsum.photos/seed/logo3/100/100",
      rating: 4
    }
  ];

  for (const t of initialTestimonials) {
    insertTestimonial.run(t.name, t.company, t.quote, t.photo_url, t.logo_url, t.rating);
  }
}

// Seed articles if empty or less than 15
const articleCount = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number };
if (articleCount.count < 15) {
  const insertArticle = db.prepare(`
    INSERT OR IGNORE INTO articles (title, slug, excerpt, content, image_url, category, author)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialArticles = [
    {
      title: "Pentingnya Kapur dalam Pengolahan Air Bersih dan Limbah",
      slug: "pentingnya-kapur-pengolahan-air",
      excerpt: "Kapur atau kalsium hidroksida telah lama menjadi komponen vital dalam industri pengolahan air. Artikel ini membahas mengapa kapur tetap menjadi pilihan utama.",
      content: `
# Pentingnya Kapur dalam Pengolahan Air Bersih dan Limbah

Kapur (Calcium Hydroxide atau Hydrated Lime) adalah salah satu bahan kimia yang paling serbaguna dan ekonomis yang digunakan dalam pengolahan air minum dan air limbah industri. Meskipun teknologi pengolahan air terus berkembang, peran kapur tetap tak tergantikan karena efektivitasnya dalam berbagai proses kimia.

## 1. Netralisasi Asam (pH Adjustment)
Banyak air limbah industri bersifat asam yang dapat merusak infrastruktur pipa dan membahayakan ekosistem air jika langsung dibuang. Kapur digunakan untuk menaikkan pH air limbah ke tingkat netral. Dibandingkan dengan soda kaustik, kapur lebih aman ditangani dan seringkali lebih murah.

## 2. Penghilangan Kesadahan (Water Softening)
Dalam pengolahan air minum, kapur digunakan untuk menghilangkan kesadahan karbonat (kalsium dan magnesium). Proses ini penting untuk mencegah pembentukan kerak pada pipa distribusi dan peralatan rumah tangga konsumen.

## 3. Presipitasi Logam Berat
Air limbah dari industri pertambangan atau pelapisan logam sering mengandung logam berat beracun seperti tembaga, nikel, dan timbal. Kapur bereaksi dengan logam-logam ini membentuk endapan hidroksida yang tidak larut, sehingga mudah dipisahkan dari air melalui proses sedimentasi.

## 4. Koagulasi dan Flokulasi
Kapur membantu dalam proses penjernihan air dengan membantu pembentukan "flok" (gumpalan partikel kecil). Flok ini akan mengikat kotoran dan bakteri, membuatnya lebih berat sehingga mudah mengendap di dasar tangki penjernihan.

## Kesimpulan
Penggunaan kapur dalam pengolahan air bukan hanya soal biaya, tetapi juga soal efisiensi dan keamanan lingkungan. PT Indeks Industri Indonesia berkomitmen menyediakan Hydrated Lime berkualitas tinggi dengan kadar kalsium aktif yang optimal untuk memastikan proses pengolahan air Anda berjalan sempurna.
      `,
      image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
      category: "Water Treatment",
      author: "Tim Teknis Indeks"
    },
    {
      title: "Mengenal Quicklime dan Hydrated Lime: Perbedaan dan Kegunaannya",
      slug: "perbedaan-quicklime-dan-hydrated-lime",
      excerpt: "Seringkali orang bingung membedakan antara Quicklime (CaO) dan Hydrated Lime (Ca(OH)2). Mari kita bedah perbedaan mendasar dan aplikasi industrinya.",
      content: `
# Mengenal Quicklime dan Hydrated Lime: Perbedaan dan Kegunaannya

Dalam dunia industri kimia mineral, kapur hadir dalam dua bentuk utama: Quicklime (Kapur Tohor) dan Hydrated Lime (Kapur Padam). Memahami perbedaan keduanya sangat krusial untuk menentukan material mana yang paling efisien untuk kebutuhan operasional Anda.

## Apa itu Quicklime (CaO)?
Quicklime, atau Kalsium Oksida, diproduksi melalui proses kalsinasi batu kapur (kalsium karbonat) pada suhu sangat tinggi (sekitar 900-1100°C). 
- **Karakteristik:** Berbentuk bongkahan atau bubuk, sangat reaktif terhadap air (menghasilkan panas tinggi/eksotermik).
- **Kegunaan Utama:** Industri baja (sebagai fluxing agent), industri kertas, dan stabilisasi tanah skala besar.

## Apa itu Hydrated Lime (Ca(OH)2)?
Hydrated Lime, atau Kalsium Hidroksida, adalah hasil dari proses "slaking" di mana Quicklime direaksikan dengan air dalam jumlah yang terkontrol.
- **Karakteristik:** Berbentuk bubuk putih halus, lebih stabil dibandingkan Quicklime, dan lebih mudah larut dalam air untuk membentuk susu kapur.
- **Kegunaan Utama:** Pengolahan air, netralisasi limbah, industri makanan (food grade), dan bahan campuran mortar konstruksi.

## Mana yang Harus Anda Pilih?
Pemilihan antara CaO dan Ca(OH)2 tergantung pada beberapa faktor:
1. **Volume Penggunaan:** Untuk volume sangat besar, Quicklime seringkali lebih ekonomis karena biaya transportasi per unit kalsium lebih rendah (karena tidak mengandung molekul air).
2. **Fasilitas di Lokasi:** Penggunaan Quicklime memerlukan sistem "slaker" di lokasi untuk mengubahnya menjadi cairan. Jika Anda tidak memiliki alat tersebut, Hydrated Lime adalah pilihan praktis.
3. **Keamanan:** Hydrated Lime jauh lebih aman ditangani karena tidak menghasilkan panas saat terkena kelembaban.

PT Indeks Industri Indonesia menyediakan kedua jenis kapur ini dengan spesifikasi yang dapat disesuaikan dengan kebutuhan teknis industri Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
      category: "Industrial Knowledge",
      author: "Admin Indeks"
    },
    {
      title: "Peran Kapur dalam Menjaga Kualitas Tanah Pertanian",
      slug: "peran-kapur-pertanian",
      excerpt: "Tanah yang asam dapat menghambat pertumbuhan tanaman. Kapur pertanian (Dolomite) adalah solusi kunci untuk meningkatkan produktivitas lahan.",
      content: `
# Peran Kapur dalam Menjaga Kualitas Tanah Pertanian

Kesuburan tanah bukan hanya soal pupuk NPK. Salah satu faktor yang sering terabaikan oleh petani adalah tingkat keasaman (pH) tanah. Tanah yang terlalu asam (pH di bawah 5.5) dapat mengunci nutrisi sehingga tidak bisa diserap oleh akar tanaman. Di sinilah kapur pertanian berperan penting.

## Mengapa Tanah Menjadi Asam?
Tanah bisa menjadi asam karena beberapa faktor: curah hujan tinggi yang mencuci mineral basa, penggunaan pupuk kimia nitrogen secara berlebihan dalam jangka panjang, serta dekomposisi bahan organik.

## Manfaat Pengapuran (Liming):
1. **Meningkatkan pH Tanah:** Kapur menetralkan ion hidrogen yang menyebabkan keasaman.
2. **Menyediakan Nutrisi Kalsium dan Magnesium:** Kapur Dolomite mengandung Kalsium (Ca) dan Magnesium (Mg) yang esensial untuk pembentukan dinding sel tanaman dan klorofil.
3. **Meningkatkan Aktivitas Mikroba:** Mikroorganisme pengurai yang menguntungkan tanah bekerja lebih optimal pada pH netral.
4. **Meningkatkan Efisiensi Pupuk:** Pada pH yang tepat, tanaman dapat menyerap pupuk NPK secara maksimal, sehingga biaya pemupukan menjadi lebih efisien.

## Kapan Waktu Terbaik Melakukan Pengapuran?
Idealnya, pengapuran dilakukan 2-4 minggu sebelum penanaman agar kapur memiliki waktu untuk bereaksi dengan tanah. PT Indeks Industri Indonesia menyediakan Dolomite Mesh 100 dengan tingkat kehalusan tinggi untuk reaksi yang lebih cepat dan merata pada lahan pertanian Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      category: "Agriculture",
      author: "Agronomist Team"
    },
    {
      title: "Aplikasi Kapur pada Industri Baja dan Metalurgi",
      slug: "kapur-industri-baja",
      excerpt: "Dalam pembuatan baja, kapur bertindak sebagai fluxing agent yang krusial untuk menghilangkan kotoran seperti fosfor dan sulfur.",
      content: `
# Aplikasi Kapur pada Industri Baja dan Metalurgi

Baja adalah tulang punggung infrastruktur modern, dan kapur adalah pahlawan tanpa tanda jasa di balik kekuatannya. Dalam proses pembuatan baja, Quicklime (CaO) digunakan secara luas sebagai agen pembersih atau "flux".

## Peran Utama Kapur dalam Tanur Baja:
1. **Penghilangan Kotoran:** Kapur bereaksi dengan silika, fosfor, dan sulfur dalam bijih besi untuk membentuk terak (slag) cair yang kemudian dapat dipisahkan dari baja cair.
2. **Perlindungan Refraktori:** Terak yang kaya akan kapur membantu melindungi lapisan bata tahan api (refractory) di dalam tanur dari erosi kimia.
3. **Kontrol Kualitas:** Penggunaan kapur yang tepat memastikan baja memiliki tingkat kemurnian yang tinggi, yang secara langsung mempengaruhi kekuatan dan fleksibilitas produk akhir.

## Mengapa Kualitas Kapur Sangat Penting?
Industri baja memerlukan kapur dengan reaktivitas tinggi dan kadar sulfur yang sangat rendah. PT Indeks Industri Indonesia memproduksi Quicklime dengan teknologi kalsinasi modern untuk menjamin performa maksimal dalam proses metalurgi Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
      category: "Steel Industry",
      author: "Metallurgy Expert"
    },
    {
      title: "Kapur sebagai Solusi Pengendalian Emisi Gas Buang (FGD)",
      slug: "kapur-pengendalian-emisi-fgd",
      excerpt: "Pembangkit listrik tenaga uap menggunakan kapur untuk menyerap gas sulfur dioksida yang berbahaya bagi lingkungan.",
      content: `
# Kapur sebagai Solusi Pengendalian Emisi Gas Buang (FGD)

Flue Gas Desulfurization (FGD) adalah proses krusial di pembangkit listrik tenaga batubara dan industri berat untuk mengurangi polusi udara. Kapur, baik dalam bentuk Quicklime maupun Hydrated Lime, adalah reagen yang paling umum digunakan dalam sistem ini.

## Bagaimana Proses FGD Bekerja?
Gas buang yang mengandung sulfur dioksida (SO2) dialirkan melalui "scrubber" di mana ia disemprot dengan bubur kapur (lime slurry). Kapur bereaksi dengan SO2 membentuk kalsium sulfit atau kalsium sulfat (gipsum).

## Keunggulan Menggunakan Kapur untuk FGD:
- **Efisiensi Tinggi:** Dapat menghilangkan lebih dari 95% emisi SO2.
- **Produk Sampingan Berguna:** Gipsum hasil reaksi dapat digunakan kembali dalam industri semen atau papan gipsum.
- **Biaya Operasional Rendah:** Kapur adalah reagen yang paling ekonomis dibandingkan alternatif kimia lainnya.

PT Indeks Industri Indonesia mendukung komitmen lingkungan industri Anda dengan menyediakan kapur berkualitas tinggi untuk sistem FGD yang efisien.
      `,
      image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
      category: "Environment",
      author: "Eco Consultant"
    },
    {
      title: "Teknik Stabilisasi Tanah dengan Kapur untuk Infrastruktur Jalan",
      slug: "stabilisasi-tanah-kapur",
      excerpt: "Tanah lempung yang tidak stabil dapat diperkuat secara permanen menggunakan kapur, menciptakan fondasi jalan yang kokoh.",
      content: `
# Teknik Stabilisasi Tanah dengan Kapur untuk Infrastruktur Jalan

Membangun jalan di atas tanah lempung atau tanah ekspansif adalah tantangan besar bagi teknik sipil. Kapur menawarkan solusi kimia yang mengubah sifat fisik tanah secara permanen.

## Proses Kimia Stabilisasi:
1. **Modifikasi (Jangka Pendek):** Kapur segera bereaksi dengan partikel lempung, mengurangi plastisitas tanah dan membuatnya lebih mudah dikerjakan.
2. **Stabilisasi (Jangka Panjang):** Terjadi reaksi pozzolanik yang membentuk kalsium silikat hidrat, menciptakan struktur tanah yang keras seperti beton.

## Manfaat untuk Proyek Konstruksi:
- **Peningkatan Daya Dukung (CBR):** Tanah menjadi jauh lebih kuat menahan beban kendaraan.
- **Ketahanan terhadap Air:** Tanah yang distabilisasi kapur tidak mudah lembek saat terkena hujan.
- **Efisiensi Biaya:** Mengurangi kebutuhan untuk menggali dan membuang tanah asli yang buruk.

PT Indeks Industri Indonesia menyediakan Quicklime berkualitas tinggi yang sangat efektif untuk proyek stabilisasi tanah skala besar.
      `,
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
      category: "Construction",
      author: "Civil Engineer"
    },
    {
      title: "Manfaat Kapur dalam Industri Kertas dan Pulp",
      slug: "kapur-industri-kertas",
      excerpt: "Kapur digunakan dalam proses pemulihan bahan kimia di pabrik kertas, menjadikannya industri yang lebih berkelanjutan.",
      content: `
# Manfaat Kapur dalam Industri Kertas dan Pulp

Industri kertas adalah salah satu pengguna kapur terbesar. Peran utamanya adalah dalam proses "causticizing" di mana kapur digunakan untuk meregenerasi bahan kimia pemasak (white liquor).

## Siklus Pemulihan Kimia:
Dalam pabrik pulp Kraft, kapur bereaksi dengan "green liquor" untuk menghasilkan soda kaustik yang diperlukan untuk memisahkan serat selulosa dari kayu. Proses ini memungkinkan pabrik untuk mendaur ulang bahan kimia mereka berkali-kali.

## Penggunaan Lain dalam Industri Kertas:
- **Pengisi (Filler):** Calcium Carbonate (hasil reaksi kapur) digunakan sebagai pengisi untuk meningkatkan kecerahan dan kehalusan kertas.
- **Pelapis (Coating):** Memberikan permukaan kertas yang lebih baik untuk pencetakan.

PT Indeks Industri Indonesia memahami standar ketat industri kertas dan menyediakan kapur dengan kemurnian tinggi untuk mendukung efisiensi pabrik Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      category: "Paper Industry",
      author: "Process Specialist"
    },
    {
      title: "Proses Produksi Kapur: Dari Tambang hingga Produk Industri",
      slug: "proses-produksi-kapur",
      excerpt: "Pernahkah Anda bertanya bagaimana batu gunung berubah menjadi bubuk putih halus? Mari intip proses produksinya.",
      content: `
# Proses Produksi Kapur: Dari Tambang hingga Produk Industri

Kapur tidak ditemukan begitu saja di alam dalam bentuk bubuk. Ia melalui proses transformasi termal dan kimia yang intensif.

## Tahapan Produksi:
1. **Penambangan:** Batu kapur (CaCO3) diekstraksi dari tambang kuari.
2. **Kalsinasi:** Batu kapur dipanaskan dalam tanur (kiln) pada suhu di atas 900°C. Proses ini melepaskan CO2 dan menghasilkan Quicklime (CaO).
3. **Slaking (Opsi):** Quicklime direaksikan dengan air untuk menghasilkan Hydrated Lime (Ca(OH)2).
4. **Penggilingan & Klasifikasi:** Produk digiling hingga kehalusan tertentu (misalnya Mesh 200 atau 325) sesuai kebutuhan industri.

PT Indeks Industri Indonesia mengawasi setiap tahap produksi dengan kontrol kualitas yang ketat untuk memastikan produk akhir memenuhi standar tertinggi.
      `,
      image_url: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200",
      category: "Manufacturing",
      author: "Production Manager"
    },
    {
      title: "Kapur dalam Industri Makanan: Standar Food Grade dan Kegunaannya",
      slug: "kapur-industri-makanan",
      excerpt: "Kapur juga digunakan dalam pengolahan makanan, mulai dari pemurnian gula hingga pembuatan tortilla.",
      content: `
# Kapur dalam Industri Makanan: Standar Food Grade dan Kegunaannya

Mungkin mengejutkan, tetapi kapur adalah bahan tambahan makanan yang legal dan aman (E526). Namun, untuk aplikasi ini, kapur harus memenuhi standar kemurnian "Food Grade" yang sangat ketat.

## Aplikasi dalam Pengolahan Makanan:
- **Pemurnian Gula:** Kapur digunakan untuk mengendapkan kotoran dari jus tebu atau bit sebelum dikristalisasi menjadi gula.
- **Nixtamalisasi:** Proses tradisional merendam jagung dalam air kapur untuk meningkatkan nilai gizi dan rasa (digunakan dalam pembuatan tortilla).
- **Pengolahan Susu:** Digunakan untuk menetralkan keasaman dalam krim sebelum diproses menjadi mentega.

PT Indeks Industri Indonesia menyediakan Hydrated Lime dengan tingkat kemurnian tinggi yang diproses secara higienis untuk kebutuhan industri makanan Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      category: "Food Industry",
      author: "Quality Auditor"
    },
    {
      title: "Penggunaan Kapur untuk Netralisasi Air Asam Tambang",
      slug: "kapur-air-asam-tambang",
      excerpt: "Industri pertambangan menghadapi tantangan air asam tambang. Kapur adalah solusi paling efektif untuk menetralkannya.",
      content: `
# Penggunaan Kapur untuk Netralisasi Air Asam Tambang

Air Asam Tambang (Acid Mine Drainage) terjadi ketika mineral sulfida terpapar udara dan air, menghasilkan asam sulfat yang sangat korosif dan berbahaya.

## Mengapa Memilih Kapur?
Kapur adalah penetral asam yang paling kuat dan ekonomis. Ia tidak hanya menaikkan pH air, tetapi juga membantu mengendapkan logam berat yang terlarut dalam air asam tersebut.

## Metode Aplikasi:
- **Dosing Plant:** Bubur kapur ditambahkan secara otomatis ke dalam aliran air asam.
- **Open Limestone Channels:** Air dialirkan melalui saluran yang berisi batu kapur.

PT Indeks Industri Indonesia mendukung industri pertambangan yang bertanggung jawab dengan menyediakan supply kapur yang stabil untuk pengelolaan lingkungan.
      `,
      image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
      category: "Mining",
      author: "Environmental Engineer"
    },
    {
      title: "Inovasi Material: Calcium Carbonate dalam Industri Plastik dan Cat",
      slug: "calcium-carbonate-plastik-cat",
      excerpt: "Calcium Carbonate bukan hanya pengisi, tetapi juga meningkatkan properti fisik produk plastik dan cat.",
      content: `
# Inovasi Material: Calcium Carbonate dalam Industri Plastik dan Cat

Calcium Carbonate (CaCO3) adalah salah satu mineral yang paling banyak digunakan sebagai pengisi fungsional dalam industri manufaktur.

## Dalam Industri Plastik:
- **Meningkatkan Kekakuan:** Memberikan struktur yang lebih kokoh pada produk plastik.
- **Efisiensi Biaya:** Mengurangi penggunaan resin polimer yang mahal.
- **Peningkatan Panas:** Membantu distribusi panas yang lebih baik selama proses ekstrusi.

## Dalam Industri Cat:
- **Daya Tutup (Opacity):** Meningkatkan kemampuan cat untuk menutup permukaan.
- **Kontrol Kilap:** Membantu mengatur tingkat gloss pada cat tembok.

PT Indeks Industri Indonesia menyediakan Calcium Carbonate dengan berbagai ukuran partikel (mesh) untuk memenuhi spesifikasi teknis produk manufaktur Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200",
      category: "Manufacturing",
      author: "Material Scientist"
    },
    {
      title: "Pentingnya Sertifikasi COA dan MSDS dalam Pembelian Material Industri",
      slug: "pentingnya-coa-msds-material-industri",
      excerpt: "Keamanan dan kualitas adalah prioritas. Pahami mengapa Anda harus selalu meminta dokumen ini dari supplier Anda.",
      content: `
# Pentingnya Sertifikasi COA dan MSDS dalam Pembelian Material Industri

Dalam dunia industri berat, membeli material bukan hanya soal harga. Keamanan operasional dan konsistensi kualitas adalah segalanya.

## Apa itu COA (Certificate of Analysis)?
Dokumen ini merinci hasil pengujian laboratorium untuk batch produk tertentu. Ia menjamin bahwa material yang Anda terima memenuhi spesifikasi teknis yang dijanjikan (misalnya kadar CaO minimal 90%).

## Apa itu MSDS (Material Safety Data Sheet)?
Dokumen ini berisi informasi krusial mengenai penanganan aman, risiko kesehatan, prosedur darurat, dan instruksi penyimpanan material. Ini adalah panduan wajib bagi tim K3 di pabrik Anda.

PT Indeks Industri Indonesia selalu menyertakan COA dan MSDS untuk setiap pengiriman produk kami, memberikan ketenangan pikiran bagi operasional Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
      category: "Safety & Quality",
      author: "Compliance Officer"
    },
    {
      title: "Strategi Logistik Material Curah: Menjamin Supply Chain Industri",
      slug: "logistik-material-curah-industri",
      excerpt: "Bagaimana menjamin supply kapur ribuan ton per bulan tetap lancar? Simak strategi logistik kami.",
      content: `
# Strategi Logistik Material Curah: Menjamin Supply Chain Industri

Bagi pabrik yang beroperasi 24/7, keterlambatan supply bahan baku berarti kerugian besar. Logistik material curah seperti kapur memerlukan perencanaan yang matang.

## Tantangan Logistik Curah:
- **Volume Besar:** Memerlukan armada truk yang banyak dan andal.
- **Perlindungan Cuaca:** Kapur harus tetap kering selama perjalanan untuk mencegah reaksi dini.
- **Ketepatan Waktu:** Sinkronisasi antara jadwal produksi supplier dan kebutuhan user.

PT Indeks Industri Indonesia mengelola armada logistik mandiri dan bekerja sama dengan mitra strategis untuk memastikan supply kapur Anda tidak pernah terputus, di mana pun lokasi pabrik Anda.
      `,
      image_url: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200",
      category: "Logistics",
      author: "Logistics Manager"
    },
    {
      title: "Kapur vs Soda Kaustik: Perbandingan Efisiensi Biaya dalam Water Treatment",
      slug: "perbandingan-kapur-vs-soda-kaustik",
      excerpt: "Mana yang lebih hemat untuk netralisasi pH? Mari kita hitung perbandingan efektivitas dan biayanya.",
      content: `
# Kapur vs Soda Kaustik: Perbandingan Efisiensi Biaya dalam Water Treatment

Dua bahan kimia paling umum untuk netralisasi pH adalah Hydrated Lime dan Soda Kaustik (NaOH). Meskipun keduanya efektif, kapur seringkali menang dalam hal efisiensi biaya.

## Perbandingan Teknis:
1. **Kekuatan Netralisasi:** Secara molekuler, kapur memiliki kapasitas netralisasi yang sangat baik per kilogramnya.
2. **Harga:** Harga pasar kapur per ton biasanya jauh lebih rendah dibandingkan soda kaustik.
3. **Penanganan:** Kapur lebih aman disimpan dan tidak menyebabkan luka bakar kimia separah soda kaustik cair.

## Kapan Kapur Menjadi Pemenang?
Untuk instalasi pengolahan air skala menengah hingga besar, penghematan biaya dengan beralih ke kapur bisa mencapai jutaan rupiah per bulan. PT Indeks Industri Indonesia siap membantu Anda menghitung potensi penghematan ini.
      `,
      image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
      category: "Cost Optimization",
      author: "Financial Analyst"
    },
    {
      title: "Masa Depan Industri Kapur: Keberlanjutan dan Teknologi Ramah Lingkungan",
      slug: "masa-depan-industri-kapur",
      excerpt: "Industri kapur terus bertransformasi menuju proses produksi yang lebih hijau dan rendah karbon.",
      content: `
# Masa Depan Industri Kapur: Keberlanjutan dan Teknologi Ramah Lingkungan

Sebagai industri yang intensif energi, masa depan produksi kapur terletak pada inovasi teknologi yang mengurangi dampak lingkungan.

## Tren Masa Depan:
- **Carbon Capture:** Menangkap emisi CO2 dari tanur kalsinasi untuk digunakan kembali atau disimpan.
- **Bahan Bakar Alternatif:** Menggunakan biomassa atau limbah sebagai sumber energi panas tanur.
- **Efisiensi Energi:** Desain tanur modern yang meminimalkan kehilangan panas.

PT Indeks Industri Indonesia berkomitmen untuk terus berinvestasi dalam teknologi yang lebih bersih guna memastikan industri kami tetap relevan dan bertanggung jawab di masa depan.
      `,
      image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
      category: "Sustainability",
      author: "Innovation Lead"
    }
  ];

  for (const a of initialArticles) {
    insertArticle.run(a.title, a.slug, a.excerpt, a.content, a.image_url, a.category, a.author);
  }
}

// Seed admin if empty
const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
if (adminCount.count === 0) {
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", "admin123");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve uploaded files
  const absoluteUploadDir = path.resolve(uploadDir);
  console.log("Serving uploads from:", absoluteUploadDir);
  app.use("/uploads", express.static(absoluteUploadDir));

  // API Routes
  app.post("/api/admin/upload", upload.single("image"), (req, res) => {
    console.log("Upload request received");
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File uploaded to:", req.file.path);
    
    // Verify file exists
    if (fs.existsSync(req.file.path)) {
      console.log("File verification: EXISTS");
    } else {
      console.log("File verification: MISSING!");
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  app.get("/api/products", (req, res) => {
    try {
      // Check if updated_at column exists
      const tableInfo = db.prepare("PRAGMA table_info(products)").all() as any[];
      const hasUpdatedAt = tableInfo.some(col => col.name === 'updated_at');
      
      let query = "SELECT * FROM products ORDER BY created_at DESC";
      if (hasUpdatedAt) {
        query = "SELECT * FROM products ORDER BY updated_at DESC, created_at DESC";
      }
      
      const products = db.prepare(query).all();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.get("/api/products/:slug/related", (req, res) => {
    const product = db.prepare("SELECT category, id FROM products WHERE slug = ?").get(req.params.slug) as { category: string, id: number };
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    const related = db.prepare("SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4").all(product.category, product.id);
    res.json(related);
  });

  app.get("/api/testimonials", (req, res) => {
    const testimonials = db.prepare("SELECT * FROM testimonials ORDER BY created_at DESC").all();
    res.json(testimonials);
  });

  app.get("/api/articles", (req, res) => {
    const articles = db.prepare("SELECT * FROM articles ORDER BY created_at DESC").all();
    res.json(articles);
  });

  app.get("/api/articles/:slug", (req, res) => {
    const article = db.prepare("SELECT * FROM articles WHERE slug = ?").get(req.params.slug);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  });

  app.post("/api/inquiries", (req, res) => {
    const { name, company, whatsapp, email, product_id, product_name, quantity, location, notes } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO inquiries (name, company, whatsapp, email, product_id, product_name, quantity, location, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, company, whatsapp, email, product_id, product_name, quantity, location, notes);
      
      // In a real app, send WhatsApp/Email here
      console.log(`New Inquiry from ${name} for ${product_name}`);
      
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to save inquiry" });
    }
  });

  app.post("/api/sample-requests", async (req, res) => {
    const { picName, company, position, email, whatsapp, product, monthlyVolume, address, notes } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO sample_requests (pic_name, company, position, email, whatsapp, product, monthly_volume, address, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(picName, company, position, email, whatsapp, product, monthlyVolume, address, notes);
      
      console.log(`New Sample Request from ${picName} (${company}) for ${product}`);

      // Trigger Webhook if configured
      try {
        const webhookSetting = db.prepare("SELECT value FROM settings WHERE key = 'google_sheets_webhook'").get() as { value: string } | undefined;
        if (webhookSetting && webhookSetting.value) {
          fetch(webhookSetting.value, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'new_sample_request',
              data: {
                id: result.lastInsertRowid,
                picName,
                company,
                position,
                email,
                whatsapp,
                product,
                monthlyVolume,
                address,
                notes,
                date: new Date().toISOString()
              }
            })
          }).catch(err => console.error("Webhook fetch error:", err));
        }
      } catch (webhookError) {
        console.error("Webhook processing error:", webhookError);
      }

      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error saving sample request:", error);
      res.status(500).json({ error: "Failed to save sample request" });
    }
  });

  app.get("/api/admin/sample-requests", (req, res) => {
    try {
      const requests = db.prepare("SELECT * FROM sample_requests ORDER BY created_at DESC").all();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sample requests" });
    }
  });

  app.post("/api/admin/sample-requests/sync", async (req, res) => {
    try {
      const webhookSetting = db.prepare("SELECT value FROM settings WHERE key = 'google_sheets_webhook'").get() as { value: string } | undefined;
      
      if (!webhookSetting || !webhookSetting.value) {
        return res.status(400).json({ error: "Webhook URL not configured in Settings" });
      }

      const webhookUrl = webhookSetting.value.trim();
      
      if (!webhookUrl.endsWith('/exec')) {
        return res.status(400).json({ error: "URL Webhook sepertinya salah. Pastikan URL berakhiran dengan '/exec' (bukan /edit atau lainnya)." });
      }

      let requests = db.prepare("SELECT * FROM sample_requests ORDER BY created_at DESC").all();
      
      // If empty, insert a dummy request so the user can see it works
      if (requests.length === 0) {
        const dummyResult = db.prepare(`
          INSERT INTO sample_requests (pic_name, company, position, email, whatsapp, product, monthly_volume, address, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run('Budi Santoso (Test)', 'PT Contoh Sukses', 'Manager', 'budi@contoh.com', '081234567890', 'Kalsium Karbonat', '50', 'Jl. Industri No. 1, Jakarta', 'Ini adalah data percobaan otomatis.');
        
        requests = db.prepare("SELECT * FROM sample_requests ORDER BY created_at DESC").all();
      }
      
      const payload = {
        type: 'sync_all_samples',
        data: requests.map((req: any) => ({
          id: req.id,
          picName: req.pic_name,
          company: req.company,
          position: req.position,
          email: req.email,
          whatsapp: req.whatsapp,
          product: req.product,
          monthlyVolume: req.monthly_volume,
          address: req.address,
          notes: req.notes,
          date: new Date(req.created_at).toISOString(),
          status: req.status
        }))
      };

      // Google Apps Script requires following redirects, which fetch does by default
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const responseText = await response.text();
      let isSuccess = false;
      let errorMessage = "Gagal terhubung ke Google Sheets.";

      try {
        const json = JSON.parse(responseText);
        if (json.status === 'success') {
          isSuccess = true;
        } else if (json.status === 'error') {
          errorMessage = `Error dari Google Sheets: ${json.message}`;
        }
      } catch (e) {
        // If it's not JSON, it might be an HTML error page from Google (e.g. login required)
        errorMessage = `Gagal terhubung. Pastikan akses Web App diatur ke 'Anyone'. Respons: ${responseText.substring(0, 100)}...`;
        console.error("Non-JSON response from webhook:", responseText.substring(0, 200));
      }

      if (!response.ok || !isSuccess) {
        throw new Error(errorMessage);
      }

      res.json({ success: true, count: requests.length });
    } catch (error: any) {
      console.error("Sync error:", error);
      res.status(500).json({ error: error.message || "Failed to sync with Google Sheets" });
    }
  });

  app.patch("/api/admin/sample-requests/:id", (req, res) => {
    const { status, shipping_date, tracking_number, pic_name, company, position, email, whatsapp, product, monthly_volume, address, notes } = req.body;
    try {
      const fields = [];
      const values = [];

      if (status !== undefined) { fields.push("status = ?"); values.push(status); }
      if (shipping_date !== undefined) { fields.push("shipping_date = ?"); values.push(shipping_date); }
      if (tracking_number !== undefined) { fields.push("tracking_number = ?"); values.push(tracking_number); }
      if (pic_name !== undefined) { fields.push("pic_name = ?"); values.push(pic_name); }
      if (company !== undefined) { fields.push("company = ?"); values.push(company); }
      if (position !== undefined) { fields.push("position = ?"); values.push(position); }
      if (email !== undefined) { fields.push("email = ?"); values.push(email); }
      if (whatsapp !== undefined) { fields.push("whatsapp = ?"); values.push(whatsapp); }
      if (product !== undefined) { fields.push("product = ?"); values.push(product); }
      if (monthly_volume !== undefined) { fields.push("monthly_volume = ?"); values.push(monthly_volume); }
      if (address !== undefined) { fields.push("address = ?"); values.push(address); }
      if (notes !== undefined) { fields.push("notes = ?"); values.push(notes); }

      if (fields.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      values.push(req.params.id);
      db.prepare(`UPDATE sample_requests SET ${fields.join(", ")} WHERE id = ?`).run(...values);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update sample request" });
    }
  });

  app.patch("/api/admin/sample-requests/:id/status", (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE sample_requests SET status = ? WHERE id = ?").run(status, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update sample request status" });
    }
  });

  app.delete("/api/admin/sample-requests/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM sample_requests WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sample request" });
    }
  });

  app.post("/api/analytics/track", (req, res) => {
    const { event_type, page_path, product_id, referrer } = req.body;
    const user_agent = req.headers["user-agent"];
    try {
      db.prepare(`
        INSERT INTO analytics (event_type, page_path, product_id, referrer, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `).run(event_type, page_path, product_id, referrer, user_agent);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track analytics" });
    }
  });

  // Admin Routes (Simple Auth for demo)
// Settings Endpoints
app.get('/api/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings').all();
  const settingsObj = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.json(settingsObj);
});

app.post('/api/admin/settings', (req, res) => {
  const updates = req.body;
  const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  
  const transaction = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) {
      updateStmt.run(key, value);
    }
  });

  try {
    transaction(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare("SELECT * FROM admins WHERE username = ? AND password = ?").get(username, password);
    if (admin) {
      res.json({ success: true, token: "mock-jwt-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    // Basic stats
    const totalInquiries = db.prepare("SELECT COUNT(*) as count FROM inquiries").get() as { count: number };
    const totalVisitors = db.prepare("SELECT COUNT(DISTINCT user_agent) as count FROM analytics WHERE event_type = 'page_view'").get() as { count: number };
    const whatsappClicks = db.prepare("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'whatsapp_click'").get() as { count: number };
    
    // Quotation stats
    const totalQuotations = db.prepare("SELECT COUNT(*) as count FROM quotations").get() as { count: number };
    const wonQuotations = db.prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'Won'").get() as { count: number };
    const lostQuotations = db.prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'Lost'").get() as { count: number };
    const totalRevenue = db.prepare("SELECT SUM(total_price) as sum FROM quotations WHERE status = 'Won'").get() as { sum: number };

    const recentInquiries = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 10").all();
    const popularProducts = db.prepare(`
      SELECT p.name, COUNT(a.id) as views 
      FROM products p 
      LEFT JOIN analytics a ON p.id = a.product_id 
      WHERE a.event_type = 'page_view'
      GROUP BY p.id 
      ORDER BY views DESC 
      LIMIT 5
    `).all();

    res.json({
      totalInquiries: totalInquiries.count,
      totalVisitors: totalVisitors.count,
      whatsappClicks: whatsappClicks.count,
      totalQuotations: totalQuotations.count,
      wonQuotations: wonQuotations.count,
      lostQuotations: lostQuotations.count,
      totalRevenue: totalRevenue.sum || 0,
      recentInquiries,
      popularProducts
    });
  });

  app.get("/api/admin/customers", (req, res) => {
    try {
      const customers = db.prepare("SELECT * FROM customers ORDER BY company_name ASC").all();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/admin/quotations", (req, res) => {
    const quotations = db.prepare("SELECT * FROM quotations ORDER BY created_at DESC").all();
    res.json(quotations);
  });

  app.post("/api/admin/quotations", (req, res) => {
    const { 
      inquiry_id, buyer_name, company, buyer_address, whatsapp, email, 
      product_name, quantity, unit_price, total_price, 
      tax_type, tax_amount, grand_total, po_number, npwp,
      lead_time, payment_terms, delivery_terms, notes 
    } = req.body;
    
    const quotation_number = generateQuotationNumber(tax_type);
    
    try {
      let lastInsertRowid;
      db.transaction(() => {
        const result = db.prepare(`
          INSERT INTO quotations (
            quotation_number, inquiry_id, buyer_name, company, buyer_address, whatsapp, email, 
            product_name, quantity, unit_price, total_price, 
            tax_type, tax_amount, grand_total, po_number, npwp,
            lead_time, payment_terms, delivery_terms, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          quotation_number, inquiry_id, buyer_name, company, buyer_address, whatsapp, email, 
          product_name, quantity, unit_price, total_price, 
          tax_type, tax_amount, grand_total, po_number, npwp,
          lead_time, payment_terms, delivery_terms, notes
        );
        lastInsertRowid = result.lastInsertRowid;
        
        // Update inquiry status if linked
        if (inquiry_id) {
          db.prepare("UPDATE inquiries SET status = 'contacted' WHERE id = ?").run(inquiry_id);
        }

        // Upsert customer
        if (company) {
          db.prepare(`
            INSERT INTO customers (company_name, pic_name, address, npwp, whatsapp, email)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(company_name) DO UPDATE SET
              pic_name = excluded.pic_name,
              address = excluded.address,
              npwp = excluded.npwp,
              whatsapp = excluded.whatsapp,
              email = excluded.email,
              updated_at = CURRENT_TIMESTAMP
          `).run(company, buyer_name, buyer_address, npwp, whatsapp, email);
        }
      })();
      
      res.json({ success: true, id: lastInsertRowid, quotation_number });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create quotation" });
    }
  });

  app.put("/api/admin/quotations/:id", (req, res) => {
    const { 
      buyer_name, company, buyer_address, whatsapp, email, 
      product_name, quantity, unit_price, total_price, 
      tax_type, tax_amount, grand_total, po_number, npwp,
      lead_time, payment_terms, delivery_terms, notes 
    } = req.body;
    
    try {
      db.transaction(() => {
        db.prepare(`
          UPDATE quotations SET
            buyer_name = ?, company = ?, buyer_address = ?, whatsapp = ?, email = ?, 
            product_name = ?, quantity = ?, unit_price = ?, total_price = ?, 
            tax_type = ?, tax_amount = ?, grand_total = ?, po_number = ?, npwp = ?,
            lead_time = ?, payment_terms = ?, delivery_terms = ?, notes = ?
          WHERE id = ?
        `).run(
          buyer_name, company, buyer_address, whatsapp, email, 
          product_name, quantity, unit_price, total_price, 
          tax_type, tax_amount, grand_total, po_number, npwp,
          lead_time, payment_terms, delivery_terms, notes,
          req.params.id
        );

        if (company) {
          db.prepare(`
            INSERT INTO customers (company_name, pic_name, address, npwp, whatsapp, email)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(company_name) DO UPDATE SET
              pic_name = excluded.pic_name,
              address = excluded.address,
              npwp = excluded.npwp,
              whatsapp = excluded.whatsapp,
              email = excluded.email,
              updated_at = CURRENT_TIMESTAMP
          `).run(company, buyer_name, buyer_address, npwp, whatsapp, email);
        }
      })();
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating quotation:", error);
      res.status(500).json({ error: "Failed to update quotation" });
    }
  });

  app.patch("/api/admin/quotations/:id/status", (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE quotations SET status = ? WHERE id = ?").run(status, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update quotation status" });
    }
  });

  app.delete("/api/admin/quotations/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM quotations WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quotation" });
    }
  });

  app.delete("/api/admin/customers/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  app.get("/api/admin/inquiries", (req, res) => {
    const inquiries = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
    res.json(inquiries);
  });

  app.delete("/api/admin/inquiries/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM inquiries WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  app.patch("/api/admin/inquiries/:id/status", (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.post("/api/admin/products", (req, res) => {
    const { name, slug, description, specs, capacity, min_order, image_url, category, label } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO products (name, slug, description, specs, capacity, min_order, image_url, category, label, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(name, slug, description, specs, capacity, min_order, image_url, category, label);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Add product error:", error);
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.put("/api/admin/products/:id", (req, res) => {
    const { name, slug, description, specs, capacity, min_order, image_url, category, label } = req.body;
    console.log(`[ADMIN] Updating product ${req.params.id}`);
    console.log(`[ADMIN] New Image URL: ${image_url}`);
    
    try {
      const result = db.prepare(`
        UPDATE products 
        SET name = ?, slug = ?, description = ?, specs = ?, capacity = ?, min_order = ?, image_url = ?, category = ?, label = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(name, slug, description, specs, capacity, min_order, image_url, category, label, req.params.id);
      
      if (result.changes > 0) {
        const updatedProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
        console.log(`[ADMIN] Successfully updated product ${req.params.id}. New updated_at: ${updatedProduct.updated_at}`);
        res.json({ success: true, product: updatedProduct });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("[ADMIN] Update error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
