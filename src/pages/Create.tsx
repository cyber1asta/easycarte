import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart, CardConfig } from "@/lib/cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCardPreview } from "@/components/BusinessCardPreview";
import { motion } from "framer-motion";
import { toast } from "sonner";

const templatePrices = { minimal: 1.49, corporate: 1.99, luxury: 2.99 };

const CreatePage = () => {
  const { t } = useI18n();
  const { addItem } = useCart();

  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    phone: "",
    email: "",
    company: "",
    website: "",
    template: "minimal" as "minimal" | "corporate" | "luxury",
    primaryColor: "#c8973e",
    quantity: 100,
  });

  const update = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  const handleAddToCart = () => {
    if (!form.name || !form.phone) {
      toast.error("Please fill in name and phone");
      return;
    }
    const item: CardConfig = {
      id: crypto.randomUUID(),
      ...form,
      unitPrice: templatePrices[form.template],
    };
    addItem(item);
    toast.success("Added to cart!");
  };

  const totalPrice = (form.quantity * templatePrices[form.template]).toFixed(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">{t.generator.title}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {([
                ["name", t.generator.name],
                ["jobTitle", t.generator.jobTitle],
                ["company", t.generator.company],
                ["phone", t.generator.phone],
                ["email", t.generator.email],
                ["website", t.generator.website],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => update(key, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={label}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t.generator.template}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["minimal", "corporate", "luxury"] as const).map(tmpl => (
                    <button key={tmpl} onClick={() => update("template", tmpl)}
                      className={`py-2 rounded-xl text-sm font-medium border transition-all ${form.template === tmpl ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/30"}`}
                    >
                      {t.templates[tmpl]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.generator.primaryColor}</label>
                  <input type="color" value={form.primaryColor} onChange={e => update("primaryColor", e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer border border-border"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.generator.quantity}</label>
                  <select value={form.quantity} onChange={e => update("quantity", Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm"
                  >
                    {[50, 100, 250, 500, 1000].map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-foreground">{totalPrice} {t.currency}</span>
                <button onClick={handleAddToCart}
                  className="px-8 py-3 rounded-xl bg-gradient-gold text-accent-foreground font-semibold text-sm shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all hover:scale-105"
                >
                  {t.generator.addToCart}
                </button>
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <p className="text-sm text-muted-foreground mb-4">{t.generator.preview}</p>
              <div className="p-8 rounded-2xl bg-muted/50 border border-border">
                <BusinessCardPreview
                  name={form.name}
                  jobTitle={form.jobTitle}
                  phone={form.phone}
                  email={form.email}
                  company={form.company}
                  website={form.website}
                  template={form.template}
                  primaryColor={form.primaryColor}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePage;
