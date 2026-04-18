import { useI18n, Lang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/easycarte-logo.jpeg";

const langLabels: Record<Lang, string> = { fr: "FR", en: "EN", ar: "عربي" };
const langs: Lang[] = ["fr", "en", "ar"];

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.create, path: "/create" },
    { label: t.nav.pricing, path: "/pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Easy Carte logo"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-accent/40"
          />
          <span className="font-display font-bold text-lg text-foreground">Easy Carte</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === item.path ? "text-accent" : "text-muted-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
              <Globe className="w-4 h-4" />
              <span>{langLabels[lang]}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 glass rounded-lg p-1 min-w-[80px]"
                >
                  {langs.map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${l === lang ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >{langLabels[l]}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-border"
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >{item.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
