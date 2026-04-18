import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Palette, Truck, Award, BadgeDollarSign } from "lucide-react";

const iconMap = [Palette, Truck, Award, BadgeDollarSign];

export function FeaturesSection() {
  const { t } = useI18n();
  const features = [t.features.design, t.features.fast, t.features.quality, t.features.price];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t.features.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t.features.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = iconMap[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
