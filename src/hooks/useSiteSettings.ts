import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

let cache: SiteSettings | null = null;
const subscribers = new Set<(s: SiteSettings) => void>();
let channelInitialized = false;

async function fetchAll(): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("key,value");
  const map: SiteSettings = {};
  (data ?? []).forEach((row: any) => {
    if (row.key) map[row.key] = row.value ?? "";
  });
  cache = map;
  subscribers.forEach((cb) => cb(map));
  return map;
}

function ensureChannel() {
  if (channelInitialized) return;
  channelInitialized = true;
  supabase
    .channel("realtime-site_settings-global")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_settings" },
      () => {
        fetchAll();
      }
    )
    .subscribe();
}

/**
 * Live-synced site settings keyed by `key` column.
 * All consumers share one cache + one realtime channel.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cache ?? {});

  useEffect(() => {
    subscribers.add(setSettings);
    ensureChannel();
    if (!cache) fetchAll();
    else setSettings(cache);
    return () => {
      subscribers.delete(setSettings);
    };
  }, []);

  return settings;
}
