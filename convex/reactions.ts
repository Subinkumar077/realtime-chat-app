import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const { messageId, userId, emoji } = args;

    // Check if user already reacted to this message
    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_user_message", (q) =>
        q.eq("userId", userId).eq("messageId", messageId)
      )
      .first();

    if (existingReaction) {
      // If same emoji, remove the reaction (toggle off)
      if (existingReaction.emoji === emoji) {
        await ctx.db.delete(existingReaction._id);
        return { action: "removed" };
      } else {
        // If different emoji, update to new emoji
        await ctx.db.patch(existingReaction._id, {
          emoji,
          createdAt: Date.now(),
        });
        return { action: "updated" };
      }
    } else {
      // Add new reaction
      await ctx.db.insert("reactions", {
        messageId,
        userId,
        emoji,
        createdAt: Date.now(),
      });
      return { action: "added" };
    }
  },
});

export const getMessageReactions = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();

    // Group reactions by emoji and count them
    const reactionMap = new Map<string, { count: number; userIds: string[] }>();
    
    reactions.forEach((reaction) => {
      const existing = reactionMap.get(reaction.emoji);
      if (existing) {
        existing.count++;
        existing.userIds.push(reaction.userId);
      } else {
        reactionMap.set(reaction.emoji, {
          count: 1,
          userIds: [reaction.userId],
        });
      }
    });

    // Convert Map to array format
    return Array.from(reactionMap.entries()).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      userIds: data.userIds,
    }));
  },
});
