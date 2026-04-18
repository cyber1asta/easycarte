import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCardPreview } from "@/components/BusinessCardPreview";
import { Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartPage = () => {
  const { t } = useI18n();
  const { items, removeItem, total } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleCheckout = async () => {
    if (!customerName || !customerEmail) {
      toast.error("Please fill in your name and email");
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items,
          customerName,
          customerEmail,
          customerPhone,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">{t.nav.cart}</h1>
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">Your cart is empty</p>
              <Link to="/create" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                {t.nav.create}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border">
                  <div className="flex-shrink-0">
                    <BusinessCardPreview {...item} scale={0.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.templates[item.template]} · {item.quantity} cards</p>
                    <p className="text-sm font-bold text-accent mt-1">{(item.quantity * item.unitPrice).toFixed(0)} {t.currency}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Customer info */}
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="font-semibold text-foreground text-sm">Your information</h3>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name *"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email *"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-lg font-bold text-foreground">Total: {total.toFixed(0)} {t.currency}</span>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-gold text-accent-foreground font-semibold text-sm shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {checkoutLoading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
