import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all public APIs
export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("apis").filter((q) => q.eq(q.field("isPublic"), true));

    const apis = await q.order("desc").collect();

    // Filter by category if provided
    let filtered = apis;
    if (args.category && args.category !== "all") {
      filtered = apis.filter((api) => api.category === args.category);
    }

    // Sort by upvotes
    filtered.sort((a, b) => b.upvotes - a.upvotes);

    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

// Search APIs
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return [];
    }
    const results = await ctx.db
      .query("apis")
      .withSearchIndex("search_apis", (q) =>
        q.search("name", args.query).eq("isPublic", true)
      )
      .take(20);
    return results;
  },
});

// Get single API details
export const get = query({
  args: { id: v.id("apis") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Add a new API (authenticated users only)
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    baseUrl: v.string(),
    documentationUrl: v.string(),
    authType: v.string(),
    isFree: v.boolean(),
    tags: v.array(v.string()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("apis", {
      ...args,
      isPublic: true,
      createdBy: userId,
      createdAt: Date.now(),
      upvotes: 0,
    });
  },
});

// Upvote an API
export const upvote = mutation({
  args: { id: v.id("apis") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const api = await ctx.db.get(args.id);
    if (!api) throw new Error("API not found");

    await ctx.db.patch(args.id, {
      upvotes: api.upvotes + 1,
    });
  },
});

// Get categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});
