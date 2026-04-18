import React, { createContext, useContext, useState, useCallback } from "react";

export type Lang = "fr" | "en" | "ar";

const translations = {
  fr: {
    nav: { home: "Accueil", create: "Créer", pricing: "Tarifs", contact: "Contact", login: "Connexion", cart: "Panier" },
    hero: {
      badge: "🇲🇦 Service 100% Marocain",
      title: "Créez vos cartes de visite",
      titleHighlight: "professionnelles",
      subtitle: "Design premium, impression haute qualité. Personnalisez votre carte en quelques clics et recevez-la chez vous partout au Maroc.",
      cta: "Commencer maintenant",
      ctaSecondary: "Voir les modèles",
      startingFrom: "À partir de",
      perCard: "/ 100 cartes",
    },
    features: {
      title: "Pourquoi Easy Carte ?",
      subtitle: "Tout ce dont vous avez besoin pour des cartes de visite exceptionnelles",
      design: { title: "Design Premium", desc: "Modèles créés par des designers professionnels" },
      fast: { title: "Livraison Rapide", desc: "Recevez vos cartes en 48h partout au Maroc" },
      quality: { title: "Qualité Supérieure", desc: "Impression haute définition sur papier premium" },
      price: { title: "Prix Compétitifs", desc: "Les meilleurs tarifs du marché marocain" },
    },
    templates: {
      title: "Nos Modèles",
      subtitle: "Choisissez parmi notre collection de modèles premium",
      minimal: "Minimaliste",
      corporate: "Corporate",
      luxury: "Luxe",
      useTemplate: "Utiliser ce modèle",
    },
    generator: {
      title: "Personnalisez votre carte",
      name: "Nom complet",
      jobTitle: "Titre / Poste",
      phone: "Téléphone",
      email: "Email",
      company: "Entreprise",
      website: "Site web",
      template: "Modèle",
      primaryColor: "Couleur principale",
      addToCart: "Ajouter au panier",
      preview: "Aperçu en direct",
      quantity: "Quantité",
    },
    footer: {
      tagline: "La référence marocaine pour vos cartes de visite professionnelles.",
      rights: "Tous droits réservés.",
    },
    currency: "MAD",
  },
  en: {
    nav: { home: "Home", create: "Create", pricing: "Pricing", contact: "Contact", login: "Sign In", cart: "Cart" },
    hero: {
      badge: "🇲🇦 100% Moroccan Service",
      title: "Create your professional",
      titleHighlight: "business cards",
      subtitle: "Premium design, high-quality printing. Customize your card in a few clicks and receive it anywhere in Morocco.",
      cta: "Get Started",
      ctaSecondary: "View Templates",
      startingFrom: "Starting from",
      perCard: "/ 100 cards",
    },
    features: {
      title: "Why Easy Carte?",
      subtitle: "Everything you need for exceptional business cards",
      design: { title: "Premium Design", desc: "Templates crafted by professional designers" },
      fast: { title: "Fast Delivery", desc: "Receive your cards in 48h anywhere in Morocco" },
      quality: { title: "Superior Quality", desc: "High-definition printing on premium paper" },
      price: { title: "Best Prices", desc: "The most competitive rates in Morocco" },
    },
    templates: {
      title: "Our Templates",
      subtitle: "Choose from our premium template collection",
      minimal: "Minimal",
      corporate: "Corporate",
      luxury: "Luxury",
      useTemplate: "Use Template",
    },
    generator: {
      title: "Customize your card",
      name: "Full Name",
      jobTitle: "Job Title",
      phone: "Phone",
      email: "Email",
      company: "Company",
      website: "Website",
      template: "Template",
      primaryColor: "Primary Color",
      addToCart: "Add to Cart",
      preview: "Live Preview",
      quantity: "Quantity",
    },
    footer: {
      tagline: "Morocco's reference for professional business cards.",
      rights: "All rights reserved.",
    },
    currency: "MAD",
  },
  ar: {
    nav: { home: "الرئيسية", create: "إنشاء", pricing: "الأسعار", contact: "اتصل بنا", login: "تسجيل الدخول", cart: "السلة" },
    hero: {
      badge: "🇲🇦 خدمة مغربية 100%",
      title: "أنشئ بطاقات عملك",
      titleHighlight: "الاحترافية",
      subtitle: "تصميم فاخر وطباعة عالية الجودة. خصص بطاقتك بنقرات قليلة واستلمها في أي مكان بالمغرب.",
      cta: "ابدأ الآن",
      ctaSecondary: "عرض النماذج",
      startingFrom: "ابتداءً من",
      perCard: "/ 100 بطاقة",
    },
    features: {
      title: "لماذا Easy Carte؟",
      subtitle: "كل ما تحتاجه لبطاقات عمل استثنائية",
      design: { title: "تصميم فاخر", desc: "نماذج من تصميم مصممين محترفين" },
      fast: { title: "توصيل سريع", desc: "استلم بطاقاتك في 48 ساعة في أي مكان بالمغرب" },
      quality: { title: "جودة عالية", desc: "طباعة عالية الدقة على ورق فاخر" },
      price: { title: "أسعار تنافسية", desc: "أفضل الأسعار في السوق المغربي" },
    },
    templates: {
      title: "نماذجنا",
      subtitle: "اختر من مجموعتنا الفاخرة",
      minimal: "بسيط",
      corporate: "شركات",
      luxury: "فاخر",
      useTemplate: "استخدم هذا النموذج",
    },
    generator: {
      title: "خصص بطاقتك",
      name: "الاسم الكامل",
      jobTitle: "المنصب",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      company: "الشركة",
      website: "الموقع",
      template: "النموذج",
      primaryColor: "اللون الرئيسي",
      addToCart: "أضف إلى السلة",
      preview: "معاينة مباشرة",
      quantity: "الكمية",
    },
    footer: {
      tagline: "المرجع المغربي لبطاقات العمل الاحترافية.",
      rights: "جميع الحقوق محفوظة.",
    },
    currency: "د.م.",
  },
};

type Translations = typeof translations.fr;

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr,
  dir: "ltr",
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>("fr");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang], dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  );
};
