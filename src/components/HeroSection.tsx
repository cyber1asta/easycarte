import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsla(38,80%,55%,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsla(160,50%,30%,0.2) 0%, transparent 50%)" }}
      />
      {/* Geometric accent */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full border border-gold/10 animate-float opacity-40" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full border border-gold/5 animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-gold/10 text-gold-light border border-gold/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="text-primary-foreground">{t.hero.title} </span>
            <span className="text-gradient-gold">{t.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <Link to="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-gold text-accent-foreground font-semibold text-sm shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all hover:scale-105"
            >
              {t.hero.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#templates"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-primary-foreground/20 text-primary-foreground/90 font-medium text-sm hover:bg-primary-foreground/5 transition-all"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-primary-foreground/50 text-sm"
          >
            <span>{t.hero.startingFrom}</span>
            <span className="text-gold font-bold text-lg">149 {t.currency}</span>
            <span>{t.hero.perCard}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
