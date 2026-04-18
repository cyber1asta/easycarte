import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

const AdminOverview = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, pending: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [ordersRes, profilesRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const orders = ordersRes.data || [];
      const revenue = orders.reduce((s, o) => s + (o.status !== "cancelled" ? o.total_amount : 0), 0);
      const pending = orders.filter((o) => o.status === "pending").length;

      setStats({ orders: orders.length, revenue, pending, users: profilesRes.count || 0 });
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("admin-overview-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `${stats.revenue} MAD`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Orders", value: stats.orders, icon: Package, color: "text-accent", bg: "bg-accent/10" },
    { label: "Pending Orders", value: stats.pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-card border border-border hover:border-border/80 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-card border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Recent Orders</h2>
          <span className="text-xs text-muted-foreground">Last 5</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{order.total_amount} {order.currency}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
