import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Mail, ArrowRight } from 'lucide-react';

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: 'Authentic Curation',
    desc: 'Direct from designers, strictly verified materials.',
  },
  {
    icon: RefreshCw,
    title: 'Circular Fashion',
    desc: 'Return packaging or old pieces for store credits.',
  },
  {
    icon: Mail,
    title: 'Inquiries & Support',
    desc: 'Support team active 24/7 at support@softwear.com',
  },
];

const FOOTER_LINKS = {
  Shop: [
    { label: 'Outerwear',   href: '/products?category=Outerwear' },
    { label: 'Knitwear',    href: '/products?category=Knitwear' },
    { label: 'Basics',      href: '/products?category=Basics' },
    { label: 'Accessories', href: '/products?category=Accessories' },
  ],
  About: [
    { label: 'Our Philosophy',  href: '#' },
    { label: 'Sustainability',  href: '#' },
    { label: 'Careers',         href: '#' },
    { label: 'Press Room',      href: '#' },
  ],
  Support: [
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Sizing Charts',      href: '#' },
    { label: 'FAQ',                href: '#' },
    { label: 'Store Locator',      href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--color-inverse-surface)',
        color: 'var(--color-inverse-on-surface)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── Newsletter Strip ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="page-container py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p
                className="text-headline-sm"
                style={{ fontStyle: 'italic', color: 'var(--color-primary-fixed-dim)' }}
              >
                Stay in the loop.
              </p>
              <p className="text-body-sm mt-1" style={{ color: 'rgba(243,240,240,0.55)' }}>
                New arrivals, exclusive drops, and editorial stories.
              </p>
            </div>
            <form
              className="flex w-full sm:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-inverse-on-surface)',
                  padding: '0.625rem 1rem',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-fixed-dim)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
              <button
                type="submit"
                className="flex items-center gap-2"
                style={{
                  background: 'var(--color-primary-container)',
                  color: 'var(--color-on-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-label)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary-container)')}
              >
                Subscribe <ArrowRight size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Trust Badges ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
                style={{
                  background: 'rgba(255,181,161,0.12)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-primary-fixed-dim)',
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <h4 className="text-body-sm font-semibold mb-1" style={{ color: 'var(--color-inverse-on-surface)' }}>
                  {title}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(243,240,240,0.5)', lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Links ── */}
      <div className="page-container py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div>
          <h3
            className="text-headline-sm mb-4"
            style={{ fontStyle: 'italic', color: 'var(--color-primary-fixed-dim)' }}
          >
            Softwear
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(243,240,240,0.5)', lineHeight: 1.7, maxWidth: '18ch' }}>
            Minimalist designs, elevated essentials, and ethical manufacturing practices.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 'var(--radius)',
                color: 'rgba(243,240,240,0.6)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,181,161,0.15)'; e.currentTarget.style.color = 'var(--color-primary-fixed-dim)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(243,240,240,0.6)'; }}
            >
              {/* <Instagram size={14} /> */}
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 'var(--radius)',
                color: 'rgba(243,240,240,0.6)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,181,161,0.15)'; e.currentTarget.style.color = 'var(--color-primary-fixed-dim)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(243,240,240,0.6)'; }}
            >
              {/* <Twitter size={14} /> */}
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section}>
            <h3 className="text-label-md mb-5" style={{ color: 'rgba(243,240,240,0.4)' }}>
              {section}
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors duration-150"
                    style={{ fontSize: '0.8125rem', color: 'rgba(243,240,240,0.55)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-inverse-on-surface)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(243,240,240,0.55)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: '0.8125rem', color: 'rgba(243,240,240,0.35)' }}>
            © {new Date().getFullYear()} Softwear. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-150"
                style={{ fontSize: '0.75rem', color: 'rgba(243,240,240,0.35)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(243,240,240,0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(243,240,240,0.35)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
