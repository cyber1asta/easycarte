import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

type Template = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  currency: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

const emptyForm = { name: "", description: "", category: "general", price: 0, image_url: "", is_active: true };

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractStoragePath = (url: string): string | null => {
    const marker = "/storage/v1/object/public/template-images/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  };

  const removeStorageFile = async (url: string | null | undefined) => {
    if (!url) return;
    const path = extractStoragePath(url);
    if (!path) return;
    await supabase.storage.from("template-images").remove([path]);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("template-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("template-images").getPublicUrl(path);
    // Clean up the previously selected image (replace flow)
    if (form.image_url) {
      await removeStorageFile(form.image_url);
    }
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
    toast({ title: "Image uploaded", description: "Preview ready." });
  };

  useEffect(() => {
    fetchTemplates();
    const channel = supabase
      .channel("admin-templates-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "templates" }, () => fetchTemplates())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTemplates = async () => {
    const { data } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
    if (data) setTemplates(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      category: form.category,
      price: form.price,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };

    if (editingId) {
      const previous = templates.find((t) => t.id === editingId);
      const { error } = await supabase.from("templates").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }
      if (previous?.image_url && previous.image_url !== form.image_url) {
        await removeStorageFile(previous.image_url);
      }
      setTemplates((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...payload } : t)));
      toast({ title: "Template updated", description: `"${payload.name}" was saved successfully.` });
    } else {
      const { data, error } = await supabase.from("templates").insert(payload).select().single();
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
        return;
      }
      if (data) {
        setTemplates((prev) => [data, ...prev]);
        toast({ title: "Template created", description: `"${data.name}" is now live.` });
      }
    }
    resetForm();
  };

  const startEdit = (t: Template) => {
    setForm({ name: t.name, description: t.description || "", category: t.category, price: t.price, image_url: t.image_url || "", is_active: t.is_active });
    setEditingId(t.id);
    setShowForm(true);
  };

  const deleteTemplate = async (id: string) => {
    const target = templates.find((t) => t.id === id);
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    if (target?.image_url) {
      await removeStorageFile(target.image_url);
    }
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Template deleted", description: target ? `"${target.name}" was removed.` : "Template removed." });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="h-64 rounded-2xl bg-card animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{templates.length} template(s)</p>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-accent-foreground text-sm font-semibold hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Template
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl bg-card border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">{editingId ? "Edit Template" : "New Template"}</h3>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Template name" required className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price (MAD)" className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground hover:bg-muted/70 transition-colors disabled:opacity-60"
                >
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> {form.image_url ? "Replace image" : "Upload image"}</>}
                </button>
                {form.image_url && (
                  <button type="button" onClick={() => setForm({ ...form, image_url: "" })} className="px-3 py-2.5 rounded-xl bg-muted border border-border text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="sm:col-span-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground resize-none" />
              {form.image_url && (
                <div className="sm:col-span-2 flex items-center gap-3 p-2 rounded-xl bg-muted border border-border">
                  <img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                  <span className="text-xs text-muted-foreground truncate flex-1">{form.image_url}</span>
                </div>
              )}
              <div className="sm:col-span-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
                  Active
                </label>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-gold text-accent-foreground text-sm font-semibold hover:scale-[1.02] transition-transform">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-card border border-border overflow-hidden hover:border-accent/30 transition-colors group"
          >
            <div className="h-36 bg-muted flex items-center justify-center">
              {t.image_url ? (
                <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground/30">{t.name[0]}</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-lg ${t.is_active ? "text-green-600 bg-green-500/10" : "text-red-600 bg-red-500/10"}`}>
                  {t.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{t.category} • {t.price} MAD</p>
              <div className="flex gap-2">
                <button onClick={() => startEdit(t)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-accent hover:bg-accent/10 transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => deleteTemplate(t.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminTemplates;
