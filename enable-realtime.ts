import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function enableRealtime() {
  try {
    // Run SQL commands to enable realtime
    const { error } = await supabase.rpc("sql", {
      query: `
        ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS portfolio_items;
        ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS products;
        ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS live_updates;
        ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS videos;
      `,
    });

    if (error) {
      console.error("Error enabling realtime:", error);
    } else {
      console.log("Realtime enabled successfully!");
    }
  } catch (err) {
    console.error("Failed to enable realtime:", err);
  }
}

enableRealtime();
