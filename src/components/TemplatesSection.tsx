import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BusinessCardPreview } from "./BusinessCardPreview";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

const sampleCard = {
  name: "Youssef El Amrani",
  jobTitle: "Directeur Général",
  phone: "+212 6 12 34 56 78",
  email: "youssef@example.com",
  company: "Atlas Corp",
  website: "www.atlascorp.ma",
};

type Template = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  is_active: boolean;
  image_url: string | null;
  design_data: any;
};

const variantFor = (i: number): "minimal" | "corporate" | "luxury" => {
  const all = ["minimal", "corporate", "luxury"] as const;
  return all[i % all.length];
};

export function TemplatesSection() {
  const { t } = useI18n();
  const { rows, loading } = useRealtimeTable<Template>("templates", {
    orderBy: { column: "created_at", ascending: false },
    filter: (row) => row.is_active,
  });

  return (
    <section id="templates" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t.templates.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t.templates.subtitle}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No templates available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {rows.slice(0, 6).map((tmpl, i) => (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/30 transition-all hover:shadow-xl">
                  <div className="p-6 flex items-center justify-center min-h-[200px] bg-muted/30">
                    {tmpl.image_url ? (
                      <img src={tmpl.image_url} alt={tmpl.name} className="max-h-44 object-contain rounded-lg" />
                    ) : (
                      <BusinessCardPreview {...sampleCard} template={variantFor(i)} primaryColor="#c8973e" scale={0.85} />
                    )}
                  </div>
                  <div className="p-5 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{tmpl.name}</h3>
                      <span className="text-sm font-bold text-accent">
                        {tmpl.price} {tmpl.currency}
                      </span>
                    </div>
                    {tmpl.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tmpl.description}</p>
                    )}
                    <Link
                      to="/create"
                      className="block w-full text-center py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      {t.templates.useTemplate}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
