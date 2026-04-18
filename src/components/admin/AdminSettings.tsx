import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Save, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Setting = {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "" });
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
    const channel = supabase
      .channel("admin-settings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => fetchSettings())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").order("key");
    if (data) {
      setSettings(data);
      setEditValues((prev) => {
        const vals: Record<string, string> = { ...prev };
        data.forEach((s) => {
          // Only seed values for rows the user isn't actively editing
          if (vals[s.id] === undefined) vals[s.id] = s.value || "";
        });
        return vals;
      });
    }
    setLoading(false);
  };

  const addSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from("site_settings").insert({
      key: newSetting.key,
      value: newSetting.value || null,
      description: newSetting.description || null,
    }).select().single();
    if (!error && data) {
      setSettings((prev) => [...prev, data]);
      setEditValues((prev) => ({ ...prev, [data.id]: data.value || "" }));
      setNewSetting({ key: "", value: "", description: "" });
      setShowAdd(false);
    }
  };

  const updateSetting = async (id: string) => {
    await supabase.from("site_settings").update({ value: editValues[id] }).eq("id", id);
  };

  const deleteSetting = async (id: string) => {
    const { error } = await supabase.from("site_settings").delete().eq("id", id);
    if (!error) setSettings((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <div className="h-64 rounded-2xl bg-card animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Key-value site configuration</p>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-accent-foreground text-sm font-semibold hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Setting
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={addSetting}
            className="rounded-2xl bg-card border border-border p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">New Setting</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={newSetting.key} onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })} placeholder="Key" required className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
              <input value={newSetting.value} onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })} placeholder="Value" className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
              <input value={newSetting.description} onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })} placeholder="Description" className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
            </div>
            <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-gold text-accent-foreground text-sm font-semibold">Create</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="rounded-2xl bg-card border border-border divide-y divide-border">
        {settings.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No settings configured</div>
        ) : (
          settings.map((setting) => (
            <div key={setting.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-medium text-foreground">{setting.key}</p>
                {setting.description && <p className="text-xs text-muted-foreground">{setting.description}</p>}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  value={editValues[setting.id] || ""}
                  onChange={(e) => setEditValues({ ...editValues, [setting.id]: e.target.value })}
                  className="flex-1 sm:w-48 px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground"
                />
                <button onClick={() => updateSetting(setting.id)} className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => deleteSetting(setting.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
