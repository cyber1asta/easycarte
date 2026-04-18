import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Shield, Ban, UserCheck } from "lucide-react";

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  city: string | null;
  is_banned: boolean;
  created_at: string;
};

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data);
    setLoading(false);
  };

  const toggleBan = async (profile: Profile) => {
    const { error } = await supabase.from("profiles").update({ is_banned: !profile.is_banned }).eq("id", profile.id);
    if (!error) setProfiles((prev) => prev.map((p) => (p.id === profile.id ? { ...p, is_banned: !p.is_banned } : p)));
  };

  const makeAdmin = async (userId: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error && error.code === "23505") {
      // Already admin
      return;
    }
  };

  const filtered = profiles.filter((p) =>
    (p.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-64 rounded-2xl bg-card animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">City</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Joined</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((profile) => (
                  <tr key={profile.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{profile.display_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{profile.phone || "—"}</p>
                    </td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{profile.city || "—"}</td>
                    <td className="p-4 text-muted-foreground text-xs hidden md:table-cell">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {profile.is_banned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 bg-red-500/10">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-green-600 bg-green-500/10">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBan(profile)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            profile.is_banned
                              ? "text-green-600 hover:bg-green-500/10"
                              : "text-red-600 hover:bg-red-500/10"
                          }`}
                        >
                          {profile.is_banned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => makeAdmin(profile.user_id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-accent hover:bg-accent/10 transition-colors flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3" /> Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
