import React from "react";
import { Phone, Mail, Globe } from "lucide-react";

interface Props {
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  company: string;
  website: string;
  template: "minimal" | "corporate" | "luxury";
  primaryColor: string;
  scale?: number;
}

export const BusinessCardPreview: React.FC<Props> = ({
  name, jobTitle, phone, email, company, website, template, primaryColor, scale = 1,
}) => {
  const w = 340;
  const h = 200;

  if (template === "minimal") {
    return (
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        className="rounded-xl overflow-hidden shadow-lg select-none"
      >
        <div style={{ width: w, height: h, background: "#fff" }} className="relative p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold" style={{ color: primaryColor }}>{name || "Your Name"}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{jobTitle || "Job Title"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Phone className="w-3 h-3" />{phone || "+212 600 000 000"}</p>
            <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Mail className="w-3 h-3" />{email || "email@example.com"}</p>
            {website && <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Globe className="w-3 h-3" />{website}</p>}
          </div>
          <div className="absolute top-0 right-0 w-16 h-full" style={{ background: primaryColor, opacity: 0.08 }} />
          <div className="absolute bottom-4 right-5 text-[9px] font-semibold" style={{ color: primaryColor }}>{company}</div>
        </div>
      </div>
    );
  }

  if (template === "corporate") {
    return (
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        className="rounded-xl overflow-hidden shadow-lg select-none"
      >
        <div style={{ width: w, height: h }} className="relative flex">
          <div style={{ width: 8, background: primaryColor }} />
          <div className="flex-1 bg-white p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: primaryColor }}>{company || "Company"}</p>
              <h3 className="text-base font-bold text-gray-900">{name || "Your Name"}</h3>
              <p className="text-[10px] text-gray-500">{jobTitle || "Job Title"}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: primaryColor }} />{phone}</p>
              <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: primaryColor }} />{email}</p>
              {website && <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Globe className="w-3 h-3" style={{ color: primaryColor }} />{website}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // luxury
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      className="rounded-xl overflow-hidden shadow-lg select-none"
    >
      <div style={{ width: w, height: h, background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)` }}
        className="relative p-6 flex flex-col justify-between"
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, ${primaryColor} 0, ${primaryColor} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }}
        />
        <div className="relative z-10">
          <h3 className="text-lg font-bold" style={{ color: primaryColor }}>{name || "Your Name"}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5 tracking-wider uppercase">{jobTitle || "Job Title"}</p>
        </div>
        <div className="relative z-10 flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] text-gray-400 flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: primaryColor }} />{phone}</p>
            <p className="text-[10px] text-gray-400 flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: primaryColor }} />{email}</p>
          </div>
          <span className="text-[10px] font-semibold tracking-wider" style={{ color: primaryColor }}>{company}</span>
        </div>
      </div>
    </div>
  );
};
