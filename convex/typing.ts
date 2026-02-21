import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const setTypingStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { conversationId, userId, isTyping } = args;

    // Find existing typing indicator
    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        isTyping,
        lastTypingTime: now,
      });
    } else {
      // Create new record
      await ctx.db.insert("typingIndicators", {
        conversationId,
        userId,
        isTyping,
        lastTypingTime: now,
      });
    }
  },
});

export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const { conversationId } = args;
    const now = Date.now();
    const TYPING_TIMEOUT = 3000; // 3 seconds

    // Get all typing indicators for this conversation
    const typingIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();

    // Filter for active typing (within 3 seconds and isTyping is true)
    const activeTypingUsers = [];
    for (const indicator of typingIndicators) {
      if (
        indicator.isTyping &&
        now - indicator.lastTypingTime < TYPING_TIMEOUT
      ) {
        // Get user details
        const user = await ctx.db.get(indicator.userId);
        if (user) {
          activeTypingUsers.push({
            userId: indicator.userId,
            userName: user.name,
          });
        }
      }
    }

    return activeTypingUsers;
  },
});
