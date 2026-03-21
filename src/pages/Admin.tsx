import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, Edit2, Save, X, Upload, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { ThemePreview } from "@/components/ThemePreview";

type Tab = "portfolio" | "products" | "updates" | "videos" | "themes";

export default function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    // First check if there are any admin users
    const { data: existingAdmins } = await supabase.from("user_roles").select("role").eq("role", "admin");
    
    // If no admins exist, create this user as admin
    if (!existingAdmins || existingAdmins.length === 0) {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      setIsAdmin(true);
      setLoading(false);
      return;
    }
    
    // Otherwise check if this user is admin
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin");
    setIsAdmin(data && data.length > 0);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16 section-padding">
          <div className="glass-card p-8 w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              {loginError && <p className="text-destructive text-xs">{loginError}</p>}
              <button type="submit" className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.97]">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="glass-card p-8 text-center max-w-sm">
            <h1 className="text-xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground text-sm mb-4">You don't have admin privileges.</p>
            <button onClick={handleLogout} className="text-sm text-primary hover:underline">Sign Out</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all active:scale-[0.97]"
                title="Refresh page and data"
              >
                <RefreshCw size={16} />
              </button>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all active:scale-[0.97]">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 glass-card rounded-xl w-fit">
            {(["portfolio", "products", "updates", "videos", "themes"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "portfolio" && <AdminCRUD table="portfolio_items" fields={["title", "description", "image_url"]} />}
          {activeTab === "products" && <AdminCRUD table="products" fields={["title", "description", "specs", "price", "image_url"]} />}
          {activeTab === "updates" && <AdminCRUD table="live_updates" fields={["title", "content", "image_url"]} />}
          {activeTab === "videos" && <AdminCRUD table="videos" fields={["title", "url", "platform"]} />}
          {activeTab === "themes" && <ThemePreview />}
        </div>
      </div>
    </>
  );
}

function AdminCRUD({ table, fields }: { table: string; fields: string[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [showNew, setShowNew] = useState(false);

  const fetchItems = async () => {
    const { data, error } = await supabase.from(table as any).select("*").order("created_at", { ascending: false });
    if (error) {
      console.error(`Error fetching ${table}:`, error);
    }
    if (data) {
      console.log(`Fetched ${table}:`, data);
      setItems(data);
    }
  };

  useEffect(() => { fetchItems(); }, [table]);

  const handleCreate = async () => {
    const insertData: any = { ...newItem };
    if (insertData.price) insertData.price = parseFloat(insertData.price);
    console.log("Creating:", insertData);
    const { error } = await supabase.from(table as any).insert(insertData);
    if (error) {
      console.error("Error creating item:", error);
      alert("Error creating item: " + error.message);
    } else {
      setNewItem({});
      setShowNew(false);
      await fetchItems();
    }
  };

  const handleUpdate = async (id: string) => {
    const updateData: any = { ...editData };
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    console.log("Updating:", updateData);
    const { error } = await supabase.from(table as any).update(updateData).eq("id", id);
    if (error) {
      console.error("Error updating item:", error);
      alert("Error updating item: " + error.message);
    } else {
      setEditingId(null);
      await fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    console.log("Deleting:", id);
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item: " + error.message);
    } else {
      await fetchItems();
    }
  };

  const handleImageUpload = async (file: File, field: string, target: "new" | string) => {
    const ext = file.name.split(".").pop();
    const path = `${table}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) return;
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
    if (target === "new") {
      setNewItem((prev) => ({ ...prev, [field]: publicUrl }));
    } else {
      setEditData((prev) => ({ ...prev, [field]: publicUrl }));
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowNew(!showNew)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.97]"
      >
        <Plus size={16} /> Add New
      </button>

      {showNew && (
        <div className="glass-card p-4 space-y-3 animate-fade-up">
          {fields.map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-muted-foreground capitalize mb-1 block">{field.replace("_", " ")}</label>
              {field.includes("image") ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newItem[field] || ""}
                    onChange={(e) => setNewItem((p) => ({ ...p, [field]: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="URL or upload"
                  />
                  <label className="p-2 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
                    <Upload size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], field, "new")} />
                  </label>
                </div>
              ) : (
                <input
                  type={field === "price" ? "number" : "text"}
                  value={newItem[field] || ""}
                  onChange={(e) => setNewItem((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={handleCreate} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium active:scale-95 transition-all">
              <Save size={14} /> Save
            </button>
            <button onClick={() => { setShowNew(false); setNewItem({}); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium active:scale-95 transition-all">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4">
            {editingId === item.id ? (
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-muted-foreground capitalize mb-1 block">{field.replace("_", " ")}</label>
                    {field.includes("image") ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editData[field] ?? item[field] ?? ""}
                          onChange={(e) => setEditData((p) => ({ ...p, [field]: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <label className="p-2 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
                          <Upload size={16} />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], field, item.id)} />
                        </label>
                      </div>
                    ) : (
                      <input
                        type={field === "price" ? "number" : "text"}
                        value={editData[field] ?? item[field] ?? ""}
                        onChange={(e) => setEditData((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium active:scale-95 transition-all">
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => { setEditingId(null); setEditData({}); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium active:scale-95 transition-all">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{item.description || item.content || item.url || ""}</p>
                  {item.price !== undefined && item.price !== null && (
                    <span className="text-xs font-medium text-primary tabular-nums">${Number(item.price).toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setEditingId(item.id); setEditData({}); }} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="glass-card p-8 text-center text-muted-foreground text-sm">
            No items yet. Click "Add New" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
