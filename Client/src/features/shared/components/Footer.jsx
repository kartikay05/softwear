import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Mail } from 'lucide-react';

/* Pinterest SVG icon (not in lucide) */
const PinterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

export const Footer = () => {
  const shopLinks = [
    { label: 'Outerwear',   href: '/products?category=Outerwear'  },
    { label: 'Knitwear',    href: '/products?category=Knitwear'   },
    { label: 'Basics',      href: '/products?category=Basics'     },
    { label: 'Accessories', href: '/products?category=Accessories'},
    { label: 'New Arrivals',href: '/products?sort=-createdAt'      },
  ];
  const aboutLinks = [
    { label: 'Our Philosophy', href: '#' },
    { label: 'Sustainability',  href: '#' },
    { label: 'Careers',         href: '#' },
    { label: 'Press Room',      href: '#' },
  ];
  const supportLinks = [
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Sizing Charts',      href: '#' },
    { label: 'FAQ',                href: '#' },
    { label: 'Store Locator',      href: '#' },
  ];

  return (
    <footer style={{ backgroundColor: '#1a1512', color: '#a09080' }}>

      {/* Top value props */}
      <div
        className="border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { Icon: ShieldCheck, title: 'Authentic curation',   body: 'Direct from designers, strictly verified materials.' },
            { Icon: RefreshCw,   title: 'Circular fashion',      body: 'Return packaging or old pieces for store credits.'  },
            { Icon: Mail,        title: 'Inquiries & Support',   body: 'Support team active 24/7 at support@softwear.com'  },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4">
              <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--sw-primary-light)' }} />
              <div>
                <h4 className="font-medium text-sm mb-1" style={{ color: '#f3f0f0' }}>
                  {title}
                </h4>
                <p className="text-xs leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-4 group">
            <span
              className="text-2xl italic"
              style={{ fontFamily: 'var(--font-headline)', color: '#f3f0f0', fontWeight: 400 }}
            >
              Softwear
            </span>
          </Link>
          <p className="text-xs leading-relaxed mb-5 max-w-[200px]">
            Minimalist designs, elevated essentials, and ethical manufacturing.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {[
              // { Icon: Instagram,    label: 'Instagram', href: '#' },
              // { Icon: Twitter,      label: 'X (Twitter)', href: '#' },
              { Icon: PinterestIcon,label: 'Pinterest',  href: '#' },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-2 rounded-lg transition-colors duration-200 hover:text-white"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#a09080',
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <FooterColumn title="Shop" links={shopLinks} />

        {/* About */}
        <FooterColumn title="About" links={aboutLinks} />

        {/* Support */}
        <FooterColumn title="Support" links={supportLinks} />
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs">© 2026 Softwear Design Studio. All rights reserved.</span>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => (
  <div>
    <h3
      className="text-[11px] font-semibold uppercase tracking-widest mb-4"
      style={{ color: '#f3f0f0' }}
    >
      {title}
    </h3>
    <ul className="space-y-2.5">
      {links.map(({ label, href }) => (
        <li key={label}>
          <a
            href={href}
            className="text-xs transition-colors duration-200 hover:text-white"
            style={{ color: '#a09080' }}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
