import { useI18n } from "@/lib/i18n";
import { Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/easycarte-logo.jpeg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const DEFAULTS = {
  contact_phone: "0642910204",
  contact_whatsapp: "212642910204",
  social_instagram: "e_asycarte",
  site_name: "Easy Carte",
  contact_city: "Salé",
  contact_country: "Morocco",
};

export function Footer() {
  const { t } = useI18n();
  const settings = useSiteSettings();

  const phone = settings.contact_phone || DEFAULTS.contact_phone;
  const whatsapp = settings.contact_whatsapp || DEFAULTS.contact_whatsapp;
  const instagram = (settings.social_instagram || DEFAULTS.social_instagram).replace(/^@/, "");
  const siteName = settings.site_name || DEFAULTS.site_name;
  const city = settings.contact_city || DEFAULTS.contact_city;
  const country = settings.contact_country || DEFAULTS.contact_country;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt={`${siteName} logo`}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-accent/30"
              />
              <span className="font-display font-bold text-xl text-foreground">{siteName}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${phone}`}
                className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="w-4 h-4 text-accent" />
                </span>
                <span className="font-medium">{phone}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <MessageCircle className="w-4 h-4 text-accent" />
                </span>
                <span className="font-medium">WhatsApp</span>
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Instagram className="w-4 h-4 text-accent" />
                </span>
                <span className="font-medium">@{instagram}</span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Location
            </h3>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-accent" />
              </span>
              <div>
                <p className="font-medium text-foreground">{city}</p>
                <p>{country}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 {siteName}. {t.footer.rights}</p>
          <p className="text-xs text-muted-foreground">Made with care in Morocco 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
