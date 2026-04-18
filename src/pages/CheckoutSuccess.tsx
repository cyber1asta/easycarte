import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useEffect } from "react";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { t } = useI18n();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. Your business cards are being processed.
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground mb-8">
              Order ID: <span className="font-mono text-foreground">{orderId.slice(0, 8)}</span>
            </p>
          )}
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-gold text-accent-foreground font-semibold text-sm shadow-lg"
          >
            {t.nav.home}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
