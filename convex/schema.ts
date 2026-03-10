import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // API collection entries
  apis: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    baseUrl: v.string(),
    documentationUrl: v.string(),
    authType: v.string(), // "api_key", "oauth", "none", "bearer"
    isPublic: v.boolean(),
    isFree: v.boolean(),
    tags: v.array(v.string()),
    logoUrl: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    upvotes: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_public", ["isPublic"])
    .index("by_upvotes", ["upvotes"])
    .searchIndex("search_apis", {
      searchField: "name",
      filterFields: ["category", "isPublic"],
    }),

  // User's saved/favorite APIs
  savedApis: defineTable({
    userId: v.id("users"),
    apiId: v.id("apis"),
    savedAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_api", ["userId", "apiId"]),

  // User's API keys storage (encrypted reference)
  userApiKeys: defineTable({
    userId: v.id("users"),
    apiId: v.id("apis"),
    keyName: v.string(),
    keyValue: v.string(), // In production, encrypt this
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_api", ["userId", "apiId"]),

  // Categories for organization
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    color: v.string(),
    apiCount: v.number(),
  }).index("by_slug", ["slug"]),
});
