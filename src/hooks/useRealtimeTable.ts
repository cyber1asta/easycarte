import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type TableName = "templates" | "orders" | "site_settings" | "profiles";

interface Options {
  orderBy?: { column: string; ascending?: boolean };
  filter?: (row: any) => boolean;
}

/**
 * Subscribes to a Supabase table and keeps local state in sync via Postgres realtime.
 * Returns the live rows + a manual refetch function.
 */
export function useRealtimeTable<T = any>(table: TableName, options: Options = {}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const optsRef = useRef(options);
  optsRef.current = options;

  const refetch = useCallback(async () => {
    let query = supabase.from(table).select("*");
    if (optsRef.current.orderBy) {
      query = query.order(optsRef.current.orderBy.column, {
        ascending: optsRef.current.orderBy.ascending ?? false,
      });
    }
    const { data } = await query;
    let next = (data ?? []) as T[];
    if (optsRef.current.filter) next = next.filter(optsRef.current.filter);
    setRows(next);
    setLoading(false);
  }, [table]);

  useEffect(() => {
    refetch();

    const channel = supabase
      .channel(`realtime-${table}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          // Simple + reliable: refetch on any change. Keeps ordering & filters consistent.
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, refetch]);

  return { rows, loading, refetch, setRows };
}
