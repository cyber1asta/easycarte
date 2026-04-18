import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

type Template = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  is_active: boolean;
  category: string;
};

const PricingPage = () => {
  const { t } = useI18n();
  const { rows: templates, loading } = useRealtimeTable<Template>("templates", {
    orderBy: { column: "price", ascending: true },
    filter: (row) => row.is_active,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t.nav.pricing}</h1>
            <p className="text-muted-foreground">Live pricing — updated in real-time</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No active templates yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {templates.map((plan, i) => {
                const featured = i === 1;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl p-6 border ${featured ? "border-accent bg-accent/5 shadow-lg shadow-accent/10" : "border-border bg-card"}`}
                  >
                    <p className="text-sm text-muted-foreground mb-1 capitalize">{plan.category}</p>
                    <h3 className="text-base font-semibold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-foreground mb-4">
                      {plan.price} <span className="text-sm font-normal text-muted-foreground">{plan.currency}</span>
                    </p>
                    {plan.description && (
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {plan.description}
                        </li>
                      </ul>
                    )}
                    <Link
                      to="/create"
                      className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all ${featured ? "bg-gradient-gold text-accent-foreground shadow-lg" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                    >
                      {t.hero.cta}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
