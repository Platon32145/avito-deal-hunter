import { demoListings, demoMonitors } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import type { Listing, Monitor } from "@/types";

const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === "true";

export async function getDashboardData(): Promise<{ monitors: Monitor[]; listings: Listing[]; connected: boolean }> {
  if (!useSupabase) return { monitors: demoMonitors, listings: demoListings, connected: false };

  const supabase = await createClient();
  const [{ data: monitors, error: monitorError }, { data: listings, error: listingError }] = await Promise.all([
    supabase.from("monitors").select("*").order("created_at", { ascending: false }),
    supabase.from("listings").select("*").order("first_seen_at", { ascending: false }).limit(50)
  ]);
  if (monitorError) throw new Error(monitorError.message);
  if (listingError) throw new Error(listingError.message);
  return { monitors: (monitors ?? []) as Monitor[], listings: (listings ?? []) as Listing[], connected: true };
}
