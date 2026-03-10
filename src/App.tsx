import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Category icons mapping
const categoryIcons: Record<string, string> = {
  ai: "🧠",
  finance: "💰",
  communication: "💬",
  data: "📊",
  social: "👥",
  weather: "🌤️",
  entertainment: "🎬",
  ecommerce: "🛒",
};

const authTypeLabels: Record<string, { label: string; color: string }> = {
  api_key: { label: "API Key", color: "bg-amber-500/20 text-amber-300" },
  oauth: { label: "OAuth", color: "bg-purple-500/20 text-purple-300" },
  bearer: { label: "Bearer", color: "bg-cyan-500/20 text-cyan-300" },
  none: { label: "No Auth", color: "bg-emerald-500/20 text-emerald-300" },
};

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/10 to-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            API <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Collector</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">All APIs. One place. Zero hassle.</p>
        </div>

        {/* Auth Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl animate-slide-up">
          <h2 className="text-xl font-semibold text-white mb-6">
            {flow === "signIn" ? "Welcome back" : "Create your account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                flow === "signIn" ? "Sign In" : "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              {flow === "signIn" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0a0a0f] text-zinc-500">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full py-3 px-4 bg-white/5 border border-white/10 text-zinc-300 font-medium rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

function APICard({
  api,
  onSave,
  onUpvote,
  isSaved
}: {
  api: {
    _id: Id<"apis">;
    name: string;
    description: string;
    category: string;
    baseUrl: string;
    documentationUrl: string;
    authType: string;
    isFree: boolean;
    tags: string[];
    upvotes: number;
  };
  onSave: (id: Id<"apis">) => void;
  onUpvote: (id: Id<"apis">) => void;
  isSaved?: boolean;
}) {
  const authInfo = authTypeLabels[api.authType] || authTypeLabels.none;

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
      {/* Category icon */}
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-lg">
        {categoryIcons[api.category] || "🔗"}
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors truncate pr-8">
            {api.name}
          </h3>
          <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{api.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className={`px-2 py-0.5 text-xs rounded-full ${authInfo.color}`}>
              {authInfo.label}
            </span>
            {api.isFree && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300">
                Free Tier
              </span>
            )}
            {api.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-zinc-400">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            <a
              href={api.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Docs
            </a>
            <button
              onClick={() => onUpvote(api._id)}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-violet-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {api.upvotes}
            </button>
            <button
              onClick={() => onSave(api._id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isSaved ? "text-pink-400" : "text-zinc-400 hover:text-pink-400"
              }`}
            >
              <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddAPIModal({
  isOpen,
  onClose,
  categories
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ _id: Id<"categories">; name: string; slug: string }>;
}) {
  const createApi = useMutation(api.apis.create);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createApi({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        baseUrl: formData.get("baseUrl") as string,
        documentationUrl: formData.get("documentationUrl") as string,
        authType: formData.get("authType") as string,
        isFree: formData.get("isFree") === "true",
        tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#12121a] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Add New API</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">API Name</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="e.g., Stripe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="What does this API do?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
              <select
                name="category"
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug} className="bg-[#12121a]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Auth Type</label>
              <select
                name="authType"
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="api_key" className="bg-[#12121a]">API Key</option>
                <option value="oauth" className="bg-[#12121a]">OAuth</option>
                <option value="bearer" className="bg-[#12121a]">Bearer Token</option>
                <option value="none" className="bg-[#12121a]">No Auth</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Base URL</label>
            <input
              name="baseUrl"
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="https://api.example.com/v1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Documentation URL</label>
            <input
              name="documentationUrl"
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="https://docs.example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Tags (comma-separated)</label>
            <input
              name="tags"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="payments, subscriptions, billing"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFree"
              value="true"
              id="isFree"
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-500 focus:ring-violet-500"
            />
            <label htmlFor="isFree" className="text-sm text-zinc-400">Has free tier</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-white/5 border border-white/10 text-zinc-300 rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add API"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState<"browse" | "saved">("browse");

  const categories = useQuery(api.apis.getCategories) || [];
  const apis = useQuery(api.apis.list, { category: activeCategory === "all" ? undefined : activeCategory });
  const searchResults = useQuery(api.apis.search, { query: searchQuery });
  const savedApis = useQuery(api.saved.list);
  const seedData = useMutation(api.seed.seedData);
  const saveApi = useMutation(api.saved.save);
  const removeApi = useMutation(api.saved.remove);
  const upvoteApi = useMutation(api.apis.upvote);

  // Seed data on first load if empty
  useEffect(() => {
    if (apis && apis.length === 0) {
      seedData();
    }
  }, [apis, seedData]);

  const displayedApis = searchQuery ? searchResults : apis;
  const savedApiIds = new Set(savedApis?.map((s: { apiId: Id<"apis"> }) => s.apiId) || []);

  const handleSave = async (apiId: Id<"apis">) => {
    if (savedApiIds.has(apiId)) {
      await removeApi({ apiId });
    } else {
      await saveApi({ apiId });
    }
  };

  const handleUpvote = async (apiId: Id<"apis">) => {
    await upvoteApi({ id: apiId });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">
                API <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Collector</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex-shrink-0 p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/20"
              >
                <span className="hidden sm:inline">Add API</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button
                onClick={() => signOut()}
                className="flex-shrink-0 p-2 bg-white/5 border border-white/10 text-zinc-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView("browse")}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                view === "browse"
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              Browse APIs
            </button>
            <button
              onClick={() => setView("saved")}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                view === "saved"
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              Saved
              {savedApis && savedApis.length > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{savedApis.length}</span>
              )}
            </button>
          </div>

          {view === "browse" ? (
            <>
              {/* Categories */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === "all"
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-white/5 text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  All APIs
                </button>
                {categories.map((cat: { _id: Id<"categories">; slug: string; name: string }) => (
                  <button
                    key={cat._id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      activeCategory === cat.slug
                        ? "bg-white/10 text-white border border-white/20"
                        : "bg-white/5 text-zinc-400 hover:text-white border border-transparent"
                    }`}
                  >
                    <span>{categoryIcons[cat.slug] || "🔗"}</span>
                    <span className="hidden sm:inline">{cat.name}</span>
                    <span className="sm:hidden">{cat.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Stats bar */}
              <div className="flex items-center gap-4 mb-6 text-sm text-zinc-500">
                <span>{displayedApis?.length || 0} APIs found</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* API Grid */}
              {displayedApis === undefined ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading APIs...
                  </div>
                </div>
              ) : displayedApis.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-400">No APIs found</h3>
                  <p className="text-zinc-600 mt-1">Try a different search or category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayedApis.map((apiItem: { _id: Id<"apis">; name: string; description: string; category: string; baseUrl: string; documentationUrl: string; authType: string; isFree: boolean; tags: string[]; upvotes: number }) => (
                    <APICard
                      key={apiItem._id}
                      api={apiItem}
                      onSave={handleSave}
                      onUpvote={handleUpvote}
                      isSaved={savedApiIds.has(apiItem._id)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Saved APIs */}
              {!savedApis || savedApis.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-400">No saved APIs yet</h3>
                  <p className="text-zinc-600 mt-1">Browse and save APIs you want to use</p>
                  <button
                    onClick={() => setView("browse")}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all"
                  >
                    Browse APIs
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {savedApis.map((saved: { _id: Id<"savedApis">; apiId: Id<"apis">; api: { _id: Id<"apis">; name: string; description: string; category: string; baseUrl: string; documentationUrl: string; authType: string; isFree: boolean; tags: string[]; upvotes: number } | null }) =>
                    saved.api && (
                      <APICard
                        key={saved._id}
                        api={saved.api}
                        onSave={handleSave}
                        onUpvote={handleUpvote}
                        isSaved={true}
                      />
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-zinc-600">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>

      {/* Add API Modal */}
      <AddAPIModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
      />

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out 0.1s both;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center animate-pulse">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-sm">Loading API Collector...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
}
