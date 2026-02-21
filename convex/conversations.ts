import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getOrCreateConversation = mutation({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId1, userId2 } = args;

    // Ensure consistent ordering to avoid duplicate conversations
    const [participant1, participant2] = userId1 < userId2 
      ? [userId1, userId2] 
      : [userId2, userId1];

    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) =>
        q.eq("participant1", participant1).eq("participant2", participant2)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      participant1,
      participant2,
      lastMessageTime: Date.now(),
      lastMessageText: undefined,
    });

    return conversationId;
  },
});

export const getUserConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get conversations where user is participant1
    const asParticipant1 = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1", userId))
      .collect();

    // Get conversations where user is participant2
    const asParticipant2 = await ctx.db
      .query("conversations")
      .withIndex("by_participant2", (q) => q.eq("participant2", userId))
      .collect();

    // Combine and sort by last message time
    const allConversations = [...asParticipant1, ...asParticipant2].sort(
      (a, b) => b.lastMessageTime - a.lastMessageTime
    );

    // Enrich with other user's data
    const enrichedConversations = await Promise.all(
      allConversations.map(async (conv) => {
        const otherUserId = conv.participant1 === userId ? conv.participant2 : conv.participant1;
        const otherUser = await ctx.db.get(otherUserId);

        return {
          ...conv,
          otherUser,
        };
      })
    );

    return enrichedConversations;
  },
});

export const getConversationById = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});
