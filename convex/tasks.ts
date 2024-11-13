import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("tasks").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { name, description, status }) => {
    const task = await ctx.db.insert("tasks", { name, description, status });
    return task
  },
});

export const updateStatus = mutation({
  args: { id: v.id("tasks"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
