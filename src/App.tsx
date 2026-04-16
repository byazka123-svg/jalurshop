/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate,
  useLocation
} from 'react-router-dom';
import Markdown from 'react-markdown';
import { 
  Search, 
  ShoppingBag, 
  Star, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronRight, 
  Github, 
  Twitter, 
  Instagram,
  Filter,
  MessageCircle,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Copy,
  Check,
  Link as LinkIcon
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, Product } from './types';
import { cn } from './lib/utils';
import { fetchProducts, fetchProductBySlug, fetchCategories } from './services/strapi';
import { useSearchParams } from 'react-router-dom';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.slug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl md:rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all overflow-hidden flex flex-col relative"
    >
      <button 
        onClick={copyLink}
        className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-primary hover:bg-white transition-all shadow-sm md:opacity-0 group-hover:opacity-100"
        title="Salin Link"
      >
        {isCopied ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} />}
      </button>

      <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 md:top-4 md:left-4">
          <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/90 backdrop-blur-sm text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-3 md:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1 md:mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="md:w-[12px] md:h-[12px]" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
            ))}
          </div>
        </div>
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] md:text-sm text-slate-500 mb-3 md:mb-6 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>
        
        <div className="mt-auto pt-2 md:pt-4 border-t border-slate-50">
          <Link 
            to={`/product/${product.slug}`}
            className="w-full flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 bg-primary text-white rounded-xl md:rounded-2xl text-xs md:text-base font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Lihat Produk
            <ChevronRight size={14} className="md:w-[18px] md:h-[18px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const setCategory = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-32 bg-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
              Review jujur <span className="text-secondary">produk pilihan</span>
            </h1>
            <div className="flex justify-center gap-4">
              <a href="#products" className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                Lihat Katalog
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Filter */}
      <section id="products" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex-1 max-w-md">
              <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Katalog Produk</h2>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                    selectedCategory === cat 
                      ? "bg-secondary text-white shadow-lg shadow-orange-100" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode='popLayout'>
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-slate-100 animate-pulse aspect-[4/5] rounded-3xl" />
                ))
              ) : (
                filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </AnimatePresence>
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Produk tidak ditemukan</h3>
              <p className="text-slate-500">Coba gunakan kata kunci lain atau pilih kategori berbeda.</p>
              <button 
                onClick={() => {setSearchQuery(''); setCategory('All');}}
                className="mt-6 text-indigo-600 font-bold hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      const data = await fetchProductBySlug(slug);
      if (data) {
        setProduct(data);
        setActiveImage(data.image);
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [slug]);

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Jalur Shop',
      text: product?.description || 'Lihat produk menarik ini di Jalur Shop!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <button onClick={() => navigate('/')} className="text-primary font-bold">Kembali ke Home</button>
      </div>
    );
  }

  const allImages = [product.image, ...product.gallery];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-100"
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                  activeImage === img ? "border-primary shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="px-4 py-1.5 bg-blue-50 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4 inline-block">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-lg font-bold text-slate-900">{product.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <a 
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
            >
              Beli di Marketplace
              <ExternalLink size={22} />
            </a>
            <button 
              onClick={handleShare}
              className="p-5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center relative"
            >
              {isCopied ? <Check size={24} className="text-green-500" /> : <Share2 size={24} />}
              {isCopied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Link disalin!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Blog-style Review Section */}
      <div className="border-t border-slate-200 pt-20 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Review Jujur</h2>
          <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
        </div>
        
        <div className="prose prose-slate prose-lg max-w-none bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="markdown-body">
            <Markdown>{product.longReview}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <ShoppingBag size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Jalur <span className="text-secondary">Shop</span></span>
              </Link>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Home</Link>
                <a href="/#products" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Katalog</a>
                <a 
                  href="https://chat.whatsapp.com/your-group-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full text-sm font-bold hover:bg-green-600 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle size={18} />
                  Join WhatsApp
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
              >
                <div className="px-4 pt-2 pb-6 space-y-4">
                  <div className="flex flex-col gap-4">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700">Home</Link>
                    <a href="/#products" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700">Katalog</a>
                    <a 
                      href="https://chat.whatsapp.com/your-group-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-2xl font-bold"
                    >
                      <MessageCircle size={20} />
                      Join WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
        </Routes>

        {/* WhatsApp CTA (Only on Home) */}
        <Routes>
          <Route path="/" element={
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20 rotate-3">
                  <MessageCircle size={40} className="text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Join Komunitas</h2>
                <div className="flex justify-center">
                  <a 
                    href="https://chat.whatsapp.com/your-group-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-10 py-5 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-xl shadow-green-900/40 hover:-translate-y-1 active:scale-95"
                  >
                    <MessageCircle size={24} />
                    Join Grup WhatsApp
                  </a>
                </div>
              </div>
            </section>
          } />
        </Routes>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="max-w-md">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">Jalur <span className="text-secondary">Shop</span></span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Platform showcase produk affiliate terpercaya. Kami mengkurasi produk terbaik dari berbagai marketplace untuk kemudahan belanja Anda.
                </p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-secondary hover:text-white transition-all">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all">
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-xs text-center">
                &copy; {new Date().getFullYear()} Jalur Shop. All rights reserved. Made with ❤️ for smart shoppers.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
