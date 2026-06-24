import React from 'react';
import { ShieldCheck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-neutral-400 text-sm border-t border-neutral-900">
      {/* Top Value Proposition Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-neutral-900">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-white shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-medium mb-1">Authentic curation</h4>
            <p className="text-neutral-500 text-xs">Direct from designers, strictly verified materials.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <RefreshCw className="w-6 h-6 text-white shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-medium mb-1">Circular fashion</h4>
            <p className="text-neutral-500 text-xs">Return packaging or old pieces for store credits.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 text-white shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-medium mb-1">Inquiries & Support</h4>
            <p className="text-neutral-500 text-xs">Support team active 24/7 at support@softwear.com</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold text-xs tracking-widest uppercase mb-4">Shop</h3>
          <ul className="space-y-2.5 text-xs text-neutral-500">
            <li><a href="/products?category=Outerwear" className="hover:text-white transition-colors">Outerwear</a></li>
            <li><a href="/products?category=Knitwear" className="hover:text-white transition-colors">Knitwear</a></li>
            <li><a href="/products?category=Basics" className="hover:text-white transition-colors">Basics</a></li>
            <li><a href="/products?category=Accessories" className="hover:text-white transition-colors">Accessories</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-xs tracking-widest uppercase mb-4">About</h3>
          <ul className="space-y-2.5 text-xs text-neutral-500">
            <li><a href="#" className="hover:text-white transition-colors">Our Philosophy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainabilty</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Press Room</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-xs tracking-widest uppercase mb-4">Support</h3>
          <ul className="space-y-2.5 text-xs text-neutral-500">
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sizing Charts</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-xs tracking-widest uppercase mb-4">Softwear</h3>
          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
            A brand focused on minimalist designs, elevated essentials, and ethical manufacturing practices.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-neutral-600">© 2026 Softwear</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
