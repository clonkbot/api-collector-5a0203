import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's saved APIs
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const saved = await ctx.db
      .query("savedApis")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Fetch full API details
    const apisWithDetails = await Promise.all(
      saved.map(async (s) => {
        const api = await ctx.db.get(s.apiId);
        return {
          ...s,
          api,
        };
      })
    );

    return apisWithDetails.filter((a) => a.api !== null);
  },
});

// Save an API
export const save = mutation({
  args: { apiId: v.id("apis"), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already saved
    const existing = await ctx.db
      .query("savedApis")
      .withIndex("by_user_and_api", (q) =>
        q.eq("userId", userId).eq("apiId", args.apiId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("savedApis", {
      userId,
      apiId: args.apiId,
      savedAt: Date.now(),
      notes: args.notes,
    });
  },
});

// Remove saved API
export const remove = mutation({
  args: { apiId: v.id("apis") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const saved = await ctx.db
      .query("savedApis")
      .withIndex("by_user_and_api", (q) =>
        q.eq("userId", userId).eq("apiId", args.apiId)
      )
      .first();

    if (saved) {
      await ctx.db.delete(saved._id);
    }
  },
});

// Check if API is saved
export const isSaved = query({
  args: { apiId: v.id("apis") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const saved = await ctx.db
      .query("savedApis")
      .withIndex("by_user_and_api", (q) =>
        q.eq("userId", userId).eq("apiId", args.apiId)
      )
      .first();

    return saved !== null;
  },
});
